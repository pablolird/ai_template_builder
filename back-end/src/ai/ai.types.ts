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
