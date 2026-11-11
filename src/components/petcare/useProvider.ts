import { usePetCare, useSession } from "@/lib/petcare/store";

/** Data for the signed-in provider. Only used inside the provider layout. */
export function useProviderData() {
  const s = usePetCare();
  const user = useSession();
  const provider = s.providers.find((p) => p.id === user?.providerId);
  const services = s.services.filter((x) => x.providerId === provider?.id);
  const requests = s.requests
    .filter((r) => r.providerId === provider?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { state: s, user, provider, services, requests };
}
