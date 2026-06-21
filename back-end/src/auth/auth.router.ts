import { type Router as ExpressRouter, Router } from 'express';

import { login, logout, refresh, register } from './auth.controller.js';

const router: ExpressRouter = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
