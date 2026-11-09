"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";

/** Fio laranja no topo que acompanha a leitura da página (só transform). */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.set(el, { scaleX: 0 });
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => gsap.set(el, { scaleX: s.progress }) });
    });
    return () => mm.revert();
  }, [pathname]);
  return <div ref={bar} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left scale-x-0 bg-dot motion-reduce:hidden" />;
}
