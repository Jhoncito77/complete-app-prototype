import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { DemoStrip } from "./DemoNotice";
import { useHydrated, useSession } from "@/lib/petcare/store";

type NavItem = { to: "/" | "/explorar" | "/propietario" | "/propietario/solicitudes" | "/propietario/perfil"; label: string; exact?: boolean };

const PUBLIC_NAV: NavItem[] = [
  { to: "/", label: "Inicio", exact: true },
  { to: "/explorar", label: "Explorar servicios" },
];

const OWNER_NAV: NavItem[] = [
  { to: "/propietario", label: "Panel", exact: true },
  { to: "/explorar", label: "Explorar servicios" },
  { to: "/propietario/solicitudes", label: "Mis solicitudes" },
  { to: "/propietario/perfil", label: "Perfil y mascotas" },
];

const linkBase =
  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
const linkActive = "bg-lavender text-primary hover:bg-lavender hover:text-primary";

export function SiteHeader() {
  const hydrated = useHydrated();
  const user = useSession();
  const [open, setOpen] = useState(false);
  const nav = user?.role === "propietario" ? OWNER_NAV : PUBLIC_NAV;

  return (
    <header className="no-print sticky top-0 z-40">
      <DemoStrip />
      <div className="border-b border-border bg-card/90 backdrop-blur">
        <div className="container-app flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo to={user?.role === "propietario" ? "/propietario" : "/"} />
            <nav aria-label="Navegación principal" className="hidden items-center gap-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={linkBase}
                  activeProps={{ className: linkActive, "aria-current": "page" }}
                  activeOptions={{ exact: item.exact }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {!hydrated ? (
              <div className="h-10 w-40" aria-hidden />
            ) : user ? (
              <>
                {user.role === "proveedor" && (
                  <Button asChild size="sm" className="hidden sm:inline-flex">
                    <Link to="/proveedor">Ir a mi panel</Link>
                  </Button>
                )}
                <UserMenu user={user} />
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/registro">Registrarse</Link>
                </Button>
              </div>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menú">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menú</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 flex flex-col gap-1" aria-label="Navegación móvil">
                  {nav.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={`${linkBase} py-3 text-base`}
                      activeProps={{ className: linkActive }}
                      activeOptions={{ exact: item.exact }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {user?.role === "proveedor" && (
                    <Link to="/proveedor" onClick={() => setOpen(false)} className={`${linkBase} py-3 text-base`}>
                      Ir a mi panel
                    </Link>
                  )}
                </nav>
                {hydrated && !user && (
                  <div className="mt-6 flex flex-col gap-2">
                    <Button asChild variant="secondary">
                      <Link to="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/registro" onClick={() => setOpen(false)}>Registrarse</Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
