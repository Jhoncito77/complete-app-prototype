import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Info, Mail, MapPin, Phone, SearchX } from "lucide-react";
import { PublicLayout } from "@/components/petcare/PublicLayout";
import { EmptyState } from "@/components/petcare/common";
import { DemoTag } from "@/components/petcare/DemoNotice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatPrice, getCategory } from "@/lib/petcare/categories";
import { providerImage } from "@/lib/petcare/images";
import { usePetCare, useSession } from "@/lib/petcare/store";

export const Route = createFileRoute("/proveedores/$providerId")({
  head: () => ({
    meta: [
      { title: "Detalle del proveedor — PetCare" },
      { name: "description", content: "Servicios ofrecidos, precios orientativos, ubicación y contacto del proveedor." },
      { property: "og:title", content: "Detalle del proveedor — PetCare" },
      { property: "og:description", content: "Consulta servicios, precios orientativos y contacto del proveedor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProviderDetail,
});

function ProviderDetail() {
  const { providerId } = Route.useParams();
  const s = usePetCare();
  const user = useSession();
  const provider = s.providers.find((p) => p.id === providerId);

  if (!provider) {
    return (
      <PublicLayout>
        <div className="container-app py-16">
          <EmptyState
            icon={SearchX}
            title="No encontramos este proveedor"
            description="Es posible que ya no esté disponible."
            action={
              <Button asChild>
                <Link to="/explorar">Volver a explorar</Link>
              </Button>
            }
          />
        </div>
      </PublicLayout>
    );
  }

  const cat = getCategory(provider.category);
  const services = s.services.filter((x) => x.providerId === provider.id && x.published);
  const isOwnProvider = user?.providerId === provider.id;

  return (
    <PublicLayout>
      <div className="container-app py-6 md:py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/explorar">Explorar servicios</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/explorar" search={{ categoria: cat.id }}>{cat.label}</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{provider.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-muted">
              <img
                src={providerImage(provider.image, provider.category)}
                alt={`Imagen representativa de ${provider.name}`}
                width={1024}
                height={768}
                className="aspect-[16/8] w-full object-cover"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary"><cat.icon aria-hidden /> {cat.label}</Badge>
                <DemoTag />
              </div>
              <h1 className="mt-3 text-h1">{provider.name}</h1>
              {provider.tagline && <p className="mt-1 text-base text-muted-foreground">{provider.tagline}</p>}
            </div>

            <section className="surface-card p-6" aria-labelledby="desc">
              <h2 id="desc" className="text-h3">Descripción</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {provider.description || "Este proveedor aún no ha agregado una descripción."}
              </p>
            </section>

            <section className="surface-card overflow-hidden" aria-labelledby="servicios">
              <div className="border-b border-border px-6 py-4">
                <h2 id="servicios" className="text-h3">Servicios ofrecidos</h2>
                <p className="text-sm text-muted-foreground">Los precios son orientativos y pueden variar según la mascota.</p>
              </div>
              {services.length === 0 ? (
                <p className="px-6 py-8 text-sm text-muted-foreground">Este proveedor no tiene servicios publicados.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {services.map((svc) => (
                    <li key={svc.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">{svc.name}</p>
                        <p className="text-sm text-muted-foreground">{svc.description}</p>
                      </div>
                      <div className="flex items-center gap-4 sm:shrink-0">
                        <span className="text-sm font-semibold">{formatPrice(svc.price)}</span>
                        {!isOwnProvider && (
                          <Button asChild size="sm">
                            <Link to="/solicitar/$serviceId" params={{ serviceId: svc.id }}>Solicitar servicio</Link>
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="surface-card sticky top-28 space-y-5 p-6">
              <h2 className="text-h3">Ubicación y contacto</h2>
              <dl className="space-y-4 text-sm">
                <InfoRow icon={MapPin} label="Ubicación" value={`${provider.address || provider.neighborhood} · ${provider.city}`} />
                {provider.schedule && <InfoRow icon={Clock} label="Horario de atención" value={provider.schedule} />}
                {provider.phone && <InfoRow icon={Phone} label="Teléfono" value={provider.phone} />}
                {provider.email && <InfoRow icon={Mail} label="Correo" value={provider.email} />}
              </dl>
              {services[0] && !isOwnProvider && (
                <Button asChild size="lg" className="w-full">
                  <Link to="/solicitar/$serviceId" params={{ serviceId: services[0].id }}>Solicitar servicio</Link>
                </Button>
              )}
              {isOwnProvider && (
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/proveedor/perfil">Editar mi perfil</Link>
                </Button>
              )}
              <p className="flex gap-2 rounded-xl bg-info-soft p-3 text-xs text-info-strong">
                <Info className="size-4 shrink-0" aria-hidden />
                Tu solicitud queda pendiente hasta que el proveedor la acepte. No se realizan pagos en línea.
              </p>
            </div>
          </aside>
        </div>

        <Button asChild variant="ghost" className="mt-8">
          <Link to="/explorar"><ArrowLeft /> Volver a resultados</Link>
        </Button>
      </div>
    </PublicLayout>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-lavender text-primary">
        <Icon className="size-4" aria-hidden />
      </span>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-foreground">{value}</dd>
      </div>
    </div>
  );
}
