import { useNavigate } from "react-router";
import {
  FileText,
  LayoutTemplate,
  LogOut,
  Settings,
  SquarePen,
  Trash2,
  User,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { type Conversation } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/sidebar";

export interface AppSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onConversationClick: (id: string) => void;
  onConversationDelete: (id: string) => void;
  onPresetsClick: () => void;
}

export function AppSidebar({
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
            <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
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
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar_chats")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onNewChat}>
                <SquarePen />
                <span>{t("sidebar_new_chat")}</span>
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
                  onClick={() => onConversationClick(c.id)}
                >
                  <span className="flex-1 text-left text-xs text-sidebar-foreground truncate">
                    {c.title}
                  </span>
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

        <SidebarGroup>
          <SidebarGroupLabel>
            {t("sidebar_templates_section")}
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/templates")}>
                <FileText />
                <span>{t("sidebar_my_templates")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onPresetsClick}>
                <LayoutTemplate />
                <span>{t("sidebar_presets")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebar_account")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/profile")}>
                <User />
                <span>{t("sidebar_profile")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/settings")}>
                <Settings />
                <span>{t("sidebar_settings")}</span>
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
