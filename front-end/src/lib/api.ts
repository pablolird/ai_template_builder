const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export class PaywallError extends Error {
  constructor() {
    super('trial_exhausted');
    this.name = 'PaywallError';
  }
}

export interface SessionData {
  access_token: string;
  user: { id: string; email: string; name: string };
}

type RefreshCallback = (session: SessionData) => void;
let onRefreshed: RefreshCallback | null = null;
export function setRefreshCallback(fn: RefreshCallback) { onRefreshed = fn; }

let inflightRefresh: Promise<SessionData> | null = null;

async function refreshSession(): Promise<SessionData> {
  if (!inflightRefresh) {
    inflightRefresh = fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Session expired");
        return r.json() as Promise<SessionData>;
      })
      .finally(() => { inflightRefresh = null; });
  }
  return inflightRefresh;
}

async function apiFetch<T>(
  path: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
  const makeRequest = (t: string) =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
        ...(options?.headers ?? {}),
      },
      credentials: "include",
    });

  let res = await makeRequest(token);

  if (res.status === 401) {
    const session = await refreshSession();
    onRefreshed?.(session);
    res = await makeRequest(session.access_token);
  }

  if (res.status === 402) throw new PaywallError();
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
  logo_data: string | null;
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
  logo_data?: string;
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

export type ChatStreamEvent =
  | { type: "init"; conversationId: string }
  | { type: "reasoning"; delta: string }
  | { type: "message_delta"; delta: string }
  | { type: "done"; message?: string; templateHtml?: string }
  | { type: "error"; code: string };

export interface StreamChatParams {
  message: string;
  model: string;
  conversationId?: string;
  presetId?: string;
  templateHtml?: string;
}

export async function streamChat(
  token: string,
  params: StreamChatParams,
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const body = JSON.stringify({
    message: params.message,
    model: params.model,
    conversationId: params.conversationId,
    presetId: params.presetId,
    templateHtml: params.templateHtml,
  });

  const makeRequest = (t: string) =>
    fetch(`${API_BASE}/ai/chat-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      credentials: "include",
      body,
      signal,
    });

  let res = await makeRequest(token);

  if (res.status === 401) {
    const session = await refreshSession();
    onRefreshed?.(session);
    res = await makeRequest(session.access_token);
  }

  if (res.status === 402) throw new PaywallError();
  if (!res.ok) throw new Error(`API error ${res.status}`);

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const raw = line.slice(6).trim();
          if (raw) {
            try {
              onEvent(JSON.parse(raw) as ChatStreamEvent);
            } catch {
              // ignore malformed SSE lines
            }
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
