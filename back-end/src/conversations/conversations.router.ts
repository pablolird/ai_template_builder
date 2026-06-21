import { type Router as ExpressRouter, Router } from 'express';

import { authenticate } from '../auth/auth.middleware.js';
import { getOne, list, remove, update } from './conversations.controller.js';

const router: ExpressRouter = Router();

router.use(authenticate);

router.get('/', list);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router;
