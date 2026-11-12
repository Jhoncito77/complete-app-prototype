import { describe, expect, it } from "vitest";
import { canTransition, countByStatus } from "@/lib/petcare/store";
import { formatPrice } from "@/lib/petcare/categories";
import { SEED } from "@/lib/petcare/seed";

describe("PetCare request rules", () => {
  it("a pending request can only be accepted or rejected by the provider", () => {
    expect(canTransition("pendiente", "aceptada")).toBe(true);
    expect(canTransition("pendiente", "rechazada")).toBe(true);
    expect(canTransition("pendiente", "finalizada")).toBe(false);
  });

  it("only an accepted request can be marked as finished", () => {
    expect(canTransition("aceptada", "finalizada")).toBe(true);
    expect(canTransition("rechazada", "aceptada")).toBe(false);
    expect(canTransition("finalizada", "pendiente")).toBe(false);
  });

  it("counts requests per status for the provider summary", () => {
    const p1 = SEED.requests.filter((r) => r.providerId === "p1");
    expect(countByStatus(p1)).toEqual({ total: 6, pendiente: 3, aceptada: 1, rechazada: 1, finalizada: 1 });
  });

  it("shows 'Precio a consultar' when no orientative price is defined", () => {
    expect(formatPrice(null)).toBe("Precio a consultar");
  });
});
