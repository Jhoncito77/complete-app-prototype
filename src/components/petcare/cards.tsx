import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategory, formatPrice, type CategoryMeta } from "@/lib/petcare/categories";
import { providerImage } from "@/lib/petcare/images";
import type { Provider, Service } from "@/lib/petcare/types";
import { cn } from "@/lib/utils";
import { DemoTag } from "./DemoNotice";

export function CategoryCard({ category, compact }: { category: CategoryMeta; compact?: boolean }) {
  const Icon = category.icon;
  return (
    <Link
      to="/explorar"
      search={{ categoria: category.id }}
      className={cn(
        "group surface-card flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        !compact && "sm:flex-col sm:items-start sm:p-5",
      )}
    >
      <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", category.tone)}>
        <Icon className="size-6" aria-hidden strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2 text-base font-semibold text-foreground">
          {category.label}
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
        </span>
        {!compact && <span className="mt-1 block text-sm text-muted-foreground">{category.description}</span>}
      </span>
    </Link>
  );
}

export function minPrice(services: Service[]): number | null {
  const prices = services.filter((s) => s.published && s.price != null).map((s) => s.price as number);
  return prices.length ? Math.min(...prices) : null;
}

export function ProviderCard({ provider, services }: { provider: Provider; services: Service[] }) {
  const cat = getCategory(provider.category);
  const published = services.filter((s) => s.published);
  return (
    <article className="surface-card group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={providerImage(provider.image, provider.category)}
          alt={`Imagen representativa de ${provider.name}`}
          loading="lazy"
          width={1024}
          height={768}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <DemoTag className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge variant="secondary" className="self-start">
          <cat.icon aria-hidden /> {cat.label}
        </Badge>
        <h3 className="mt-3 text-h3 leading-snug">{provider.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{provider.tagline || provider.description || "Sin descripción todavía."}</p>
        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <dt className="sr-only">Ubicación</dt>
            <dd>{provider.neighborhood}, {provider.city}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">{published.length} {published.length === 1 ? "servicio" : "servicios"}</dt>
            <dd className="font-semibold text-foreground">{formatPrice(minPrice(services))}</dd>
          </div>
        </dl>
        <Button asChild variant="secondary" className="mt-5 w-full">
          <Link to="/proveedores/$providerId" params={{ providerId: provider.id }}>
            Ver detalle
          </Link>
        </Button>
      </div>
    </article>
  );
}
