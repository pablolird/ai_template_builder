import type { Request, Response } from 'express';
import { z } from 'zod';

import * as conversationsService from './conversations.service.js';

export async function list(req: Request, res: Response): Promise<void> {
  const conversations = await conversationsService.listConversations(req.user!.id);
  res.json(conversations);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  const conversation = await conversationsService.getConversation(id, req.user!.id);
  if (!conversation) {
    res.status(404).json({ error: 'Conversation not found' });
    return;
  }
  res.json(conversation);
}

export async function update(req: Request, res: Response): Promise<void> {
  const schema = z.object({ title: z.string().min(1).optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error) });
    return;
  }
  const id = req.params['id'] as string;
  const conversation = await conversationsService.updateConversation(
    id,
    req.user!.id,
    parsed.data as conversationsService.UpdateConversationPayload,
  );
  if (!conversation) {
    res.status(404).json({ error: 'Conversation not found' });
    return;
  }
  res.json(conversation);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  const deleted = await conversationsService.deleteConversation(id, req.user!.id);
  if (!deleted) {
    res.status(404).json({ error: 'Conversation not found' });
    return;
  }
  res.status(204).end();
}
