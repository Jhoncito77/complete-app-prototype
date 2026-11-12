import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  BarChart3,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageOpen,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { DemoStrip } from "./DemoNotice";
import { logout, usePetCare } from "@/lib/petcare/store";
import type { User } from "@/lib/petcare/types";
import { cn } from "@/lib/utils";

type ProviderPath = "/proveedor" | "/proveedor/solicitudes" | "/proveedor/servicios" | "/proveedor/reportes" | "/proveedor/perfil";

const NAV: { to: ProviderPath; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/proveedor", label: "Panel principal", icon: LayoutDashboard, exact: true },
  { to: "/proveedor/solicitudes", label: "Solicitudes recibidas", icon: ClipboardList },
  { to: "/proveedor/servicios", label: "Mis servicios", icon: PackageOpen },
  { to: "/proveedor/reportes", label: "Reportes", icon: BarChart3 },
  { to: "/proveedor/perfil", label: "Perfil del proveedor", icon: Store },
];

function SidebarNav({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  const s = usePetCare();
  const navigate = useNavigate();
  const pending = s.requests.filter((r) => r.providerId === user.providerId && r.status === "pendiente").length;
  const provider = s.providers.find((p) => p.id === user.providerId);

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-4 pt-5">
        <Logo to="/proveedor" />
        <p className="mt-3 rounded-lg bg-lavender px-3 py-2 text-xs font-medium text-accent-foreground">
          Área del proveedor
        </p>
      </div>
      <nav aria-label="Menú del proveedor" className="flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: !!item.exact }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "bg-lavender text-primary hover:bg-lavender hover:text-primary", "aria-current": "page" }}
          >
            <item.icon className="size-[18px]" aria-hidden />
            <span className="flex-1">{item.label}</span>
            {item.to === "/proveedor/solicitudes" && pending > 0 && (
              <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-semibold text-warning-strong">
                {pending} <span className="sr-only">pendientes</span>
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-sidebar-border p-3">
        {provider && (
          <Link
            to="/proveedores/$providerId"
            params={{ providerId: provider.id }}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="size-[18px]" aria-hidden /> Ver mi ficha pública
          </Link>
        )}
        <button
          type="button"
          onClick={() => {
            logout();
            toast.success("Sesión cerrada");
            navigate({ to: "/" });
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive-soft hover:text-destructive-strong"
        >
          <LogOut className="size-[18px]" aria-hidden /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export function ProviderShell({ user, children }: { user: User; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const current = NAV.find((n) => (n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to)));

  return (
    <div className="min-h-screen">
      <DemoStrip />
      <div className="flex">
        <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
          <SidebarNav user={user} />
        </aside>
        <div className="min-w-0 flex-1">
          <header className="no-print sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menú del proveedor">
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 p-0">
                    <SheetTitle className="sr-only">Menú del proveedor</SheetTitle>
                    <SidebarNav user={user} onNavigate={() => setOpen(false)} />
                  </SheetContent>
                </Sheet>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden sm:inline-flex">
                      <BreadcrumbLink asChild>
                        <Link to="/proveedor">Proveedor</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden sm:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-medium">{current?.label ?? "Panel principal"}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <UserMenu user={user} />
            </div>
          </header>
          <main className={cn("px-4 py-6 sm:px-6 lg:px-8 lg:py-8")}>
            <div className="mx-auto max-w-6xl animate-fade-up">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
