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
      // abre com a rolagem só com transform (moldura cresce, imagem interna compensa); sem clip-path
      const st = { trigger: cover, start: "top 95%", end: "top 30%", scrub: 0.5 };
      gsap.fromTo(cover, { scale: 0.82, transformOrigin: "50% 0%" }, { scale: 1, ease: "none", scrollTrigger: st });
      gsap.fromTo(cover.querySelectorAll("img"), { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: st });
    });
  });
  return <div ref={ref}>{children}</div>;
}
