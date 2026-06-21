import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Pencil, Plus, Trash2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import {
  createPreset,
  deletePreset,
  fetchPresets,
  updatePreset,
  type Preset,
  type PresetData,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const presetSchema = z.object({
  name: z.string().min(1, "Label is required"),
  business_name: z.string().optional(),
  ruc: z.string().optional(),
  timbrado: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
});

type PresetFormData = z.infer<typeof presetSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-xs mt-1">{message}</p>;
}

interface PresetFormProps {
  preset?: Preset;
  onSave: (data: PresetData) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function PresetForm({ preset, onSave, onCancel, isSaving }: PresetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PresetFormData>({
    resolver: zodResolver(presetSchema),
    defaultValues: {
      name: preset?.name ?? "",
      business_name: preset?.business_name ?? "",
      ruc: preset?.ruc ?? "",
      timbrado: preset?.timbrado ?? "",
      address: preset?.address ?? "",
      city: preset?.city ?? "",
      phone: preset?.phone ?? "",
      email: preset?.email ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4 px-4 py-2">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Preset label *</Label>
        <Input id="name" placeholder="e.g. My Company" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <Separator />
      <p className="text-xs text-muted-foreground -mt-2">Company information</p>

      <div className="grid gap-1.5">
        <Label htmlFor="business_name">Razón Social</Label>
        <Input id="business_name" placeholder="Company legal name" {...register("business_name")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="ruc">RUC</Label>
          <Input id="ruc" placeholder="80000000-0" {...register("ruc")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="timbrado">Timbrado</Label>
          <Input id="timbrado" placeholder="12345678" {...register("timbrado")} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" placeholder="Street address" {...register("address")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" placeholder="Asunción" {...register("city")} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" placeholder="+595 21 000000" {...register("phone")} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="contact@company.com" {...register("email")} />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm" disabled={isSaving} className="flex-1">
          {isSaving ? "Saving…" : preset ? "Update preset" : "Create preset"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

interface PresetSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PresetSheet({ open, onOpenChange }: PresetSheetProps) {
  const { getAccessToken } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Preset | "new" | null>(null);

  const token = getAccessToken();

  const { data: presets = [] } = useQuery({
    queryKey: ["presets"],
    queryFn: () => fetchPresets(token!),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (data: PresetData) => createPreset(token!, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["presets"] });
      setEditing(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PresetData> }) =>
      updatePreset(token!, id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["presets"] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePreset(token!, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["presets"] });
    },
  });

  function handleSave(data: PresetData) {
    if (editing === "new") {
      createMutation.mutate(data);
    } else if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0 overflow-y-auto">
        <SheetHeader className="px-4 pt-5 pb-3">
          {editing ? (
            <button
              onClick={() => setEditing(null)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-1 w-fit"
            >
              <ChevronLeft className="size-3.5" />
              Back to presets
            </button>
          ) : null}
          <SheetTitle>{editing ? (editing === "new" ? "New preset" : "Edit preset") : "Presets"}</SheetTitle>
          <SheetDescription>
            {editing
              ? "Fill in your company details for Paraguay invoices."
              : "Select a preset to auto-fill invoice fields when chatting with the AI."}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        {editing ? (
          <PresetForm
            preset={editing === "new" ? undefined : editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            isSaving={isSaving}
          />
        ) : (
          <div className="flex flex-col gap-1 px-4 py-3">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start gap-2 mb-1"
              onClick={() => setEditing("new")}
            >
              <Plus className="size-3.5" />
              New preset
            </Button>

            {presets.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No presets yet. Create one to auto-fill invoice fields.
              </p>
            )}

            {presets.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  {p.business_name && (
                    <p className="text-xs text-muted-foreground truncate">{p.business_name}</p>
                  )}
                </div>
                <button
                  onClick={() => setEditing(p)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded"
                  aria-label="Edit preset"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(p.id)}
                  className="text-muted-foreground hover:text-destructive p-1 rounded"
                  aria-label="Delete preset"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
