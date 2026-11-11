"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Celular: depois do hero, um atalho fixo para o orçamento. Some no fim da página
 * (onde já há o CTA final) e na própria página de orçamento.
 */
export function MobileCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 1400;
      setShow(y > window.innerHeight * 0.9 && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  if (pathname.startsWith("/orcamento")) return null;
  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex items-center justify-between gap-3 rounded-full border border-line-strong bg-void py-2 pl-5 pr-2 transition-[transform,translate,rotate,scale,opacity] duration-500 ease-[var(--ease-out)] md:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[150%] opacity-0",
      )}
      aria-hidden={!show}
    >
      <p className="min-w-0 text-[0.86rem] leading-tight text-muted">
        <span className="block text-text">Sem custo</span>
        leva 2 minutos
      </p>
      <ButtonLink href="/orcamento" tabIndex={show ? 0 : -1} className="h-11 pl-9 pr-5">
        Pedir orçamento
      </ButtonLink>
    </div>
  );
}
