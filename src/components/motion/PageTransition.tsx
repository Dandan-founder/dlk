"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";

/**
 * Transição entre páginas com a assinatura da marca: o ponto laranja cresce a partir do clique
 * até cobrir a tela, a página troca por baixo e o ponto sai pelo topo. Só transform (scale/translate).
 * Não intercepta: links externos, âncoras na mesma página, Ctrl/Cmd/Shift-clique, target=_blank.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const dot = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const covering = useRef(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!window.matchMedia(MQ.motion).matches) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      if (busy.current) return;
      busy.current = true;
      const el = dot.current!;
      const r = Math.hypot(window.innerWidth, window.innerHeight) * 1.1;
      gsap.set(el, { x: e.clientX - 40, y: e.clientY - 40, scale: 0, yPercent: 0, display: "block" });
      gsap.to(el, {
        scale: r / 40,
        duration: 0.6,
        ease: "power3.in",
        onComplete: () => {
          covering.current = true;
          router.push(url.pathname + url.search + url.hash);
        },
      });
    };
    // fase de captura: roda antes do <Link> do Next (que respeita o preventDefault)
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // nova página montada: o ponto sai
  useEffect(() => {
    if (!covering.current) return;
    covering.current = false;
    const el = dot.current!;
    gsap.to(el, {
      yPercent: -260,
      duration: 0.75,
      delay: 0.1,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(el, { display: "none" });
        busy.current = false;
      },
    });
  }, [pathname]);

  return <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-20 w-20 rounded-full bg-dot will-change-transform" />;
}
