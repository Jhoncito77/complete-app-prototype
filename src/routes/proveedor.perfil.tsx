import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FormField, PageHeader } from "@/components/petcare/common";
import { useProviderData } from "@/components/petcare/useProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, CITIES } from "@/lib/petcare/categories";
import { updateProvider } from "@/lib/petcare/store";
import type { CategoryId, Provider } from "@/lib/petcare/types";

export const Route = createFileRoute("/proveedor/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil del proveedor — PetCare" },
      { name: "description", content: "Actualiza la información pública de tu negocio en PetCare." },
      { property: "og:title", content: "Perfil del proveedor — PetCare" },
      { property: "og:description", content: "Información pública del proveedor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProviderProfilePage,
});

function ProviderProfilePage() {
  const { provider } = useProviderData();
  if (!provider) return null;
  return <ProviderProfileForm key={provider.id} provider={provider} />;
}

type Fields = Omit<Provider, "id" | "image">;

function ProviderProfileForm({ provider }: { provider: Provider }) {
  const [f, setF] = useState<Fields>({
    name: provider.name,
    category: provider.category,
    tagline: provider.tagline,
    description: provider.description,
    city: provider.city,
    neighborhood: provider.neighborhood,
    address: provider.address,
    phone: provider.phone,
    email: provider.email,
    schedule: provider.schedule,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  function save(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (f.name.trim().length < 3) next.name = "Escribe el nombre del negocio.";
    if (!f.neighborhood.trim()) next.neighborhood = "Indica el barrio o zona.";
    if (f.phone.replace(/\D/g, "").length < 7) next.phone = "Ingresa un teléfono válido.";
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) next.email = "Revisa el formato del correo.";
    setErrors(next);
    if (Object.keys(next).length) return;
    updateProvider(provider.id, f);
    toast.success("Perfil actualizado", { description: "Los propietarios ya ven la nueva información." });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perfil del proveedor"
        description="Información clara y completa ayuda a los propietarios a decidir."
        actions={
          <Button asChild variant="secondary">
            <Link to="/proveedores/$providerId" params={{ providerId: provider.id }}><ExternalLink /> Ver ficha pública</Link>
          </Button>
        }
      />
      <form onSubmit={save} noValidate className="surface-card space-y-6 p-6">
        <fieldset className="grid gap-5 md:grid-cols-2">
          <legend className="mb-1 text-h3 md:col-span-2">Información general</legend>
          <FormField id="name" label="Nombre del negocio" error={errors.name}>
            <Input id="name" value={f.name} onChange={set("name")} aria-invalid={!!errors.name} />
          </FormField>
          <FormField id="category" label="Categoría principal">
            <Select value={f.category} onValueChange={(v) => setF((p) => ({ ...p, category: v as CategoryId }))}>
              <SelectTrigger id="category"><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
          <FormField id="tagline" label="Frase corta" optional className="md:col-span-2" hint="Aparece en las tarjetas de resultados.">
            <Input id="tagline" value={f.tagline} onChange={set("tagline")} maxLength={80} placeholder="Ej.: Medicina preventiva para perros y gatos" />
          </FormField>
          <FormField id="description" label="Descripción" optional className="md:col-span-2">
            <Textarea id="description" value={f.description} onChange={set("description")} rows={4} placeholder="Cuéntales a los propietarios cómo trabajas" />
          </FormField>
        </fieldset>
        <fieldset className="grid gap-5 border-t border-border pt-6 md:grid-cols-2">
          <legend className="mb-1 pt-6 text-h3 md:col-span-2">Ubicación y contacto</legend>
          <FormField id="city" label="Ciudad">
            <Select value={f.city} onValueChange={(v) => setF((p) => ({ ...p, city: v }))}>
              <SelectTrigger id="city"><SelectValue /></SelectTrigger>
              <SelectContent>{CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
          <FormField id="neighborhood" label="Barrio o zona" error={errors.neighborhood}>
            <Input id="neighborhood" value={f.neighborhood} onChange={set("neighborhood")} aria-invalid={!!errors.neighborhood} />
          </FormField>
          <FormField id="address" label="Dirección" optional className="md:col-span-2">
            <Input id="address" value={f.address} onChange={set("address")} />
          </FormField>
          <FormField id="phone" label="Teléfono" error={errors.phone}>
            <Input id="phone" type="tel" value={f.phone} onChange={set("phone")} aria-invalid={!!errors.phone} />
          </FormField>
          <FormField id="email" label="Correo de contacto" optional error={errors.email}>
            <Input id="email" type="email" value={f.email} onChange={set("email")} aria-invalid={!!errors.email} />
          </FormField>
          <FormField id="schedule" label="Horario de atención" optional className="md:col-span-2">
            <Input id="schedule" value={f.schedule} onChange={set("schedule")} placeholder="Ej.: Lunes a viernes, 8:00 a. m. – 6:00 p. m." />
          </FormField>
        </fieldset>
        <div className="flex justify-end border-t border-border pt-6">
          <Button type="submit" size="lg">Guardar cambios</Button>
        </div>
      </form>
    </div>
  );
}
