"use client";

import { useRef, useState } from "react";
import { process } from "@/data/content";
import { gsap, MQ, ScrollTrigger, splitReveal, useGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Processo: título e contador fixos à esquerda; à direita, a linha do tempo se preenche com a rolagem
 * e cada etapa acende quando passa pelo centro da tela.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);

  useGsap(root, (mm, el) => {
    splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
    mm.add(MQ.motion, () => {
      const list = el.querySelector("[data-steps]");
      gsap.fromTo("[data-progress]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 55%", end: "bottom 55%", scrub: 0.3 } });
    });
    // Etapa ativa (também com movimento reduzido: é informação, não decoração). Dentro do mm: desfeito ao sair.
    mm.add("(min-width: 0px)", () => {
      el.querySelectorAll<HTMLElement>("[data-step]").forEach((s, i) =>
        ScrollTrigger.create({ trigger: s, start: "top 58%", end: "bottom 58%", onToggle: (self) => self.isActive && setCurrent(i) }),
      );
    });
  }, [], { defer: true });

  return (
    <section ref={root} id="processo" aria-labelledby="processo-title" className="grain relative bg-void py-28 md:py-40">
      <div className="mx-auto grid max-w-[1800px] gap-16 px-[var(--gutter)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 id="processo-title" data-split data-hide className="display text-[clamp(2.8rem,6.4vw,7rem)]">
              Da ideia
              <br />
              ao digital<span className="text-dot">.</span>
            </h2>
            <p className="mt-8 max-w-md leading-relaxed text-muted">Um processo claro, com você aprovando cada etapa. Sem surpresas no meio do caminho.</p>
            <div aria-hidden className="mt-12 hidden items-end gap-4 lg:flex">
              <span className="relative block h-[clamp(6rem,10vw,10rem)] overflow-hidden text-[clamp(6rem,10vw,10rem)] font-bold leading-none tracking-[-0.06em]">
                <span className="block transition-transform duration-700 ease-[var(--ease-out)]" style={{ transform: `translateY(-${(current * 100) / process.length}%)` }}>
                  {process.map((p) => (
                    <span key={p.n} className="block h-[clamp(6rem,10vw,10rem)]">
                      {p.n}
                    </span>
                  ))}
                </span>
              </span>
              <span className="mb-3 text-[0.95rem] text-muted">de 06</span>
            </div>
          </div>
        </div>

        <ol data-steps className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden className="absolute bottom-0 left-[0.45rem] top-0 w-px bg-line" />
          <span aria-hidden data-progress className="absolute bottom-0 left-[0.45rem] top-0 w-px origin-top bg-dot" />
          {process.map((p, i) => (
            <li key={p.n} data-step className="relative pb-16 pl-12 last:pb-0 md:pb-24 md:pl-16">
              <span aria-hidden className={cn("absolute left-0 top-2 h-[0.95rem] w-[0.95rem] rounded-full border-2 transition-[background-color,border-color,box-shadow] duration-500", i <= current ? "border-dot bg-dot shadow-[0_0_0_6px_rgba(242,106,28,.15)]" : "border-line-strong bg-void")} />
              <p className="font-display text-[1.05rem] tabular-nums text-dot">{p.n}</p>
              <h3 className={cn("mt-3 text-[clamp(1.9rem,3.6vw,3.4rem)] font-semibold leading-none tracking-[-0.04em] transition-colors duration-500", i === current ? "text-text" : "text-text/40")}>{p.title}</h3>
              <p className={cn("mt-4 max-w-lg text-[1.05rem] leading-relaxed transition-colors duration-500", i === current ? "text-muted" : "text-muted/80")}>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
