import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProviderShell } from "@/components/petcare/ProviderShell";
import { PublicLayout } from "@/components/petcare/PublicLayout";
import { PageSkeleton, RequireRole } from "@/components/petcare/RequireRole";
import { useHydrated, useSession } from "@/lib/petcare/store";

export const Route = createFileRoute("/proveedor")({
  component: ProviderLayout,
});

function ProviderLayout() {
  const hydrated = useHydrated();
  const user = useSession();

  if (hydrated && user?.role === "proveedor") {
    return (
      <ProviderShell user={user}>
        <Outlet />
      </ProviderShell>
    );
  }

  return (
    <PublicLayout>
      <div className="container-app py-12">
        {hydrated ? <RequireRole role="proveedor">{() => null}</RequireRole> : <PageSkeleton />}
      </div>
    </PublicLayout>
  );
}
