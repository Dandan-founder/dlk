import type { Service } from "@/data/services";

/** Ilustrações de interface desenhadas em código (leves, nítidas em qualquer tela, sem imagens de banco). */
const bar = "rounded-full bg-white/15";

function Frame({ children, phone = false }: { children: React.ReactNode; phone?: boolean }) {
  return (
    <div className={`relative overflow-hidden border border-white/10 bg-[#0d1528] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)] ${phone ? "mx-auto aspect-[9/17] w-[46%] rounded-[1.6rem] p-3" : "aspect-[16/11] w-full rounded-xl"}`}>
      {!phone && (
        <div className="flex h-6 items-center gap-1 border-b border-white/10 px-3">
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>
      )}
      {children}
    </div>
  );
}

export function ServiceVisual({ kind }: { kind: Service["visual"] }) {
  switch (kind) {
    case "institucional":
      return (
        <Frame>
          <div className="grid h-[calc(100%-1.5rem)] grid-cols-5 gap-3 p-5">
            <div className="col-span-3 flex flex-col justify-end gap-2.5">
              <span className="h-5 w-[90%] rounded bg-white/85 sv-in" />
              <span className="h-5 w-[70%] rounded bg-white/85 sv-in [animation-delay:.08s]" />
              <span className={`mt-2 h-2 w-[80%] ${bar}`} />
              <span className={`h-2 w-[60%] ${bar}`} />
              <span className="mt-3 h-7 w-24 rounded-full bg-dot sv-in [animation-delay:.2s]" />
            </div>
            <div className="col-span-2 rounded-lg bg-gradient-to-br from-navy to-[#22355e] sv-in [animation-delay:.12s]" />
          </div>
        </Frame>
      );
    case "landing":
      return (
        <Frame>
          <div className="flex h-[calc(100%-1.5rem)] flex-col items-center justify-center gap-3 p-6 text-center">
            <span className={`h-2 w-20 ${bar}`} />
            <span className="h-6 w-[70%] rounded bg-white/85 sv-in" />
            <span className="h-6 w-[50%] rounded bg-white/85 sv-in [animation-delay:.08s]" />
            <span className="relative mt-4 h-10 w-40 rounded-full bg-dot sv-in [animation-delay:.18s]">
              <span className="absolute inset-0 animate-[ping_2.2s_ease-out_infinite] rounded-full bg-dot/40" />
            </span>
            <span className="mt-3 flex gap-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-10 w-16 rounded-md border border-white/10 bg-white/5" />
              ))}
            </span>
          </div>
        </Frame>
      );
    case "local":
      return (
        <Frame phone>
          <div className="relative h-[45%] overflow-hidden rounded-xl bg-[#14203a]">
            <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full opacity-60" aria-hidden>
              <path d="M0 30 L100 22 M0 55 L100 62 M30 0 L38 80 M70 0 L64 80" stroke="#2b3d66" strokeWidth="5" fill="none" />
            </svg>
            <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-full rounded-full rounded-bl-none bg-dot [transform:rotate(-45deg)] sv-pin" />
          </div>
          <div className="mt-3 space-y-1.5">
            {["Seg–Sex", "Sábado", "Domingo"].map((d, i) => (
              <div key={d} className="flex justify-between text-[0.5rem] text-white/60">
                <span>{d}</span>
                <span>{i === 2 ? "Fechado" : "09h–19h"}</span>
              </div>
            ))}
          </div>
          <span className="absolute inset-x-3 bottom-3 grid h-8 place-items-center rounded-full bg-[#25d366] text-[0.55rem] font-semibold text-[#062d16]">WhatsApp</span>
        </Frame>
      );
    case "ecommerce":
      return (
        <Frame>
          <div className="grid h-[calc(100%-1.5rem)] grid-cols-3 gap-3 p-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-1.5 sv-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="flex-1 rounded-md bg-gradient-to-br from-[#1b2a4a] to-[#2a3f6b]" />
                <span className={`h-1.5 w-[70%] ${bar}`} />
                <span className="h-1.5 w-[35%] rounded-full bg-dot/80" />
              </div>
            ))}
          </div>
          <span className="absolute right-3 top-1 grid h-5 w-5 place-items-center rounded-full bg-dot text-[0.55rem] font-bold text-void sv-pop">2</span>
        </Frame>
      );
    case "agenda":
      return (
        <Frame>
          <div className="grid h-[calc(100%-1.5rem)] grid-cols-[1.2fr_1fr] gap-4 p-4">
            <div className="grid grid-cols-7 content-start gap-1">
              {Array.from({ length: 28 }, (_, i) => (
                <span key={i} className={`aspect-square rounded ${i === 17 ? "bg-dot" : i % 7 > 4 ? "bg-white/5" : "bg-white/10"}`} />
              ))}
            </div>
            <div className="grid content-start gap-1.5">
              {["09:00", "09:45", "10:30", "11:15", "14:00"].map((t, i) => (
                <span key={t} className={`rounded-md border px-2 py-1 text-center font-mono text-[0.55rem] sv-in ${i === 2 ? "border-dot bg-dot/15 text-white" : "border-white/10 text-white/60"}`} style={{ animationDelay: `${i * 0.06}s` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Frame>
      );
    case "redesign":
      return (
        <Frame>
          <div className="relative h-[calc(100%-1.5rem)]">
            <div className="absolute inset-0 grid grid-cols-3 gap-1 bg-[#d9d6cf] p-3 opacity-90">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="bg-[#b9b4a8]" />
              ))}
            </div>
            <div className="sv-wipe absolute inset-0 overflow-hidden">
              <div className="sv-wipe-in absolute inset-0 flex flex-col justify-end gap-2 bg-[#0d1528] p-5">
                <span className="h-5 w-[75%] rounded bg-white/85" />
                <span className="h-5 w-[50%] rounded bg-white/85" />
                <span className="mt-2 h-7 w-24 rounded-full bg-dot" />
              </div>
            </div>
            <span className="sv-wipe-line absolute inset-0">
              <span className="absolute inset-y-0 left-0 w-0.5 bg-dot" />
            </span>
          </div>
        </Frame>
      );
    case "manutencao":
      return (
        <Frame>
          <div className="grid h-[calc(100%-1.5rem)] grid-cols-[1.3fr_1fr] gap-4 p-5">
            <svg viewBox="0 0 120 70" className="h-full w-full" aria-hidden>
              <path d="M0 60 L20 52 L40 55 L60 38 L80 34 L100 18 L120 10" fill="none" stroke="#F26A1C" strokeWidth="2.5" pathLength={1} className="sv-draw" />
              <path d="M0 60 L20 52 L40 55 L60 38 L80 34 L100 18 L120 10 L120 70 L0 70Z" fill="url(#g)" opacity=".25" />
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#F26A1C" />
                  <stop offset="1" stopColor="#F26A1C" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <ul className="grid content-center gap-2">
              {["Conteúdo", "Segurança", "Velocidade", "Novas páginas"].map((t, i) => (
                <li key={t} className="flex items-center gap-2 text-[0.6rem] text-white/70 sv-in" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
                  <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-dot text-[0.45rem] text-void">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Frame>
      );
  }
}
