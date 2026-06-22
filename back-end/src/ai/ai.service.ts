import OpenAI from 'openai';

import type { Preset } from '../presets/presets.types.js';
import type { ChatMessage, ChatResponse } from './ai.types.js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function getClient(): OpenAI {
  return new OpenAI({
    apiKey: requireEnv('DEEPSEEK_API_KEY'),
    baseURL: 'https://api.deepseek.com',
  });
}

function buildSystemPrompt(preset: Preset | null): string {
  const presetBlock = preset
    ? `
The user has selected the following company preset — inject these values into the invoice template:
- Company name: ${preset.business_name ?? 'Not specified'}
- RUC: ${preset.ruc ?? 'Not specified'}
- Timbrado: ${preset.timbrado ?? 'Not specified'}
- Address: ${preset.address ?? 'Not specified'}
- City: ${preset.city ?? 'Not specified'}
- Phone: ${preset.phone ?? 'Not specified'}
- Email: ${preset.email ?? 'Not specified'}
`
    : 'No company preset selected; use placeholder values for company fields.';

  return `You are an expert invoice template designer specializing in Paraguayan invoices (facturas).
When the user asks you to create or modify an invoice template, respond with a JSON object:
{
  "message": "Brief acknowledgment of what you are doing (1 sentence max). Omit if just generating silently.",
  "templateHtml": "A complete, self-contained HTML invoice template with all CSS inlined or in a <style> tag. Must look professional and print-ready."
}

If the user asks a question or makes a purely conversational request (not asking to generate or change the template), respond with:
{
  "message": "Your answer here."
}

Rules:
- Always return valid JSON. Never wrap it in markdown code fences.
- The HTML must be fully self-contained: no external stylesheets or scripts.
- Design for A4 paper (210mm × 297mm) by default unless the user specifies otherwise.
- Include realistic placeholder rows for line items (product/service, qty, unit price, total).
- The template should look like an actual Paraguayan invoice with the proper structure.
${presetBlock}`;
}

// deepseek-reasoner (R1) does not support response_format — only use it for chat models
const SUPPORTS_JSON_FORMAT = new Set(['deepseek-chat']);

// R1 sometimes wraps its JSON in markdown code fences despite instructions
function extractJson(raw: string): string {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  return fenceMatch ? fenceMatch[1]!.trim() : raw.trim();
}

export async function chat(
  messages: ChatMessage[],
  model: string,
  preset: Preset | null,
): Promise<ChatResponse> {
  const client = getClient();
  const systemPrompt = buildSystemPrompt(preset);

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    ...(SUPPORTS_JSON_FORMAT.has(model) ? { response_format: { type: 'json_object' } } : {}),
  });

  const raw = extractJson(completion.choices[0]?.message.content ?? '{}');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { message: raw };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { message: raw };
  }

  const obj = parsed as Record<string, unknown>;
  return {
    message: typeof obj['message'] === 'string' ? obj['message'] : undefined,
    templateHtml: typeof obj['templateHtml'] === 'string' ? obj['templateHtml'] : undefined,
  };
}
