import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

/**
 * Botão-assinatura da DLK: o ponto do logotipo vive dentro do botão e, no hover/foco,
 * se expande até preencher tudo (o rótulo inverte de cor). Sem setas, sem rótulo rolando.
 */
type Variant = "primary" | "ghost" | "light" | "dark";

const variants: Record<Variant, { base: string; dot: string; hover: string }> = {
  // laranja → preenche de marinho
  primary: { base: "bg-dot text-void", dot: "bg-void", hover: "group-hover:text-text group-focus-visible:text-text" },
  // contorno → preenche de laranja
  ghost: { base: "border border-line-strong text-text", dot: "bg-dot", hover: "group-hover:text-void group-focus-visible:text-void" },
  // branco → preenche de laranja
  light: { base: "bg-paper text-navy", dot: "bg-dot", hover: "group-hover:text-void group-focus-visible:text-void" },
  // marinho → preenche de laranja
  dark: { base: "bg-void text-text", dot: "bg-dot", hover: "group-hover:text-void group-focus-visible:text-void" },
};
const sizes = { md: "h-12 pl-10 pr-6 text-[0.98rem]", lg: "h-14 pl-11 pr-7 text-[1.02rem] md:h-[3.75rem] md:pl-12 md:pr-8 md:text-[1.08rem]" };

export const buttonClass = (variant: Variant = "primary", size: keyof typeof sizes = "md", className?: string) =>
  cn(
    "group relative isolate inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full font-medium tracking-[-0.005em] [transform:translateZ(0)] disabled:pointer-events-none disabled:opacity-50",
    sizes[size],
    variants[variant].base,
    className,
  );

function Inner({ variant, size, children }: { variant: Variant; size: keyof typeof sizes; children: React.ReactNode }) {
  const v = variants[variant];
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rounded-full transition-transform duration-[650ms] ease-[var(--ease-out)] group-hover:scale-[90] group-focus-visible:scale-[90] motion-reduce:transition-none",
          size === "lg" ? "left-5 md:left-6" : "left-[1.15rem]",
          v.dot,
        )}
      />
      <span className={cn("relative transition-colors duration-300 delay-75", v.hover)}>{children}</span>
    </>
  );
}

type Common = { variant?: Variant; size?: keyof typeof sizes; magnetic?: boolean; className?: string; children: React.ReactNode; arrow?: boolean };

export function ButtonLink({ href, external, variant = "primary", size = "md", magnetic = false, className, children, arrow: _arrow, ...rest }: Common & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  void _arrow;
  const cls = buttonClass(variant, size, className);
  const inner = (
    <Inner variant={variant} size={size}>
      {children}
    </Inner>
  );
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

export function Button({ variant = "primary", size = "md", magnetic = false, className, children, arrow: _arrow, ...rest }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  void _arrow;
  const el = (
    <button className={buttonClass(variant, size, className)} {...rest}>
      <Inner variant={variant} size={size}>
        {children}
      </Inner>
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
