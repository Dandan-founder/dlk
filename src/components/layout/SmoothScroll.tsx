"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Altura do cabeçalho fixo, para as âncoras não ficarem escondidas. */
const headerOffset = () => -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) * 16 || 72);

/**
 * Rolagem suave (Lenis) sincronizada com o ScrollTrigger. Desligada com movimento reduzido:
 * aí vale a rolagem nativa do navegador, sem inércia.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");
    const mq = window.matchMedia(MQ.motion);
    let instance: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    const start = () => {
      instance = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true, anchors: { offset: headerOffset() } });
      instance.on("scroll", ScrollTrigger.update);
      tick = (t: number) => instance?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
    };
    const stop = () => {
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
      setLenis(null);
    };
    if (mq.matches) start();
    const onChange = () => (mq.matches ? start() : stop());
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  // Ao trocar de página: volta ao topo (ou à âncora) e recalcula as animações de rolagem
  useEffect(() => {
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    if (lenis) lenis.scrollTo(target instanceof HTMLElement ? target : 0, { immediate: true, offset: headerOffset(), force: true });
    else if (!target) window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
