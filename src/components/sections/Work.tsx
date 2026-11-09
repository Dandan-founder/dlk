"use client";

import { useRef } from "react";
import { projects } from "@/data/projects";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { gsap, MQ, ScrollTrigger, splitReveal, useGsap } from "@/lib/gsap";

/**
 * Vitrine da home. No computador, a seção fica presa e os projetos deslizam na horizontal
 * conforme a rolagem (com leve inclinação de profundidade); no celular, lista vertical.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  useGsap(
    root,
    (mm, el) => {
      splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
      mm.add(MQ.desktop, () => {
        const track = el.querySelector<HTMLElement>("[data-track]");
        const pin = el.querySelector<HTMLElement>("[data-pin]");
        if (!track || !pin) return;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: pin, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        tl.to(track, { x: () => -distance(), ease: "none" }, 0);
        // cada painel gira de leve ao entrar e sair do centro (profundidade)
        track.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
          gsap
            .timeline({ scrollTrigger: { containerAnimation: tl, trigger: panel, start: "left right", end: "right left", scrub: true } })
            .fromTo(panel, { rotateY: -12, scale: 0.9 }, { rotateY: 0, scale: 1, ease: "none" })
            .to(panel, { rotateY: 12, scale: 0.9, ease: "none" });
        });
        // o pin entrou depois (momento ocioso): recalcula as posições das outras animações
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    },
    [],
    { defer: true },
  );

  return (
    <section ref={root} id="projetos" aria-labelledby="projetos-title" className="relative bg-void pt-10">
      <div className="mx-auto max-w-[1800px] px-[var(--gutter)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 id="projetos-title" data-split data-hide className="display text-[clamp(3rem,8.4vw,9.4rem)]">
              Projetos que
              <br />
              falam por si<span className="text-dot">.</span>
            </h2>
          </div>
          <p className="text-[0.98rem] leading-relaxed text-muted lg:col-span-4">
            Estes são <strong className="font-medium text-text">projetos conceito</strong>: sites completos que a DLK criou para mostrar, na prática, o nível do que entregamos. Os negócios e os dados são fictícios; o design, o código e as funcionalidades são reais.
          </p>
        </div>
      </div>

      <div data-pin className="pb-24 pt-16 md:pt-24 lg:flex lg:h-[100svh] lg:items-center lg:overflow-hidden lg:py-0">
        <div data-track className="flex flex-col gap-20 px-[var(--gutter)] lg:w-max lg:flex-row lg:items-center lg:gap-[4vw] lg:pr-[12vw] [perspective:1800px]">
          {projects.map((p, i) => (
            <div key={p.slug} data-panel className="lg:w-[62vw] lg:max-w-[1100px]">
              <ProjectCard project={p} index={i} />
            </div>
          ))}
          <div data-panel className="flex min-h-[22rem] flex-col justify-between rounded-[1.75rem] border border-dashed border-line-strong p-8 md:p-12 lg:h-[62vh] lg:w-[34vw]">
            <p className="text-[0.95rem] text-muted">Próximo projeto</p>
            <div>
              <p className="display text-[clamp(2.6rem,4.6vw,5rem)]">
                O próximo pode ser o seu negócio<span className="text-dot">.</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/orcamento">Quero um projeto assim</ButtonLink>
                <ButtonLink href="/projetos" variant="ghost">
                  Ver todos os projetos
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
