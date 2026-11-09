"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 1 });
}

export { gsap, ScrollTrigger, SplitText };

/** Media queries de movimento: anime dentro de mm.add(MQ.motion, ...) para respeitar o usuário. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  fine: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
} as const;

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * GSAP com escopo no elemento e limpeza automática (matchMedia.revert) ao desmontar.
 */
export function useGsap(scope: RefObject<HTMLElement | null>, setup: (mm: gsap.MatchMedia, el: HTMLElement) => void, deps: unknown[] = [], opts: { defer?: boolean } = {}) {
  useIso(() => {
    const el = scope.current;
    if (!el) return;
    let mm: gsap.MatchMedia | undefined;
    const run = () => {
      mm = gsap.matchMedia(el);
      setup(mm, el);
    };
    if (!opts.defer) {
      run();
      return () => mm?.revert();
    }
    // Seções abaixo da dobra: prepara as animações num momento ocioso (menos bloqueio no carregamento)
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const id = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 1500 }) : window.setTimeout(run, 200);
    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
      mm?.revert();
    };
  }, deps);
}

/** Revela títulos linha a linha por máscara quando entram na tela. */
export function splitReveal(mm: gsap.MatchMedia, targets: Element[], opts: { delay?: number; scroll?: boolean; stagger?: number } = {}) {
  mm.add(MQ.motion, () => {
    const splits = targets.map((t) =>
      SplitText.create(t, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) => {
          (t as HTMLElement).style.opacity = "1";
          return gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.25,
            stagger: opts.stagger ?? 0.09,
            delay: opts.delay ?? 0,
            scrollTrigger: opts.scroll === false ? undefined : { trigger: t, start: "top 88%", once: true },
          });
        },
      }),
    );
    return () => splits.forEach((s) => s.revert());
  });
}

/** Entrada padrão para [data-reveal]: sobe e aparece, em lote. */
export function revealBatch(mm: gsap.MatchMedia, el: HTMLElement) {
  mm.add(MQ.motion, () => {
    const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
    // opacity (não visibility): o conteúdo segue no leitor de tela e no Tab antes de aparecer
    gsap.set(items, { opacity: 0, y: 28 });
    ScrollTrigger.batch(items, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.07, overwrite: true }),
    });
    // Foco pelo teclado num item ainda não revelado: revela na hora
    const onFocus = (e: FocusEvent) => {
      const item = (e.target as Element).closest?.("[data-reveal]");
      if (item) gsap.to(item, { opacity: 1, y: 0, duration: 0.4, overwrite: true });
    };
    el.addEventListener("focusin", onFocus);
    return () => el.removeEventListener("focusin", onFocus);
  });
}
