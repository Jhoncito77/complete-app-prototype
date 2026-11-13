import { Link } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Franja superior que identifica el prototipo y sus datos como demostración. */
export function DemoStrip() {
  return (
    <div className="no-print border-b border-primary/10 bg-lavender">
      <div className="container-app flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-xs text-accent-foreground">
        <p className="flex items-center gap-1.5 font-medium">
          <FlaskConical className="size-3.5" aria-hidden />
          Prototipo navegable · Los proveedores y solicitudes son datos de demostración
        </p>
        <nav aria-label="Documentación del proyecto" className="hidden items-center gap-3 sm:flex">
          <Link to="/design-system" className="hover:underline">Design System</Link>
          <span aria-hidden className="text-secondary">·</span>
          <Link to="/flujos" className="hover:underline">User Flow y Journey</Link>
          <span aria-hidden className="text-secondary">·</span>
          <Link to="/usabilidad" className="hover:underline">Pruebas de usabilidad</Link>
        </nav>
      </div>
    </div>
  );
}

export function DemoTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      <FlaskConical className="size-3" aria-hidden />
      Ejemplo
    </span>
  );
}
