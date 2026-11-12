import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Inbox, MapPin, Printer, User } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/petcare/PublicLayout";
import { CategoryCard, ProviderCard } from "@/components/petcare/cards";
import { EmptyState, FormField, PageHeader, StatCard } from "@/components/petcare/common";
import { ConfirmDialog } from "@/components/petcare/ConfirmDialog";
import { PasswordInput } from "@/components/petcare/PasswordInput";
import { StatusBadge } from "@/components/petcare/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES } from "@/lib/petcare/categories";
import { usePetCare } from "@/lib/petcare/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design System y UIKit — PetCare" },
      { name: "description", content: "Colores, tipografía, espaciado, iconos y componentes reutilizables de PetCare." },
      { property: "og:title", content: "Design System y UIKit — PetCare" },
      { property: "og:description", content: "Guía de estilos visual y componentes de PetCare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignSystem,
});

const COLORS = [
  { token: "primary-600", hex: "#6C5CE7", use: "Botones principales, enlaces activos, navegación", cls: "bg-primary" },
  { token: "primary-500", hex: "#7B68EE", use: "Hover y elementos destacados", cls: "bg-primary-hover" },
  { token: "secondary-400", hex: "#A78BFA", use: "Acentos secundarios, chips", cls: "bg-secondary" },
  { token: "lavender-100", hex: "#F1ECFF", use: "Fondos suaves, estados seleccionados", cls: "bg-lavender" },
  { token: "background", hex: "#F8FAFC", use: "Fondo general", cls: "bg-background" },
  { token: "surface", hex: "#FFFFFF", use: "Tarjetas, formularios, paneles", cls: "bg-card" },
  { token: "text-primary", hex: "#1F2937", use: "Títulos y texto principal", cls: "bg-foreground" },
  { token: "text-secondary", hex: "#6B7280", use: "Descripciones y metadatos", cls: "bg-muted-foreground" },
  { token: "border", hex: "#E5E7EB", use: "Bordes y separadores", cls: "bg-border" },
  { token: "accent-orange", hex: "#F59E0B", use: "Destacados, categoría paseo", cls: "bg-orange" },
  { token: "success", hex: "#10B981", use: "Aceptado, acciones exitosas", cls: "bg-success" },
  { token: "warning", hex: "#F59E0B", use: "Pendiente, advertencias", cls: "bg-warning" },
  { token: "danger", hex: "#EF4444", use: "Rechazado, errores", cls: "bg-destructive" },
  { token: "info", hex: "#3B82F6", use: "Información", cls: "bg-info" },
];

const TYPE = [
  { name: "Display", spec: "Bold 700 · 32–44 px", cls: "text-display", sample: "Cuida a tu mascota" },
  { name: "H1", spec: "Bold 700 · 28–32 px", cls: "text-h1", sample: "Mis solicitudes" },
  { name: "H2", spec: "Semibold 600 · 22–24 px", cls: "text-h2", sample: "Categorías de servicio" },
  { name: "H3", spec: "Semibold 600 · 18 px", cls: "text-h3", sample: "Consulta general" },
  { name: "Texto normal", spec: "Regular 400 · 14–16 px", cls: "text-base", sample: "Revisión completa del estado de salud." },
  { name: "Texto secundario", spec: "Regular 400 · 12–14 px", cls: "text-sm text-muted-foreground", sample: "Chapinero, Bogotá" },
  { name: "Botón", spec: "Semibold 600 · 14–16 px", cls: "text-sm font-semibold", sample: "Enviar solicitud" },
  { name: "Etiqueta", spec: "Medium 500 · 12–13 px", cls: "text-xs font-medium", sample: "Pendiente" },
];

const SECTIONS = [
  ["colores", "Colores"],
  ["tipografia", "Tipografía"],
  ["espaciado", "Espaciado y formas"],
  ["botones", "Botones"],
  ["formularios", "Formularios"],
  ["estados", "Badges de estado"],
  ["tarjetas", "Tarjetas"],
  ["feedback", "Feedback"],
  ["iconos", "Iconografía"],
] as const;

function DesignSystem() {
  const s = usePetCare();
  const [modal, setModal] = useState(false);
  const sample = s.providers[0];

  return (
    <PublicLayout>
      <div className="container-app py-8 md:py-10">
        <PageHeader
          eyebrow={<Badge variant="secondary">01 — Design System · 02 — UIKit</Badge>}
          title="Design System PetCare"
          description="Tokens, tipografía y componentes reutilizables. Todas las pantallas del prototipo usan exactamente estos elementos."
          actions={<Button variant="secondary" onClick={() => window.print()} className="no-print"><Printer /> Imprimir / PDF</Button>}
        />

        <nav aria-label="Secciones" className="no-print mt-6 flex flex-wrap gap-2">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary">{label}</a>
          ))}
        </nav>

        <Block id="colores" title="Colores">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLORS.map((c) => (
              <div key={c.token} className="surface-card overflow-hidden">
                <div className={cn("h-20 border-b border-border", c.cls)} />
                <div className="p-4">
                  <p className="font-mono text-sm font-semibold">{c.token}</p>
                  <p className="font-mono text-xs text-muted-foreground">{c.hex}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.use}</p>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block id="tipografia" title="Tipografía · Inter">
          <div className="surface-card divide-y divide-border">
            {TYPE.map((t) => (
              <div key={t.name} className="grid items-center gap-2 p-5 md:grid-cols-12">
                <div className="md:col-span-3">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.spec}</p>
                </div>
                <p className={cn("md:col-span-9", t.cls)}>{t.sample}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block id="espaciado" title="Espaciado y formas">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface-card p-6">
              <p className="text-sm font-semibold">Escala de espaciado (múltiplos de 4 / 8 px)</p>
              <div className="mt-4 space-y-2">
                {[4, 8, 12, 16, 24, 32, 48].map((n) => (
                  <div key={n} className="flex items-center gap-3">
                    <span className="w-12 font-mono text-xs text-muted-foreground">{n}px</span>
                    <span className="h-3 rounded bg-secondary" style={{ width: n * 3 }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-card p-6">
              <p className="text-sm font-semibold">Radios y sombras</p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
                <div><div className="mx-auto h-16 w-16 rounded-lg border border-border bg-lavender" />Inputs y botones · 12 px</div>
                <div><div className="mx-auto h-16 w-16 rounded-2xl border border-border bg-lavender" />Tarjetas · 16 px</div>
                <div><div className="mx-auto h-16 w-16 rounded-full border border-border bg-lavender" />Chips y badges</div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
                <div><div className="mx-auto h-12 w-full rounded-xl bg-card shadow-soft" />Soft</div>
                <div><div className="mx-auto h-12 w-full rounded-xl bg-card shadow-card" />Card</div>
                <div><div className="mx-auto h-12 w-full rounded-xl bg-card shadow-lift" />Hover</div>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">Contenedor máximo 1240 px · cuadrícula de 12 columnas · separación entre secciones 24–32 px.</p>
            </div>
          </div>
        </Block>

        <Block id="botones" title="Botones · altura 44–48 px">
          <div className="surface-card overflow-x-auto p-6">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Variante</th><th className="pb-3 font-medium">Default</th><th className="pb-3 font-medium">Disabled</th><th className="pb-3 font-medium">Loading</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {([
                  ["Primary", "default"],
                  ["Secondary", "secondary"],
                  ["Tertiary / Ghost", "ghost"],
                  ["Danger", "destructive"],
                ] as const).map(([label, v]) => (
                  <tr key={v}>
                    <td className="py-3 font-medium">{label}</td>
                    <td className="py-3"><Button variant={v}>Botón</Button></td>
                    <td className="py-3"><Button variant={v} disabled>Botón</Button></td>
                    <td className="py-3"><Button variant={v} loading>Enviando</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted-foreground">Hover: primary-500. Pressed: escala 98 %. Foco: anillo morado visible con teclado.</p>
          </div>
        </Block>

        <Block id="formularios" title="Formularios">
          <div className="surface-card grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
            <FormField id="ds-default" label="Default"><Input id="ds-default" placeholder="nombre@correo.com" /></FormField>
            <FormField id="ds-filled" label="Filled"><Input id="ds-filled" defaultValue="ana@petcare.demo" /></FormField>
            <FormField id="ds-focus" label="Focus" hint="Haz clic para ver el foco morado."><Input id="ds-focus" placeholder="Escribe aquí" /></FormField>
            <FormField id="ds-error" label="Error" error="Revisa el formato del correo."><Input id="ds-error" defaultValue="ana@correo" aria-invalid /></FormField>
            <FormField id="ds-disabled" label="Disabled"><Input id="ds-disabled" disabled defaultValue="No editable" /></FormField>
            <FormField id="ds-pass" label="Contraseña"><PasswordInput id="ds-pass" defaultValue="demo1234" /></FormField>
            <FormField id="ds-select" label="Select">
              <Select defaultValue="veterinaria">
                <SelectTrigger id="ds-select"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            <div className="space-y-3">
              <p className="text-sm font-medium">Checkbox y switch</p>
              <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked className="data-[state=checked]:border-primary data-[state=checked]:bg-primary" /> Acepto los términos</label>
              <label className="flex items-center gap-2 text-sm"><Switch defaultChecked /> Servicio publicado</label>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Radio</p>
              <RadioGroup defaultValue="propietario">
                <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="propietario" /> Propietario</label>
                <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="proveedor" /> Proveedor</label>
              </RadioGroup>
            </div>
          </div>
        </Block>

        <Block id="estados" title="Badges de estado · color + icono + texto">
          <div className="surface-card flex flex-wrap gap-3 p-6">
            <StatusBadge status="pendiente" />
            <StatusBadge status="aceptada" />
            <StatusBadge status="rechazada" />
            <StatusBadge status="finalizada" />
            <Badge variant="secondary">Chip seleccionado</Badge>
            <Badge variant="outline">Borrador</Badge>
          </div>
        </Block>

        <Block id="tarjetas" title="Tarjetas">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3">
              {CATEGORIES.slice(0, 2).map((c) => <CategoryCard key={c.id} category={c} />)}
            </div>
            {sample && <ProviderCard provider={sample} services={s.services.filter((x) => x.providerId === sample.id)} />}
            <div className="space-y-3">
              <StatCard label="Pendientes" value={3} icon={Inbox} tone="bg-warning-soft text-warning-strong" hint="Ejemplo de contador" />
              <div className="space-y-2 surface-card p-5" aria-label="Skeleton de carga">
                <Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </Block>

        <Block id="feedback" title="Feedback: toast, modal y estado vacío">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="surface-card flex flex-wrap items-start gap-3 p-6">
              <Button variant="success" onClick={() => toast.success("Solicitud enviada", { description: "Te avisaremos cuando el proveedor responda." })}>Toast de éxito</Button>
              <Button variant="destructive-outline" onClick={() => toast.error("No pudimos guardar los cambios", { description: "Inténtalo de nuevo." })}>Toast de error</Button>
              <Button variant="secondary" onClick={() => setModal(true)}>Modal de confirmación</Button>
            </div>
            <EmptyState icon={Inbox} title="Estado vacío" description="Mensaje claro y una acción para continuar." action={<Button size="sm">Acción principal</Button>} />
          </div>
          <ConfirmDialog open={modal} onOpenChange={setModal} title="¿Aceptar esta solicitud?" description="El propietario verá su reserva como confirmada." confirmLabel="Sí, aceptar" tone="success" onConfirm={() => toast.success("Confirmado")} />
        </Block>

        <Block id="iconos" title="Iconografía · outline, trazo uniforme">
          <div className="surface-card grid grid-cols-2 gap-4 p-6 sm:grid-cols-4 lg:grid-cols-7">
            {[
              ...CATEGORIES.map((c) => ({ icon: c.icon, label: c.label, tone: c.tone })),
              { icon: CalendarDays, label: "Reservas", tone: "bg-lavender text-primary" },
              { icon: User, label: "Perfil", tone: "bg-lavender text-primary" },
              { icon: MapPin, label: "Ubicación", tone: "bg-lavender text-primary" },
            ].map((i) => (
              <div key={i.label} className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
                <span className={cn("flex size-12 items-center justify-center rounded-xl", i.tone)}><i.icon className="size-6" strokeWidth={1.75} aria-hidden /></span>
                {i.label}
              </div>
            ))}
          </div>
        </Block>
      </div>
    </PublicLayout>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-32" aria-labelledby={`${id}-t`}>
      <h2 id={`${id}-t`} className="mb-4 text-h2">{title}</h2>
      {children}
    </section>
  );
}
