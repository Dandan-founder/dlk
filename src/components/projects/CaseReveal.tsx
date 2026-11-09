"use client";

import { useRef } from "react";
import { gsap, MQ, revealBatch, useGsap } from "@/lib/gsap";

/** Animações do estudo de caso: capa abre por máscara e escala com a rolagem; blocos entram em lote. */
export function CaseReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, (mm, el) => {
    revealBatch(mm, el);
    mm.add(MQ.motion, () => {
      const cover = el.querySelector("[data-case-cover]");
      if (!cover) return;
      gsap.fromTo(cover, { clipPath: "inset(6% 10% 0% 10% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: cover, start: "top 95%", end: "top 30%", scrub: 0.5 } });
    });
  });
  return <div ref={ref}>{children}</div>;
}
