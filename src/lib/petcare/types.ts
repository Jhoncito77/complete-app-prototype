export type CategoryId = "veterinaria" | "peluqueria" | "paseo" | "cuidado";

export type Role = "propietario" | "proveedor";

export type RequestStatus = "pendiente" | "aceptada" | "rechazada" | "finalizada";

export interface Service {
  id: string;
  providerId: string;
  name: string;
  category: CategoryId;
  description: string;
  /** Precio orientativo en COP. null = no definido */
  price: number | null;
  published: boolean;
}

export interface Provider {
  id: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  city: string;
  neighborhood: string;
  address: string;
  phone: string;
  email: string;
  schedule: string;
  image: string;
}

export interface Pet {
  id: string;
  name: string;
  species: "Perro" | "Gato" | "Otro";
  breed: string;
  age: string;
}

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  password: string;
  phone?: string | undefined;
  city?: string | undefined;
  providerId?: string | undefined;
  pets: Pet[];
}

export interface StatusEvent {
  status: RequestStatus;
  at: string; // ISO
  note?: string | undefined;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  providerId: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  petName: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  notes: string;
  status: RequestStatus;
  createdAt: string;
  history: StatusEvent[];
}

export interface UsabilityEntry {
  taskId: string;
  participant: string;
  result: string;
  difficulty: string;
  feedback: string;
  improvement: string;
  change: string;
}

export interface PetCareState {
  version: number;
  users: User[];
  providers: Provider[];
  services: Service[];
  requests: ServiceRequest[];
  sessionUserId: string | null;
  usability: UsabilityEntry[];
}
