import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), "EEE d 'de' MMMM yyyy", { locale: es });
  } catch {
    return isoDate;
  }
}

export function formatShortDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), "d MMM yyyy", { locale: es });
  } catch {
    return isoDate;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), "d MMM yyyy, h:mm a", { locale: es });
  } catch {
    return iso;
  }
}

export function formatTime(hhmm: string): string {
  const [h = "0", m = "00"] = hhmm.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "p. m." : "a. m.";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${m} ${suffix}`;
}

export const TIME_SLOTS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
