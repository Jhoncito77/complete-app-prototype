import { useSyncExternalStore } from "react";
import { SEED, SEED_VERSION } from "./seed";
import type {
  CategoryId,
  PetCareState,
  Pet,
  Provider,
  RequestStatus,
  Role,
  Service,
  ServiceRequest,
  UsabilityEntry,
  User,
} from "./types";

/**
 * Prototype store: data lives in the browser (localStorage) so the full
 * owner ↔ provider flow can be tested without a backend.
 */

const STORAGE_KEY = "petcare-prototipo";

let state: PetCareState = SEED;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PetCareState;
      if (parsed.version === SEED_VERSION) state = parsed;
    }
  } catch {
    state = SEED;
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento no disponible */
  }
}

function setState(updater: (s: PetCareState) => PetCareState) {
  load();
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return SEED;
}

export function usePetCare(): PetCareState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};
/** true once the browser has hydrated and local data is available */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useSession(): User | null {
  const s = usePetCare();
  return s.users.find((u) => u.id === s.sessionUserId) ?? null;
}

const uid = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// ---------- Auth ----------

export function login(email: string, password: string): { ok: true; user: User } | { ok: false; field: "email" | "password"; error: string } {
  load();
  const user = state.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return { ok: false, field: "email", error: "No encontramos una cuenta con este correo." };
  if (user.password !== password) return { ok: false, field: "password", error: "La contraseña no es correcta." };
  setState((s) => ({ ...s, sessionUserId: user.id }));
  return { ok: true, user };
}

export function loginAs(role: Role): User {
  load();
  const user = state.users.find((u) => u.role === role && (role === "propietario" ? u.id === "u1" : u.id === "u2")) ?? state.users.find((u) => u.role === role)!;
  setState((s) => ({ ...s, sessionUserId: user.id }));
  return user;
}

export function logout() {
  setState((s) => ({ ...s, sessionUserId: null }));
}

export interface RegisterInput {
  role: Role;
  name: string;
  email: string;
  password: string;
  business?: { name: string; category: CategoryId; city: string; neighborhood: string; phone: string };
}

export function emailExists(email: string) {
  load();
  return state.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function register(input: RegisterInput): User {
  const userId = uid("u");
  let providerId: string | undefined;
  let provider: Provider | undefined;
  if (input.role === "proveedor" && input.business) {
    providerId = uid("p");
    provider = {
      id: providerId,
      name: input.business.name,
      category: input.business.category,
      tagline: "",
      description: "",
      city: input.business.city,
      neighborhood: input.business.neighborhood,
      address: "",
      phone: input.business.phone,
      email: input.email,
      schedule: "",
      image: input.business.category,
    };
  }
  const user: User = {
    id: userId,
    role: input.role,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
    phone: input.business?.phone,
    city: input.business?.city,
    providerId,
    pets: [],
  };
  setState((s) => ({
    ...s,
    users: [...s.users, user],
    providers: provider ? [...s.providers, provider] : s.providers,
    sessionUserId: userId,
  }));
  return user;
}

export function updateUser(id: string, patch: Partial<Pick<User, "name" | "phone" | "city">>) {
  setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
}

export function addPet(userId: string, pet: Omit<Pet, "id">) {
  setState((s) => ({
    ...s,
    users: s.users.map((u) => (u.id === userId ? { ...u, pets: [...u.pets, { ...pet, id: uid("pet") }] } : u)),
  }));
}

export function removePet(userId: string, petId: string) {
  setState((s) => ({
    ...s,
    users: s.users.map((u) => (u.id === userId ? { ...u, pets: u.pets.filter((p) => p.id !== petId) } : u)),
  }));
}

// ---------- Requests ----------

export function createRequest(input: Omit<ServiceRequest, "id" | "status" | "createdAt" | "history">): ServiceRequest {
  const now = new Date().toISOString();
  const request: ServiceRequest = {
    ...input,
    id: uid("r"),
    status: "pendiente",
    createdAt: now,
    history: [{ status: "pendiente", at: now }],
  };
  setState((s) => ({ ...s, requests: [request, ...s.requests] }));
  return request;
}

/** Allowed transitions: pendiente → aceptada|rechazada, aceptada → finalizada */
export function canTransition(from: RequestStatus, to: RequestStatus): boolean {
  if (from === "pendiente") return to === "aceptada" || to === "rechazada";
  if (from === "aceptada") return to === "finalizada";
  return false;
}

export function updateRequestStatus(id: string, status: RequestStatus, note?: string) {
  setState((s) => ({
    ...s,
    requests: s.requests.map((r) =>
      r.id === id && canTransition(r.status, status)
        ? { ...r, status, history: [...r.history, { status, at: new Date().toISOString(), note: note?.trim() || undefined }] }
        : r,
    ),
  }));
}

// ---------- Services & provider ----------

export function upsertService(service: Omit<Service, "id"> & { id?: string }): Service {
  const saved: Service = { ...service, id: service.id ?? uid("s") };
  setState((s) => ({
    ...s,
    services: service.id ? s.services.map((x) => (x.id === service.id ? saved : x)) : [...s.services, saved],
  }));
  return saved;
}

export function setServicePublished(id: string, published: boolean) {
  setState((s) => ({ ...s, services: s.services.map((x) => (x.id === id ? { ...x, published } : x)) }));
}

export function deleteService(id: string) {
  setState((s) => ({ ...s, services: s.services.filter((x) => x.id !== id) }));
}

export function updateProvider(id: string, patch: Partial<Omit<Provider, "id">>) {
  setState((s) => ({ ...s, providers: s.providers.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
}

// ---------- Usability ----------

export function saveUsability(entry: UsabilityEntry) {
  setState((s) => ({
    ...s,
    usability: s.usability.some((u) => u.taskId === entry.taskId)
      ? s.usability.map((u) => (u.taskId === entry.taskId ? entry : u))
      : [...s.usability, entry],
  }));
}

export function resetDemo() {
  const keepUsability = state.usability;
  setState(() => ({ ...SEED, usability: keepUsability }));
}

// ---------- Selectors ----------

export function countByStatus(requests: ServiceRequest[]) {
  return {
    total: requests.length,
    pendiente: requests.filter((r) => r.status === "pendiente").length,
    aceptada: requests.filter((r) => r.status === "aceptada").length,
    rechazada: requests.filter((r) => r.status === "rechazada").length,
    finalizada: requests.filter((r) => r.status === "finalizada").length,
  };
}
