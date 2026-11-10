import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import authImg from "@/assets/auth-mascotas.jpg";
import { Logo } from "./Logo";
import { DemoStrip } from "./DemoNotice";

export function AuthLayout({ children, aside }: { children: ReactNode; aside: { title: string; text: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DemoStrip />
      <div className="grid flex-1 lg:grid-cols-2">
        <div className="flex flex-col px-4 py-6 sm:px-8 lg:px-14">
          <div className="flex items-center justify-between">
            <Logo />
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
              <ArrowLeft className="size-4" aria-hidden /> Volver al inicio
            </Link>
          </div>
          <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 animate-fade-up">{children}</main>
        </div>
        <div className="relative hidden overflow-hidden bg-lavender lg:block">
          <div className="paw-pattern absolute inset-0" aria-hidden />
          <div className="relative flex h-full flex-col justify-end p-10">
            <img
              src={authImg}
              alt="Un perro corgi y un gato blanco recostados juntos sobre una manta lavanda"
              width={896}
              height={1152}
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="relative max-w-md rounded-2xl border border-border bg-card/95 p-6 shadow-card backdrop-blur">
              <h2 className="text-h3">{aside.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{aside.text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
