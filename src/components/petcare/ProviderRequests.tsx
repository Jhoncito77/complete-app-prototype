import { CalendarDays, Check, Clock, Eye, Flag, Phone, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";
import { RequestHistory } from "./RequestHistory";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatShortDate, formatTime } from "@/lib/petcare/format";
import { updateRequestStatus, usePetCare } from "@/lib/petcare/store";
import type { RequestStatus, ServiceRequest } from "@/lib/petcare/types";

type Action = { request: ServiceRequest; to: Extract<RequestStatus, "aceptada" | "rechazada" | "finalizada"> };

const ACTION_COPY = {
  aceptada: {
    title: "¿Aceptar esta solicitud?",
    confirm: "Sí, aceptar",
    tone: "success" as const,
    toast: "Solicitud aceptada. El propietario verá la reserva confirmada.",
  },
  rechazada: {
    title: "¿Rechazar esta solicitud?",
    confirm: "Sí, rechazar",
    tone: "destructive" as const,
    toast: "Solicitud rechazada. El propietario verá el estado actualizado.",
  },
  finalizada: {
    title: "¿Marcar como finalizada?",
    confirm: "Marcar finalizada",
    tone: "default" as const,
    toast: "Servicio marcado como finalizado.",
  },
};

export function ProviderRequests({ requests, compact = false }: { requests: ServiceRequest[]; compact?: boolean }) {
  const s = usePetCare();
  const [detail, setDetail] = useState<string | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [note, setNote] = useState("");

  const svcName = (id: string) => s.services.find((x) => x.id === id)?.name ?? "Servicio";
  const current = requests.find((r) => r.id === detail) ?? s.requests.find((r) => r.id === detail);

  function ask(request: ServiceRequest, to: Action["to"]) {
    setNote("");
    setAction({ request, to });
  }

  function confirm() {
    if (!action) return;
    updateRequestStatus(action.request.id, action.to, note);
    toast.success(ACTION_COPY[action.to].toast);
    setAction(null);
  }

  const actions = (r: ServiceRequest, size: "sm" | "default" = "sm") => (
    <>
      {r.status === "pendiente" && (
        <>
          <Button size={size} variant="success" onClick={() => ask(r, "aceptada")}><Check /> Aceptar</Button>
          <Button size={size} variant="destructive-outline" onClick={() => ask(r, "rechazada")}><X /> Rechazar</Button>
        </>
      )}
      {r.status === "aceptada" && (
        <Button size={size} variant="secondary" onClick={() => ask(r, "finalizada")}><Flag /> Marcar finalizada</Button>
      )}
    </>
  );

  return (
    <>
      {/* Escritorio: tabla */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="pl-5">Propietario y mascota</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Fecha y hora preferidas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="pr-5 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="pl-5">
                  <p className="font-semibold text-foreground">{r.ownerName}</p>
                  <p className="text-xs text-muted-foreground">Mascota: {r.petName}</p>
                </TableCell>
                <TableCell className="text-foreground">{svcName(r.serviceId)}</TableCell>
                <TableCell>
                  <p className="text-foreground">{formatShortDate(r.date)}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(r.time)}</p>
                </TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell className="pr-5">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setDetail(r.id)}><Eye /> Revisar</Button>
                    {!compact && actions(r)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Móvil: tarjetas */}
      <ul className="space-y-3 md:hidden">
        {requests.map((r) => (
          <li key={r.id} className="surface-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{svcName(r.serviceId)}</p>
                <p className="text-sm text-muted-foreground">{r.ownerName} · {r.petName}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden /> {formatShortDate(r.date)} · {formatTime(r.time)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setDetail(r.id)}><Eye /> Revisar</Button>
              {actions(r)}
            </div>
          </li>
        ))}
      </ul>

      {/* Detalle */}
      <Dialog open={!!current} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          {current && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2"><StatusBadge status={current.status} /></div>
                <DialogTitle className="text-h3">{svcName(current.serviceId)}</DialogTitle>
                <DialogDescription>Solicitud de {current.ownerName} para {current.petName}</DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-muted p-3">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" aria-hidden /> Fecha preferida</dt>
                  <dd className="mt-1 font-medium">{formatDate(current.date)}</dd>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="size-3.5" aria-hidden /> Hora preferida</dt>
                  <dd className="mt-1 font-medium">{formatTime(current.time)}</dd>
                </div>
                <div className="col-span-2 rounded-xl bg-muted p-3">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="size-3.5" aria-hidden /> Contacto del propietario</dt>
                  <dd className="mt-1 font-medium">{current.ownerName} · {current.ownerPhone || "Sin teléfono"}</dd>
                </div>
                <div className="col-span-2 rounded-xl bg-muted p-3">
                  <dt className="text-xs text-muted-foreground">Observaciones</dt>
                  <dd className="mt-1">{current.notes || "Sin observaciones."}</dd>
                </div>
              </dl>
              <div>
                <h3 className="mb-3 text-sm font-semibold">Historial</h3>
                <RequestHistory history={current.history} />
              </div>
              {(current.status === "pendiente" || current.status === "aceptada") && (
                <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">{actions(current, "default")}</div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmación */}
      <ConfirmDialog
        open={!!action}
        onOpenChange={(o) => !o && setAction(null)}
        title={action ? ACTION_COPY[action.to].title : ""}
        tone={action ? ACTION_COPY[action.to].tone : "default"}
        confirmLabel={action ? ACTION_COPY[action.to].confirm : ""}
        description={
          action && (
            <>
              <b className="text-foreground">{svcName(action.request.serviceId)}</b> para {action.request.petName} ({action.request.ownerName}),{" "}
              {formatDate(action.request.date)} a las {formatTime(action.request.time)}.
              {action.to === "aceptada" && " El propietario verá su reserva como confirmada."}
            </>
          )
        }
        onConfirm={confirm}
      >
        {action?.to === "rechazada" && (
          <div className="space-y-1.5">
            <label htmlFor="reject-note" className="text-sm font-medium">Motivo <span className="font-normal text-muted-foreground">(opcional)</span></label>
            <Textarea id="reject-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej.: No tenemos disponibilidad en ese horario." className="min-h-[72px]" />
          </div>
        )}
      </ConfirmDialog>
    </>
  );
}
