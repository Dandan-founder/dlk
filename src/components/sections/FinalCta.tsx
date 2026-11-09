"use client";

import { useRef } from "react";
import { finalCta } from "@/data/content";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { gsap, MQ, splitReveal, useGsap } from "@/lib/gsap";

/**
 * CTA final: o ponto laranja da marca cresce com a rolagem até tomar a seção inteira.
 * Com movimento reduzido, a seção já aparece laranja.
 */
export function FinalCta() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, (mm, el) => {
    splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")), { stagger: 0.12 });
    mm.add(MQ.motion, () => {
      gsap.fromTo("[data-cta-dot]", { scale: 0.04, borderRadius: "42%" }, { scale: 1, borderRadius: "0%", ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "top 10%", scrub: 0.5 } });
    });
  }, [], { defer: true });

  return (
    <section ref={root} aria-labelledby="cta-title" className="relative isolate overflow-clip bg-void py-32 md:py-48">
      <div aria-hidden className="absolute inset-0 -z-10 grid place-items-center">
        <span data-cta-dot className="block aspect-square w-[160vmax] bg-dot will-change-transform" />
      </div>
      <div className="mx-auto max-w-[1800px] px-[var(--gutter)] text-void">
        <h2 id="cta-title" data-split data-hide className="display text-[clamp(3.2rem,10.5vw,12rem)]">
          {finalCta.lines[0]}
          <br />
          {finalCta.lines[1]}
          <span className="text-white">.</span>
        </h2>
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-[minmax(0,30rem)_1fr] md:items-end">
          <p className="text-[clamp(1.1rem,1.6vw,1.35rem)] font-medium leading-relaxed text-void">{finalCta.sub}</p>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <ButtonLink href="/orcamento" variant="dark" size="lg">
              {finalCta.button}
            </ButtonLink>
            <WhatsAppButton message={site.messages.hero} variant="light" size="lg">
              Falar no WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
