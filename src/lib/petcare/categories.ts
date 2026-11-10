import { Stethoscope, Scissors, PawPrint, Home, type LucideIcon } from "lucide-react";
import type { CategoryId, RequestStatus } from "./types";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** Clases semánticas del design system para el icono */
  tone: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "veterinaria",
    label: "Veterinaria",
    short: "Veterinaria",
    description: "Consultas, vacunas y controles preventivos.",
    icon: Stethoscope,
    tone: "bg-lavender text-primary",
  },
  {
    id: "peluqueria",
    label: "Peluquería",
    short: "Peluquería",
    description: "Baño, corte y cuidado del pelaje.",
    icon: Scissors,
    tone: "bg-info-soft text-info-strong",
  },
  {
    id: "paseo",
    label: "Paseo",
    short: "Paseo",
    description: "Paseos individuales o en grupo.",
    icon: PawPrint,
    tone: "bg-orange-soft text-orange-strong",
  },
  {
    id: "cuidado",
    label: "Cuidado temporal",
    short: "Cuidado",
    description: "Cuidado en casa o guardería por días.",
    icon: Home,
    tone: "bg-success-soft text-success-strong",
  },
];

export function getCategory(id: CategoryId): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export const STATUS_META: Record<
  RequestStatus,
  { label: string; variant: "pending" | "success" | "danger" | "info"; help: string }
> = {
  pendiente: {
    label: "Pendiente",
    variant: "pending",
    help: "Enviada. Esperando respuesta del proveedor.",
  },
  aceptada: {
    label: "Aceptada",
    variant: "success",
    help: "El proveedor aceptó. La reserva está confirmada.",
  },
  rechazada: {
    label: "Rechazada",
    variant: "danger",
    help: "El proveedor no puede atender esta solicitud.",
  },
  finalizada: {
    label: "Finalizada",
    variant: "info",
    help: "El servicio ya se prestó.",
  },
};

export const CITIES = ["Bogotá", "Medellín", "Cali"];

export function formatPrice(price: number | null): string {
  if (price == null) return "Precio a consultar";
  return `Desde ${new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price)}`;
}
