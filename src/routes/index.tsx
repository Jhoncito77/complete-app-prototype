import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, CheckCircle2, ClipboardList, Search, Store } from "lucide-react";
import heroImg from "@/assets/hero-mascotas.jpg";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/petcare/PublicLayout";
import { SearchBar } from "@/components/petcare/SearchBar";
import { CategoryCard, ProviderCard } from "@/components/petcare/cards";
import { SectionTitle } from "@/components/petcare/common";
import { CATEGORIES } from "@/lib/petcare/categories";
import { usePetCare } from "@/lib/petcare/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PetCare — Cuida a tu mascota en un solo lugar" },
      {
        name: "description",
        content:
          "Busca veterinarias, peluquerías, paseadores y cuidadores. Compara información clara y envía solicitudes desde PetCare.",
      },
      { property: "og:title", content: "PetCare — Cuida a tu mascota en un solo lugar" },
      {
        property: "og:description",
        content: "Servicios para mascotas con información clara y solicitudes en una sola plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  { icon: Search, title: "Busca y compara", text: "Filtra por categoría y ubicación. Revisa descripción, servicios y precios orientativos." },
  { icon: CalendarCheck, title: "Envía tu solicitud", text: "Elige el servicio, tu fecha y hora preferidas. Solo pedimos los datos necesarios." },
  { icon: ClipboardList, title: "Sigue el estado", text: "El proveedor acepta o rechaza. Verás el estado actualizado en Mis solicitudes." },
];

function Index() {
  const s = usePetCare();
  const featured = ["p1", "p3", "p5"].map((id) => s.providers.find((p) => p.id === id)).filter(Boolean);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="paw-pattern absolute inset-0 opacity-70" aria-hidden />
        <div className="container-app relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
          <div className="animate-fade-up lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-lavender px-3 py-1 text-xs font-medium text-accent-foreground">
              <CheckCircle2 className="size-3.5" aria-hidden /> Veterinaria · Peluquería · Paseo · Cuidado temporal
            </span>
            <h1 className="mt-5 text-display">
              Cuida a tu mascota <span className="text-primary">en un solo lugar</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              Encuentra servicios para tu mascota con información clara y gestiona tus solicitudes desde una sola plataforma.
            </p>
            <SearchBar className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/explorar">
                  Explorar servicios <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/registro">Crear cuenta gratis</Link>
              </Button>
            </div>
          </div>
          <div className="relative lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
              <img
                src={heroImg}
                alt="Un perro golden retriever y un gato atigrado descansando juntos en un sofá"
                width={1536}
                height={1024}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="surface-card absolute -bottom-5 left-4 hidden items-center gap-3 p-3 pr-5 sm:flex">
              <span className="flex size-10 items-center justify-center rounded-xl bg-success-soft text-success-strong">
                <CheckCircle2 className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold">Solicitud aceptada</p>
                <p className="text-xs text-muted-foreground">Baño y corte · Pelos &amp; Patas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container-app py-12" aria-labelledby="cat-title">
        <SectionTitle
          action={
            <Link to="/explorar" className="text-sm font-semibold text-primary hover:underline">
              Ver todos
            </Link>
          }
        >
          <span id="cat-title">Categorías de servicio</span>
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="container-app py-12" aria-labelledby="how-title">
        <div className="rounded-3xl bg-lavender p-6 md:p-10">
          <h2 id="how-title" className="text-h2">Cómo funciona</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="surface-card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <step.icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Paso {i + 1}</span>
                </div>
                <h3 className="mt-4 text-h3">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-accent-foreground">
            Enviar una solicitud no confirma la reserva: la fecha y hora son preferencias sujetas a la respuesta del proveedor.
          </p>
        </div>
      </section>

      {/* Destacados */}
      <section className="container-app py-12" aria-labelledby="feat-title">
        <SectionTitle
          action={
            <Link to="/explorar" className="text-sm font-semibold text-primary hover:underline">
              Explorar todos
            </Link>
          }
        >
          <span id="feat-title">Proveedores de ejemplo</span>
        </SectionTitle>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProviderCard key={p!.id} provider={p!} services={s.services.filter((x) => x.providerId === p!.id)} />
          ))}
        </div>
      </section>

      {/* CTA proveedores */}
      <section className="container-app py-12">
        <div className="surface-card flex flex-col items-start gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange-soft text-orange-strong">
              <Store className="size-6" aria-hidden />
            </span>
            <div>
              <h2 className="text-h2">¿Ofreces servicios para mascotas?</h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground md:text-base">
                Publica tus servicios, recibe solicitudes y respóndelas desde tu panel de proveedor.
              </p>
            </div>
          </div>
          <Button asChild size="lg">
            <Link to="/registro" search={{ tipo: "proveedor" }}>
              Registrarme como proveedor
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
