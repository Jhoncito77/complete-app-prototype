import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PublicLayout } from "@/components/petcare/PublicLayout";
import { RequireRole } from "@/components/petcare/RequireRole";

export const Route = createFileRoute("/propietario")({
  component: OwnerLayout,
});

function OwnerLayout() {
  return (
    <PublicLayout>
      <div className="container-app py-8 md:py-10">
        <RequireRole role="propietario">
          {() => (
            <div className="animate-fade-up">
              <Outlet />
            </div>
          )}
        </RequireRole>
      </div>
    </PublicLayout>
  );
}
