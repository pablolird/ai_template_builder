import type { Request, Response } from 'express';
import { z } from 'zod';

import { changeUserPassword, deleteUser, updateUserName } from './users.service.js';

const updateNameSchema = z.object({
  name: z.string().min(2).max(50),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const result = updateNameSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: z.flattenError(result.error) });
    return;
  }
  const updated = await updateUserName(req.user!.id, result.data.name);
  res.json({ name: updated.username });
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const result = changePasswordSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: z.flattenError(result.error) });
    return;
  }
  const ok = await changeUserPassword(
    req.user!.id,
    result.data.currentPassword,
    result.data.newPassword,
  );
  if (!ok) {
    res.status(400).json({ error: 'Current password is incorrect' });
    return;
  }
  res.status(204).send();
}

export async function deleteAccount(req: Request, res: Response): Promise<void> {
  await deleteUser(req.user!.id);
  res.status(204).send();
}
