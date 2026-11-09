"use client";

import { useRef } from "react";
import { about } from "@/data/content";
import { gsap, MQ, splitReveal, useGsap } from "@/lib/gsap";

/**
 * Sobre: folha clara que sobe por cima do hero (cantos arredondados que se endireitam).
 * Composição editorial assimétrica, sem cartões. O ponto da marca acompanha a rolagem.
 */
export function About() {
  const root = useRef<HTMLElement>(null);
  useGsap(
    root,
    (mm, el) => {
      splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
      mm.add(MQ.motion, () => {
        gsap.fromTo(el, { borderTopLeftRadius: "3.5rem", borderTopRightRadius: "3.5rem" }, { borderTopLeftRadius: "0rem", borderTopRightRadius: "0rem", ease: "none", scrollTrigger: { trigger: el, start: "top 60%", end: "top top", scrub: true } });
        gsap.fromTo("[data-about-dot]", { scale: 0.35, yPercent: -40 }, { scale: 1, yPercent: 60, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
    },
    [],
    { defer: true },
  );

  return (
    <section
      ref={root}
      id="sobre"
      aria-labelledby="sobre-title"
      className="relative z-10 overflow-clip rounded-t-[2rem] bg-paper text-navy shadow-[0_-40px_80px_-20px_rgba(0,0,0,.45)] md:rounded-t-[3.5rem]"
    >
      <div className="mx-auto max-w-[1800px] px-[var(--gutter)] pb-24 pt-24 md:pb-36 md:pt-36">
        <div className="relative grid gap-10 lg:grid-cols-12">
          <h2 id="sobre-title" data-split data-hide className="display text-[clamp(3rem,9vw,10rem)] lg:col-span-10">
            {about.title[0]}
            <br />
            {about.title[1]}
          </h2>
          <span aria-hidden data-about-dot className="pointer-events-none absolute right-0 top-[8%] hidden h-[clamp(4rem,9vw,8.5rem)] w-[clamp(4rem,9vw,8.5rem)] rounded-[42%] bg-dot lg:block" />
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <p className="text-[clamp(1.35rem,2.2vw,2rem)] font-medium leading-[1.3] tracking-[-0.015em] lg:col-span-6">{about.lead}</p>
          <dl className="grid gap-10 lg:col-span-5 lg:col-start-8">
            {about.blocks.map((b) => (
              <div key={b.k} className="border-t border-navy/15 pt-5">
                <dt className="font-display text-[1.45rem] font-semibold [font-stretch:85%]">{b.k}</dt>
                <dd className="mt-2 leading-relaxed text-navy/75">{b.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
