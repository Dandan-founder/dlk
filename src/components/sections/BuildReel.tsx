"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * "Da ideia ao digital", ao vivo: dentro de uma janela de navegador, o esqueleto (wireframe) de uma página
 * se desenha e o site real pinta por cima, alternando entre os projetos do portfólio.
 * Pausa fora da tela e na aba oculta; com movimento reduzido, mostra o site pronto, parado.
 */

type Phase = "draw" | "paint" | "hold" | "out";
const DUR: Record<Phase, number> = { draw: 1500, paint: 1000, hold: 2600, out: 700 };
const NEXT: Record<Phase, Phase> = { draw: "paint", paint: "hold", hold: "out", out: "draw" };

/** Esqueleto de cada projeto, no espaço 160×100 da captura (segue o layout real de cada página). */
const wireframes: Record<string, React.ReactNode> = {
  "blackstone-barber-club": (
    <>
      <rect pathLength={1} x="6" y="4.5" width="18" height="3" rx="0.6" />
      <path pathLength={1} d="M58 6h10M72 6h8M84 6h8M96 6h8" />
      <rect pathLength={1} x="134" y="4" width="20" height="4" rx="0.6" />
      <rect pathLength={1} x="96" y="12" width="58" height="84" rx="1" />
      <path pathLength={1} d="M96 12l58 84M154 12l-58 84" />
      <path pathLength={1} d="M8 26h18" />
      <rect pathLength={1} x="8" y="31" width="74" height="9" rx="1" />
      <rect pathLength={1} x="8" y="43" width="56" height="9" rx="1" />
      <rect pathLength={1} x="8" y="55" width="52" height="9" rx="1" />
      <path pathLength={1} d="M8 74h50M8 78h44M8 82h30" />
      <rect pathLength={1} x="8" y="88" width="22" height="5" rx="0.8" />
      <rect pathLength={1} x="33" y="88" width="20" height="5" rx="0.8" />
    </>
  ),
  "brace-pizzaria": (
    <>
      <rect pathLength={1} x="6" y="4.5" width="14" height="3" rx="0.6" />
      <path pathLength={1} d="M62 6h10M76 6h12M92 6h8M104 6h8" />
      <rect pathLength={1} x="138" y="3.8" width="16" height="4.4" rx="2.2" />
      <circle pathLength={1} cx="122" cy="52" r="34" />
      <circle pathLength={1} cx="122" cy="52" r="26" />
      <rect pathLength={1} x="8" y="26" width="46" height="11" rx="1" />
      <rect pathLength={1} x="8" y="40" width="44" height="11" rx="1" />
      <rect pathLength={1} x="8" y="54" width="48" height="11" rx="1" />
      <path pathLength={1} d="M8 72h58M8 76h52M8 80h40" />
      <rect pathLength={1} x="8" y="86" width="16" height="5.5" rx="2.7" />
      <rect pathLength={1} x="27" y="86" width="18" height="5.5" rx="2.7" />
    </>
  ),
};

export function BuildReel({ className }: { className?: string }) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<Phase>("draw");
  const [running, setRunning] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const p = projects[i % projects.length];

  // Só anima com movimento permitido, na tela e com a aba visível
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setPhase("hold");
      return;
    }
    let inView = true;
    // Começa quando a cortina de abertura sobe (senão o esqueleto se desenharia escondido)
    let ready = false;
    const update = () => setRunning(ready && inView && !document.hidden);
    const wait = window.setTimeout(
      () => {
        ready = true;
        update();
      },
      document.documentElement.classList.contains("intro-skip") ? 350 : 1450,
    );
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      window.clearTimeout(wait);
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      if (phase === "out") setI((n) => n + 1);
      setPhase(NEXT[phase]);
    }, DUR[phase]);
    return () => window.clearTimeout(t);
  }, [phase, running]);

  const painted = phase === "paint" || phase === "hold";

  const dur = phase === "out" ? "700ms" : phase === "draw" ? "0ms" : "1000ms";

  return (
    <div ref={root} className={className}>
      <figure className="overflow-hidden rounded-[0.9rem] border border-line-strong bg-void shadow-[0_50px_120px_-50px_rgba(0,0,0,.85)]">
        <div className="flex h-8 items-center gap-3 border-b border-line bg-ink-2/80 px-3.5">
          <span aria-hidden className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-text/25" />
            <span className="h-2 w-2 rounded-full bg-text/25" />
            <span className="h-2 w-2 rounded-full bg-dot" />
          </span>
          <span className="flex h-5 flex-1 items-center rounded-full bg-void/70 px-3 text-[0.68rem] text-muted">
            {p.slug.split("-")[0]}.dlk.demo
          </span>
        </div>
        <div className="relative aspect-[16/10] bg-void">
          {/* esqueleto */}
          <svg key={`wf-${i}`} viewBox="0 0 160 100" aria-hidden className={cn("absolute inset-0 h-full w-full transition-opacity duration-500", phase === "out" ? "opacity-0" : "opacity-100")}>
            <g
              fill="none"
              stroke="rgba(214,224,245,.55)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              className="wf"
              style={{ ["--wf-run" as string]: running || phase !== "draw" ? "running" : "paused" }}
            >
              {wireframes[p.slug]}
            </g>
          </svg>
          {/* site real pintando por cima: cortina feita só com transform (a moldura anda e a imagem anda ao contrário) */}
          <div
            className="absolute inset-0 overflow-hidden transition-transform ease-[var(--ease-in-out)]"
            style={{ transform: `translateX(${painted ? 0 : phase === "out" ? 100 : -100}%)`, transitionDuration: dur }}
          >
            <div
              className="absolute inset-0 transition-transform ease-[var(--ease-in-out)]"
              style={{ transform: `translateX(${painted ? 0 : phase === "out" ? -100 : 100}%)`, transitionDuration: dur }}
            >
              <Image src={p.cover.src} alt={p.cover.alt} fill sizes="(min-width: 1024px) 46vw, 92vw" className="object-cover object-top" priority={i === 0} fetchPriority={i === 0 ? "low" : undefined} />
            </div>
          </div>
          {/* agulha da "pintura" */}
          <span
            aria-hidden
            className="absolute inset-0 transition-[transform,opacity] ease-[var(--ease-in-out)]"
            style={{ transform: `translateX(${painted ? 100 : 0}%)`, opacity: phase === "paint" ? 1 : 0, transitionDuration: phase === "paint" ? "1000ms" : "0ms" }}
          >
            <span className="absolute inset-y-0 left-0 w-px bg-dot shadow-[0_0_24px_4px_rgba(242,106,28,.55)]" />
          </span>
        </div>
      </figure>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[0.88rem] text-muted">
        <span>
          <span className="text-text">{p.name}</span>, projeto conceito
        </span>
        <span className="flex items-center gap-4">
          <span aria-hidden className="flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-300", phase === "draw" ? "bg-dot" : "bg-text/25")} />
            Estrutura
            <span className={cn("ml-2 h-1.5 w-1.5 rounded-full transition-colors duration-300", painted ? "bg-dot" : "bg-text/25")} />
            Site pronto
          </span>
          <Link href={`/projetos/${p.slug}`} className="text-text underline decoration-line-strong underline-offset-4 hover:decoration-dot">
            Ver o case
          </Link>
        </span>
      </figcaption>
    </div>
  );
}
