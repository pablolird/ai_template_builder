import bcrypt from 'bcryptjs';

import pool from '../db/db.js';

export async function updateUserName(userId: string, name: string): Promise<{ username: string }> {
  const { rows } = await pool.query<{ username: string }>(
    `UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2 RETURNING username`,
    [name.trim(), userId],
  );
  return rows[0]!;
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<boolean> {
  const { rows } = await pool.query<{ password_hash: string }>(
    'SELECT password_hash FROM users WHERE id = $1',
    [userId],
  );
  if (!rows[0]) return false;

  const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!valid) return false;

  const newHash = await bcrypt.hash(newPassword, 12);
  await pool.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [newHash, userId],
  );
  return true;
}

export async function deleteUser(userId: string): Promise<void> {
  await pool.query('DELETE FROM users WHERE id = $1', [userId]);
}
