import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft",
        className,
      )}
      aria-hidden
    >
      <PawPrint className="size-5" strokeWidth={2.25} />
    </span>
  );
}

export function Logo({ className, to = "/" }: { className?: string; to?: "/" | "/proveedor" | "/propietario" }) {
  return (
    <Link to={to} className={cn("inline-flex items-center gap-2.5 rounded-lg", className)} aria-label="PetCare, ir al inicio">
      <LogoMark />
      <span className="text-lg font-bold tracking-tight text-foreground">
        Pet<span className="text-primary">Care</span>
      </span>
    </Link>
  );
}
