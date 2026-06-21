import { type Router as ExpressRouter, Router } from 'express';

import { authenticate } from '../auth/auth.middleware.js';
import { chat } from './ai.controller.js';

const router: ExpressRouter = Router();

router.use(authenticate);

router.post('/chat', chat);

export default router;
