"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { useRef } from "react";
import { Plus } from "lucide-react";
import { faq } from "@/data/content";
import { site } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { revealBatch, splitReveal, useGsap } from "@/lib/gsap";

/** Perguntas frequentes: acordeão acessível (Radix) com altura animada + FAQPage em JSON-LD. */
export function Faq() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, (mm, el) => {
    splitReveal(mm, Array.from(el.querySelectorAll("[data-split]")));
    revealBatch(mm, el);
  }, [], { defer: true });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <section ref={root} id="faq" aria-labelledby="faq-title" className="grain relative bg-ink py-28 md:py-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto grid max-w-[1800px] gap-14 px-[var(--gutter)] lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Eyebrow>Dúvidas frequentes</Eyebrow>
            <h2 id="faq-title" data-split data-hide className="display mt-6 text-[clamp(2.6rem,5.6vw,6rem)]">
              Perguntas
              <br />
              diretas<span className="text-dot">.</span>
            </h2>
            <p className="mt-8 max-w-sm leading-relaxed text-muted">Não encontrou o que procurava? Pergunte direto para a gente.</p>
            <div className="mt-6">
              <WhatsAppButton message={site.messages.default}>Fazer uma pergunta</WhatsAppButton>
            </div>
          </div>
        </div>
        <Accordion.Root type="single" collapsible defaultValue="item-0" className="border-t border-line lg:col-span-7 lg:col-start-6">
          {faq.map((f, i) => (
            <Accordion.Item key={f.q} value={`item-${i}`} data-reveal className="border-b border-line">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-7 text-left md:py-8">
                  <span className="text-[clamp(1.2rem,2vw,1.6rem)] font-medium tracking-[-0.02em] transition-colors group-hover:text-dot">{f.q}</span>
                  <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong transition-all duration-500 group-data-[state=open]:rotate-45 group-data-[state=open]:border-dot group-data-[state=open]:bg-dot">
                    <Plus className="h-4 w-4" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_.45s_var(--ease-out)] data-[state=open]:animate-[acc-down_.55s_var(--ease-out)]">
                <p className="max-w-2xl pb-8 pr-14 text-[1.05rem] leading-relaxed text-muted">{f.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
      <style>{`@keyframes acc-down{from{height:0;opacity:0}to{height:var(--radix-accordion-content-height);opacity:1}}@keyframes acc-up{from{height:var(--radix-accordion-content-height)}to{height:0;opacity:0}}`}</style>
    </section>
  );
}
