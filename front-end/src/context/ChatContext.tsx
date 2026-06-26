import { createContext, useContext, useRef, useState, type RefObject } from "react";
import type { Message } from "@/components/home/ChatMessage";

export const WELCOME_ID = "welcome";

interface ChatContextValue {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  templateHtml: string | null;
  setTemplateHtml: React.Dispatch<React.SetStateAction<string | null>>;
  templateName: string;
  setTemplateName: React.Dispatch<React.SetStateAction<string>>;
  currentTemplateId: string | null;
  setCurrentTemplateId: React.Dispatch<React.SetStateAction<string | null>>;
  currentConversationId: string | null;
  setCurrentConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  mobileTab: "chat" | "preview";
  setMobileTab: React.Dispatch<React.SetStateAction<"chat" | "preview">>;
  loadOpRef: RefObject<number>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: WELCOME_ID, role: "assistant", content: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [templateHtml, setTemplateHtml] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("Invoice Template");
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");
  const loadOpRef = useRef(0);

  function resetChat() {
    loadOpRef.current += 1;
    setMessages([{ id: WELCOME_ID, role: "assistant", content: "" }]);
    setIsLoading(false);
    setCurrentConversationId(null);
    setTemplateHtml(null);
    setTemplateName("Invoice Template");
    setCurrentTemplateId(null);
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        isLoading,
        setIsLoading,
        templateHtml,
        setTemplateHtml,
        templateName,
        setTemplateName,
        currentTemplateId,
        setCurrentTemplateId,
        currentConversationId,
        setCurrentConversationId,
        mobileTab,
        setMobileTab,
        loadOpRef,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}
