import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ClipboardList, Clock, Inbox, PackageOpen, XCircle } from "lucide-react";
import { EmptyState, PageHeader, SectionTitle, StatCard } from "@/components/petcare/common";
import { ProviderRequests } from "@/components/petcare/ProviderRequests";
import { useProviderData } from "@/components/petcare/useProvider";
import { Button } from "@/components/ui/button";
import { countByStatus } from "@/lib/petcare/store";

export const Route = createFileRoute("/proveedor/")({
  head: () => ({
    meta: [
      { title: "Panel del proveedor — PetCare" },
      { name: "description", content: "Resumen de solicitudes recibidas y accesos a tus servicios en PetCare." },
      { property: "og:title", content: "Panel del proveedor — PetCare" },
      { property: "og:description", content: "Resumen de solicitudes recibidas por estado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProviderDashboard,
});

function ProviderDashboard() {
  const { user, provider, services, requests } = useProviderData();
  if (!user || !provider) return null;
  const counts = countByStatus(requests);
  const pending = requests.filter((r) => r.status === "pendiente").slice(0, 5);
  const published = services.filter((s) => s.published).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={<span className="text-sm font-medium text-primary">{provider.name}</span>}
        title={`Hola, ${user.name.split(" ").slice(0, 2).join(" ")}`}
        description="Este es el resumen de las solicitudes que has recibido."
        actions={<Button asChild><Link to="/proveedor/solicitudes">Ver solicitudes <ArrowRight /></Link></Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total de solicitudes" value={counts.total} icon={ClipboardList} tone="bg-lavender text-primary" />
        <StatCard label="Pendientes" value={counts.pendiente} icon={Clock} tone="bg-warning-soft text-warning-strong" hint="Requieren tu respuesta" />
        <StatCard label="Aceptadas" value={counts.aceptada} icon={CheckCircle2} tone="bg-success-soft text-success-strong" />
        <StatCard label="Rechazadas" value={counts.rechazada} icon={XCircle} tone="bg-destructive-soft text-destructive-strong" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/proveedor/solicitudes" className="surface-card group flex items-center gap-4 p-5 transition-all hover:border-primary/40 hover:shadow-lift">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Inbox className="size-6" aria-hidden /></span>
          <div className="flex-1">
            <p className="font-semibold">Solicitudes recibidas</p>
            <p className="text-sm text-muted-foreground">{counts.pendiente} pendientes de respuesta</p>
          </div>
          <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary" aria-hidden />
        </Link>
        <Link to="/proveedor/servicios" className="surface-card group flex items-center gap-4 p-5 transition-all hover:border-primary/40 hover:shadow-lift">
          <span className="flex size-12 items-center justify-center rounded-xl bg-orange-soft text-orange-strong"><PackageOpen className="size-6" aria-hidden /></span>
          <div className="flex-1">
            <p className="font-semibold">Mis servicios</p>
            <p className="text-sm text-muted-foreground">{published} publicados de {services.length}</p>
          </div>
          <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary" aria-hidden />
        </Link>
      </div>

      <section aria-labelledby="pend">
        <SectionTitle action={<Button asChild variant="ghost" size="sm"><Link to="/proveedor/solicitudes">Ver todas</Link></Button>}>
          <span id="pend">Pendientes por responder</span>
        </SectionTitle>
        {pending.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="Estás al día" description="No tienes solicitudes pendientes por responder." />
        ) : (
          <ProviderRequests requests={pending} />
        )}
      </section>

      {services.length === 0 && (
        <EmptyState
          icon={PackageOpen}
          title="Publica tu primer servicio"
          description="Los propietarios solo pueden encontrarte cuando tienes al menos un servicio publicado."
          action={<Button asChild><Link to="/proveedor/servicios">Crear servicio</Link></Button>}
        />
      )}
    </div>
  );
}
