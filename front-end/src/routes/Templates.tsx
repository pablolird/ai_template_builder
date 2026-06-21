import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Loader2,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { deleteTemplate, fetchTemplates, updateTemplate, type Template } from "@/lib/api";
import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Scaled iframe thumbnail — shows the top portion of the template at reduced size
const IFRAME_NATURAL_WIDTH = 794; // ~A4 at 96 dpi
const THUMBNAIL_SCALE = 0.32;
const THUMBNAIL_HEIGHT = 200;

function TemplateThumbnail({ html }: { html: string }) {
  return (
    <div
      className="overflow-hidden bg-white rounded-t-lg border-b border-border"
      style={{ height: THUMBNAIL_HEIGHT }}
    >
      <iframe
        srcDoc={html}
        title="preview"
        style={{
          width: IFRAME_NATURAL_WIDTH,
          height: THUMBNAIL_HEIGHT / THUMBNAIL_SCALE,
          transform: `scale(${THUMBNAIL_SCALE})`,
          transformOrigin: "top left",
          border: "none",
          pointerEvents: "none",
        }}
        sandbox="allow-same-origin"
      />
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Template card ──────────────────────────────────────────────────────────────

interface TemplateCardProps {
  template: Template;
  onOpenInEditor: (template: Template) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function TemplateCard({ template, onOpenInEditor, onDelete, isDeleting }: TemplateCardProps) {
  const { getAccessToken } = useAuth();
  const queryClient = useQueryClient();
  const token = getAccessToken();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(template.name);

  const renameMutation = useMutation({
    mutationFn: (name: string) => updateTemplate(token!, template.id, { name }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });

  function commitRename() {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(template.name);
      setEditing(false);
      return;
    }
    if (trimmed !== template.name) {
      renameMutation.mutate(trimmed);
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitRename();
    if (e.key === "Escape") { setTitle(template.name); setEditing(false); }
  }

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <TemplateThumbnail html={template.html_content} />

      <div className="flex flex-col gap-2 p-3">
        {/* Editable title */}
        <div className="flex items-center gap-1.5 min-w-0">
          {editing ? (
            <>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={commitRename}
                onKeyDown={handleKeyDown}
                className="h-7 text-sm px-2 flex-1"
                autoFocus
              />
              <button onClick={commitRename} className="text-muted-foreground hover:text-foreground shrink-0">
                <Check className="size-3.5" />
              </button>
              <button onClick={() => { setTitle(template.name); setEditing(false); }} className="text-muted-foreground hover:text-foreground shrink-0">
                <X className="size-3.5" />
              </button>
            </>
          ) : (
            <>
              <span className="text-sm font-medium truncate flex-1">{template.name}</span>
              <button
                onClick={() => setEditing(true)}
                className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 shrink-0"
                aria-label="Rename template"
              >
                <Pencil className="size-3.5" />
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground">{formatDate(template.created_at)}</p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs gap-1.5"
            onClick={() => onOpenInEditor(template)}
          >
            <ExternalLink className="size-3" />
            Open in editor
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(template.id)}
            disabled={isDeleting}
            aria-label="Delete template"
          >
            {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Templates() {
  const navigate = useNavigate();
  const { getAccessToken } = useAuth();
  const queryClient = useQueryClient();
  const token = getAccessToken();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: () => fetchTemplates(token!),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setDeletingId(id);
      await deleteTemplate(token!, id);
    },
    onSuccess: () => {
      setDeletingId(null);
      void queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: () => setDeletingId(null),
  });

  function handleOpenInEditor(template: Template) {
    navigate("/", {
      state: {
        templateHtml: template.html_content,
        templateId: template.id,
        templateName: template.name,
        presetId: template.preset_id,
      },
    });
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border px-6 h-14 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="size-3.5" />
          Back to chat
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <h1 className="text-sm font-semibold">My Templates</h1>
        <div className="flex-1" />
        <ModeToggle />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 h-64 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center">
              <FileText className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">No saved templates yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Generate an invoice in the chat and click Save to store it here.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate("/")}>
              Go to chat
            </Button>
          </div>
        ) : (
          <div className="group-cards grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {templates.map((t) => (
              <div key={t.id} className="group">
                <TemplateCard
                  template={t}
                  onOpenInEditor={handleOpenInEditor}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  isDeleting={deletingId === t.id}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
