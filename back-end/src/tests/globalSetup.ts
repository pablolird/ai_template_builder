export async function setup(): Promise<void> {
  process.env['DATABASE_URL'] ??=
    'postgresql://test_user:test_password@localhost:5432/test_db';
  process.env['JWT_ACCESS_SECRET'] ??= 'test-access-secret-key';
  process.env['JWT_REFRESH_SECRET'] ??= 'test-refresh-secret-key';
  process.env['NODE_ENV'] ??= 'test';

  const { migrate } = await import('../db/migrate.js');
  await migrate();
}

export async function teardown(): Promise<void> {
  const { default: pool } = await import('../db/db.js');
  await pool.end();
}
