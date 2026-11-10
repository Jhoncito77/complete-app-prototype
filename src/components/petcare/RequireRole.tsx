import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated, useSession } from "@/lib/petcare/store";
import type { Role, User } from "@/lib/petcare/types";

export function PageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Cargando">
      <Skeleton className="h-9 w-64 rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}

export function RequireRole({ role, children }: { role: Role; children: (user: User) => ReactNode }) {
  const hydrated = useHydrated();
  const user = useSession();
  const location = useLocation();

  if (!hydrated) return <PageSkeleton />;

  if (!user || user.role !== role) {
    const wrongRole = !!user && user.role !== role;
    return (
      <div className="surface-card mx-auto max-w-md p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-lavender text-primary">
          <Lock className="size-6" aria-hidden />
        </span>
        <h1 className="mt-4 text-h2">{wrongRole ? "Esta sección es para otro tipo de cuenta" : "Inicia sesión para continuar"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {wrongRole
            ? `Tu cuenta es de ${user!.role}. Este espacio es para ${role === "proveedor" ? "proveedores" : "propietarios"}.`
            : `Este espacio es para ${role === "proveedor" ? "proveedores" : "propietarios de mascotas"}.`}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {wrongRole ? (
            <Button asChild>
              <Link to={user!.role === "proveedor" ? "/proveedor" : "/propietario"}>Ir a mi panel</Link>
            </Button>
          ) : (
            <>
              <Button asChild>
                <Link to="/login" search={{ redirect: location.href }}>Iniciar sesión</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/registro">Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return <>{children(user)}</>;
}
