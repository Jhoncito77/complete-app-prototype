import { STATUS_META } from "@/lib/petcare/categories";
import { formatDateTime } from "@/lib/petcare/format";
import type { StatusEvent } from "@/lib/petcare/types";
import { cn } from "@/lib/utils";

const DOT: Record<StatusEvent["status"], string> = {
  pendiente: "bg-warning",
  aceptada: "bg-success",
  rechazada: "bg-destructive",
  finalizada: "bg-info",
};

export function RequestHistory({ history }: { history: StatusEvent[] }) {
  return (
    <ol className="relative space-y-4 border-l border-border pl-5">
      {history.map((h, i) => (
        <li key={`${h.status}-${i}`} className="relative">
          <span className={cn("absolute -left-[26px] top-1 size-3 rounded-full ring-4 ring-card", DOT[h.status])} aria-hidden />
          <p className="text-sm font-medium text-foreground">
            {h.status === "pendiente" ? "Solicitud enviada" : `Solicitud ${STATUS_META[h.status].label.toLowerCase()}`}
          </p>
          <p className="text-xs text-muted-foreground">{formatDateTime(h.at)}</p>
          {h.note && <p className="mt-1 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">“{h.note}”</p>}
        </li>
      ))}
    </ol>
  );
}
