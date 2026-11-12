import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Printer, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/petcare/PublicLayout";
import { FormField, PageHeader } from "@/components/petcare/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveUsability, useHydrated, usePetCare } from "@/lib/petcare/store";
import type { UsabilityEntry } from "@/lib/petcare/types";

export const Route = createFileRoute("/usabilidad")({
  head: () => ({
    meta: [
      { title: "Pruebas de usabilidad — PetCare" },
      { name: "description", content: "Plantilla para documentar tareas, hallazgos y mejoras de las pruebas con usuarios reales." },
      { property: "og:title", content: "Pruebas de usabilidad — PetCare" },
      { property: "og:description", content: "Registro de pruebas de usabilidad de PetCare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Usability,
});

const TASKS = [
  { id: "t1", title: "Registrarse o iniciar sesión" },
  { id: "t2", title: "Encontrar un servicio por categoría" },
  { id: "t3", title: "Consultar el detalle de un proveedor" },
  { id: "t4", title: "Enviar una solicitud" },
  { id: "t5", title: "Consultar el estado de la solicitud" },
  { id: "t6", title: "Como proveedor, aceptar o rechazar una solicitud" },
];

const FIELDS: { key: keyof Omit<UsabilityEntry, "taskId">; label: string; placeholder: string; long?: boolean }[] = [
  { key: "participant", label: "Perfil del participante", placeholder: "Ej.: propietario de perro, usa apps a diario (sin datos personales)" },
  { key: "result", label: "Resultado observado", placeholder: "¿Completó la tarea? ¿Cómo lo hizo?", long: true },
  { key: "difficulty", label: "Dificultad encontrada", placeholder: "Dónde dudó o se equivocó", long: true },
  { key: "feedback", label: "Comentario o retroalimentación", placeholder: "Lo que dijo el participante", long: true },
  { key: "improvement", label: "Mejora propuesta", placeholder: "Qué cambiarías", long: true },
  { key: "change", label: "Cambio realizado en el prototipo", placeholder: "Qué se modificó y dónde", long: true },
];

const empty = (taskId: string): UsabilityEntry => ({ taskId, participant: "", result: "", difficulty: "", feedback: "", improvement: "", change: "" });

function Usability() {
  const s = usePetCare();
  const hydrated = useHydrated();
  return (
    <PublicLayout>
      <div className="container-app py-8 md:py-10">
        <PageHeader
          eyebrow={<Badge variant="secondary">09 — Usability Testing</Badge>}
          title="Pruebas de usabilidad"
          description="Registra aquí los resultados reales de tus sesiones. No incluye participantes, tiempos ni resultados inventados. Lo que escribas se guarda en este navegador."
          actions={<Button variant="secondary" className="no-print" onClick={() => window.print()}><Printer /> Imprimir / PDF</Button>}
        />
        <div className="mt-8 space-y-6">
          {TASKS.map((t, i) =>
            hydrated ? (
              <TaskCard key={t.id} index={i + 1} title={t.title} initial={s.usability.find((u) => u.taskId === t.id) ?? empty(t.id)} />
            ) : (
              <div key={t.id} className="surface-card h-40" aria-hidden />
            ),
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

function TaskCard({ index, title, initial }: { index: number; title: string; initial: UsabilityEntry }) {
  const [entry, setEntry] = useState(initial);
  useEffect(() => setEntry(initial), [initial]);
  const filled = FIELDS.filter((f) => entry[f.key].trim()).length;

  return (
    <section className="surface-card break-inside-avoid p-6" aria-labelledby={`task-${entry.taskId}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">{index}</span>
          <h2 id={`task-${entry.taskId}`} className="text-h3">Tarea: {title}</h2>
        </div>
        <Badge variant={filled === FIELDS.length ? "success" : filled > 0 ? "pending" : "outline"}>
          {filled === FIELDS.length && <CheckCircle2 aria-hidden />}
          {filled}/{FIELDS.length} campos
        </Badge>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {FIELDS.map((f) => {
          const id = `${entry.taskId}-${f.key}`;
          return (
            <FormField key={f.key} id={id} label={f.label} className={f.key === "participant" ? "md:col-span-2" : undefined}>
              {f.long ? (
                <Textarea id={id} value={entry[f.key]} placeholder={f.placeholder} className="min-h-[80px]" onChange={(e) => setEntry((p) => ({ ...p, [f.key]: e.target.value }))} />
              ) : (
                <Input id={id} value={entry[f.key]} placeholder={f.placeholder} onChange={(e) => setEntry((p) => ({ ...p, [f.key]: e.target.value }))} />
              )}
            </FormField>
          );
        })}
      </div>
      <div className="no-print mt-4 flex justify-end">
        <Button size="sm" onClick={() => { saveUsability(entry); toast.success(`Tarea ${index} guardada`); }}>
          <Save /> Guardar tarea
        </Button>
      </div>
    </section>
  );
}
