import type { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from './auth.service.js';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired access token' });
    return;
  }

  req.user = { id: payload.userId, username: payload.username, email: payload.email, role: payload.role ?? 'user' };
  next();
}
