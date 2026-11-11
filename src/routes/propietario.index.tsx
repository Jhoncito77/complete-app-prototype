import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, PawPrint, Plus } from "lucide-react";
import { SearchBar } from "@/components/petcare/SearchBar";
import { CategoryCard, ProviderCard } from "@/components/petcare/cards";
import { EmptyState, SectionTitle } from "@/components/petcare/common";
import { StatusBadge } from "@/components/petcare/StatusBadge";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/petcare/categories";
import { formatShortDate, formatTime } from "@/lib/petcare/format";
import { countByStatus, usePetCare, useSession } from "@/lib/petcare/store";

export const Route = createFileRoute("/propietario/")({
  head: () => ({
    meta: [
      { title: "Mi panel — PetCare" },
      { name: "description", content: "Tu resumen de solicitudes, mascotas y servicios destacados en PetCare." },
      { property: "og:title", content: "Mi panel — PetCare" },
      { property: "og:description", content: "Resumen de solicitudes y mascotas del propietario." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OwnerDashboard,
});

function OwnerDashboard() {
  const s = usePetCare();
  const user = useSession();
  if (!user) return null;
  const mine = s.requests.filter((r) => r.ownerId === user.id);
  const counts = countByStatus(mine);
  const recent = [...mine].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);
  const featured = s.providers
    .filter((p) => (user.city ? p.city === user.city : true) && s.services.some((x) => x.providerId === p.id && x.published))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="paw-pattern relative overflow-hidden rounded-3xl border border-primary/10 bg-lavender p-6 md:p-10">
        <p className="text-sm font-medium text-accent-foreground">Panel del propietario</p>
        <h1 className="mt-1 text-display">Hola, {user.name.split(" ")[0]}</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">¿Qué necesita tu mascota hoy?</p>
        <SearchBar className="mt-6 max-w-3xl" size="md" />
      </section>

      <section aria-labelledby="cats">
        <SectionTitle><span id="cats">Categorías</span></SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => <CategoryCard key={c.id} category={c} compact />)}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="surface-card p-6 lg:col-span-8" aria-labelledby="recent">
          <SectionTitle
            action={<Button asChild variant="ghost" size="sm"><Link to="/propietario/solicitudes">Ver todas <ArrowRight /></Link></Button>}
          >
            <span id="recent">Solicitudes recientes</span>
          </SectionTitle>
          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">Total: <b className="text-foreground">{counts.total}</b></span>
            <span className="rounded-full bg-warning-soft px-3 py-1 text-warning-strong">Pendientes: <b>{counts.pendiente}</b></span>
            <span className="rounded-full bg-success-soft px-3 py-1 text-success-strong">Aceptadas: <b>{counts.aceptada}</b></span>
            <span className="rounded-full bg-destructive-soft px-3 py-1 text-destructive-strong">Rechazadas: <b>{counts.rechazada}</b></span>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon={ClipboardList} title="Aún no tienes solicitudes" description="Explora servicios y envía tu primera solicitud." action={<Button asChild><Link to="/explorar">Explorar servicios</Link></Button>} />
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((r) => {
                const svc = s.services.find((x) => x.id === r.serviceId);
                const prov = s.providers.find((p) => p.id === r.providerId);
                return (
                  <li key={r.id} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{svc?.name ?? "Servicio"} <span className="font-normal text-muted-foreground">· {r.petName}</span></p>
                      <p className="text-sm text-muted-foreground">{prov?.name} · {formatShortDate(r.date)}, {formatTime(r.time)}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="surface-card p-6 lg:col-span-4" aria-labelledby="pets">
          <SectionTitle action={<Button asChild variant="ghost" size="sm"><Link to="/propietario/perfil">Gestionar</Link></Button>}>
            <span id="pets">Mis mascotas</span>
          </SectionTitle>
          {user.pets.length === 0 ? (
            <p className="text-sm text-muted-foreground">Agrega a tu mascota para agilizar tus solicitudes.</p>
          ) : (
            <ul className="space-y-3">
              {user.pets.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-orange-soft text-orange-strong"><PawPrint className="size-5" aria-hidden /></span>
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.species} · {p.breed} · {p.age}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="secondary" className="mt-4 w-full"><Link to="/propietario/perfil"><Plus /> Agregar mascota</Link></Button>
        </section>
      </div>

      <section aria-labelledby="feat">
        <SectionTitle action={<Button asChild variant="ghost" size="sm"><Link to="/explorar">Ver más <ArrowRight /></Link></Button>}>
          <span id="feat">Proveedores {user.city ? `en ${user.city}` : "destacados"}</span>
        </SectionTitle>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProviderCard key={p.id} provider={p} services={s.services.filter((x) => x.providerId === p.id)} />)}
        </div>
      </section>
    </div>
  );
}
