"use client";

import { useRef } from "react";
import { differentials } from "@/data/content";
import { gsap, MQ, splitReveal, useGsap } from "@/lib/gsap";

/** Diferenciais: grade editorial clara, números tipográficos gigantes e preenchimento no hover. */
export function Differentials() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, (mm, el) => {
    splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
    mm.add(MQ.motion, () => {
      // folha clara: os cantos se endireitam ao chegar no topo
      gsap.fromTo(el, { borderTopLeftRadius: "3.5rem", borderTopRightRadius: "3.5rem" }, { borderTopLeftRadius: "0rem", borderTopRightRadius: "0rem", ease: "none", scrollTrigger: { trigger: el, start: "top 60%", end: "top top", scrub: true } });
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
    <section ref={root} id="diferenciais" aria-labelledby="dif-title" className="relative z-10 rounded-t-[2rem] bg-paper py-28 text-navy shadow-[0_-40px_80px_-20px_rgba(0,0,0,.45)] md:rounded-t-[3.5rem] md:py-40">
      <div className="mx-auto max-w-[1800px] px-[var(--gutter)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="dif-title" data-split data-hide className="display text-[clamp(2.8rem,6.8vw,7.4rem)]">
              Detalhes que
              <br />
              fazem diferença
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
                <span aria-hidden data-n={d.n} className="display block text-[clamp(4rem,7vw,6.6rem)] text-navy/10 transition-colors duration-500 before:content-[attr(data-n)] group-hover:text-dot" />
                <h3 className="mt-10 font-display text-[1.6rem] font-semibold leading-tight [font-stretch:85%] transition-colors duration-500 group-hover:text-paper">{d.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-navy/70 transition-colors duration-500 group-hover:text-paper/75">{d.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
