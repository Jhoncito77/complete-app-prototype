import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, ClipboardList, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { EmptyState, PageHeader } from "@/components/petcare/common";
import { RequestHistory } from "@/components/petcare/RequestHistory";
import { StatusBadge } from "@/components/petcare/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STATUS_META } from "@/lib/petcare/categories";
import { formatDate, formatTime } from "@/lib/petcare/format";
import { countByStatus, usePetCare, useSession } from "@/lib/petcare/store";
import type { RequestStatus } from "@/lib/petcare/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/propietario/solicitudes")({
  head: () => ({
    meta: [
      { title: "Mis solicitudes — PetCare" },
      { name: "description", content: "Consulta el estado de tus solicitudes y reservas de servicios para mascotas." },
      { property: "og:title", content: "Mis solicitudes — PetCare" },
      { property: "og:description", content: "Estado de solicitudes y reservas del propietario." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyRequests,
});

type Filter = "todas" | RequestStatus;

function MyRequests() {
  const s = usePetCare();
  const user = useSession();
  const [filter, setFilter] = useState<Filter>("todas");
  const [open, setOpen] = useState<string | null>(null);
  if (!user) return null;

  const mine = s.requests.filter((r) => r.ownerId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const counts = countByStatus(mine);
  const list = filter === "todas" ? mine : mine.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis solicitudes"
        description="Una solicitud pendiente aún no es una reserva. Cuando el proveedor la acepta, se convierte en reserva confirmada."
        actions={<Button asChild><Link to="/explorar">Nueva solicitud</Link></Button>}
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-xl bg-muted p-1">
          <TabsTrigger value="todas" className="rounded-lg">Todas ({counts.total})</TabsTrigger>
          <TabsTrigger value="pendiente" className="rounded-lg">Pendientes ({counts.pendiente})</TabsTrigger>
          <TabsTrigger value="aceptada" className="rounded-lg">Reservas aceptadas ({counts.aceptada})</TabsTrigger>
          <TabsTrigger value="rechazada" className="rounded-lg">Rechazadas ({counts.rechazada})</TabsTrigger>
          <TabsTrigger value="finalizada" className="rounded-lg">Finalizadas ({counts.finalizada})</TabsTrigger>
        </TabsList>
      </Tabs>

      {list.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={filter === "todas" ? "Aún no tienes solicitudes" : `No tienes solicitudes ${STATUS_META[filter as RequestStatus].label.toLowerCase()}s`}
          description="Explora servicios y envía una solicitud con tu fecha preferida."
          action={<Button asChild><Link to="/explorar">Explorar servicios</Link></Button>}
        />
      ) : (
        <ul className="space-y-4">
          {list.map((r) => {
            const svc = s.services.find((x) => x.id === r.serviceId);
            const prov = s.providers.find((p) => p.id === r.providerId);
            const accepted = r.status === "aceptada";
            const isOpen = open === r.id;
            return (
              <li
                key={r.id}
                className={cn(
                  "surface-card overflow-hidden",
                  accepted && "border-success/50",
                  r.status === "pendiente" && "border-warning/40",
                )}
              >
                {accepted && (
                  <div className="bg-success-soft px-5 py-2 text-xs font-semibold text-success-strong">Reserva confirmada por el proveedor</div>
                )}
                {r.status === "pendiente" && (
                  <div className="bg-warning-soft px-5 py-2 text-xs font-semibold text-warning-strong">Solicitud enviada · Esperando respuesta del proveedor</div>
                )}
                <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-h3">{svc?.name ?? "Servicio"}</h2>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {prov ? (
                        <Link to="/proveedores/$providerId" params={{ providerId: prov.id }} className="font-medium text-primary hover:underline">{prov.name}</Link>
                      ) : "Proveedor"}{" "}
                      · Para {r.petName}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden /> {formatDate(r.date)}</span>
                      <span className="flex items-center gap-1.5"><Clock className="size-4" aria-hidden /> {formatTime(r.time)}</span>
                      {prov && <span className="flex items-center gap-1.5"><MapPin className="size-4" aria-hidden /> {prov.neighborhood}, {prov.city}</span>}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{STATUS_META[r.status].help}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setOpen(isOpen ? null : r.id)} aria-expanded={isOpen} className="self-start md:self-center">
                    Historial <ChevronDown className={cn("transition-transform", isOpen && "rotate-180")} />
                  </Button>
                </div>
                {isOpen && (
                  <div className="border-t border-border bg-muted/40 px-5 py-4">
                    {r.notes && <p className="mb-4 text-sm"><span className="font-medium">Tus observaciones:</span> <span className="text-muted-foreground">{r.notes}</span></p>}
                    <RequestHistory history={r.history} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
