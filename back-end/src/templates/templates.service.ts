import pool from '../db/db.js';
import type { Template } from './templates.types.js';

export async function listTemplates(userId: string): Promise<Template[]> {
  const { rows } = await pool.query<Template>(
    'SELECT * FROM templates WHERE user_id = $1 ORDER BY created_at DESC',
    [userId],
  );
  return rows;
}

export interface CreateTemplatePayload {
  name: string;
  html_content: string;
  preset_id?: string | undefined;
}

export async function createTemplate(
  userId: string,
  data: CreateTemplatePayload,
): Promise<Template> {
  const { rows } = await pool.query<Template>(
    `INSERT INTO templates (user_id, name, html_content, preset_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, data.name, data.html_content, data.preset_id ?? null],
  );
  return rows[0]!;
}

export interface UpdateTemplatePayload {
  name?: string | undefined;
  html_content?: string | undefined;
}

export async function updateTemplate(
  id: string,
  userId: string,
  data: UpdateTemplatePayload,
): Promise<Template | null> {
  const fields = Object.keys(data) as (keyof UpdateTemplatePayload)[];
  if (fields.length === 0) return null;

  const setClauses = fields.map((f, i) => `${f} = $${i + 3}`).join(', ');
  const values = fields.map((f) => data[f] ?? null);

  const { rows } = await pool.query<Template>(
    `UPDATE templates SET ${setClauses}, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId, ...values],
  );
  return rows[0] ?? null;
}

export async function deleteTemplate(id: string, userId: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    'DELETE FROM templates WHERE id = $1 AND user_id = $2',
    [id, userId],
  );
  return (rowCount ?? 0) > 0;
}
