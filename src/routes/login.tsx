import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { PawPrint, Store } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/petcare/AuthLayout";
import { FormField } from "@/components/petcare/common";
import { PasswordInput } from "@/components/petcare/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, loginAs } from "@/lib/petcare/store";
import { DEMO_OWNER_EMAIL, DEMO_PASSWORD, DEMO_PROVIDER_EMAIL } from "@/lib/petcare/seed";
import type { User } from "@/lib/petcare/types";

interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    redirect: typeof s.redirect === "string" && s.redirect.startsWith("/") && !s.redirect.startsWith("//") ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Iniciar sesión — PetCare" },
      { name: "description", content: "Accede a tu cuenta de PetCare como propietario o proveedor." },
      { property: "og:title", content: "Iniciar sesión — PetCare" },
      { property: "og:description", content: "Accede a tu cuenta de PetCare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function goAfterLogin(user: User) {
    toast.success(`¡Hola, ${user.name.split(" ")[0]}!`);
    const ownerOnly = redirect?.startsWith("/propietario") || redirect?.startsWith("/solicitar");
    const providerOnly = redirect?.startsWith("/proveedor/") || redirect === "/proveedor";
    if (redirect && !(ownerOnly && user.role !== "propietario") && !(providerOnly && user.role !== "proveedor")) {
      router.history.push(redirect);
      return;
    }
    navigate({ to: user.role === "proveedor" ? "/proveedor" : "/propietario" });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Ingresa tu correo electrónico.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Revisa el formato del correo. Ej.: nombre@correo.com";
    if (!password) next.password = "Ingresa tu contraseña.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.ok) {
        setErrors({ [res.field]: res.error });
        return;
      }
      goAfterLogin(res.user);
    }, 450);
  }

  return (
    <AuthLayout aside={{ title: "Todo el cuidado de tu mascota, organizado", text: "Consulta tus solicitudes y su estado desde cualquier dispositivo." }}>
      <h1 className="text-h1">¡Qué bueno verte de nuevo!</h1>
      <p className="mt-2 text-sm text-muted-foreground">Inicia sesión para gestionar tus solicitudes y servicios.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
        <FormField id="email" label="Correo electrónico" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </FormField>
        <FormField id="password" label="Contraseña" error={errors.password}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
        </FormField>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
            onClick={() => toast.info("Recuperar contraseña no está disponible en este prototipo.")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Iniciar sesión
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className="font-semibold text-primary hover:underline">Regístrate</Link>
      </p>

      <div className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-lavender/60 p-4">
        <p className="text-sm font-semibold text-foreground">Acceso rápido de demostración</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Contraseña de ambas cuentas: <code className="font-semibold text-foreground">{DEMO_PASSWORD}</code>
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => goAfterLogin(loginAs("propietario"))} title={DEMO_OWNER_EMAIL}>
            <PawPrint /> Entrar como propietario
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => goAfterLogin(loginAs("proveedor"))} title={DEMO_PROVIDER_EMAIL}>
            <Store /> Entrar como proveedor
          </Button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {DEMO_OWNER_EMAIL} · {DEMO_PROVIDER_EMAIL}
        </p>
      </div>
    </AuthLayout>
  );
}
