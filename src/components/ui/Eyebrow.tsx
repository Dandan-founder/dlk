import { cn } from "@/lib/utils";

/** Rótulo de seção em mono, com o ponto da marca. */
export function Eyebrow({ children, className, dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", dark ? "text-muted-dark" : "text-muted", className)}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-dot" />
      {children}
    </p>
  );
}
