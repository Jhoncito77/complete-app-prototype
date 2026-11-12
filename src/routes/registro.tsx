import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, PawPrint, Store } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/petcare/AuthLayout";
import { FormField } from "@/components/petcare/common";
import { PasswordInput } from "@/components/petcare/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, CITIES } from "@/lib/petcare/categories";
import { emailExists, register } from "@/lib/petcare/store";
import type { CategoryId, Role } from "@/lib/petcare/types";
import { cn } from "@/lib/utils";

interface RegisterSearch {
  tipo?: Role | undefined;
}

export const Route = createFileRoute("/registro")({
  validateSearch: (s: Record<string, unknown>): RegisterSearch => ({
    tipo: s["tipo"] === "proveedor" || s["tipo"] === "propietario" ? s["tipo"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Crear cuenta — PetCare" },
      { name: "description", content: "Regístrate en PetCare como propietario de mascota o como proveedor de servicios." },
      { property: "og:title", content: "Crear cuenta — PetCare" },
      { property: "og:description", content: "Regístrate como propietario o proveedor en PetCare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email" | "password" | "confirm" | "terms" | "business" | "category" | "city" | "neighborhood" | "phone", string>>;

function RegisterPage() {
  const { tipo } = Route.useSearch();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(tipo ?? "propietario");
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [biz, setBiz] = useState({ name: "", category: "" as CategoryId | "", city: "", neighborhood: "", phone: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function validateStep1(): Errors {
    const e: Errors = {};
    if (form.name.trim().length < 3) e.name = "Escribe tu nombre completo.";
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Ingresa un correo válido. Ej.: nombre@correo.com";
    else if (emailExists(form.email)) e.email = "Ya existe una cuenta con este correo. Inicia sesión.";
    if (form.password.length < 8) e.password = "La contraseña debe tener al menos 8 caracteres.";
    if (form.confirm !== form.password || !form.confirm) e.confirm = "Las contraseñas no coinciden.";
    if (!form.terms) e.terms = "Debes aceptar los términos para continuar.";
    return e;
  }

  function validateStep2(): Errors {
    const e: Errors = {};
    if (biz.name.trim().length < 3) e.business = "Escribe el nombre de tu negocio o servicio.";
    if (!biz.category) e.category = "Selecciona una categoría.";
    if (!biz.city) e.city = "Selecciona una ciudad.";
    if (!biz.neighborhood.trim()) e.neighborhood = "Indica el barrio o zona.";
    if (biz.phone.replace(/\D/g, "").length < 7) e.phone = "Ingresa un teléfono de contacto válido.";
    return e;
  }

  function finish() {
    setLoading(true);
    setTimeout(() => {
      const user = register({
        role,
        name: form.name,
        email: form.email,
        password: form.password,
        business:
          role === "proveedor"
            ? { name: biz.name.trim(), category: biz.category as CategoryId, city: biz.city, neighborhood: biz.neighborhood.trim(), phone: biz.phone.trim() }
            : undefined,
      });
      setLoading(false);
      toast.success("¡Cuenta creada!", { description: role === "proveedor" ? "Ahora publica tu primer servicio." : "Ya puedes explorar y solicitar servicios." });
      navigate({ to: user.role === "proveedor" ? "/proveedor" : "/propietario" });
    }, 500);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step === 1) {
      const errs = validateStep1();
      setErrors(errs);
      if (Object.keys(errs).length) return;
      if (role === "proveedor") setStep(2);
      else finish();
      return;
    }
    const errs = validateStep2();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    finish();
  }

  const field = (k: keyof typeof form) => ({
    id: k,
    value: form[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value })),
    "aria-invalid": !!errors[k as keyof Errors],
    "aria-describedby": errors[k as keyof Errors] ? `${k}-error` : undefined,
  });

  return (
    <AuthLayout aside={{ title: "Dos tipos de cuenta, una sola plataforma", text: "Los propietarios buscan y solicitan servicios. Los proveedores publican sus servicios y responden solicitudes." }}>
      {role === "proveedor" && (
        <ol className="mb-6 flex items-center gap-3 text-xs font-medium" aria-label="Pasos del registro">
          <StepDot n={1} label="Tu cuenta" active={step === 1} done={step === 2} />
          <span className="h-px flex-1 bg-border" aria-hidden />
          <StepDot n={2} label="Tu negocio" active={step === 2} done={false} />
        </ol>
      )}

      {step === 1 ? (
        <>
          <h1 className="text-h1">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Elige el tipo de cuenta y completa tus datos.</p>
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Tipo de cuenta</legend>
              <div className="grid grid-cols-2 gap-3" role="radiogroup">
                <RoleOption active={role === "propietario"} onClick={() => setRole("propietario")} icon={PawPrint} title="Propietario" text="Busco servicios para mi mascota" />
                <RoleOption active={role === "proveedor"} onClick={() => setRole("proveedor")} icon={Store} title="Proveedor" text="Ofrezco servicios para mascotas" />
              </div>
            </fieldset>
            <FormField id="name" label="Nombre completo" error={errors.name}>
              <Input autoComplete="name" placeholder="Ej.: Ana Gómez" {...field("name")} />
            </FormField>
            <FormField id="email" label="Correo electrónico" error={errors.email}>
              <Input type="email" autoComplete="email" placeholder="nombre@correo.com" {...field("email")} />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="password" label="Contraseña" error={errors.password} hint="Mínimo 8 caracteres">
                <PasswordInput autoComplete="new-password" {...field("password")} />
              </FormField>
              <FormField id="confirm" label="Confirmar contraseña" error={errors.confirm}>
                <PasswordInput autoComplete="new-password" {...field("confirm")} />
              </FormField>
            </div>
            <div>
              <label className="flex items-start gap-3 text-sm">
                <Checkbox
                  checked={form.terms}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, terms: v === true }))}
                  aria-invalid={!!errors.terms}
                  className="mt-0.5 size-5 rounded-md data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <span className="text-muted-foreground">
                  Acepto los <span className="font-medium text-primary">términos y condiciones</span> y la{" "}
                  <span className="font-medium text-primary">política de privacidad</span>.
                </span>
              </label>
              {errors.terms && <p className="mt-1.5 text-[13px] text-destructive-strong" role="alert">{errors.terms}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {role === "proveedor" ? "Continuar" : "Crear cuenta"}
            </Button>
          </form>
        </>
      ) : (
        <>
          <h1 className="text-h1">Datos básicos de tu negocio</h1>
          <p className="mt-2 text-sm text-muted-foreground">Con esto creamos tu perfil. Podrás completarlo después desde tu panel.</p>
          <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
            <FormField id="business" label="Nombre del negocio o servicio" error={errors.business}>
              <Input id="business" placeholder="Ej.: Veterinaria Patitas" value={biz.name} onChange={(e) => setBiz((b) => ({ ...b, name: e.target.value }))} aria-invalid={!!errors.business} />
            </FormField>
            <FormField id="category" label="Categoría principal" error={errors.category}>
              <Select value={biz.category} onValueChange={(v) => setBiz((b) => ({ ...b, category: v as CategoryId }))}>
                <SelectTrigger id="category" aria-invalid={!!errors.category}><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="city" label="Ciudad" error={errors.city}>
                <Select value={biz.city} onValueChange={(v) => setBiz((b) => ({ ...b, city: v }))}>
                  <SelectTrigger id="city" aria-invalid={!!errors.city}><SelectValue placeholder="Selecciona" /></SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField id="neighborhood" label="Barrio o zona" error={errors.neighborhood}>
                <Input id="neighborhood" placeholder="Ej.: Chapinero" value={biz.neighborhood} onChange={(e) => setBiz((b) => ({ ...b, neighborhood: e.target.value }))} aria-invalid={!!errors.neighborhood} />
              </FormField>
            </div>
            <FormField id="phone" label="Teléfono de contacto" error={errors.phone}>
              <Input id="phone" type="tel" placeholder="+57 300 000 0000" value={biz.phone} onChange={(e) => setBiz((b) => ({ ...b, phone: e.target.value }))} aria-invalid={!!errors.phone} />
            </FormField>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                <ArrowLeft /> Atrás
              </Button>
              <Button type="submit" size="lg" className="flex-1" loading={loading}>Crear cuenta</Button>
            </div>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-primary hover:underline">Inicia sesión</Link>
      </p>
    </AuthLayout>
  );
}

function RoleOption({ active, onClick, icon: Icon, title, text }: { active: boolean; onClick: () => void; icon: typeof Store; title: string; text: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-primary bg-lavender shadow-soft" : "border-border bg-card hover:border-secondary",
      )}
    >
      <span className={cn("flex size-10 items-center justify-center rounded-lg", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="text-sm font-semibold text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{text}</span>
      {active && (
        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" aria-hidden />
        </span>
      )}
    </button>
  );
}

function StepDot({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <li className={cn("flex items-center gap-2", active || done ? "text-primary" : "text-muted-foreground")} aria-current={active ? "step" : undefined}>
      <span className={cn("flex size-7 items-center justify-center rounded-full border text-xs font-semibold", active ? "border-primary bg-primary text-primary-foreground" : done ? "border-primary bg-lavender" : "border-border bg-card")}>
        {done ? <Check className="size-3.5" aria-hidden /> : n}
      </span>
      {label}
    </li>
  );
}
