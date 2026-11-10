import veterinaria from "@/assets/prov-veterinaria.jpg";
import veterinariaFelina from "@/assets/prov-veterinaria-felina.jpg";
import peluqueria from "@/assets/prov-peluqueria.jpg";
import spa from "@/assets/prov-spa.jpg";
import paseo from "@/assets/prov-paseo.jpg";
import cuidado from "@/assets/prov-cuidado.jpg";
import type { CategoryId } from "./types";

export const PROVIDER_IMAGES: Record<string, string> = {
  veterinaria,
  "veterinaria-felina": veterinariaFelina,
  peluqueria,
  spa,
  paseo,
  cuidado,
};

const FALLBACK: Record<CategoryId, string> = {
  veterinaria,
  peluqueria,
  paseo,
  cuidado,
};

export function providerImage(key: string, category: CategoryId): string {
  return PROVIDER_IMAGES[key] ?? FALLBACK[category];
}
