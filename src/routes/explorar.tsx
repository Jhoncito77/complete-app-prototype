import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Search, SearchX, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PublicLayout } from "@/components/petcare/PublicLayout";
import { ProviderCard } from "@/components/petcare/cards";
import { EmptyState, PageHeader } from "@/components/petcare/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CATEGORIES, CITIES, getCategory } from "@/lib/petcare/categories";
import { usePetCare } from "@/lib/petcare/store";
import type { CategoryId } from "@/lib/petcare/types";
import { cn } from "@/lib/utils";

interface ExploreSearch {
  q?: string | undefined;
  categoria?: CategoryId | undefined;
  ubicacion?: string | undefined;
  pagina?: number | undefined;
}

const PAGE_SIZE = 6;
const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as string[];

export const Route = createFileRoute("/explorar")({
  validateSearch: (s: Record<string, unknown>): ExploreSearch => ({
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    categoria: typeof s["categoria"] === "string" && CATEGORY_IDS.includes(s["categoria"]) ? (s["categoria"] as CategoryId) : undefined,
    ubicacion: typeof s["ubicacion"] === "string" && s["ubicacion"] ? s["ubicacion"] : undefined,
    pagina: typeof s["pagina"] === "number" && s["pagina"] > 1 ? Math.floor(s["pagina"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explorar servicios para mascotas — PetCare" },
      { name: "description", content: "Filtra veterinarias, peluquerías, paseadores y cuidadores por categoría y ubicación." },
      { property: "og:title", content: "Explorar servicios para mascotas — PetCare" },
      { property: "og:description", content: "Filtra proveedores de servicios para mascotas por categoría y ubicación." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explorar,
});

function normalize(t: string) {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function Explorar() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/explorar" });
  const s = usePetCare();
  const [text, setText] = useState(search.q ?? "");

  useEffect(() => setText(search.q ?? ""), [search.q]);

  const update = (patch: Partial<ExploreSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch, pagina: undefined }), replace: true });

  const results = useMemo(() => {
    const q = normalize(search.q ?? "");
    return s.providers.filter((p) => {
      const services = s.services.filter((x) => x.providerId === p.id && x.published);
      if (services.length === 0) return false;
      if (search.categoria && p.category !== search.categoria) return false;
      if (search.ubicacion && p.city !== search.ubicacion) return false;
      if (q) {
        const hay = normalize([p.name, p.tagline, p.description, p.neighborhood, getCategory(p.category).label, ...services.map((x) => x.name)].join(" "));
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [s, search.q, search.categoria, search.ubicacion]);

  const page = search.pagina ?? 1;
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = !!(search.q || search.categoria || search.ubicacion);

  return (
    <PublicLayout>
      <div className="container-app py-8 md:py-10">
        <PageHeader
          title="Explorar servicios"
          description="Compara proveedores por categoría y ubicación. Toda la información mostrada es de ejemplo."
        />

        {/* Filtros */}
        <div className="surface-card mt-6 p-4 md:p-5">
          <form
            className="grid gap-3 md:grid-cols-12"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              update({ q: text.trim() || undefined });
            }}
          >
            <div className="relative md:col-span-6">
              <label htmlFor="buscar" className="sr-only">Buscar servicio o proveedor</label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="buscar"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Buscar por servicio o proveedor"
                className="pl-10"
              />
            </div>
            <div className="md:col-span-4">
              <label htmlFor="ubicacion" className="sr-only">Ubicación</label>
              <Select value={search.ubicacion ?? "todas"} onValueChange={(v) => update({ ubicacion: v === "todas" ? undefined : v })}>
                <SelectTrigger id="ubicacion">
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" aria-hidden />
                    <SelectValue placeholder="Ubicación" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las ciudades</SelectItem>
                  {CITIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="md:col-span-2">Buscar</Button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por categoría">
            <FilterChip active={!search.categoria} onClick={() => update({ categoria: undefined })}>
              Todas
            </FilterChip>
            {CATEGORIES.map((c) => (
              <FilterChip key={c.id} active={search.categoria === c.id} onClick={() => update({ categoria: search.categoria === c.id ? undefined : c.id })}>
                <c.icon className="size-4" aria-hidden />
                {c.label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            <span className="font-semibold text-foreground">{results.length}</span> {results.length === 1 ? "resultado" : "resultados"}
            {search.categoria && <> en <span className="font-medium text-foreground">{getCategory(search.categoria).label}</span></>}
            {search.ubicacion && <> · {search.ubicacion}</>}
          </p>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => navigate({ search: {}, replace: true })}>
              <X /> Limpiar filtros
            </Button>
          )}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            className="mt-4"
            icon={SearchX}
            title="No encontramos servicios con estos filtros"
            description="Prueba con otra categoría, otra ciudad o una búsqueda más general."
            action={
              <Button variant="secondary" onClick={() => navigate({ search: {}, replace: true })}>
                Ver todos los servicios
              </Button>
            }
          />
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProviderCard key={p.id} provider={p} services={s.services.filter((x) => x.providerId === p.id)} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={page === 1}
                  className={cn(page === 1 && "pointer-events-none opacity-40")}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ search: (prev) => ({ ...prev, pagina: page - 1 > 1 ? page - 1 : undefined }) });
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-3 text-sm text-muted-foreground">Página {page} de {pages}</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={page === pages}
                  className={cn(page === pages && "pointer-events-none opacity-40")}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ search: (prev) => ({ ...prev, pagina: page + 1 }) });
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          ¿No encuentras lo que buscas? <Link to="/registro" className="font-medium text-primary hover:underline">Crea una cuenta</Link> para guardar tus solicitudes.
        </p>
      </div>
    </PublicLayout>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary bg-lavender text-primary"
          : "border-border bg-card text-muted-foreground hover:border-secondary hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
