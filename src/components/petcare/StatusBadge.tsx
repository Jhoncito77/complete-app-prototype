import { CheckCircle2, Clock, XCircle, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_META } from "@/lib/petcare/categories";
import type { RequestStatus } from "@/lib/petcare/types";

const ICONS = {
  pendiente: Clock,
  aceptada: CheckCircle2,
  rechazada: XCircle,
  finalizada: Flag,
} as const;

/** Estado comunicado con color, icono y texto (nunca solo color). */
export function StatusBadge({ status, className }: { status: RequestStatus; className?: string }) {
  const meta = STATUS_META[status];
  const Icon = ICONS[status];
  return (
    <Badge variant={meta.variant} className={className}>
      <Icon aria-hidden />
      {meta.label}
    </Badge>
  );
}
