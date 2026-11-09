"use client";

import { useRef } from "react";
import { projects } from "@/data/projects";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { revealBatch, splitReveal, useGsap } from "@/lib/gsap";

/** Vitrine da home: projetos em composição assimétrica + aviso transparente sobre projetos conceito. */
export function Work() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, (mm, el) => {
    splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
    revealBatch(mm, el);
  }, [], { defer: true });
  return (
    <section ref={root} id="projetos" aria-labelledby="projetos-title" className="relative bg-void pb-28 pt-10 md:pb-40">
      <div className="mx-auto max-w-[1800px] px-[var(--gutter)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow>Portfólio</Eyebrow>
            <h2 id="projetos-title" data-split data-hide className="display mt-6 text-[clamp(3rem,8.4vw,9.4rem)]">
              Projetos que
              <br />
              falam por si<span className="text-dot">.</span>
            </h2>
          </div>
          <p data-reveal className="text-[0.98rem] leading-relaxed text-muted lg:col-span-4">
            Estes são <strong className="font-medium text-text">projetos conceito</strong>: sites completos que a DLK criou para mostrar, na prática, o nível do que entregamos. Os negócios e os dados são fictícios; o design, o código e as funcionalidades são reais.
          </p>
        </div>

        <div className="mt-16 grid gap-y-20 md:mt-24 lg:grid-cols-12 lg:gap-x-10">
          {projects.map((p, i) => (
            <div key={p.slug} className={i % 2 === 0 ? "lg:col-span-8" : "lg:col-span-7 lg:col-start-6 lg:-mt-10"}>
              <ProjectCard project={p} index={i} />
            </div>
          ))}
        </div>

        <div data-reveal className="mt-24 flex flex-col items-start justify-between gap-8 border-t border-line pt-10 md:flex-row md:items-center">
          <p className="max-w-xl text-[clamp(1.4rem,2.4vw,2.2rem)] font-semibold leading-tight tracking-[-0.03em]">
            O próximo da lista pode ser <span className="text-dot">o seu negócio.</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/projetos" variant="ghost" arrow={false}>
              Ver todos os projetos
            </ButtonLink>
            <ButtonLink href="/orcamento">Quero um projeto assim</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
