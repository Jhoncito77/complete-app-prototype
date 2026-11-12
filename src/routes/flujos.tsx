import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Frown, Meh, Printer, Smile } from "lucide-react";
import { Fragment } from "react";
import { PublicLayout } from "@/components/petcare/PublicLayout";
import { PageHeader } from "@/components/petcare/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/flujos")({
  head: () => ({
    meta: [
      { title: "User Flow y Customer Journey — PetCare" },
      { name: "description", content: "Flujos del propietario y del proveedor, mapa de experiencia y wireframes de PetCare." },
      { property: "og:title", content: "User Flow y Customer Journey — PetCare" },
      { property: "og:description", content: "Recorridos principales y mapa de experiencia de PetCare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Flows,
});

type Step = { label: string; to?: string; note?: string };

const OWNER_FLOW: Step[] = [
  { label: "Inicio", to: "/" },
  { label: "Iniciar sesión / Registrarse", to: "/login" },
  { label: "Explorar servicios", to: "/explorar" },
  { label: "Seleccionar categoría", to: "/explorar?categoria=veterinaria" },
  { label: "Ver resultados", to: "/explorar?categoria=veterinaria" },
  { label: "Detalle del proveedor", to: "/proveedores/p1" },
  { label: "Solicitar servicio", to: "/solicitar/s1" },
  { label: "Confirmación de envío", note: "Tras enviar" },
  { label: "Mis solicitudes", to: "/propietario/solicitudes" },
  { label: "Consultar estado", to: "/propietario/solicitudes" },
];

const PROVIDER_FLOW: Step[] = [
  { label: "Login", to: "/login" },
  { label: "Panel del proveedor", to: "/proveedor" },
  { label: "Solicitudes recibidas", to: "/proveedor/solicitudes" },
  { label: "Revisar detalle", note: "Botón Revisar" },
  { label: "Aceptar o rechazar", note: "Con confirmación" },
  { label: "Estado actualizado", to: "/proveedor/solicitudes" },
];

const JOURNEY = [
  { stage: "Descubrimiento", action: "Conoce PetCare", need: "Entender qué ofrece", friction: "No comprender la propuesta", opportunity: "Mensaje principal claro", emotion: 1 },
  { stage: "Exploración", action: "Busca una categoría", need: "Encontrar opciones", friction: "Resultados desordenados", opportunity: "Categorías y filtros visibles", emotion: 1 },
  { stage: "Evaluación", action: "Compara proveedores", need: "Consultar información suficiente", friction: "Faltan precios o datos", opportunity: "Fichas completas", emotion: 0 },
  { stage: "Solicitud", action: "Envía una solicitud", need: "Hacerlo rápido", friction: "Formulario largo", opportunity: "Pedir solo datos necesarios", emotion: 0 },
  { stage: "Seguimiento", action: "Consulta el estado", need: "Saber qué ocurrió", friction: "No saber si fue recibida", opportunity: "Estados claros y visibles", emotion: -1 },
];

const EMOTION = {
  1: { icon: Smile, label: "Curiosidad / interés", cls: "bg-success-soft text-success-strong" },
  0: { icon: Meh, label: "Duda / evaluación", cls: "bg-warning-soft text-warning-strong" },
  [-1]: { icon: Frown, label: "Incertidumbre", cls: "bg-destructive-soft text-destructive-strong" },
} as const;

const WIREFRAMES = [
  { name: "Inicio", rows: ["h-3 w-1/2", "h-2 w-3/4", "h-8 w-full", "grid4"] },
  { name: "Login", rows: ["h-3 w-1/2", "h-7 w-full", "h-7 w-full", "h-8 w-full btn"] },
  { name: "Explorar", rows: ["h-7 w-full", "chips", "grid3"] },
  { name: "Detalle", rows: ["h-16 w-full", "h-3 w-1/2", "list", "h-8 w-1/2 btn"] },
  { name: "Solicitud", rows: ["h-7 w-full", "h-7 w-full", "h-12 w-full", "h-8 w-full btn"] },
  { name: "Panel proveedor", rows: ["grid4", "h-3 w-1/3", "list"] },
];

function Flows() {
  return (
    <PublicLayout>
      <div className="container-app py-8 md:py-10">
        <PageHeader
          eyebrow={<Badge variant="secondary">03 — Wireframes · 07 — User Flow · 08 — Customer Journey</Badge>}
          title="User Flow y Customer Journey"
          description="Cada paso enlaza con la pantalla real del prototipo. Los dos flujos comparten el mismo Design System."
          actions={<Button variant="secondary" className="no-print" onClick={() => window.print()}><Printer /> Imprimir / PDF</Button>}
        />

        <FlowBlock title="Flujo del propietario" steps={OWNER_FLOW} tone="primary" />
        <FlowBlock title="Flujo del proveedor" steps={PROVIDER_FLOW} tone="orange" />

        <section className="mt-12" aria-labelledby="cj">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 id="cj" className="text-h2">Customer Journey Map · propietario</h2>
            <Badge variant="pending">Emociones: hipótesis por validar</Badge>
          </div>
          <div className="surface-card overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-lavender text-xs uppercase tracking-wide text-accent-foreground">
                <tr>
                  <th className="p-4 font-semibold">Etapa</th>
                  {JOURNEY.map((j) => <th key={j.stage} className="p-4 font-semibold">{j.stage}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {([
                  ["Acción del usuario", "action"],
                  ["Necesidad", "need"],
                  ["Fricción posible", "friction"],
                  ["Oportunidad", "opportunity"],
                ] as const).map(([label, key]) => (
                  <tr key={key}>
                    <th scope="row" className="bg-muted/40 p-4 font-semibold">{label}</th>
                    {JOURNEY.map((j) => <td key={j.stage} className={cn("p-4", key === "opportunity" ? "font-medium text-primary" : "text-muted-foreground")}>{j[key]}</td>)}
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="bg-muted/40 p-4 font-semibold">Emoción (hipótesis)</th>
                  {JOURNEY.map((j) => {
                    const e = EMOTION[j.emotion as 1 | 0 | -1];
                    return (
                      <td key={j.stage} className="p-4">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", e.cls)}>
                          <e.icon className="size-4" aria-hidden /> {e.label}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Las emociones son supuestos de diseño, no resultados de investigación. Actualízalas con los hallazgos de las pruebas de usabilidad.</p>
        </section>

        <section className="mt-12" aria-labelledby="wf">
          <h2 id="wf" className="mb-4 text-h2">Wireframes de baja fidelidad</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WIREFRAMES.map((w) => (
              <figure key={w.name} className="surface-card p-4">
                <div className="space-y-2.5 rounded-xl border border-dashed border-input bg-background p-4" aria-hidden>
                  <div className="flex items-center justify-between"><div className="h-3 w-16 rounded bg-input" /><div className="h-3 w-10 rounded bg-input" /></div>
                  {w.rows.map((r, i) => <WireRow key={i} kind={r} />)}
                </div>
                <figcaption className="mt-3 text-sm font-semibold">{w.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

function WireRow({ kind }: { kind: string }) {
  if (kind === "grid4") return <div className="grid grid-cols-4 gap-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-10 rounded-lg bg-input" />)}</div>;
  if (kind === "grid3") return <div className="grid grid-cols-3 gap-2">{[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-lg bg-input" />)}</div>;
  if (kind === "chips") return <div className="flex gap-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-4 w-12 rounded-full bg-input" />)}</div>;
  if (kind === "list") return <div className="space-y-1.5">{[0, 1, 2].map((i) => <div key={i} className="h-4 w-full rounded bg-input" />)}</div>;
  const isBtn = kind.endsWith("btn");
  return <div className={cn("rounded", kind.replace(" btn", ""), isBtn ? "bg-secondary" : "bg-input")} />;
}

function FlowBlock({ title, steps, tone }: { title: string; steps: Step[]; tone: "primary" | "orange" }) {
  return (
    <section className="mt-10" aria-label={title}>
      <h2 className="mb-4 text-h2">{title}</h2>
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((st, i) => (
          <Fragment key={st.label}>
            <li>
              {st.to ? (
                <a
                  href={st.to}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border bg-card px-3.5 py-2.5 text-sm font-medium shadow-soft transition-colors hover:shadow-card",
                    tone === "primary" ? "border-primary/30 hover:border-primary hover:text-primary" : "border-orange/40 hover:border-orange hover:text-orange-strong",
                  )}
                >
                  <span className={cn("flex size-6 items-center justify-center rounded-full text-xs font-semibold", tone === "primary" ? "bg-primary text-primary-foreground" : "bg-orange text-foreground")}>{i + 1}</span>
                  {st.label}
                </a>
              ) : (
                <span className="flex items-center gap-2 rounded-xl border border-dashed border-input bg-muted/50 px-3.5 py-2.5 text-sm font-medium">
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted-foreground text-xs font-semibold text-primary-foreground">{i + 1}</span>
                  {st.label}
                  {st.note && <span className="text-xs font-normal text-muted-foreground">({st.note})</span>}
                </span>
              )}
            </li>
            {i < steps.length - 1 && <ArrowRight className="size-4 text-muted-foreground" aria-hidden />}
          </Fragment>
        ))}
      </ol>
      {tone === "primary" && (
        <p className="mt-3 text-sm text-muted-foreground">
          Prueba el flujo completo con el <Link to="/login" className="font-medium text-primary hover:underline">acceso rápido de demostración</Link>.
        </p>
      )}
    </section>
  );
}
