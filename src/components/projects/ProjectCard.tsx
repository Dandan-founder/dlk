"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { gsap, MQ, useGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function KindBadge({ kind, className }: { kind: Project["kind"]; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.8rem]", kind === "conceito" ? "border-white/25 bg-void/85 text-text" : "border-dot/60 bg-void/85 text-text", className)}>
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", kind === "conceito" ? "bg-white/70" : "bg-dot")} />
      {kind === "conceito" ? "Projeto conceito" : "Cliente"}
    </span>
  );
}

/**
 * Cartão de projeto: abre por máscara ao entrar e, com o mouse em cima, o site inteiro rola dentro da moldura
 * (captura de página inteira; 100cqh = altura da moldura). O cursor vira "Ver case".
 */
export function ProjectCard({ project: p, size = "lg", headingLevel = 3 }: { project: Project; index?: number; size?: "lg" | "md"; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const root = useRef<HTMLElement>(null);
  useGsap(root, (mm, el) => {
    mm.add(MQ.motion, () => {
      // abertura só com transform: a moldura cresce e a imagem de dentro "desinfla" (sem clip-path, que repinta a cada quadro)
      const frame = el.querySelector("[data-frame]");
      const imgs = el.querySelectorAll("[data-frame] img");
      const st = { trigger: el, start: "top 85%", once: true };
      gsap.fromTo(frame, { scale: 0.86 }, { scale: 1, duration: 1.4, ease: "expo.out", scrollTrigger: st });
      gsap.fromTo(imgs, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: "expo.out", scrollTrigger: st });
    });
  }, [], { defer: true });

  return (
    <article ref={root} className="group">
      <Link href={`/projetos/${p.slug}`} data-cursor="view" data-cursor-label="Ver case" className="block">
        <div data-frame className={cn("relative overflow-hidden rounded-[1.75rem] bg-ink-2 [container-type:size]", size === "lg" ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[4/3]")}>
          {/* telas de toque: só a capa, leve */}
          <Image src={p.cover.src} alt={p.cover.alt} fill sizes="100vw" className="object-cover object-top [@media(hover:hover)_and_(pointer:fine)]:hidden" />
          {/* com mouse: a página inteira; no hover desce até o rodapé em ~6 s e, ao sair, volta ao topo */}
          <div className="absolute inset-x-0 top-0 hidden [@media(hover:hover)_and_(pointer:fine)]:block transition-transform duration-[1.1s] ease-[var(--ease-in-out)] group-hover:translate-y-[calc(-100%+100cqh)] group-hover:duration-[6.5s] group-hover:ease-[cubic-bezier(.45,0,.25,1)] motion-reduce:!translate-y-0">
            <Image src={p.full.src} alt="" width={p.full.w} height={p.full.h} sizes={size === "lg" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 768px) 50vw, 100vw"} className="block h-auto w-full" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-0" />
          <span aria-hidden className="absolute bottom-5 left-5 rounded-full bg-void/85 px-3 py-1 text-[0.8rem] text-text/85 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:bottom-7 md:left-7">
            Percorrendo o site
          </span>
          <div className="absolute left-5 top-5 flex flex-wrap gap-2 md:left-7 md:top-7">
            <KindBadge kind={p.kind} />
            <span className="rounded-full border border-white/15 bg-void/85 px-3 py-1 text-[0.8rem] text-text/85">{p.category}</span>
          </div>
          {/* celular de canto, com a versão mobile */}
          <div aria-hidden className="absolute bottom-[-12%] right-[5%] hidden w-[17%] translate-y-6 overflow-hidden rounded-[1.4rem] border-[5px] border-[#0b0f1b] shadow-2xl transition-transform duration-700 ease-[var(--ease-out)] group-hover:-translate-y-4 md:block">
            <Image src={p.mobile.src} alt="" width={p.mobile.w} height={p.mobile.h} sizes="12vw" className="h-auto w-full" />
          </div>
        </div>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-[0.88rem] text-muted">
              {p.category}, {p.year}
            </p>
            <H className="display mt-2 text-[clamp(2rem,3.6vw,3.4rem)]">{p.name}</H>
            <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-muted">{p.summary}</p>
            <span className="sr-only">Ver estudo de caso</span>
          </div>
          <span aria-hidden className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line-strong transition-[transform,translate,rotate,scale,background-color,border-color,color] duration-500 group-hover:rotate-45 group-hover:border-dot group-hover:bg-dot">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
