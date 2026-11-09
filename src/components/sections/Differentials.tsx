"use client";

import { useRef } from "react";
import { differentials } from "@/data/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { gsap, MQ, splitReveal, useGsap } from "@/lib/gsap";

/** Diferenciais: grade editorial clara, números tipográficos gigantes e preenchimento no hover. */
export function Differentials() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, (mm, el) => {
    splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
    mm.add(MQ.motion, () => {
      gsap.from(el.querySelectorAll("[data-cell]"), {
        opacity: 0,
        y: 40,
        duration: 1.1,
        stagger: { each: 0.06, grid: "auto", from: "start" },
        scrollTrigger: { trigger: el.querySelector("[data-grid]"), start: "top 80%", once: true },
      });
    });
  }, [], { defer: true });

  return (
    <section ref={root} id="diferenciais" aria-labelledby="dif-title" className="bg-paper py-28 text-navy md:py-40">
      <div className="mx-auto max-w-[1800px] px-[var(--gutter)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow dark>Por que a DLK</Eyebrow>
            <h2 id="dif-title" data-split data-hide className="display mt-6 text-[clamp(2.8rem,6.8vw,7.4rem)]">
              Detalhes que
              <br />
              <span className="text-muted-dark">fazem diferença</span>
            </h2>
          </div>
          <p className="text-[1.02rem] leading-relaxed text-navy/75 lg:col-span-4 lg:col-start-9">
            Não prometemos primeira posição no Google nem vendas garantidas. Prometemos um site bem feito em cada detalhe técnico e visual, que dá ao seu negócio as melhores condições de ser encontrado e escolhido.
          </p>
        </div>

        <ul data-grid className="mt-16 grid grid-cols-1 border-l border-t border-navy/15 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {differentials.map((d) => (
            <li key={d.n} data-cell className="group relative overflow-hidden border-b border-r border-navy/15 p-7 md:p-9">
              <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-navy transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-y-100" />
              <div className="relative">
                {/* número decorativo via pseudo-elemento (não é texto lido nem avaliado como conteúdo) */}
                <span aria-hidden data-n={d.n} className="block text-[clamp(3.6rem,6vw,5.6rem)] font-bold leading-none tracking-[-0.06em] text-navy/10 transition-colors duration-500 before:content-[attr(data-n)] group-hover:text-dot" />
                <h3 className="mt-10 text-[1.35rem] font-semibold tracking-[-0.02em] transition-colors duration-500 group-hover:text-paper">{d.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-navy/70 transition-colors duration-500 group-hover:text-paper/75">{d.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
