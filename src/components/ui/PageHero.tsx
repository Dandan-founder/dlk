
/** Abertura das páginas internas: título gigante com revelação em CSS (sem esperar o JavaScript). */
export function PageHero({ note, title, accentDot = true, children }: { note?: string; title: string[]; accentDot?: boolean; children?: React.ReactNode }) {
  return (
    <section className="grain relative overflow-clip bg-void pb-16 pt-[calc(var(--header-h)+5rem)] md:pb-24 md:pt-[calc(var(--header-h)+8rem)]">
      <div aria-hidden className="pointer-events-none absolute -left-[15vw] -top-[25vw] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(19,33,60,.9),transparent_65%)]" />
      <div className="relative mx-auto max-w-[1800px] px-[var(--gutter)]" style={{ ["--hero-delay" as string]: "0.05s" }}>
        {note && (
          <p className="hero-fade text-[0.95rem] text-muted" style={{ ["--d" as string]: "0s" }}>
            {note}
          </p>
        )}
        <h1 className="display mt-6 text-[clamp(3rem,9vw,10rem)]">
          {title.map((l, i) => (
            <span key={l} className="hero-line" style={{ ["--i" as string]: i }}>
              <span>
                {l}
                {accentDot && i === title.length - 1 && <span className="text-dot">.</span>}
              </span>
            </span>
          ))}
        </h1>
        {children && (
          <div className="hero-fade mt-10 max-w-2xl text-[1.1rem] leading-relaxed text-muted" style={{ ["--d" as string]: "0.3s" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
