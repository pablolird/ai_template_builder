import pool from '../db/db.js';
import type {
  Conversation,
  ConversationMessage,
  ConversationWithMessages,
} from './conversations.types.js';

export async function listConversations(userId: string): Promise<Conversation[]> {
  const { rows } = await pool.query<Conversation>(
    `SELECT * FROM conversations WHERE user_id = $1 ORDER BY updated_at DESC`,
    [userId],
  );
  return rows;
}

export async function getConversation(
  id: string,
  userId: string,
): Promise<ConversationWithMessages | null> {
  const { rows: convRows } = await pool.query<Conversation>(
    `SELECT * FROM conversations WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
  const conv = convRows[0];
  if (!conv) return null;

  const { rows: msgRows } = await pool.query<ConversationMessage>(
    `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
    [id],
  );

  return { ...conv, messages: msgRows };
}

export async function createConversation(
  userId: string,
  title: string,
  presetId?: string | undefined,
): Promise<Conversation> {
  const { rows } = await pool.query<Conversation>(
    `INSERT INTO conversations (user_id, title, preset_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, title, presetId ?? null],
  );
  return rows[0]!;
}

export interface UpdateConversationPayload {
  title?: string | undefined;
  template_html?: string | undefined;
}

export async function updateConversation(
  id: string,
  userId: string,
  data: UpdateConversationPayload,
): Promise<Conversation | null> {
  const fields = Object.keys(data) as (keyof UpdateConversationPayload)[];
  if (fields.length === 0) return null;

  const setClauses = fields.map((f, i) => `${f} = $${i + 3}`).join(', ');
  const values = fields.map((f) => data[f] ?? null);

  const { rows } = await pool.query<Conversation>(
    `UPDATE conversations SET ${setClauses}, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId, ...values],
  );
  return rows[0] ?? null;
}

export async function deleteConversation(id: string, userId: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `DELETE FROM conversations WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
  return (rowCount ?? 0) > 0;
}

export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
): Promise<ConversationMessage> {
  const { rows } = await pool.query<ConversationMessage>(
    `INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING *`,
    [conversationId, role, content],
  );
  // Bump updated_at on the conversation so the list stays sorted by activity
  await pool.query(`UPDATE conversations SET updated_at = NOW() WHERE id = $1`, [conversationId]);
  return rows[0]!;
}
