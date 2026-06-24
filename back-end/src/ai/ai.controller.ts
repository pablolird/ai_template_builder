import type { Request, Response } from 'express';
import { z } from 'zod';

import * as conversationsService from '../conversations/conversations.service.js';
import pool from '../db/db.js';
import { getPreset } from '../presets/presets.service.js';
import * as aiService from './ai.service.js';
import type { SSEEvent } from './ai.types.js';

const ALLOWED_MODELS = ['deepseek-chat', 'deepseek-reasoner'] as const;

const chatSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().min(1),
  model: z.enum(ALLOWED_MODELS),
  presetId: z.string().uuid().optional(),
  templateHtml: z.string().optional(),
});

type SetupResult = {
  conversation: Awaited<ReturnType<typeof conversationsService.getConversation>> & { messages: { role: 'user' | 'assistant'; content: string }[] };
  history: { role: 'user' | 'assistant'; content: string }[];
  preset: Awaited<ReturnType<typeof getPreset>>;
  model: string;
};

async function setupChat(
  req: Request,
  sendError: (status: number, body: object) => void,
): Promise<SetupResult | null> {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(400, { error: z.flattenError(parsed.error) });
    return null;
  }

  const { conversationId, message, model, presetId, templateHtml: requestTemplateHtml } = parsed.data;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  if (userRole !== 'admin') {
    const { rows } = await pool.query<{ id: string }>(
      `UPDATE users SET ai_prompts_used = ai_prompts_used + 1
       WHERE id = $1 AND ai_prompts_used < 1
       RETURNING id`,
      [userId],
    );
    if (rows.length === 0) {
      sendError(402, { error: 'trial_exhausted' });
      return null;
    }
  }

  let conversation: Awaited<ReturnType<typeof conversationsService.getConversation>>;

  if (conversationId) {
    conversation = await conversationsService.getConversation(conversationId, userId);
    if (!conversation) {
      sendError(404, { error: 'Conversation not found' });
      return null;
    }
  } else {
    const title = message.slice(0, 60).trim();
    const newConv = await conversationsService.createConversation(userId, title, presetId);
    conversation = { ...newConv, messages: [] };
    if (requestTemplateHtml) {
      await conversationsService.updateConversation(newConv.id, userId, {
        template_html: requestTemplateHtml,
      });
      conversation = { ...conversation, template_html: requestTemplateHtml };
    }
  }

  await conversationsService.addMessage(conversation.id, 'user', message);

  const history = [
    ...conversation.messages.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: message },
  ];

  const resolvedPresetId = conversation.preset_id ?? presetId;
  const preset = resolvedPresetId ? await getPreset(resolvedPresetId, userId) : null;

  return { conversation: conversation as SetupResult['conversation'], history, preset, model };
}

export async function chat(req: Request, res: Response): Promise<void> {
  const setup = await setupChat(req, (status, body) => res.status(status).json(body));
  if (!setup) return;

  const { conversation, history, preset, model } = setup;

  let aiResponse: Awaited<ReturnType<typeof aiService.chat>>;
  try {
    aiResponse = await aiService.chat(history, model, preset, conversation.template_html ?? undefined);
  } catch (err) {
    console.error('[AI] DeepSeek call failed for model "%s":', model, err);
    res.status(502).json({ error: 'AI service error' });
    return;
  }

  if (aiResponse.message) {
    await conversationsService.addMessage(conversation.id, 'assistant', aiResponse.message);
  }

  if (aiResponse.templateHtml) {
    await conversationsService.updateConversation(conversation.id, req.user!.id, {
      template_html: aiResponse.templateHtml,
    });
  }

  res.json({ conversationId: conversation.id, ...aiResponse });
}

export async function chatStream(req: Request, res: Response): Promise<void> {
  const sendSSE = (event: SSEEvent) => res.write(`data: ${JSON.stringify(event)}\n\n`);

  // SSE errors before headers are flushed go out as regular HTTP status codes.
  // After flushHeaders(), we use SSE error events instead.
  let headersFlashed = false;

  const setup = await setupChat(req, (status, body) => {
    if (!headersFlashed) {
      res.status(status).json(body);
    } else {
      const code =
        status === 402 ? 'trial_exhausted' :
        status === 404 ? 'not_found' :
        'ai_error';
      sendSSE({ type: 'error', code });
      res.end();
    }
  });
  if (!setup) return;

  const { conversation, history, preset, model } = setup;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  headersFlashed = true;

  sendSSE({ type: 'init', conversationId: conversation.id });

  try {
    const stream = await aiService.createStream(history, model, preset, conversation.template_html ?? undefined);

    let fullContent = '';
    const extractor = new aiService.MessageExtractor();

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta as Record<string, unknown>;

      const reasoning = delta['reasoning_content'];
      if (typeof reasoning === 'string' && reasoning) {
        sendSSE({ type: 'reasoning', delta: reasoning });
      }

      const content = typeof delta['content'] === 'string' ? delta['content'] : '';
      if (content) {
        fullContent += content;
        const chars = extractor.push(content);
        for (const c of chars) {
          sendSSE({ type: 'message_delta', delta: c });
        }
      }
    }

    const raw = aiService.extractJsonPublic(fullContent);
    let parsedMessage: string | undefined;
    let parsedHtml: string | undefined;
    try {
      const obj = JSON.parse(raw) as Record<string, unknown>;
      parsedMessage = typeof obj['message'] === 'string' ? obj['message'] : undefined;
      parsedHtml = typeof obj['templateHtml'] === 'string' ? obj['templateHtml'] : undefined;
    } catch {
      parsedMessage = raw;
    }

    if (preset?.logo_data && parsedHtml) {
      parsedHtml = parsedHtml.replace('LOGO_PLACEHOLDER', preset.logo_data);
    }

    if (parsedMessage) {
      await conversationsService.addMessage(conversation.id, 'assistant', parsedMessage);
    }
    if (parsedHtml) {
      await conversationsService.updateConversation(conversation.id, req.user!.id, {
        template_html: parsedHtml,
      });
    }

    const doneEvent: { type: 'done'; message?: string; templateHtml?: string } = { type: 'done' };
    if (parsedMessage) doneEvent.message = parsedMessage;
    if (parsedHtml) doneEvent.templateHtml = parsedHtml;
    sendSSE(doneEvent);
    res.end();
  } catch (err) {
    console.error('[AI] Stream failed for model "%s":', model, err);
    sendSSE({ type: 'error', code: 'ai_error' });
    res.end();
  }
}
