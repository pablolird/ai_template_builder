import { type Router as ExpressRouter, Router } from 'express';

import { authenticate } from '../auth/auth.middleware.js';
import { create, list, remove, update } from './presets.controller.js';

const router: ExpressRouter = Router();

router.use(authenticate);

router.get('/', list);
router.post('/', create);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router;
