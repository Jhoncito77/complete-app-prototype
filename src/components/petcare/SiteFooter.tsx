import { Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { resetDemo } from "@/lib/petcare/store";

export function SiteFooter() {
  return (
    <footer className="no-print mt-16 border-t border-border bg-card">
      <div className="container-app grid gap-8 py-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Encuentra servicios para tu mascota con información clara y gestiona tus solicitudes desde una sola plataforma.
          </p>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-sm font-semibold">Plataforma</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/explorar" className="hover:text-primary">Explorar servicios</Link></li>
            <li><Link to="/registro" className="hover:text-primary">Crear cuenta</Link></li>
            <li><Link to="/login" className="hover:text-primary">Iniciar sesión</Link></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <h2 className="text-sm font-semibold">Documentación del prototipo</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/design-system" className="hover:text-primary">Design System y UIKit</Link></li>
            <li><Link to="/flujos" className="hover:text-primary">User Flow y Customer Journey</Link></li>
            <li><Link to="/usabilidad" className="hover:text-primary">Pruebas de usabilidad</Link></li>
            <li>
              <button
                type="button"
                onClick={() => {
                  resetDemo();
                  toast.success("Datos de demostración restablecidos");
                }}
                className="inline-flex items-center gap-1.5 hover:text-primary"
              >
                <RotateCcw className="size-3.5" aria-hidden /> Restablecer datos de demostración
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="container-app py-4 text-xs text-muted-foreground">
          PetCare · Prototipo MVP v1.0 · Todos los proveedores, precios y solicitudes son ficticios.
        </p>
      </div>
    </footer>
  );
}
