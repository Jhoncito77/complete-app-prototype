import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, CheckCircle2, ClipboardList, Clock, XCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { EmptyState, PageHeader, StatCard } from "@/components/petcare/common";
import { useProviderData } from "@/components/petcare/useProvider";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { countByStatus } from "@/lib/petcare/store";

export const Route = createFileRoute("/proveedor/reportes")({
  head: () => ({
    meta: [
      { title: "Reportes — PetCare" },
      { name: "description", content: "Resumen simple de solicitudes por estado y por servicio." },
      { property: "og:title", content: "Reportes — PetCare" },
      { property: "og:description", content: "Resumen de solicitudes del proveedor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reports,
});

const chartConfig = { value: { label: "Solicitudes" } } satisfies ChartConfig;

function Reports() {
  const { services, requests } = useProviderData();
  const c = countByStatus(requests);
  const data = [
    { name: "Pendientes", value: c.pendiente, fill: "var(--color-warning)" },
    { name: "Aceptadas", value: c.aceptada, fill: "var(--color-success)" },
    { name: "Rechazadas", value: c.rechazada, fill: "var(--color-destructive)" },
    { name: "Finalizadas", value: c.finalizada, fill: "var(--color-info)" },
  ];
  const byService = services
    .map((s) => ({ name: s.name, total: requests.filter((r) => r.serviceId === s.id).length }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);
  const maxTotal = Math.max(1, ...byService.map((x) => x.total));

  return (
    <div className="space-y-6">
      <PageHeader title="Reportes" description="Resumen calculado a partir de las solicitudes registradas en el prototipo." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total de solicitudes" value={c.total} icon={ClipboardList} tone="bg-lavender text-primary" />
        <StatCard label="Pendientes" value={c.pendiente} icon={Clock} tone="bg-warning-soft text-warning-strong" />
        <StatCard label="Aceptadas" value={c.aceptada} icon={CheckCircle2} tone="bg-success-soft text-success-strong" />
        <StatCard label="Rechazadas" value={c.rechazada} icon={XCircle} tone="bg-destructive-soft text-destructive-strong" />
      </div>

      {c.total === 0 ? (
        <EmptyState icon={BarChart3} title="Aún no hay datos para mostrar" description="El resumen visual aparecerá cuando recibas solicitudes." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="surface-card p-6 lg:col-span-7" aria-labelledby="by-status">
            <h2 id="by-status" className="text-h3">Solicitudes por estado</h2>
            <ChartContainer config={chartConfig} className="mt-4 h-64 w-full">
              <BarChart data={data} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {data.map((d) => <Cell key={d.name} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ChartContainer>
          </section>
          <section className="surface-card p-6 lg:col-span-5" aria-labelledby="by-service">
            <h2 id="by-service" className="text-h3">Solicitudes por servicio</h2>
            <ul className="mt-4 space-y-4">
              {byService.map((x) => (
                <li key={x.name}>
                  <div className="flex justify-between text-sm"><span>{x.name}</span><span className="font-semibold">{x.total}</span></div>
                  <div className="mt-1.5 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${(x.total / maxTotal) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
