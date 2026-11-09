import type { Segment } from "@/data/showcase";

/**
 * Prévias de layout desenhadas em código para segmentos que ainda não têm demonstração no ar.
 * São responsivas de verdade (container queries): ao alternar desktop/celular, o layout se reorganiza.
 * Nomes e textos são ilustrativos.
 */
type Theme = { bg: string; fg: string; muted: string; accent: string; card: string; font: string };

const themes: Record<"clinica" | "loja" | "escritorio", Theme> = {
  clinica: { bg: "#f3f6f5", fg: "#14302b", muted: "#5d746f", accent: "#2f8f7a", card: "#ffffff", font: "Georgia, serif" },
  loja: { bg: "#111111", fg: "#f5f2ec", muted: "#a7a29a", accent: "#e8c547", card: "#1c1c1c", font: "inherit" },
  escritorio: { bg: "#f6f3ee", fg: "#1d1a16", muted: "#6c645a", accent: "#7a1f2b", card: "#ffffff", font: "Georgia, serif" },
};

const copy = {
  clinica: {
    brand: "Clínica Aurora",
    nav: ["Especialidades", "Equipe", "Convênios", "Contato"],
    title: "Cuidado que começa com escuta.",
    sub: "Dermatologia, nutrição e fisioterapia em um só lugar, com hora marcada e atendimento humanizado.",
    cta: "Agendar consulta",
    cards: ["Dermatologia", "Nutrição", "Fisioterapia"],
    strip: "Atendemos os principais convênios",
  },
  loja: {
    brand: "NOVE/ATELIÊ",
    nav: ["Novidades", "Coleções", "Acessórios", "Sacola (2)"],
    title: "Coleção de verão, feita em pequenas tiragens.",
    sub: "Peças em linho e algodão orgânico. Frete grátis acima de um valor mínimo e troca fácil.",
    cta: "Ver coleção",
    cards: ["Camisa linho", "Calça pantalona", "Vestido midi"],
    strip: "Pagamento em até 6x · Troca em 30 dias",
  },
  escritorio: {
    brand: "Moraes & Sato Advocacia",
    nav: ["Atuação", "Equipe", "Artigos", "Contato"],
    title: "Segurança jurídica para decisões importantes.",
    sub: "Direito empresarial, trabalhista e contratos, com atendimento próximo e linguagem clara.",
    cta: "Falar com um advogado",
    cards: ["Empresarial", "Trabalhista", "Contratos"],
    strip: "Atendimento presencial e online",
  },
};

export function MiniSite({ id }: { id: Exclude<Segment["id"], "barbearia" | "restaurante"> }) {
  const t = themes[id];
  const c = copy[id];
  return (
    <div className="@container h-full overflow-hidden" style={{ background: t.bg, color: t.fg }}>
      <div className="flex items-center justify-between px-4 py-3 @2xl:px-8 @2xl:py-5" style={{ borderBottom: `1px solid ${t.fg}14` }}>
        <span className="text-[0.8rem] font-semibold tracking-tight @2xl:text-[1rem]" style={{ fontFamily: t.font }}>
          {c.brand}
        </span>
        <span className="hidden gap-5 text-[0.7rem] @2xl:flex" style={{ color: t.muted }}>
          {c.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </span>
        <span className="flex w-5 flex-col gap-1 @2xl:hidden" aria-hidden>
          <span className="h-px w-full" style={{ background: t.fg }} />
          <span className="h-px w-3/4" style={{ background: t.fg }} />
        </span>
      </div>

      <div className="grid gap-5 px-4 py-6 @2xl:grid-cols-[1.15fr_1fr] @2xl:items-center @2xl:gap-10 @2xl:px-8 @2xl:py-10">
        <div>
          <p className="text-[1.45rem] leading-[1.05] tracking-tight @2xl:text-[2.4rem]" style={{ fontFamily: t.font, fontWeight: id === "loja" ? 700 : 400 }}>
            {c.title}
          </p>
          <p className="mt-3 text-[0.72rem] leading-relaxed @2xl:text-[0.85rem]" style={{ color: t.muted }}>
            {c.sub}
          </p>
          <span className="mt-4 inline-flex h-8 items-center rounded-full px-4 text-[0.68rem] font-semibold @2xl:h-10 @2xl:px-6 @2xl:text-[0.78rem]" style={{ background: t.accent, color: id === "loja" ? "#111" : "#fff" }}>
            {c.cta}
          </span>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg, ${t.accent}33, ${t.accent}88)` }}>
          <div className="absolute inset-[18%] rounded-full blur-2xl" style={{ background: `${t.accent}66` }} />
          <div className="absolute bottom-3 left-3 rounded-lg px-3 py-2 text-[0.6rem]" style={{ background: t.card, color: t.fg }}>
            {c.strip}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 pb-6 @md:grid-cols-3 @2xl:px-8 @2xl:pb-10">
        {c.cards.map((card, i) => (
          <div key={card} className="rounded-xl p-4" style={{ background: t.card, border: `1px solid ${t.fg}10` }}>
            <div className="mb-3 aspect-[5/3] rounded-lg" style={{ background: `${t.accent}${["22", "33", "44"][i]}` }} />
            <p className="text-[0.78rem] font-semibold" style={{ fontFamily: t.font }}>
              {card}
            </p>
            <p className="mt-1 h-1.5 w-2/3 rounded-full" style={{ background: `${t.fg}1a` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
