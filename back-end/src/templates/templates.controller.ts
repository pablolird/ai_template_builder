import type { Request, Response } from 'express';
import { z } from 'zod';

import * as templatesService from './templates.service.js';

const createTemplateSchema = z.object({
  name: z.string().min(1),
  html_content: z.string().min(1),
  preset_id: z.string().uuid().optional(),
});

export async function list(req: Request, res: Response): Promise<void> {
  const templates = await templatesService.listTemplates(req.user!.id);
  res.json(templates);
}

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = createTemplateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error) });
    return;
  }
  const template = await templatesService.createTemplate(req.user!.id, parsed.data);
  res.status(201).json(template);
}

export async function update(req: Request, res: Response): Promise<void> {
  const updateSchema = z.object({
    name: z.string().min(1).optional(),
    html_content: z.string().min(1).optional(),
  });
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error) });
    return;
  }
  const id = req.params['id'] as string;
  const template = await templatesService.updateTemplate(id, req.user!.id, parsed.data);
  if (!template) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }
  res.json(template);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  const deleted = await templatesService.deleteTemplate(id, req.user!.id);
  if (!deleted) {
    res.status(404).json({ error: 'Template not found' });
    return;
  }
  res.status(204).end();
}
