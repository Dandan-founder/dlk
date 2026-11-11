"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MQ } from "@/lib/gsap";

type Mode = "default" | "link" | "view" | "hidden";

/**
 * Cursor da DLK: o ponto laranja da marca + um anel que o segue com atraso.
 * - Links e botões: o anel cresce, o ponto some.
 * - [data-cursor="view"] (projetos): o anel vira um círculo com o texto do atributo data-cursor-label.
 * - Campos de texto: volta o cursor do sistema.
 * Só em dispositivos com mouse e sem preferência por movimento reduzido.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("hidden");
  const [label, setLabel] = useState("Ver");

  useEffect(() => {
    const mq = window.matchMedia(MQ.fine);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const t = e.target as Element | null;
      if (!t || !(t instanceof Element)) return;
      if (t.closest("input, textarea, select, [contenteditable='true']")) return setMode("hidden");
      const view = t.closest<HTMLElement>("[data-cursor='view']");
      if (view) {
        setLabel(view.dataset.cursorLabel ?? "Ver");
        return setMode("view");
      }
      if (t.closest("a, button, [role='button'], label, summary, [data-cursor='link']")) return setMode("link");
      setMode("default");
    };
    const onLeave = () => setMode("hidden");
    const onDown = () => gsap.to(ring.current, { scale: 0.85, duration: 0.15 });
    const onUp = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "back.out(3)" });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = { default: 36, link: 64, view: 104, hidden: 36 }[mode];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className="grid place-items-center rounded-full border transition-[transform,background-color,border-color,opacity] duration-500 ease-[var(--ease-out)]"
          style={{
            // tamanho fixo e escala (transform) em vez de animar width/height; a borda compensa a escala
            width: 104,
            height: 104,
            transform: `translate(-50%, -50%) scale(${ringSize / 104})`,
            borderWidth: 104 / ringSize,
            opacity: mode === "hidden" ? 0 : 1,
            borderColor: mode === "view" ? "transparent" : mode === "link" ? "rgba(242,106,28,.8)" : "rgba(244,245,248,.35)",
            backgroundColor: mode === "view" ? "var(--dot)" : mode === "link" ? "rgba(242,106,28,.08)" : "transparent",
          }}
        >
          <span className={`text-[0.85rem] font-medium text-void transition-opacity duration-300 ${mode === "view" ? "opacity-100" : "opacity-0"}`}>{label}</span>
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0">
        <div className={`h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-dot transition-[transform,translate,rotate,scale,opacity] duration-300 ${mode === "default" ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
      </div>
    </div>
  );
}
