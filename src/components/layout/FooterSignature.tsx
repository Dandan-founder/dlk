"use client";

import { useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { gsap, MQ, useGsap } from "@/lib/gsap";

/** Assinatura do rodapé: o "dlk" sobe de dentro da página com a rolagem e o ponto cai no lugar com quique. */
export function FooterSignature() {
  const root = useRef<HTMLDivElement>(null);
  useGsap(
    root,
    (mm, el) => {
      mm.add(MQ.motion, () => {
        const letters = el.querySelector("[data-logo-letters]");
        const dot = el.querySelector("[data-logo-dot]");
        gsap.fromTo(letters, { yPercent: 70 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.6 } });
        gsap.fromTo(
          dot,
          { yPercent: -900, transformOrigin: "50% 100%" },
          { yPercent: 0, duration: 1.4, ease: "bounce.out", scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none reverse" } },
        );
      });
    },
    [],
    { defer: true },
  );
  return (
    <div ref={root} className="overflow-hidden">
      <Logo className="w-full overflow-visible opacity-[0.96]" title={null} />
    </div>
  );
}
