import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projectBySlug, projects } from "@/data/projects";
import { site } from "@/config/site";
import { KindBadge } from "@/components/projects/ProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CaseReveal } from "@/components/projects/CaseReveal";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = projectBySlug((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} (${p.kind === "conceito" ? "projeto conceito" : p.category})`,
    description: p.summary,
    alternates: { canonical: `/projetos/${p.slug}` },
    openGraph: { images: [{ url: p.cover.src, width: p.cover.w, height: p.cover.h, alt: p.cover.alt }] },
  };
}

function Block({ k, title, children }: { k: string; title: string; children: React.ReactNode }) {
  return (
    <div data-reveal className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
      <p className="font-mono text-xs text-muted md:col-span-2">{k}</p>
      <h2 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-semibold leading-tight tracking-[-0.03em] md:col-span-3">{title}</h2>
      <div className="text-[1.1rem] leading-relaxed text-muted md:col-span-6 md:col-start-7">{children}</div>
    </div>
  );
}

export default async function CasePage({ params }: Params) {
  const p = projectBySlug((await params).slug);
  if (!p) notFound();
  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.name,
    description: p.summary,
    creator: { "@type": "Organization", name: site.legalName, url: site.url },
    dateCreated: String(p.year),
    image: `${site.url}${p.cover.src}`,
    genre: p.category,
    ...(p.demoUrl ? { url: p.demoUrl } : {}),
  };

  return (
    <CaseReveal>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="grain relative overflow-clip bg-void pt-[calc(var(--header-h)+3.5rem)] md:pt-[calc(var(--header-h)+6rem)]">
        <div className="relative mx-auto max-w-[1800px] px-[var(--gutter)]" style={{ ["--hero-delay" as string]: "0.05s" }}>
          <Link href="/projetos" className="hero-fade inline-flex items-center gap-2 text-[0.9rem] text-muted hover:text-text" style={{ ["--d" as string]: "0s" }}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> Todos os projetos
          </Link>
          <div className="hero-fade mt-10 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "0.05s" }}>
            <KindBadge kind={p.kind} />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {p.category} · {p.year}
            </span>
          </div>
          <h1 className="display mt-6 text-[clamp(3rem,9vw,10rem)]">
            {p.name.split(" ").reduce<string[][]>((acc, w, k) => (k % 2 === 0 ? [...acc, [w]] : (acc[acc.length - 1].push(w), acc)), []).map((ws, k) => (
              <span key={k} className="hero-line" style={{ ["--i" as string]: k }}>
                <span>{ws.join(" ")}</span>
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-8 max-w-2xl text-[clamp(1.1rem,1.6vw,1.35rem)] leading-relaxed text-muted" style={{ ["--d" as string]: "0.3s" }}>
            {p.summary}
          </p>
          <dl className="hero-fade mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 md:grid-cols-4" style={{ ["--d" as string]: "0.4s" }}>
            {[
              ["Tipo", p.kind === "conceito" ? "Projeto conceito (demonstração)" : "Projeto de cliente"],
              ["Segmento", p.category],
              ["Entregas", p.services.join(", ")],
              ["Tecnologia", p.stack.join(", ")],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">{k}</dt>
                <dd className="mt-2 text-[0.98rem]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative mx-auto mt-16 max-w-[1800px] px-[var(--gutter)] md:mt-24">
          <div data-case-cover className="relative overflow-hidden rounded-3xl border border-line">
            <Image src={p.cover.src} alt={p.cover.alt} width={p.cover.w} height={p.cover.h} priority sizes="(min-width: 1800px) 1700px, 100vw" className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section aria-label="Estudo de caso" className="bg-void py-20 md:py-28">
        <div className="mx-auto max-w-[1800px] px-[var(--gutter)]">
          <Block k="01" title="Visão geral">
            <p>{p.overview}</p>
          </Block>
          <Block k="02" title="Objetivo">
            <p>{p.objective}</p>
          </Block>
          <Block k="03" title="Desafio">
            <p>{p.challenge}</p>
          </Block>
          <Block k="04" title="Solução">
            <p>{p.solution}</p>
          </Block>
          <Block k="05" title="Design">
            <p>{p.design}</p>
          </Block>
          <Block k="06" title="Funcionalidades">
            <ul className="grid gap-3 sm:grid-cols-2">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-text/90">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dot" />
                  {f}
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </section>

      <section aria-labelledby="galeria-title" className="bg-ink py-20 md:py-32">
        <div className="mx-auto max-w-[1800px] px-[var(--gutter)]">
          <Eyebrow>Galeria</Eyebrow>
          <h2 id="galeria-title" className="display mt-6 text-[clamp(2.4rem,5vw,5rem)]">
            Por dentro do projeto<span className="text-dot">.</span>
          </h2>
          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <figure data-reveal className="overflow-hidden rounded-2xl border border-line lg:col-span-8">
              <Image src={p.gallery[0].src} alt={p.gallery[0].alt} width={p.gallery[0].w} height={p.gallery[0].h} sizes="(min-width: 1024px) 65vw, 100vw" className="h-auto w-full" />
            </figure>
            <figure data-reveal className="mx-auto w-[min(100%,22rem)] overflow-hidden rounded-[2rem] border-[6px] border-[#0b0f1b] lg:col-span-4 lg:w-auto lg:max-w-[22rem]">
              <Image src={p.mobile.src} alt={p.mobile.alt} width={p.mobile.w} height={p.mobile.h} sizes="(min-width: 1024px) 22rem, 90vw" className="h-auto w-full" />
            </figure>
            {p.gallery.slice(1).map((g) => (
              <figure key={g.src} data-reveal className="overflow-hidden rounded-2xl border border-line lg:col-span-6">
                <Image src={g.src} alt={g.alt} width={g.w} height={g.h} sizes="(min-width: 1024px) 48vw, 100vw" className="h-auto w-full" />
                <figcaption className="border-t border-line px-5 py-3 text-[0.85rem] text-muted">{g.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="demo-title" className="bg-void py-20 md:py-28">
        <div className="mx-auto grid max-w-[1800px] gap-10 px-[var(--gutter)] lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Demonstração</Eyebrow>
            <h2 id="demo-title" className="display mt-6 text-[clamp(2.4rem,5vw,5rem)]">
              {p.demoUrl ? "Veja funcionando" : "Demonstração ao vivo em breve"}
              <span className="text-dot">.</span>
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-muted">
              {p.demoUrl
                ? "A demonstração abre em uma nova aba. Navegue, monte um pedido e teste no celular: nada é enviado a um negócio real."
                : "A versão navegável deste projeto ainda não está publicada. Se quiser ver ao vivo, peça uma apresentação: mostramos o site e o painel funcionando."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            {p.demoUrl && (
              <ButtonLink href={p.demoUrl} external size="lg">
                Abrir demonstração
              </ButtonLink>
            )}
            <ButtonLink href={`/orcamento?projeto=${p.slug}`} size="lg" variant={p.demoUrl ? "ghost" : "primary"}>
              Quero um projeto como este
            </ButtonLink>
            <WhatsAppButton message={site.messages.project(p.name)} size="lg">
              {p.demoUrl ? "Conversar" : "Pedir uma apresentação"}
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <Link href={`/projetos/${next.slug}`} data-cursor="view" data-cursor-label="Próximo" className="group block border-t border-line bg-void">
        <div className="mx-auto flex max-w-[1800px] items-end justify-between gap-6 px-[var(--gutter)] py-16 md:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Próximo projeto</p>
            <p className="mt-4 text-[clamp(2.4rem,7vw,7rem)] font-bold leading-none tracking-[-0.05em] transition-colors duration-500 group-hover:text-dot">{next.name}</p>
          </div>
          <ArrowUpRight className="mb-2 h-10 w-10 shrink-0 transition-transform duration-500 group-hover:rotate-45 md:h-16 md:w-16" aria-hidden />
        </div>
      </Link>
    </CaseReveal>
  );
}
