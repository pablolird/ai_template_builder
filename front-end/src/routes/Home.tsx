import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  LayoutTemplate,
  Loader2,
  LogOut,
  PenLine,
  Save,
  Send,
  Settings,
  SquarePen,
  Trash2,
  User,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  createTemplate,
  deleteConversation,
  fetchConversation,
  fetchConversations,
  fetchPresets,
  sendChat,
  updateTemplate,
  type Conversation,
} from "@/lib/api";
import PresetSheet from "@/components/PresetSheet";
import ModeToggle from "@/components/ModeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

const DEEPSEEK_MODELS = [
  { id: "deepseek-chat", label: "DeepSeek V3" },
  { id: "deepseek-reasoner", label: "DeepSeek R1 (Reasoner)" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_ID = "welcome";

// ── Sidebar ───────────────────────────────────────────────────────────────────

interface AppSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onConversationClick: (id: string) => void;
  onConversationDelete: (id: string) => void;
  onPresetsClick: () => void;
}

function AppSidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onConversationClick,
  onConversationDelete,
  onPresetsClick,
}: AppSidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">
              {user?.name ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email ?? "user@example.com"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        {/* Conversations */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar_chats")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className="w-full" onClick={onNewChat}>
                  <SquarePen />
                  <span>{t("sidebar_new_chat")}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {conversations.length > 0 && (
            <div className="mt-1 flex flex-col gap-0.5">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center gap-1 group rounded-md px-2 py-1.5 hover:bg-sidebar-accent cursor-pointer ${
                    c.id === activeConversationId ? "bg-sidebar-accent" : ""
                  }`}
                >
                  <button
                    className="flex-1 text-left text-xs text-sidebar-foreground truncate"
                    onClick={() => onConversationClick(c.id)}
                  >
                    {c.title}
                  </button>
                  <button
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConversationDelete(c.id);
                    }}
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </SidebarGroup>

        {/* Templates & presets */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {t("sidebar_templates_section")}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  className="w-full"
                  onClick={() => navigate("/templates")}
                >
                  <FileText />
                  <span>{t("sidebar_my_templates")}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className="w-full" onClick={onPresetsClick}>
                  <LayoutTemplate />
                  <span>{t("sidebar_presets")}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar_account")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className="w-full" onClick={() => navigate("/profile")}>
                  <User />
                  <span>{t("sidebar_profile")}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  className="w-full"
                  onClick={() => navigate("/settings")}
                >
                  <Settings />
                  <span>{t("sidebar_settings")}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => void logout()}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut />
              <span>{t("sidebar_sign_out")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// ── Chat message ──────────────────────────────────────────────────────────────

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

// ── Home ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const { getAccessToken } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const location = useLocation();
  const token = getAccessToken();

  const [messages, setMessages] = useState<Message[]>([
    { id: WELCOME_ID, role: "assistant", content: "" },
  ]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    () => localStorage.getItem("invoice-model") ?? DEEPSEEK_MODELS[0]!.id,
  );
  const [selectedPreset, setSelectedPreset] = useState(
    () => localStorage.getItem("invoice-preset") ?? "",
  );
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("Invoice Template");
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(
    null,
  );

  const [presetSheetOpen, setPresetSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);

  // Incremented on every new-chat reset or new load; lets async fetches detect they've been superseded.
  const loadOpRef = useRef(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");

  const bottomRef = useRef<HTMLDivElement>(null);
  const nameBeforeEdit = useRef(templateName);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("invoice-model", selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    if (selectedPreset) {
      localStorage.setItem("invoice-preset", selectedPreset);
    } else {
      localStorage.removeItem("invoice-preset");
    }
  }, [selectedPreset]);

  useEffect(() => {
    const state = location.state as {
      templateHtml?: string;
      templateId?: string;
      templateName?: string;
      presetId?: string | null;
    } | null;
    if (state?.templateHtml) {
      setTemplateHtml(state.templateHtml);
      setCurrentTemplateId(state.templateId ?? null);
      if (state.templateName) setTemplateName(state.templateName);
      if (state.presetId) setSelectedPreset(state.presetId);
      window.history.replaceState({}, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Server data ─────────────────────────────────────────────────────────────

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchConversations(token!),
    enabled: !!token,
  });

  const { data: presets = [] } = useQuery({
    queryKey: ["presets"],
    queryFn: () => fetchPresets(token!),
    enabled: !!token,
  });

  useEffect(() => {
    if (
      presets.length > 0 &&
      selectedPreset &&
      !presets.some((p) => p.id === selectedPreset)
    ) {
      setSelectedPreset("");
    }
  }, [presets, selectedPreset]);

  // ── New chat ─────────────────────────────────────────────────────────────────

  function handleNewChat() {
    loadOpRef.current += 1;
    setMessages([{ id: WELCOME_ID, role: "assistant", content: "" }]);
    setInput("");
    setCurrentConversationId(null);
    setTemplateHtml(null);
    setTemplateName("Invoice Template");
    setCurrentTemplateId(null);
  }

  // ── Load conversation ─────────────────────────────────────────────────────────

  async function handleLoadConversation(id: string) {
    if (id === currentConversationId) return;
    loadOpRef.current += 1;
    const opId = loadOpRef.current;
    setLoadingConversation(true);
    try {
      const conv = await fetchConversation(token!, id);
      if (loadOpRef.current !== opId) return;
      setCurrentConversationId(conv.id);
      setMessages(
        conv.messages.length > 0
          ? conv.messages.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
            }))
          : [{ id: WELCOME_ID, role: "assistant", content: "" }],
      );
      setTemplateHtml(conv.template_html ?? null);
      setSelectedPreset(conv.preset_id ?? "");
      setCurrentTemplateId(null);
      setTemplateName("Invoice Template");
    } finally {
      if (loadOpRef.current === opId) setLoadingConversation(false);
    }
  }

  // ── Delete conversation ───────────────────────────────────────────────────────

  const deleteConversationMutation = useMutation({
    mutationFn: (id: string) => deleteConversation(token!, id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (id === currentConversationId) handleNewChat();
    },
  });

  // ── Save / update template ───────────────────────────────────────────────────

  const saveTemplateMutation = useMutation({
    mutationFn: async () => {
      const name = templateName.trim() || "Invoice Template";
      if (currentTemplateId) {
        return updateTemplate(token!, currentTemplateId, {
          name,
          html_content: templateHtml!,
        });
      }
      return createTemplate(token!, {
        name,
        html_content: templateHtml!,
        preset_id: selectedPreset || undefined,
      });
    },
    onSuccess: (saved) => {
      if (saved && !currentTemplateId) setCurrentTemplateId(saved.id);
      void queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  // ── Inline rename ────────────────────────────────────────────────────────────

  const renameMutation = useMutation({
    mutationFn: (name: string) =>
      updateTemplate(token!, currentTemplateId!, { name }),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });

  function startNameEdit() {
    nameBeforeEdit.current = templateName;
    setIsEditingName(true);
  }

  function commitNameEdit() {
    const trimmed = templateName.trim();
    if (!trimmed) {
      setTemplateName(nameBeforeEdit.current);
      setIsEditingName(false);
      return;
    }
    setTemplateName(trimmed);
    setIsEditingName(false);
    if (currentTemplateId && trimmed !== nameBeforeEdit.current) {
      renameMutation.mutate(trimmed);
    }
  }

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitNameEdit();
    }
    if (e.key === "Escape") {
      setTemplateName(nameBeforeEdit.current);
      setIsEditingName(false);
    }
  }

  // ── Send message ──────────────────────────────────────────────────────────────

  const noPreset = !selectedPreset;

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading || noPreset) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== WELCOME_ID),
      userMsg,
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChat(
        token!,
        trimmed,
        selectedModel,
        currentConversationId ?? undefined,
        currentConversationId ? undefined : selectedPreset,
      );

      if (!currentConversationId) {
        setCurrentConversationId(response.conversationId);
        void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }

      if (response.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response.message!,
          },
        ]);
      }

      if (response.templateHtml) {
        setTemplateHtml(response.templateHtml);
        setCurrentTemplateId(null);
        setMobileTab("preview");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: t("err_generic"),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar
          conversations={conversations}
          activeConversationId={currentConversationId}
          onNewChat={handleNewChat}
          onConversationClick={(id) => void handleLoadConversation(id)}
          onConversationDelete={(id) => deleteConversationMutation.mutate(id)}
          onPresetsClick={() => setPresetSheetOpen(true)}
        />

        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          {/* Top bar */}
          <header className="flex items-center gap-3 border-b border-border px-4 h-14 shrink-0">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <h1 className="text-sm font-semibold text-foreground truncate flex-1">
              {t("app_title")}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground"
              onClick={handleNewChat}
            >
              <PenLine className="size-3.5" />
              <span className="hidden sm:inline">{t("btn_new_chat")}</span>
            </Button>
            <ModeToggle />
          </header>

          {/* Mobile tab switcher */}
          <div className="md:hidden flex shrink-0 border-b border-border">
            <button
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                mobileTab === "chat"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMobileTab("chat")}
            >
              {t("tab_chat")}
            </button>
            <button
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                mobileTab === "preview"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMobileTab("preview")}
            >
              {t("tab_preview")}
              {templateHtml && (
                <span className="ml-1.5 inline-block size-1.5 rounded-full bg-primary align-middle" />
              )}
            </button>
          </div>

          {/* Main area: chat + preview */}
          <div className="flex flex-1 min-h-0">
            {/* Chat panel */}
            <div
              className={`flex-col flex-1 md:flex-none w-full md:w-[380px] md:shrink-0 min-h-0 md:border-r border-border ${mobileTab === "chat" ? "flex" : "hidden md:flex"}`}
            >
              {loadingConversation ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      message={
                        msg.id === WELCOME_ID
                          ? { ...msg, content: t("welcome_message") }
                          : msg
                      }
                    />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start mb-3">
                      <div className="bg-muted rounded-xl px-4 py-2.5">
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              )}

              {/* Input area */}
              <div className="shrink-0 p-3 border-t border-border">
                <div
                  className={`rounded-xl border bg-background shadow-sm ${noPreset ? "opacity-60" : ""}`}
                >
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      noPreset
                        ? t("placeholder_no_preset")
                        : t("placeholder_describe")
                    }
                    rows={3}
                    className="resize-none border-0 shadow-none focus-visible:ring-0 text-sm rounded-b-none"
                    disabled={isLoading || noPreset || loadingConversation}
                  />
                  <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                    >
                      <SelectTrigger className="h-7 text-xs flex-1 md:flex-none md:w-30 border-0 shadow-none bg-transparent hover:bg-muted">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEEPSEEK_MODELS.map((m) => (
                          <SelectItem
                            key={m.id}
                            value={m.id}
                            className="text-xs"
                          >
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Separator orientation="vertical" className="h-4" />

                    <Select
                      value={selectedPreset}
                      onValueChange={setSelectedPreset}
                      disabled={!!currentConversationId}
                    >
                      <SelectTrigger
                        className={`h-7 text-xs flex-1 md:flex-none md:w-36 border-0 shadow-none bg-transparent hover:bg-muted ${
                          noPreset ? "text-destructive font-medium" : ""
                        }`}
                      >
                        <SelectValue
                          placeholder={t("select_preset_placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {presets.length === 0 ? (
                          <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                            {t("no_presets_inline")}
                          </div>
                        ) : (
                          presets.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.id}
                              className="text-xs"
                            >
                              {p.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>

                    <div className="hidden md:block md:flex-1" />

                    <Button
                      size="icon-sm"
                      onClick={() => void handleSend()}
                      disabled={
                        !input.trim() ||
                        isLoading ||
                        noPreset ||
                        loadingConversation
                      }
                    >
                      <Send className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {noPreset ? (
                  <p className="text-center text-xs text-destructive mt-2">
                    {t("prompt_no_preset")}{" "}
                    <button
                      className="underline underline-offset-2 hover:opacity-70"
                      onClick={() => setPresetSheetOpen(true)}
                    >
                      {t("word_presets")}
                    </button>
                  </p>
                ) : (
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    {t("hint_enter_send")}
                  </p>
                )}
              </div>
            </div>

            {/* Preview panel */}
            <div
              className={`flex-col flex-1 min-h-0 min-w-0 ${mobileTab === "preview" ? "flex" : "hidden md:flex"}`}
            >
              <div className="shrink-0 flex items-center gap-2 border-b border-border px-4 h-11">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("preview_label")}
                </span>
                {templateHtml && (
                  <>
                    <Separator orientation="vertical" className="h-4" />

                    {isEditingName ? (
                      <input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        onBlur={commitNameEdit}
                        onKeyDown={handleNameKeyDown}
                        className="text-xs w-48 bg-transparent outline-none border-b border-primary px-1 py-0.5"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={startNameEdit}
                        className="text-xs px-1 py-0.5 rounded hover:bg-muted max-w-48 truncate text-left"
                        title={t("click_to_rename")}
                      >
                        {templateName}
                      </button>
                    )}

                    {!currentTemplateId && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5 ml-auto"
                        onClick={() => saveTemplateMutation.mutate()}
                        disabled={saveTemplateMutation.isPending}
                      >
                        <Save className="size-3" />
                        {saveTemplateMutation.isPending
                          ? t("btn_saving")
                          : t("btn_save")}
                      </Button>
                    )}
                  </>
                )}
              </div>

              {templateHtml ? (
                <iframe
                  className="flex-1 w-full border-0 bg-white"
                  srcDoc={templateHtml}
                  title="Invoice Preview"
                  sandbox="allow-same-origin"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {t("no_template_title")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("no_template_desc")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PresetSheet open={presetSheetOpen} onOpenChange={setPresetSheetOpen} />
    </SidebarProvider>
  );
}
