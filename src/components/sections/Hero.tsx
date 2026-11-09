"use client";

import { useRef } from "react";
import { hero } from "@/data/content";
import { ButtonLink } from "@/components/ui/Button";
import { gsap, MQ, useGsap } from "@/lib/gsap";
import { BuildReel } from "./BuildReel";

/**
 * Hero: o título em grotesca condensada e, ao lado, um site se montando ao vivo
 * (esqueleto → página real). A seção fica presa enquanto a próxima sobe por cima como uma folha.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (mm, el) => {
    mm.add(MQ.motion, () => {
      // Quando a folha clara sobe, o hero recua e escurece (profundidade)
      const next = document.getElementById("sobre");
      if (next)
        gsap
          .timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } })
          .to("[data-hero-inner]", { scale: 0.92, yPercent: -4, ease: "none" }, 0)
          .to("[data-hero-shade]", { opacity: 0.65, ease: "none" }, 0)
          .to(el.querySelectorAll(".hero-line"), { xPercent: (i: number) => [-14, 9, -6][i] ?? 0, ease: "none" }, 0);
    });
    // O navegador inclina levemente em direção ao cursor
    mm.add(MQ.fine, () => {
      const tilt = el.querySelector<HTMLElement>("[data-hero-tilt]");
      if (!tilt) return;
      const rx = gsap.quickTo(tilt, "rotationX", { duration: 1.4, ease: "power3.out" });
      const ry = gsap.quickTo(tilt, "rotationY", { duration: 1.4, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        ry((e.clientX / window.innerWidth - 0.5) * 7);
        rx(-(e.clientY / window.innerHeight - 0.5) * 5);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    });
  });

  return (
    <section ref={root} aria-labelledby="hero-title" className="sticky top-0 isolate h-[100svh] min-h-[44rem] overflow-clip bg-ink max-lg:min-h-[46rem]">
      <div data-hero-inner className="relative h-full origin-top will-change-transform">
        {/* grade de planta: o site nasce de uma estrutura */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(214,224,245,.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(214,224,245,.055)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_70%_at_70%_40%,black,transparent_80%)]"
        />
        <div className="relative mx-auto grid h-full max-w-[1800px] grid-rows-[1fr_auto_auto] gap-6 px-[var(--gutter)] pb-6 pt-[calc(var(--header-h)+1rem)] lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-x-10 lg:gap-y-8 lg:pb-12 lg:pt-[calc(var(--header-h)+1.5rem)]">
          {/* Site se montando */}
          <div className="flex items-center lg:col-span-6 lg:col-start-7 lg:row-start-1 [perspective:1600px]">
            <div data-hero-tilt className="hero-fade w-full [transform-style:preserve-3d]" style={{ ["--d" as string]: "0.35s" }}>
              <BuildReel />
            </div>
          </div>

          {/* Título */}
          <div className="flex flex-col justify-end lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:justify-center">
            <h1 id="hero-title" className="display text-[clamp(3.6rem,16vw,6.4rem)] text-text lg:text-[clamp(5rem,8.4vw,10.5rem)]">
              {hero.lines.map((l, i) => (
                <span key={l} className="hero-line" style={{ ["--i" as string]: i }}>
                  <span>
                    {l}
                    {i === hero.lines.length - 1 && (
                      <>
                        <span aria-hidden className="hero-dot ml-[0.05em] inline-block h-[0.16em] w-[0.16em] rounded-[0.07em] bg-dot align-baseline" />
                        <span className="sr-only">.</span>
                      </>
                    )}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          {/* Proposta + ações */}
          <div className="grid gap-5 border-t border-line pt-5 lg:col-span-12 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pt-8">
            <p className="hero-fade max-w-[34rem] text-[1.02rem] leading-relaxed text-muted lg:col-span-5 lg:text-[1.15rem]" style={{ ["--d" as string]: "0.5s" }}>
              {hero.sub}
            </p>
            <div className="hero-fade flex flex-wrap items-center gap-3 lg:col-span-7 lg:justify-end" style={{ ["--d" as string]: "0.6s" }}>
              <p className="mr-3 hidden max-w-[17rem] text-[0.88rem] leading-snug text-muted xl:block">{hero.note}</p>
              <ButtonLink href="/orcamento" size="lg" magnetic>
                {hero.primary}
              </ButtonLink>
              <ButtonLink href="/projetos" size="lg" variant="ghost">
                {hero.secondary}
              </ButtonLink>
            </div>
          </div>
        </div>
        <div data-hero-shade aria-hidden className="pointer-events-none absolute inset-0 bg-void opacity-0" />
      </div>
    </section>
  );
}
