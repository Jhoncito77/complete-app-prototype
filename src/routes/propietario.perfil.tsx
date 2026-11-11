import { createFileRoute } from "@tanstack/react-router";
import { PawPrint, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/petcare/ConfirmDialog";
import { EmptyState, FormField, PageHeader } from "@/components/petcare/common";
import { UserAvatar } from "@/components/petcare/UserMenu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CITIES } from "@/lib/petcare/categories";
import { addPet, removePet, updateUser, useSession } from "@/lib/petcare/store";
import type { Pet, User } from "@/lib/petcare/types";

export const Route = createFileRoute("/propietario/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil y mascotas — PetCare" },
      { name: "description", content: "Actualiza tus datos y la información de tus mascotas." },
      { property: "og:title", content: "Perfil y mascotas — PetCare" },
      { property: "og:description", content: "Datos del propietario y sus mascotas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OwnerProfile,
});

function OwnerProfile() {
  const user = useSession();
  if (!user) return null;
  return <ProfileForms user={user} />;
}

function ProfileForms({ user }: { user: User }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const [nameError, setNameError] = useState<string | undefined>();
  const [petOpen, setPetOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Pet | null>(null);

  function save(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 3) {
      setNameError("Escribe tu nombre completo.");
      return;
    }
    setNameError(undefined);
    updateUser(user.id, { name: name.trim(), phone: phone.trim(), city });
    toast.success("Perfil actualizado");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Perfil y mascotas" description="Mantén tus datos al día para que los proveedores puedan contactarte." />
      <div className="grid gap-6 lg:grid-cols-12">
        <form onSubmit={save} noValidate className="surface-card space-y-5 p-6 lg:col-span-5">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} className="size-14 text-lg" />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">Cuenta de propietario</p>
            </div>
          </div>
          <FormField id="name" label="Nombre completo" error={nameError}>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!nameError} />
          </FormField>
          <FormField id="email" label="Correo electrónico" hint="El correo no se puede cambiar en el prototipo.">
            <Input id="email" value={user.email} disabled />
          </FormField>
          <FormField id="phone" label="Teléfono" optional>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+57 300 000 0000" />
          </FormField>
          <FormField id="city" label="Ciudad" optional>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger id="city"><SelectValue placeholder="Selecciona tu ciudad" /></SelectTrigger>
              <SelectContent>{CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
          <Button type="submit" className="w-full">Guardar cambios</Button>
        </form>

        <section className="surface-card p-6 lg:col-span-7" aria-labelledby="pets-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="pets-title" className="text-h2">Mis mascotas</h2>
            <Button size="sm" onClick={() => setPetOpen(true)}><Plus /> Agregar mascota</Button>
          </div>
          {user.pets.length === 0 ? (
            <EmptyState icon={PawPrint} title="Aún no has agregado mascotas" description="Agrégalas para seleccionarlas rápido al solicitar un servicio." />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {user.pets.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-orange-soft text-orange-strong"><PawPrint className="size-6" aria-hidden /></span>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.species} · {p.breed || "Sin raza"}</p>
                      <p className="text-xs text-muted-foreground">{p.age}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setToDelete(p)} aria-label={`Eliminar a ${p.name}`}>
                    <Trash2 className="text-destructive-strong" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <PetDialog open={petOpen} onOpenChange={setPetOpen} onSave={(pet) => { addPet(user.id, pet); toast.success(`${pet.name} se agregó a tus mascotas`); }} />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`¿Eliminar a ${toDelete?.name ?? ""}?`}
        description="Se quitará de tu lista de mascotas. Las solicitudes anteriores se conservan."
        confirmLabel="Eliminar"
        tone="destructive"
        onConfirm={() => {
          if (toDelete) {
            removePet(user.id, toDelete.id);
            toast.success("Mascota eliminada");
          }
          setToDelete(null);
        }}
      />
    </div>
  );
}

function PetDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; onSave: (p: Omit<Pet, "id">) => void }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<Pet["species"]>("Perro");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState<string | undefined>();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Escribe el nombre de tu mascota.");
      return;
    }
    onSave({ name: name.trim(), species, breed: breed.trim(), age: age.trim() });
    setName(""); setBreed(""); setAge(""); setError(undefined);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-h3">Agregar mascota</DialogTitle>
          <DialogDescription>Solo necesitamos lo básico.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="space-y-4">
          <FormField id="pet-name" label="Nombre" error={error}>
            <Input id="pet-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!error} placeholder="Ej.: Luna" />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="pet-species" label="Especie">
              <Select value={species} onValueChange={(v) => setSpecies(v as Pet["species"])}>
                <SelectTrigger id="pet-species"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perro">Perro</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="pet-age" label="Edad" optional>
              <Input id="pet-age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Ej.: 3 años" />
            </FormField>
          </div>
          <FormField id="pet-breed" label="Raza" optional>
            <Input id="pet-breed" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Ej.: Criollo" />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Guardar mascota</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
