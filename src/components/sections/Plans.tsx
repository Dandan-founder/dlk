"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { plans } from "@/data/content";
import { site } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { revealBatch, splitReveal, useGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Planos: três formatos de serviço; preços configuráveis em src/data/content.ts (null = sob consulta). */
export function Plans() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, (mm, el) => {
    splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
    revealBatch(mm, el);
  }, [], { defer: true });

  return (
    <section ref={root} id="planos" aria-labelledby="planos-title" className="relative bg-void py-28 md:py-40">
      <div className="mx-auto max-w-[1800px] px-[var(--gutter)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Planos</Eyebrow>
            <h2 id="planos-title" data-split data-hide className="display mt-6 text-[clamp(2.8rem,6.8vw,7.4rem)]">
              Um formato
              <br />
              para cada fase<span className="text-dot">.</span>
            </h2>
          </div>
          <p data-reveal className="text-[1.02rem] leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
            Todo projeto recebe uma proposta personalizada, com escopo, prazo e investimento definidos antes de começar. Os planos ajudam a entender por onde começar.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:mt-24 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.id}
              data-reveal
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-[transform,border-color] duration-700 ease-[var(--ease-out)] hover:-translate-y-2 md:p-10",
                p.highlight ? "border-dot/60 bg-gradient-to-b from-navy to-ink" : "border-line bg-ink",
              )}
            >
              {p.highlight && <span className="absolute right-6 top-6 rounded-full bg-dot px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-void">Mais completo</span>}
              <h3 className="text-[clamp(2.6rem,4vw,3.6rem)] font-bold leading-none tracking-[-0.05em]">
                {p.name}
                <span className="text-dot">.</span>
              </h3>
              <p className="mt-4 min-h-[3.2em] text-[1.02rem] leading-relaxed text-muted">{p.tagline}</p>
              <p className="mt-8 border-y border-line py-5">
                <span className="block font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">Investimento</span>
                <span className="mt-1 block text-[1.5rem] font-semibold tracking-[-0.02em]">{p.price ?? "Sob consulta"}</span>
              </p>
              <ul className="mt-8 grid flex-1 content-start gap-3.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[0.98rem]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-dot" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-3">
                <ButtonLink href={`/orcamento?plano=${p.id}`} variant={p.highlight ? "primary" : "light"} magnetic={false} className="w-full">
                  Solicitar orçamento
                </ButtonLink>
                <WhatsAppButton message={site.messages.plans(p.name)} magnetic={false} className="w-full">
                  Conversar sobre meu projeto
                </WhatsAppButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
