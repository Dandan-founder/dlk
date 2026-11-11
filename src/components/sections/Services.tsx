"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { services, type Service } from "@/data/services";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { cn } from "@/lib/utils";
import { splitReveal, useGsap } from "@/lib/gsap";
import { ServiceVisual } from "./ServiceVisual";

function Detail({ s }: { s: Service }) {
  return (
    <div key={s.id} className="animate-[panel-in_.7s_var(--ease-out)_both]">
      <ServiceVisual kind={s.visual} />
      <p className="mt-8 text-[1.05rem] leading-relaxed text-muted">{s.description}</p>
      <ul className="mt-6 grid gap-2.5">
        {s.benefits.map((b) => (
          <li key={b} className="flex items-center gap-3 text-[0.98rem]">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-dot" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={`/orcamento?servico=${s.id}`} magnetic={false}>
          Pedir orçamento
        </ButtonLink>
        <WhatsAppButton message={site.messages.service(s.name)}>Tirar dúvidas</WhatsAppButton>
      </div>
    </div>
  );
}

/**
 * Serviços: lista tipográfica grande + painel fixo (desktop) que troca ao passar o mouse,
 * focar ou clicar. No celular, cada item abre como um acordeão com o mesmo conteúdo.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  useGsap(root, (mm, el) => {
    splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
  }, [], { defer: true });

  return (
    <section ref={root} id="servicos" aria-labelledby="servicos-title" className="grain relative bg-void py-28 md:py-40">
      <div className="mx-auto max-w-[1800px] px-[var(--gutter)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="servicos-title" data-split data-hide className="display text-[clamp(2.8rem,7vw,7.6rem)]">
              O que a DLK
              <br />
              faz por você
            </h2>
          </div>
          <p data-reveal className="measure text-[1.05rem] leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
            Sete formas de colocar o seu negócio no lugar certo da internet. Todas com design autoral, código moderno e entrega acompanhada de perto.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12">
          <ol className="border-t border-line lg:col-span-7">
            {services.map((s, i) => {
              const on = active === i;
              const openM = openMobile === i;
              return (
                <li key={s.id} id={`servico-${s.id}`} data-reveal className="scroll-mt-28 border-b border-line">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => {
                      setActive(i);
                      setOpenMobile((o) => (o === i ? null : i));
                    }}
                    aria-expanded={openM}
                    aria-controls={`servico-painel-${s.id}`}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[3.5rem_1fr_auto] md:py-8"
                  >
                    <span className={cn("font-display text-[1rem] tabular-nums transition-colors", on ? "text-dot" : "text-muted")}>{s.n}</span>
                    <span>
                      <span className={cn("display block text-[clamp(2rem,4.2vw,4.2rem)] transition-[color,transform,translate,rotate,scale] duration-500 ease-[var(--ease-out)]", on ? "translate-x-2 text-text" : "text-text/45 group-hover:text-text/80")}>
                        {s.name}
                      </span>
                      <span className={cn("mt-2 block text-[0.95rem] text-muted transition-opacity duration-500", on ? "opacity-100" : "opacity-0 max-lg:opacity-100")}>{s.line}</span>
                    </span>
                    <span aria-hidden className={cn("grid h-10 w-10 place-items-center rounded-full border transition-[transform,translate,rotate,scale,background-color,border-color,color] duration-500", on ? "rotate-45 border-dot bg-dot text-white" : "border-line-strong text-muted")}>
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  {/* celular: conteúdo abaixo do item */}
                  <div id={`servico-painel-${s.id}`} hidden={!openM} className="pb-10 lg:hidden">
                    {openM && <Detail s={s} />}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* desktop: painel fixo */}
          <aside aria-label="Detalhes do serviço" className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 rounded-3xl border border-line bg-ink p-8 xl:p-10">
              <p className="flex items-center justify-between text-[0.92rem] text-muted">
                <span>{services[active].name}</span>
                <span className="text-dot">{services[active].n}/07</span>
              </p>
              <div className="mt-8">
                <Detail s={services[active]} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
