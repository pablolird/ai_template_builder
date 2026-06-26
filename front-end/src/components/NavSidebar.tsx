import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  FileText,
  LayoutTemplate,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import PresetSheet from "@/components/PresetSheet";
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

export default function NavSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [presetSheetOpen, setPresetSheetOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const at = (path: string) => location.pathname === path;

  return (
    <>
      <Sidebar>
        <SidebarHeader className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{user?.name ?? "User"}</span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email ?? ""}
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
                <SidebarMenuButton isActive={at("/chat")} onClick={() => navigate("/chat")}>
                  <MessageSquare />
                  <span>{t("btn_new_chat")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>{t("sidebar_templates_section")}</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={at("/templates")}
                  onClick={() => navigate("/templates")}
                >
                  <FileText />
                  <span>{t("sidebar_my_templates")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setPresetSheetOpen(true)}>
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
                <SidebarMenuButton
                  isActive={at("/profile")}
                  onClick={() => navigate("/profile")}
                >
                  <User />
                  <span>{t("sidebar_profile")}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={at("/settings")}
                  onClick={() => navigate("/settings")}
                >
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

      <PresetSheet open={presetSheetOpen} onOpenChange={setPresetSheetOpen} />
    </>
  );
}
