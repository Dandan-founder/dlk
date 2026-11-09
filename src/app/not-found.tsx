import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grain relative grid min-h-[100svh] place-items-center overflow-clip bg-void px-[var(--gutter)] text-center">
      <div>
        <p className="text-[0.95rem] text-muted">Erro 404</p>
        <h1 className="display mt-6 text-[clamp(3rem,10vw,9rem)]">
          Página não<br />encontrada<span className="text-dot">.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted">O endereço pode ter mudado ou nunca ter existido. Que tal recomeçar do início?</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Voltar ao início</ButtonLink>
          <ButtonLink href="/projetos" variant="ghost" arrow={false}>
            Ver projetos
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
