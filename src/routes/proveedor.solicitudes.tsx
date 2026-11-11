import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { useState } from "react";
import { EmptyState, PageHeader } from "@/components/petcare/common";
import { ProviderRequests } from "@/components/petcare/ProviderRequests";
import { useProviderData } from "@/components/petcare/useProvider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { countByStatus } from "@/lib/petcare/store";
import type { RequestStatus } from "@/lib/petcare/types";

export const Route = createFileRoute("/proveedor/solicitudes")({
  head: () => ({
    meta: [
      { title: "Solicitudes recibidas — PetCare" },
      { name: "description", content: "Revisa, acepta o rechaza las solicitudes de los propietarios." },
      { property: "og:title", content: "Solicitudes recibidas — PetCare" },
      { property: "og:description", content: "Gestión de solicitudes del proveedor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProviderRequestsPage,
});

type Filter = "todas" | RequestStatus;

function ProviderRequestsPage() {
  const { requests } = useProviderData();
  const [filter, setFilter] = useState<Filter>("pendiente");
  const counts = countByStatus(requests);
  const list = filter === "todas" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Solicitudes recibidas" description="La fecha y hora son preferencias del propietario. Al aceptar, la solicitud se convierte en reserva confirmada." />
      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-xl bg-muted p-1">
          <TabsTrigger value="pendiente" className="rounded-lg">Pendientes ({counts.pendiente})</TabsTrigger>
          <TabsTrigger value="aceptada" className="rounded-lg">Aceptadas ({counts.aceptada})</TabsTrigger>
          <TabsTrigger value="rechazada" className="rounded-lg">Rechazadas ({counts.rechazada})</TabsTrigger>
          <TabsTrigger value="finalizada" className="rounded-lg">Finalizadas ({counts.finalizada})</TabsTrigger>
          <TabsTrigger value="todas" className="rounded-lg">Todas ({counts.total})</TabsTrigger>
        </TabsList>
      </Tabs>
      {list.length === 0 ? (
        <EmptyState icon={Inbox} title="No hay solicitudes en este estado" description="Cuando un propietario te envíe una solicitud, aparecerá aquí." />
      ) : (
        <ProviderRequests requests={list} />
      )}
    </div>
  );
}
