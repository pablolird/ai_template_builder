export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-primary to-primary/75 text-primary-foreground shadow-sm shadow-primary/20"
            : "bg-muted text-foreground"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
