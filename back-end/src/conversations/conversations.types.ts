export interface Conversation {
  id: string;
  user_id: string;
  preset_id: string | null;
  title: string;
  template_html: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: Date;
}

export interface ConversationWithMessages extends Conversation {
  messages: ConversationMessage[];
}
