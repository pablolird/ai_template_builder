const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

async function apiFetch<T>(
  path: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Presets ───────────────────────────────────────────────────────────────────

export interface Preset {
  id: string;
  user_id: string;
  name: string;
  business_name: string | null;
  ruc: string | null;
  timbrado: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface PresetData {
  name: string;
  business_name?: string;
  ruc?: string;
  timbrado?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
}

export const fetchPresets = (token: string) =>
  apiFetch<Preset[]>("/presets", token);

export const createPreset = (token: string, data: PresetData) =>
  apiFetch<Preset>("/presets", token, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updatePreset = (token: string, id: string, data: Partial<PresetData>) =>
  apiFetch<Preset>(`/presets/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deletePreset = (token: string, id: string) =>
  apiFetch<void>(`/presets/${id}`, token, { method: "DELETE" });

// ── Templates ─────────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  user_id: string;
  preset_id: string | null;
  name: string;
  html_content: string;
  created_at: string;
  updated_at: string;
}

export const fetchTemplates = (token: string) =>
  apiFetch<Template[]>("/templates", token);

export const createTemplate = (
  token: string,
  data: { name: string; html_content: string; preset_id?: string },
) =>
  apiFetch<Template>("/templates", token, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTemplate = (
  token: string,
  id: string,
  data: { name?: string; html_content?: string },
) =>
  apiFetch<Template>(`/templates/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteTemplate = (token: string, id: string) =>
  apiFetch<void>(`/templates/${id}`, token, { method: "DELETE" });

// ── Conversations ─────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  user_id: string;
  preset_id: string | null;
  title: string;
  template_html: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: ConversationMessage[];
}

export const fetchConversations = (token: string) =>
  apiFetch<Conversation[]>("/conversations", token);

export const fetchConversation = (token: string, id: string) =>
  apiFetch<ConversationWithMessages>(`/conversations/${id}`, token);

export const updateConversation = (token: string, id: string, data: { title: string }) =>
  apiFetch<Conversation>(`/conversations/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteConversation = (token: string, id: string) =>
  apiFetch<void>(`/conversations/${id}`, token, { method: "DELETE" });

// ── Users ─────────────────────────────────────────────────────────────────────

export const updateUserProfile = (token: string, data: { name: string }) =>
  apiFetch<{ name: string }>('/users/me', token, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const changeUserPassword = (
  token: string,
  data: { currentPassword: string; newPassword: string },
) =>
  apiFetch<void>('/users/me/change-password', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteUserAccount = (token: string) =>
  apiFetch<void>('/users/me', token, { method: 'DELETE' });

// ── AI Chat ───────────────────────────────────────────────────────────────────

export interface ChatResponse {
  conversationId: string;
  message?: string;
  templateHtml?: string;
}

export const sendChat = (
  token: string,
  message: string,
  model: string,
  conversationId?: string,
  presetId?: string,
  templateHtml?: string,
) =>
  apiFetch<ChatResponse>("/ai/chat", token, {
    method: "POST",
    body: JSON.stringify({
      message,
      model,
      conversationId: conversationId ?? undefined,
      presetId: presetId ?? undefined,
      templateHtml: templateHtml ?? undefined,
    }),
  });
