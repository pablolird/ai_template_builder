import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    env: {
      DATABASE_URL:
        process.env['DATABASE_URL'] ??
        'postgresql://test_user:test_password@localhost:5432/test_db',
      JWT_ACCESS_SECRET: process.env['JWT_ACCESS_SECRET'] ?? 'test-access-secret-key',
      JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'] ?? 'test-refresh-secret-key',
      NODE_ENV: 'test',
    },
    globalSetup: ['./src/tests/globalSetup.ts'],
    setupFiles: ['./src/tests/setup.ts'],
    testTimeout: 30000,
  },
});
