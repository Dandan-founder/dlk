"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGsap } from "@/lib/gsap";

/**
 * Faixa gigante que corre sozinha e reage à rolagem: acelera, inverte o sentido e inclina
 * conforme a velocidade de quem rola. Tudo em transform (sem layout), via ticker do GSAP.
 */
export function VelocityMarquee({ items, tone = "dark" }: { items: string[]; tone?: "dark" | "dot" }) {
  const root = useRef<HTMLElement>(null);
  useGsap(
    root,
    (mm, el) => {
      mm.add(MQ.motion, () => {
        const tracks = Array.from(el.querySelectorAll<HTMLElement>("[data-track]"));
        const xs = tracks.map(() => 0);
        let dir = 1;
        let boost = 0;
        const skew = gsap.quickTo(el.querySelector("[data-skew]"), "skewX", { duration: 0.5, ease: "power3.out" });
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            dir = self.direction;
            boost = Math.min(Math.abs(v) / 120, 18);
            skew(gsap.utils.clamp(-12, 12, v / -260));
          },
        });
        let visible = false;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(el);
        const tick = (_t: number, dt: number) => {
          if (!visible) return;
          boost *= 0.94;
          tracks.forEach((tr, i) => {
            const sign = i % 2 ? -1 : 1;
            xs[i] -= sign * dir * (0.035 + boost * 0.012) * dt;
            const w = tr.scrollWidth / 2;
            xs[i] = ((xs[i] % w) - w) % w;
            tr.style.transform = `translate3d(${xs[i]}px,0,0)`;
          });
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          io.disconnect();
          st.kill();
        };
      });
    },
    [],
    { defer: true },
  );

  const row = (k: number) => (
    <div data-track className="flex w-max will-change-transform">
      {[0, 1].map((dup) => (
        <div key={dup} aria-hidden={dup === 1 || k === 1} className="flex shrink-0 items-center">
          {items.map((t) => (
            <span key={t + dup} className="flex items-center whitespace-nowrap">
              <span className={`display px-[0.35em] text-[clamp(3.6rem,12vw,13rem)] ${k === 1 ? (tone === "dot" ? "text-transparent [-webkit-text-stroke:1.5px_#0d182e]" : "text-transparent [-webkit-text-stroke:1.5px_rgba(244,245,248,.55)]") : ""}`}>{t}</span>
              <span aria-hidden className={`inline-block h-[clamp(0.9rem,2.6vw,2.8rem)] w-[clamp(0.9rem,2.6vw,2.8rem)] rounded-[38%] ${tone === "dot" ? "bg-void" : "bg-dot"}`} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <section ref={root} aria-label="O que entregamos" className={`relative overflow-clip py-14 md:py-20 ${tone === "dot" ? "bg-dot text-void" : "bg-void text-text"}`}>
      <div data-skew className="flex flex-col gap-2 will-change-transform md:gap-4">
        {row(0)}
        {row(1)}
      </div>
    </section>
  );
}
