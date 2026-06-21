import { afterAll, beforeAll } from 'vitest';

import pool from '../db/db.js';

beforeAll(async () => {
  await pool.query(
    'TRUNCATE TABLE messages, conversations, templates, presets, refresh_tokens, users RESTART IDENTITY CASCADE',
  );
});

afterAll(async () => {
  await pool.end();
});
