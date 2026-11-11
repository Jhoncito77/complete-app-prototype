import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, Info, MapPin, SearchX } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PublicLayout } from "@/components/petcare/PublicLayout";
import { RequireRole } from "@/components/petcare/RequireRole";
import { EmptyState, FormField } from "@/components/petcare/common";
import { StatusBadge } from "@/components/petcare/StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice, getCategory } from "@/lib/petcare/categories";
import { formatDate, formatTime, TIME_SLOTS } from "@/lib/petcare/format";
import { createRequest, usePetCare } from "@/lib/petcare/store";
import type { ServiceRequest, User } from "@/lib/petcare/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/solicitar/$serviceId")({
  head: () => ({
    meta: [
      { title: "Solicitar servicio — PetCare" },
      { name: "description", content: "Envía una solicitud con tu fecha y hora preferidas. El proveedor te responderá." },
      { property: "og:title", content: "Solicitar servicio — PetCare" },
      { property: "og:description", content: "Envía una solicitud de servicio para tu mascota." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SolicitarPage,
});

function SolicitarPage() {
  return (
    <PublicLayout>
      <div className="container-app py-8 md:py-10">
        <RequireRole role="propietario">{(user) => <RequestFlow user={user} />}</RequireRole>
      </div>
    </PublicLayout>
  );
}

type Errors = Partial<Record<"pet" | "date" | "time", string>>;

function RequestFlow({ user }: { user: User }) {
  const { serviceId } = Route.useParams();
  const s = usePetCare();
  const initial = s.services.find((x) => x.id === serviceId);
  const provider = initial ? s.providers.find((p) => p.id === initial.providerId) : undefined;
  const [selectedId, setSelectedId] = useState(serviceId);
  const [pet, setPet] = useState(user.pets[0]?.name ?? "");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<ServiceRequest | null>(null);
  const [calOpen, setCalOpen] = useState(false);

  if (!initial || !provider) {
    return (
      <EmptyState
        icon={SearchX}
        title="Este servicio no está disponible"
        description="Puede que el proveedor lo haya retirado."
        action={<Button asChild><Link to="/explorar">Explorar servicios</Link></Button>}
      />
    );
  }

  const options = s.services.filter((x) => x.providerId === provider.id && x.published);
  const service = options.find((x) => x.id === selectedId) ?? initial;
  const cat = getCategory(provider.category);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!pet.trim()) next.pet = "Indica para qué mascota es el servicio.";
    if (!date) next.date = "Selecciona una fecha preferida.";
    if (!time) next.time = "Selecciona una hora preferida.";
    setErrors(next);
    if (Object.keys(next).length || !date) return;
    setLoading(true);
    setTimeout(() => {
      const r = createRequest({
        serviceId: service.id,
        providerId: provider!.id,
        ownerId: user.id,
        ownerName: user.name,
        ownerPhone: user.phone ?? "",
        petName: pet.trim(),
        date: format(date, "yyyy-MM-dd"),
        time,
        notes: notes.trim(),
      });
      setLoading(false);
      setSent(r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-xl animate-fade-up">
        <div className="surface-card overflow-hidden">
          <div className="paw-pattern bg-success-soft px-6 py-8 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success text-primary-foreground shadow-soft">
              <CheckCircle2 className="size-8" aria-hidden />
            </span>
            <h1 className="mt-4 text-h1">¡Solicitud enviada!</h1>
            <p className="mt-2 text-sm text-success-strong">{provider.name} recibió tu solicitud.</p>
          </div>
          <div className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estado actual</span>
              <StatusBadge status={sent.status} />
            </div>
            <dl className="divide-y divide-border rounded-xl border border-border text-sm">
              <SummaryRow label="Servicio" value={service.name} />
              <SummaryRow label="Mascota" value={sent.petName} />
              <SummaryRow label="Fecha preferida" value={formatDate(sent.date)} />
              <SummaryRow label="Hora preferida" value={formatTime(sent.time)} />
            </dl>
            <p className="flex gap-2 rounded-xl bg-warning-soft p-3 text-sm text-warning-strong">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              Aún no es una reserva confirmada. La fecha y hora son preferencias: te avisaremos en "Mis solicitudes" cuando el proveedor acepte o rechace.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="flex-1">
                <Link to="/propietario/solicitudes">Ver mis solicitudes</Link>
              </Button>
              <Button asChild variant="secondary" className="flex-1">
                <Link to="/explorar">Seguir explorando</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
        <Link to="/proveedores/$providerId" params={{ providerId: provider.id }}><ArrowLeft /> Volver al proveedor</Link>
      </Button>
      <h1 className="text-h1">Solicitar servicio</h1>
      <p className="mt-1.5 text-sm text-muted-foreground md:text-base">Completa los datos mínimos. El proveedor confirmará si puede atenderte.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <form onSubmit={onSubmit} noValidate className="surface-card space-y-5 p-6 lg:col-span-7">
          <FormField id="service" label="Servicio seleccionado">
            <Select value={service.id} onValueChange={setSelectedId}>
              <SelectTrigger id="service"><SelectValue /></SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.id} value={o.id}>{o.name} · {formatPrice(o.price)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id="pet" label="Mascota" error={errors.pet}>
            {user.pets.length > 0 ? (
              <Select value={pet} onValueChange={setPet}>
                <SelectTrigger id="pet" aria-invalid={!!errors.pet}><SelectValue placeholder="Selecciona tu mascota" /></SelectTrigger>
                <SelectContent>
                  {user.pets.map((p) => (
                    <SelectItem key={p.id} value={p.name}>{p.name} · {p.species}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input id="pet" placeholder="Nombre de tu mascota" value={pet} onChange={(e) => setPet(e.target.value)} aria-invalid={!!errors.pet} />
            )}
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="date" label="Fecha preferida" error={errors.date}>
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <button
                    id="date"
                    type="button"
                    aria-invalid={!!errors.date}
                    className={cn(
                      "flex h-11 w-full items-center gap-2 rounded-lg border border-input bg-card px-3.5 text-left text-sm shadow-soft focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15 aria-[invalid=true]:border-destructive",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="size-4 text-muted-foreground" aria-hidden />
                    {date ? format(date, "EEE d 'de' MMM", { locale: es }) : "Elige una fecha"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto rounded-xl p-0" align="start">
                  <Calendar
                    mode="single"
                    locale={es}
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setCalOpen(false);
                    }}
                    disabled={{ before: today }}
                  />
                </PopoverContent>
              </Popover>
            </FormField>
            <FormField id="time" label="Hora preferida" error={errors.time}>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="time" aria-invalid={!!errors.time}>
                  <span className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" aria-hidden />
                    <SelectValue placeholder="Elige una hora" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>{formatTime(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField id="notes" label="Observaciones" optional hint="Ej.: comportamiento, alergias o indicaciones para el proveedor.">
            <Textarea id="notes" value={notes} maxLength={400} onChange={(e) => setNotes(e.target.value)} placeholder="Cuéntale al proveedor lo que necesite saber" />
          </FormField>

          <Button type="submit" size="lg" className="w-full" loading={loading}>Enviar solicitud</Button>
        </form>

        <aside className="lg:col-span-5">
          <div className="surface-card sticky top-28 p-6">
            <h2 className="text-h3">Resumen de la solicitud</h2>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-lavender p-4">
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", cat.tone)}>
                <cat.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold">{service.name}</p>
                <p className="text-sm text-muted-foreground">{provider.name}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" aria-hidden /> {provider.neighborhood}, {provider.city}</p>
              </div>
            </div>
            <dl className="mt-4 divide-y divide-border text-sm">
              <SummaryRow label="Precio orientativo" value={formatPrice(service.price)} />
              <SummaryRow label="Mascota" value={pet || "—"} />
              <SummaryRow label="Fecha preferida" value={date ? format(date, "d 'de' MMMM yyyy", { locale: es }) : "—"} />
              <SummaryRow label="Hora preferida" value={time ? formatTime(time) : "—"} />
            </dl>
            <p className="mt-4 flex gap-2 rounded-xl bg-info-soft p-3 text-xs text-info-strong">
              <Info className="size-4 shrink-0" aria-hidden />
              Enviar la solicitud no confirma la reserva. El pago se acuerda directamente con el proveedor.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 first:pt-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
