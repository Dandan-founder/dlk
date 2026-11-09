import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "ghost" | "light" | "dark";
const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium tracking-[-0.01em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50";
const sizes = { md: "h-12 px-6 text-[0.95rem]", lg: "h-14 px-7 text-base md:h-16 md:px-9 md:text-[1.05rem]" };
const variants: Record<Variant, string> = {
  primary: "bg-dot text-void hover:bg-[#ff8340]",
  ghost: "border border-line-strong text-text hover:border-text/60",
  light: "bg-text text-void hover:bg-white",
  dark: "bg-void text-text hover:bg-navy",
};

export const buttonClass = (variant: Variant = "primary", size: keyof typeof sizes = "md", className?: string) => cn(base, sizes[size], variants[variant], className);

/** Rótulo que rola para cima no hover (troca por uma cópia), com seta. */
function Label({ children, arrow }: { children: React.ReactNode; arrow: boolean }) {
  return (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-full">{children}</span>
        <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
      {arrow && <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-45" aria-hidden />}
    </>
  );
}

type Common = { variant?: Variant; size?: keyof typeof sizes; arrow?: boolean; magnetic?: boolean; className?: string; children: React.ReactNode };

export function ButtonLink({ href, external, variant, size, arrow = true, magnetic = true, className, children, ...rest }: Common & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = buttonClass(variant, size, className);
  const inner = <Label arrow={arrow}>{children}</Label>;
  const el = external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
      {inner}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  ) : (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export function Button({ variant, size, arrow = false, magnetic = false, className, children, ...rest }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const el = (
    <button className={buttonClass(variant, size, className)} {...rest}>
      <Label arrow={arrow}>{children}</Label>
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
