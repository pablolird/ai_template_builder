export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  conversationId?: string | undefined;
  message: string;
  model: string;
  presetId?: string | undefined;
}

export interface ChatResponse {
  message?: string | undefined;
  templateHtml?: string | undefined;
}

export type SSEEvent =
  | { type: 'init'; conversationId: string }
  | { type: 'reasoning'; delta: string }
  | { type: 'message_delta'; delta: string }
  | { type: 'done'; message?: string; templateHtml?: string }
  | { type: 'error'; code: 'trial_exhausted' | 'not_found' | 'ai_error' };
