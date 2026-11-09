import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Orçamento",
  description: "Peça um orçamento de site, landing page, loja virtual ou sistema de agendamento à DLK. Leva cerca de 2 minutos.",
  alternates: { canonical: "/orcamento" },
};

export default function OrcamentoPage() {
  return (
    <section className="grain relative min-h-[100svh] overflow-clip bg-void pb-24 pt-[calc(var(--header-h)+4rem)] md:pt-[calc(var(--header-h)+6rem)]">
      <div aria-hidden className="pointer-events-none absolute -right-[20vw] -top-[20vw] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(242,106,28,.1),transparent_62%)]" />
      <div className="relative mx-auto grid max-w-[1800px] gap-16 px-[var(--gutter)] lg:grid-cols-12" style={{ ["--hero-delay" as string]: "0.05s" }}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h1 className="display mt-8 text-[clamp(3rem,6.6vw,6.6rem)]">
              <span className="hero-line" style={{ ["--i" as string]: 0 }}>
                <span>Vamos</span>
              </span>
              <span className="hero-line" style={{ ["--i" as string]: 1 }}>
                <span>
                  começar<span className="text-dot">.</span>
                </span>
              </span>
            </h1>
            <div className="hero-fade mt-8 space-y-4 text-[1.05rem] leading-relaxed text-muted" style={{ ["--d" as string]: "0.3s" }}>
              <p>Sete perguntas rápidas, cerca de 2 minutos. Com as respostas, preparamos uma proposta com escopo, prazo e investimento.</p>
              <p>Sem compromisso e sem custo. Seus dados são usados só para responder a este pedido.</p>
            </div>
            {site.contact.whatsapp && (
              <div className="hero-fade mt-10 border-t border-line pt-8" style={{ ["--d" as string]: "0.4s" }}>
                <p className="text-[0.92rem] text-muted">Prefere conversar direto?</p>
                <div className="mt-4">
                  <WhatsAppButton message={site.messages.default}>Falar com a DLK</WhatsAppButton>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="hero-fade lg:col-span-7 lg:col-start-6" style={{ ["--d" as string]: "0.2s" }}>
          <div className="rounded-[2rem] border border-line bg-ink/80 p-6 backdrop-blur md:p-12">
            <Suspense fallback={<div className="h-96" aria-busy="true" />}>
              <QuoteForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
