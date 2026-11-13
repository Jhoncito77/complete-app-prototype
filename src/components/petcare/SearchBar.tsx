import { useNavigate } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CITIES } from "@/lib/petcare/categories";
import { cn } from "@/lib/utils";

export function SearchBar({ className, size = "lg" }: { className?: string | undefined; size?: "lg" | "md" }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string>("todas");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigate({
      to: "/explorar",
      search: { q: q.trim() || undefined, ubicacion: city === "todas" ? undefined : city },
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Buscar servicios"
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-card sm:flex-row sm:items-center",
        className,
      )}
    >
      <label className="flex flex-1 items-center gap-2.5 rounded-xl px-3 focus-within:bg-muted/60">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        <span className="sr-only">Servicio</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej.: vacunación, baño, paseo"
          className={cn("w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground", size === "lg" ? "h-12" : "h-11")}
        />
      </label>
      <div className="hidden h-8 w-px bg-border sm:block" aria-hidden />
      <div className="flex items-center gap-2 px-1 sm:w-52">
        <MapPin className="ml-2 size-5 shrink-0 text-muted-foreground" aria-hidden />
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger aria-label="Ubicación" className="border-0 shadow-none focus:ring-0">
            <SelectValue placeholder="Ubicación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las ciudades</SelectItem>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" size={size === "lg" ? "lg" : "default"} className="sm:px-7">
        Buscar
      </Button>
    </form>
  );
}
