import { createFileRoute } from "@tanstack/react-router";
import { PackageOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/petcare/ConfirmDialog";
import { EmptyState, FormField, PageHeader } from "@/components/petcare/common";
import { useProviderData } from "@/components/petcare/useProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, formatPrice, getCategory } from "@/lib/petcare/categories";
import { deleteService, setServicePublished, upsertService } from "@/lib/petcare/store";
import type { CategoryId, Service } from "@/lib/petcare/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/proveedor/servicios")({
  head: () => ({
    meta: [
      { title: "Mis servicios — PetCare" },
      { name: "description", content: "Crea, edita y publica los servicios que ofreces en PetCare." },
      { property: "og:title", content: "Mis servicios — PetCare" },
      { property: "og:description", content: "Gestión de servicios del proveedor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyServices,
});

function MyServices() {
  const { provider, services } = useProviderData();
  const [editing, setEditing] = useState<Service | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  if (!provider) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis servicios"
        description="Solo los servicios publicados son visibles para los propietarios."
        actions={<Button onClick={() => setEditing("new")}><Plus /> Nuevo servicio</Button>}
      />

      {services.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="Aún no tienes servicios"
          description="Crea tu primer servicio para aparecer en los resultados de búsqueda."
          action={<Button onClick={() => setEditing("new")}><Plus /> Crear servicio</Button>}
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {services.map((svc) => {
            const cat = getCategory(svc.category);
            return (
              <li key={svc.id} className={cn("surface-card flex flex-col p-5", !svc.published && "bg-muted/40")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", cat.tone)}>
                      <cat.icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-h3 leading-snug">{svc.name}</h2>
                      <p className="text-xs text-muted-foreground">{cat.label}</p>
                    </div>
                  </div>
                  <Badge variant={svc.published ? "success" : "outline"}>{svc.published ? "Publicado" : "Borrador"}</Badge>
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{svc.description}</p>
                <p className="mt-3 text-sm font-semibold">{formatPrice(svc.price)}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={svc.published}
                      onCheckedChange={(v) => {
                        setServicePublished(svc.id, v);
                        toast.success(v ? "Servicio publicado" : "Servicio oculto de las búsquedas");
                      }}
                      aria-label={`Publicar ${svc.name}`}
                    />
                    {svc.published ? "Visible" : "Oculto"}
                  </label>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(svc)}><Pencil /> Editar</Button>
                    <Button variant="ghost" size="icon" onClick={() => setToDelete(svc)} aria-label={`Eliminar ${svc.name}`}>
                      <Trash2 className="text-destructive-strong" />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <ServiceDialog
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? null : editing}
          defaultCategory={provider.category}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            upsertService({ ...data, providerId: provider.id, ...(editing !== "new" ? { id: editing.id } : {}) });
            toast.success(editing === "new" ? "Servicio creado" : "Cambios guardados");
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="¿Eliminar este servicio?"
        description={<>Se eliminará <b className="text-foreground">{toDelete?.name}</b>. Las solicitudes existentes se conservan.</>}
        confirmLabel="Eliminar servicio"
        tone="destructive"
        onConfirm={() => {
          if (toDelete) deleteService(toDelete.id);
          toast.success("Servicio eliminado");
          setToDelete(null);
        }}
      />
    </div>
  );
}

type ServiceForm = Omit<Service, "id" | "providerId">;

function ServiceDialog({
  initial,
  defaultCategory,
  onClose,
  onSave,
}: {
  initial: Service | null;
  defaultCategory: CategoryId;
  onClose: () => void;
  onSave: (s: ServiceForm) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<CategoryId>(initial?.category ?? defaultCategory);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [errors, setErrors] = useState<Partial<Record<"name" | "description" | "price", string>>>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 3) next.name = "Escribe un nombre de al menos 3 caracteres.";
    if (description.trim().length < 10) next.description = "Describe el servicio en al menos 10 caracteres.";
    const digits = price.replace(/\D/g, "");
    if (price.trim() && (!digits || Number(digits) <= 0)) next.price = "Ingresa un valor numérico mayor a 0 o déjalo vacío.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave({ name: name.trim(), category, description: description.trim(), price: digits ? Number(digits) : null, published });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-h3">{initial ? "Editar servicio" : "Nuevo servicio"}</DialogTitle>
          <DialogDescription>Esta información se muestra en tu ficha pública.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="space-y-4">
          <FormField id="svc-name" label="Nombre del servicio" error={errors.name}>
            <Input id="svc-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} placeholder="Ej.: Consulta general" />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="svc-cat" label="Categoría">
              <Select value={category} onValueChange={(v) => setCategory(v as CategoryId)}>
                <SelectTrigger id="svc-cat"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            <FormField id="svc-price" label="Precio orientativo (COP)" optional error={errors.price}>
              <Input id="svc-price" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} aria-invalid={!!errors.price} placeholder="Ej.: 50000" />
            </FormField>
          </div>
          <FormField id="svc-desc" label="Descripción" error={errors.description}>
            <Textarea id="svc-desc" value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={!!errors.description} placeholder="¿Qué incluye el servicio?" />
          </FormField>
          <label className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
            <span>
              <span className="block text-sm font-medium">Publicar servicio</span>
              <span className="block text-xs text-muted-foreground">Si lo desactivas, quedará como borrador.</span>
            </span>
            <Switch checked={published} onCheckedChange={setPublished} />
          </label>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{initial ? "Guardar cambios" : "Crear servicio"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
