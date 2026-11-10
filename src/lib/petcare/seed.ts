import type { PetCareState, Provider, Service, ServiceRequest, User } from "./types";

/** Todos estos datos son ficticios y sirven solo para demostrar el prototipo. */

export const DEMO_PASSWORD = "demo1234";
export const DEMO_OWNER_EMAIL = "ana@petcare.demo";
export const DEMO_PROVIDER_EMAIL = "huellitas@petcare.demo";

const providers: Provider[] = [
  {
    id: "p1",
    name: "Clínica Veterinaria Huellitas",
    category: "veterinaria",
    tagline: "Medicina general y preventiva para perros y gatos",
    description:
      "Equipo de médicos veterinarios con atención por cita. Realizamos consultas generales, planes de vacunación, desparasitación y controles de rutina en un ambiente tranquilo.",
    city: "Bogotá",
    neighborhood: "Chapinero",
    address: "Calle 60 # 9-25, Chapinero",
    phone: "+57 300 000 0001",
    email: "huellitas@petcare.demo",
    schedule: "Lunes a sábado, 8:00 a. m. – 6:00 p. m.",
    image: "veterinaria",
  },
  {
    id: "p2",
    name: "Gato Feliz Clínica Felina",
    category: "veterinaria",
    tagline: "Atención veterinaria exclusiva para gatos",
    description:
      "Consultorio diseñado para reducir el estrés felino: sala de espera separada, manejo amable y consultas sin prisa.",
    city: "Medellín",
    neighborhood: "El Poblado",
    address: "Carrera 43A # 8-12, El Poblado",
    phone: "+57 300 000 0002",
    email: "gatofeliz@petcare.demo",
    schedule: "Lunes a viernes, 9:00 a. m. – 5:00 p. m.",
    image: "veterinaria-felina",
  },
  {
    id: "p3",
    name: "Pelos & Patas Peluquería",
    category: "peluqueria",
    tagline: "Baño, corte y estética canina",
    description:
      "Peluquería canina con productos hipoalergénicos. Cortes por raza, corte de uñas y limpieza de oídos.",
    city: "Bogotá",
    neighborhood: "Usaquén",
    address: "Carrera 7 # 120-40, Usaquén",
    phone: "+57 300 000 0003",
    email: "pelosypatas@petcare.demo",
    schedule: "Martes a domingo, 9:00 a. m. – 6:00 p. m.",
    image: "peluqueria",
  },
  {
    id: "p4",
    name: "Spa Burbujas",
    category: "peluqueria",
    tagline: "Baños relajantes para perros pequeños y medianos",
    description:
      "Baños con secado suave, hidratación del pelaje y perfume opcional. Ideal para razas pequeñas.",
    city: "Cali",
    neighborhood: "Granada",
    address: "Avenida 9N # 15-30, Granada",
    phone: "+57 300 000 0004",
    email: "burbujas@petcare.demo",
    schedule: "Lunes a sábado, 8:00 a. m. – 5:00 p. m.",
    image: "spa",
  },
  {
    id: "p5",
    name: "Doggo Run Paseos",
    category: "paseo",
    tagline: "Paseos en grupos pequeños por parques cercanos",
    description:
      "Paseadores con experiencia que recogen a tu perro en casa. Grupos de máximo cuatro perros para una atención cercana.",
    city: "Bogotá",
    neighborhood: "Teusaquillo",
    address: "Recogida a domicilio en Teusaquillo y alrededores",
    phone: "+57 300 000 0005",
    email: "doggorun@petcare.demo",
    schedule: "Lunes a viernes, 7:00 a. m. – 4:00 p. m.",
    image: "paseo",
  },
  {
    id: "p6",
    name: "Camina Conmigo",
    category: "paseo",
    tagline: "Paseos individuales a tu ritmo",
    description:
      "Paseos uno a uno para perros que prefieren tranquilidad o están en entrenamiento básico.",
    city: "Medellín",
    neighborhood: "Laureles",
    address: "Recogida a domicilio en Laureles",
    phone: "+57 300 000 0006",
    email: "caminaconmigo@petcare.demo",
    schedule: "Todos los días, 6:00 a. m. – 7:00 p. m.",
    image: "paseo",
  },
  {
    id: "p7",
    name: "Casa Peluda",
    category: "cuidado",
    tagline: "Cuidado en casa mientras viajas",
    description:
      "Cuidadora que recibe a tu mascota en un hogar con espacio y rutinas definidas. Envío de fotos diarias.",
    city: "Bogotá",
    neighborhood: "Suba",
    address: "Suba, Bogotá (dirección exacta al aceptar)",
    phone: "+57 300 000 0007",
    email: "casapeluda@petcare.demo",
    schedule: "Recepción diaria, 8:00 a. m. – 8:00 p. m.",
    image: "cuidado",
  },
  {
    id: "p8",
    name: "Mi Segundo Hogar Guardería",
    category: "cuidado",
    tagline: "Guardería de día y estadías cortas",
    description:
      "Guardería con zonas de juego supervisadas y descanso. Opción de día completo o estadías de varios días.",
    city: "Medellín",
    neighborhood: "Envigado",
    address: "Calle 38 Sur # 40-10, Envigado",
    phone: "+57 300 000 0008",
    email: "segundohogar@petcare.demo",
    schedule: "Lunes a sábado, 7:00 a. m. – 7:00 p. m.",
    image: "cuidado",
  },
];

const services: Service[] = [
  { id: "s1", providerId: "p1", name: "Consulta general", category: "veterinaria", description: "Revisión completa del estado de salud de tu mascota.", price: 60000, published: true },
  { id: "s2", providerId: "p1", name: "Vacunación", category: "veterinaria", description: "Aplicación de vacunas según el plan de tu mascota.", price: 45000, published: true },
  { id: "s3", providerId: "p1", name: "Desparasitación", category: "veterinaria", description: "Desparasitación interna y externa.", price: 35000, published: true },
  { id: "s4", providerId: "p1", name: "Control de rutina", category: "veterinaria", description: "Seguimiento periódico de peso y bienestar.", price: null, published: false },
  { id: "s5", providerId: "p2", name: "Consulta felina", category: "veterinaria", description: "Consulta general adaptada a gatos.", price: 70000, published: true },
  { id: "s6", providerId: "p2", name: "Vacunación felina", category: "veterinaria", description: "Vacunas para gatos de todas las edades.", price: 50000, published: true },
  { id: "s7", providerId: "p3", name: "Baño y corte", category: "peluqueria", description: "Baño completo y corte según la raza.", price: 55000, published: true },
  { id: "s8", providerId: "p3", name: "Corte de uñas", category: "peluqueria", description: "Corte y limado de uñas.", price: 15000, published: true },
  { id: "s9", providerId: "p4", name: "Baño relajante", category: "peluqueria", description: "Baño con hidratación y secado suave.", price: 40000, published: true },
  { id: "s10", providerId: "p5", name: "Paseo grupal (1 hora)", category: "paseo", description: "Paseo en grupo de máximo cuatro perros.", price: 20000, published: true },
  { id: "s11", providerId: "p5", name: "Plan semanal de paseos", category: "paseo", description: "Cinco paseos de lunes a viernes.", price: 90000, published: true },
  { id: "s12", providerId: "p6", name: "Paseo individual", category: "paseo", description: "Paseo uno a uno de 45 minutos.", price: 25000, published: true },
  { id: "s13", providerId: "p7", name: "Cuidado por noche", category: "cuidado", description: "Estadía nocturna en casa de la cuidadora.", price: 70000, published: true },
  { id: "s14", providerId: "p7", name: "Visita a domicilio", category: "cuidado", description: "Visita para alimentar y acompañar a tu mascota.", price: null, published: true },
  { id: "s15", providerId: "p8", name: "Guardería día completo", category: "cuidado", description: "Jornada de juego y descanso supervisado.", price: 45000, published: true },
];

const users: User[] = [
  {
    id: "u1",
    role: "propietario",
    name: "Ana Gómez",
    email: DEMO_OWNER_EMAIL,
    password: DEMO_PASSWORD,
    phone: "+57 300 000 1001",
    city: "Bogotá",
    pets: [
      { id: "pet1", name: "Luna", species: "Perro", breed: "Golden retriever", age: "4 años" },
      { id: "pet2", name: "Michi", species: "Gato", breed: "Criollo", age: "2 años" },
    ],
  },
  {
    id: "u2",
    role: "proveedor",
    name: "Dra. Paula Ríos",
    email: DEMO_PROVIDER_EMAIL,
    password: DEMO_PASSWORD,
    phone: "+57 300 000 0001",
    city: "Bogotá",
    providerId: "p1",
    pets: [],
  },
];

function req(
  r: Omit<ServiceRequest, "history"> & { history?: ServiceRequest["history"] },
): ServiceRequest {
  return {
    ...r,
    history: r.history ?? [{ status: "pendiente", at: r.createdAt }],
  };
}

const requests: ServiceRequest[] = [
  req({ id: "r1", serviceId: "s1", providerId: "p1", ownerId: "u1", ownerName: "Ana Gómez", ownerPhone: "+57 300 000 1001", petName: "Luna", date: "2026-11-14", time: "10:00", notes: "Luna ha estado un poco decaída estos días.", status: "pendiente", createdAt: "2026-11-09T14:20:00.000Z" }),
  req({ id: "r2", serviceId: "s7", providerId: "p3", ownerId: "u1", ownerName: "Ana Gómez", ownerPhone: "+57 300 000 1001", petName: "Luna", date: "2026-11-12", time: "15:00", notes: "", status: "aceptada", createdAt: "2026-11-06T16:00:00.000Z", history: [ { status: "pendiente", at: "2026-11-06T16:00:00.000Z" }, { status: "aceptada", at: "2026-11-07T09:10:00.000Z" } ] }),
  req({ id: "r3", serviceId: "s10", providerId: "p5", ownerId: "u1", ownerName: "Ana Gómez", ownerPhone: "+57 300 000 1001", petName: "Luna", date: "2026-11-08", time: "08:00", notes: "", status: "rechazada", createdAt: "2026-11-04T12:00:00.000Z", history: [ { status: "pendiente", at: "2026-11-04T12:00:00.000Z" }, { status: "rechazada", at: "2026-11-05T08:30:00.000Z", note: "No hay cupo en ese horario." } ] }),
  req({ id: "r4", serviceId: "s2", providerId: "p1", ownerId: "u3", ownerName: "Carlos Ruiz", ownerPhone: "+57 300 000 1003", petName: "Toby", date: "2026-11-13", time: "09:00", notes: "Refuerzo de vacuna anual.", status: "pendiente", createdAt: "2026-11-09T10:05:00.000Z" }),
  req({ id: "r5", serviceId: "s1", providerId: "p1", ownerId: "u4", ownerName: "Laura Méndez", ownerPhone: "+57 300 000 1004", petName: "Nala", date: "2026-11-11", time: "11:00", notes: "", status: "aceptada", createdAt: "2026-11-05T18:40:00.000Z", history: [ { status: "pendiente", at: "2026-11-05T18:40:00.000Z" }, { status: "aceptada", at: "2026-11-06T08:00:00.000Z" } ] }),
  req({ id: "r6", serviceId: "s3", providerId: "p1", ownerId: "u5", ownerName: "Andrés Pardo", ownerPhone: "+57 300 000 1005", petName: "Rocky", date: "2026-11-03", time: "16:00", notes: "", status: "finalizada", createdAt: "2026-10-30T15:00:00.000Z", history: [ { status: "pendiente", at: "2026-10-30T15:00:00.000Z" }, { status: "aceptada", at: "2026-10-31T09:00:00.000Z" }, { status: "finalizada", at: "2026-11-03T17:00:00.000Z" } ] }),
  req({ id: "r7", serviceId: "s1", providerId: "p1", ownerId: "u6", ownerName: "Sofía Herrera", ownerPhone: "+57 300 000 1006", petName: "Kira", date: "2026-11-09", time: "07:00", notes: "", status: "rechazada", createdAt: "2026-11-07T20:00:00.000Z", history: [ { status: "pendiente", at: "2026-11-07T20:00:00.000Z" }, { status: "rechazada", at: "2026-11-08T08:15:00.000Z", note: "Horario fuera de atención." } ] }),
  req({ id: "r8", serviceId: "s2", providerId: "p1", ownerId: "u7", ownerName: "María Torres", ownerPhone: "+57 300 000 1007", petName: "Simba", date: "2026-11-16", time: "14:00", notes: "Es su primera vacuna.", status: "pendiente", createdAt: "2026-11-10T00:30:00.000Z" }),
];

export const SEED_VERSION = 1;

export const SEED: PetCareState = {
  version: SEED_VERSION,
  users,
  providers,
  services,
  requests,
  sessionUserId: null,
  usability: [],
};
