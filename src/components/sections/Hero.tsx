"use client";

import Image from "next/image";
import { useRef } from "react";
import { hero } from "@/data/content";
import { projects } from "@/data/projects";
import { ButtonLink } from "@/components/ui/Button";
import { gsap, MQ, useGsap } from "@/lib/gsap";
import { HeroCanvas } from "./HeroCanvas";

/** Janela de navegador estilizada com a captura real de um projeto. */
function BrowserFrame({ src, alt, label, className }: { src: string; alt: string; label: string; className?: string }) {
  return (
    <figure className={`overflow-hidden rounded-xl border border-white/10 bg-ink shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)] ${className ?? ""}`}>
      <div className="flex h-7 items-center gap-1.5 border-b border-white/10 bg-ink-2 px-3">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-3 truncate font-mono text-[0.6rem] text-muted">{label}</span>
      </div>
      <Image src={src} alt={alt} width={1600} height={1000} sizes="(min-width: 1024px) 34vw, 0px" className="block h-auto w-full" fetchPriority="low" />
    </figure>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [a, b] = projects;

  useGsap(root, (mm, el) => {
    // Rolagem: o título sobe mais devagar que as telas (camadas de profundidade)
    mm.add(MQ.motion, () => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 } })
        .to("[data-hero-title]", { yPercent: -22, ease: "none" }, 0)
        .to("[data-hero-copy]", { yPercent: -40, opacity: 0, ease: "none" }, 0)
        .to("[data-hero-stack]", { yPercent: -18, rotateX: 14, ease: "none" }, 0);
    });
    // Mouse: as telas inclinam em direção ao cursor
    mm.add(MQ.fine, () => {
      const stack = el.querySelector<HTMLElement>("[data-hero-tilt]");
      if (!stack) return;
      const rx = gsap.quickTo(stack, "rotationX", { duration: 1.2, ease: "power3.out" });
      const ry = gsap.quickTo(stack, "rotationY", { duration: 1.2, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        ry((e.clientX / window.innerWidth - 0.5) * 10);
        rx(-(e.clientY / window.innerHeight - 0.5) * 8);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    });
  });

  return (
    <section ref={root} aria-labelledby="hero-title" className="grain relative isolate flex min-h-[100svh] flex-col overflow-clip bg-void">
      <HeroCanvas />
      {/* grade editorial muito sutil */}
      <div aria-hidden className="hairline pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      {/* Telas reais de projetos em perspectiva (desktop) */}
      <div aria-hidden className="pointer-events-none absolute right-[-7vw] top-[13vh] hidden w-[40vw] max-w-[50rem] [perspective:1800px] lg:block">
        <div data-hero-stack className="hero-fade [transform-style:preserve-3d]" style={{ ["--d" as string]: "0.5s" }}>
          <div data-hero-tilt className="relative [transform-style:preserve-3d]">
            <div className="[transform:rotateY(-24deg)_rotateX(10deg)_rotateZ(2deg)]">
              <BrowserFrame src={a.cover.src} alt="" label={`${a.name.toLowerCase().replace(/ /g, "")}.demo`} className="w-[78%] animate-[float_9s_ease-in-out_infinite]" />
              <div className="absolute left-[30%] top-[42%] w-[66%] [transform:translateZ(120px)]">
                <BrowserFrame src={b.cover.src} alt="" label={`${b.name.toLowerCase().replace(/ /g, "")}.demo`} className="animate-[float_11s_ease-in-out_-3s_infinite]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-[var(--gutter)] pb-10 pt-[calc(var(--header-h)+4vh)] md:pb-14">
        <div className="hero-fade flex items-center justify-between gap-6" style={{ ["--d" as string]: "0.1s" }}>
          <p className="eyebrow flex items-center gap-3 text-muted">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-dot" />
            {hero.eyebrow}
          </p>
        </div>

        <h1 id="hero-title" data-hero-title className="display mt-auto pt-16 text-[clamp(3.3rem,11.2vw,12rem)] lg:text-[clamp(5rem,9.4vw,12rem)] text-text">
          <span className="hero-line" style={{ ["--i" as string]: 0 }}>
            <span>{hero.lines[0]}</span>
          </span>
          <span className="hero-line" style={{ ["--i" as string]: 1 }}>
            <span className="text-muted">{hero.lines[1]}</span>
          </span>
          <span className="hero-line" style={{ ["--i" as string]: 2 }}>
            <span>
              {hero.lines[2]}
              <span aria-hidden className="hero-dot ml-[0.04em] inline-block h-[0.17em] w-[0.17em] rounded-[0.075em] bg-dot align-baseline" />
              <span className="sr-only">.</span>
            </span>
          </span>
        </h1>

        <div data-hero-copy className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[minmax(0,32rem)_1fr] md:items-end">
          <p className="hero-fade measure text-[1.05rem] leading-relaxed text-muted md:text-[1.2rem]" style={{ ["--d" as string]: "0.45s" }}>
            {hero.sub}
          </p>
          <div className="hero-fade flex flex-wrap items-center gap-3 md:justify-end" style={{ ["--d" as string]: "0.6s" }}>
            <ButtonLink href="/orcamento" size="lg" data-cta="hero-primary">
              {hero.primary}
            </ButtonLink>
            <ButtonLink href="/projetos" size="lg" variant="ghost" arrow={false}>
              {hero.secondary}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Indicador de rolagem: na borda esquerda, vertical */}
      <div aria-hidden className="hero-fade absolute bottom-0 left-[calc(var(--gutter)/2-0.5px)] z-10 hidden flex-col items-center gap-3 pb-0 md:flex" style={{ ["--d" as string]: "0.9s" }}>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted [writing-mode:vertical-rl]">Role</span>
        <span className="relative h-16 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2s_var(--ease-in-out)_infinite] bg-dot" />
        </span>
      </div>
    </section>
  );
}
