import type { Request, Response } from 'express';
import { z } from 'zod';

import type { UpdatePresetPayload } from './presets.service.js';
import * as presetsService from './presets.service.js';

const presetCreateSchema = z.object({
  name: z.string().min(1),
  business_name: z.string().min(1),
  ruc: z.string().regex(/^\d+-\d$/, 'Invalid RUC format (e.g. 80000000-0)'),
  timbrado: z.string().regex(/^\d{8}$/, 'Timbrado must be exactly 8 digits'),
  address: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
});

const presetUpdateSchema = presetCreateSchema.partial();

export async function list(req: Request, res: Response): Promise<void> {
  const presets = await presetsService.listPresets(req.user!.id);
  res.json(presets);
}

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = presetCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error) });
    return;
  }
  const preset = await presetsService.createPreset(req.user!.id, parsed.data);
  res.status(201).json(preset);
}

export async function update(req: Request, res: Response): Promise<void> {
  const parsed = presetUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error) });
    return;
  }
  const id = req.params['id'] as string;
  const preset = await presetsService.updatePreset(id, req.user!.id, parsed.data as UpdatePresetPayload);
  if (!preset) {
    res.status(404).json({ error: 'Preset not found' });
    return;
  }
  res.json(preset);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  const deleted = await presetsService.deletePreset(id, req.user!.id);
  if (!deleted) {
    res.status(404).json({ error: 'Preset not found' });
    return;
  }
  res.status(204).end();
}
