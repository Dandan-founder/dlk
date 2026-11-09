import { PageHero } from "./PageHero";

/** Página de texto legal com tipografia confortável. */
export function LegalPage({ title, updated, children }: { title: string[]; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow={`Atualizado em ${updated}`} title={title} />
      <section className="bg-void pb-28">
        <div className="mx-auto max-w-[1800px] px-[var(--gutter)]">
          <div className="max-w-3xl space-y-10 text-[1.05rem] leading-relaxed text-muted lg:ml-[calc(100%/12*3)] [&_h2]:mb-3 [&_h2]:text-[1.5rem] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-text [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-text [&_ul]:space-y-2">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
