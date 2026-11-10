import { useNavigate, Link } from "@tanstack/react-router";
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/petcare/store";
import type { User } from "@/lib/petcare/types";

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function UserAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-lavender text-sm font-semibold text-primary">{initials(name)}</AvatarFallback>
    </Avatar>
  );
}

export function UserMenu({ user }: { user: User }) {
  const navigate = useNavigate();
  const isProvider = user.role === "proveedor";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Abrir menú de usuario"
      >
        <UserAvatar name={user.name} className="size-9" />
        <span className="hidden text-left leading-tight lg:block">
          <span className="block text-sm font-semibold text-foreground">{user.name.split(" ")[0]}</span>
          <span className="block text-xs text-muted-foreground">{isProvider ? "Proveedor" : "Propietario"}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={isProvider ? "/proveedor" : "/propietario"}>
            <LayoutDashboard /> Panel principal
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={isProvider ? "/proveedor/perfil" : "/propietario/perfil"}>
            <UserIcon /> {isProvider ? "Perfil del proveedor" : "Perfil y mascotas"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive-strong focus:bg-destructive-soft focus:text-destructive-strong"
          onSelect={() => {
            logout();
            toast.success("Sesión cerrada");
            navigate({ to: "/" });
          }}
        >
          <LogOut /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
