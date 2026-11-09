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
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] backdrop-blur", kind === "conceito" ? "border-white/25 bg-void/60 text-text" : "border-dot/60 bg-dot/15 text-text", className)}>
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", kind === "conceito" ? "bg-white/70" : "bg-dot")} />
      {kind === "conceito" ? "Projeto conceito" : "Cliente"}
    </span>
  );
}

/**
 * Cartão de projeto: imagem grande com parallax interno, revelação por máscara ao entrar e zoom no hover.
 * O cursor vira "Ver case" (data-cursor="view").
 */
export function ProjectCard({ project: p, index = 0, size = "lg", headingLevel = 3 }: { project: Project; index?: number; size?: "lg" | "md"; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const root = useRef<HTMLElement>(null);
  useGsap(root, (mm, el) => {
    mm.add(MQ.motion, () => {
      const frame = el.querySelector("[data-frame]");
      const img = el.querySelector("[data-img]");
      gsap.fromTo(frame, { clipPath: "inset(14% 8% 14% 8% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      gsap.fromTo(img, { yPercent: -7, scale: 1.18 }, { yPercent: 7, scale: 1.08, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }, [], { defer: true });

  return (
    <article ref={root} className="group">
      <Link href={`/projetos/${p.slug}`} data-cursor="view" data-cursor-label="Ver case" className="block">
        <div data-frame className={cn("relative overflow-hidden rounded-3xl bg-ink-2", size === "lg" ? "aspect-[4/3] md:aspect-[16/10]" : "aspect-[4/3]")}>
          <div data-img className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]">
            <Image src={p.cover.src} alt={p.cover.alt} fill sizes={size === "lg" ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 768px) 50vw, 100vw"} className="object-cover object-top" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
          <div className="absolute left-5 top-5 flex flex-wrap gap-2 md:left-7 md:top-7">
            <KindBadge kind={p.kind} />
            <span className="rounded-full border border-white/15 bg-void/50 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-text/80 backdrop-blur">{p.category}</span>
          </div>
          {/* celular de canto, com a versão mobile */}
          <div aria-hidden className="absolute bottom-[-12%] right-[5%] hidden w-[17%] translate-y-6 overflow-hidden rounded-[1.4rem] border-[5px] border-[#0b0f1b] shadow-2xl transition-transform duration-700 ease-[var(--ease-out)] group-hover:-translate-y-4 md:block">
            <Image src={p.mobile.src} alt="" width={p.mobile.w} height={p.mobile.h} sizes="12vw" className="h-auto w-full" />
          </div>
        </div>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-xs text-muted">
              {String(index + 1).padStart(2, "0")} · {p.year}
            </p>
            <H className="mt-2 text-[clamp(1.6rem,3vw,2.8rem)] font-semibold leading-none tracking-[-0.035em]">{p.name}</H>
            <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-muted">{p.summary}</p>
            <span className="sr-only">Ver estudo de caso</span>
          </div>
          <span aria-hidden className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-45 group-hover:border-dot group-hover:bg-dot">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
