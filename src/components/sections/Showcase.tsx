"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { segments } from "@/data/showcase";
import { projectBySlug } from "@/data/projects";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MiniSite } from "@/components/showcase/MiniSite";
import { splitReveal, useGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Device = "desktop" | "mobile";

/**
 * "Imagine seu negócio assim": abas por segmento (setas do teclado navegam), alternância desktop/celular
 * e uma prévia por segmento. Capturas reais quando há projeto conceito; prévia de layout identificada nos demais.
 */
export function Showcase() {
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [i, setI] = useState(0);
  const [device, setDevice] = useState<Device>("desktop");
  const seg = segments[i];
  const project = seg.preview.kind === "shots" ? projectBySlug(seg.preview.projectSlug) : null;

  useGsap(root, (mm, el) => {
    splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
  }, [], { defer: true });

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + segments.length) % segments.length;
    setI(n);
    tabs.current[n]?.focus();
  };

  return (
    <section ref={root} id="modelos" aria-labelledby="modelos-title" className="relative overflow-clip bg-ink py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute -right-[20vw] top-0 h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(242,106,28,.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1800px] px-[var(--gutter)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 id="modelos-title" data-split data-hide className="display text-[clamp(2.8rem,7.6vw,8.4rem)]">
              Imagine seu
              <br />
              negócio assim<span className="text-dot">.</span>
            </h2>
          </div>
          <p data-reveal className="text-[1.02rem] leading-relaxed text-muted lg:col-span-4">
            Escolha um segmento e veja como ele pode ficar. Alterne entre computador e celular: cada site da DLK é pensado para as duas telas.
          </p>
        </div>

        <div data-reveal role="tablist" aria-label="Segmentos" onKeyDown={onKey} className="mt-14 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:mt-20">
          {segments.map((s, k) => (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[k] = el;
              }}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={k === i}
              aria-controls="modelo-painel"
              tabIndex={k === i ? 0 : -1}
              onClick={() => setI(k)}
              className={cn("shrink-0 rounded-full border px-5 py-3 text-[0.92rem] transition-colors duration-300", k === i ? "border-dot bg-dot text-void" : "border-line-strong text-muted hover:border-text/50 hover:text-text")}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div id="modelo-painel" role="tabpanel" aria-labelledby={`tab-${seg.id}`} className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Prévia */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-[0.88rem] text-muted">
                {project ? "Capturas reais do projeto conceito" : "Prévia de layout ilustrativa"}
              </p>
              <div role="group" aria-label="Tamanho da tela" className="flex rounded-full border border-line-strong p-1">
                {(["desktop", "mobile"] as const).map((d) => (
                  <button key={d} type="button" aria-pressed={device === d} onClick={() => setDevice(d)} className={cn("inline-flex h-9 items-center gap-2 rounded-full px-4 text-[0.82rem] transition-colors", device === d ? "bg-text text-void" : "text-muted hover:text-text")}>
                    {d === "desktop" ? <Monitor className="h-4 w-4" aria-hidden /> : <Smartphone className="h-4 w-4" aria-hidden />}
                    {d === "desktop" ? "Computador" : "Celular"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid h-[clamp(26rem,52vw,40rem)] place-items-center rounded-3xl border border-line bg-void/60 p-4 md:p-8">
              <div
                key={seg.id + device}
                className={cn(
                  "animate-[panel-in_.7s_var(--ease-out)_both] overflow-hidden border border-white/10 bg-ink-2 shadow-[0_40px_100px_-40px_rgba(0,0,0,.9)]",
                  device === "desktop" ? "aspect-[16/10] w-full max-w-full rounded-xl" : "h-full max-h-full w-auto aspect-[390/844] rounded-[2rem] border-[6px] border-[#0b0f1b]",
                )}
              >
                {project ? (
                  <Image
                    src={device === "desktop" ? project.cover.src : project.mobile.src}
                    alt={device === "desktop" ? project.cover.alt : project.mobile.alt}
                    width={device === "desktop" ? project.cover.w : project.mobile.w}
                    height={device === "desktop" ? project.cover.h : project.mobile.h}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <MiniSite id={seg.id as "clinica" | "loja" | "escritorio"} />
                )}
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div key={seg.id} className="animate-[panel-in_.7s_var(--ease-out)_both] lg:col-span-4 lg:pt-12">
            <p className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{seg.title}</p>
            <p className="mt-4 leading-relaxed text-muted">{seg.text}</p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {seg.features.map((f) => (
                <li key={f} className="flex items-center justify-between py-3.5 text-[0.98rem]">
                  {f}
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-dot/80" />
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/orcamento?segmento=${seg.id}`} magnetic={false}>
                Quero um site assim
              </ButtonLink>
              <WhatsAppButton message={site.messages.showcase(seg.label)}>Conversar</WhatsAppButton>
            </div>
            {project && (
              <Link href={`/projetos/${project.slug}`} className="mt-6 inline-block text-[0.92rem] text-muted underline decoration-line-strong underline-offset-8 hover:text-text">
                Ver o estudo de caso {project.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
