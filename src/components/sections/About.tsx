"use client";

import { useRef } from "react";
import { about } from "@/data/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { gsap, MQ, revealBatch, splitReveal, useGsap } from "@/lib/gsap";

/** Sobre: seção clara (como a versão clara do logotipo), composição editorial e uma faixa de competências. */
export function About() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, (mm, el) => {
    splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
    revealBatch(mm, el);
    mm.add(MQ.motion, () => {
      // O ponto cresce e se desloca com a rolagem — o "ponto final" que a DLK coloca nos projetos
      gsap.fromTo("[data-about-dot]", { scale: 0.2, yPercent: -60 }, { scale: 1, yPercent: 40, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      // Faixa de competências acompanha a rolagem (sentido oposto ao da leitura)
      gsap.fromTo("[data-marquee]", { xPercent: 0 }, { xPercent: -25, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.4 } });
    });
  }, [], { defer: true });

  return (
    <section ref={root} id="sobre" aria-labelledby="sobre-title" className="relative overflow-clip bg-paper text-navy">
      <div className="mx-auto grid max-w-[1800px] gap-14 px-[var(--gutter)] py-28 md:py-40 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-3">
          <Eyebrow dark>{about.eyebrow}</Eyebrow>
        </div>
        <div className="relative lg:col-span-9">
          <h2 id="sobre-title" data-split data-hide className="display text-[clamp(2.8rem,7.4vw,8.4rem)]">
            {about.title[0]}
            <br />
            <span className="text-muted-dark">{about.title[1]}</span>
          </h2>
          <span aria-hidden data-about-dot className="pointer-events-none absolute -right-4 top-0 hidden h-[clamp(5rem,11vw,10rem)] w-[clamp(5rem,11vw,10rem)] rounded-[42%] bg-dot md:block" />
        </div>

        <p data-reveal className="text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-[1.35] tracking-[-0.02em] lg:col-span-6 lg:col-start-4">
          {about.lead}
        </p>

        <dl className="grid gap-px overflow-hidden rounded-2xl border border-navy/10 bg-navy/10 md:grid-cols-3 lg:col-span-9 lg:col-start-4">
          {about.blocks.map((b, i) => (
            <div key={b.k} data-reveal className="bg-paper p-7 md:p-9">
              <dt className="flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted-dark">
                {b.k}
                <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
              </dt>
              <dd className="mt-6 text-[1.02rem] leading-relaxed text-navy/80">{b.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Faixa de competências */}
      <div aria-hidden className="overflow-hidden border-t border-navy/10 py-7 md:py-9">
        <div data-marquee className="flex w-max gap-10 whitespace-nowrap text-[clamp(2.2rem,5.5vw,5.5rem)] font-semibold tracking-[-0.04em] text-navy">
          {[...about.marquee, ...about.marquee, ...about.marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-10">
              {m}
              <span className="inline-block h-[0.22em] w-[0.22em] rounded-[35%] bg-dot" />
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">Competências: {about.marquee.join(", ")}.</p>
    </section>
  );
}
