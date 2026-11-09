import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { nav, site } from "@/config/site";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { mailtoUrl, whatsappUrl } from "@/lib/whatsapp";

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[0.88rem] text-muted">{title}</p>
      <ul className="mt-5 space-y-2.5 text-[0.95rem]">{children}</ul>
    </div>
  );
}

const linkCls = "text-text/80 transition-colors hover:text-dot";

export function Footer() {
  const wa = whatsappUrl(site.messages.default);
  const mail = mailtoUrl("Projeto com a DLK", "Olá! Gostaria de conversar sobre um projeto.");
  const socials = Object.entries(site.social).filter(([, v]) => v) as [string, string][];
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-void pt-20 md:pt-28">
      <div className="mx-auto grid max-w-[1800px] gap-14 px-[var(--gutter)] lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="max-w-sm font-display text-[clamp(1.9rem,3vw,2.8rem)] font-bold leading-[1] [font-stretch:80%]">{site.statement}</p>
          <Link href="/orcamento" className="mt-8 inline-flex items-center gap-3 text-[0.95rem] text-dot underline-offset-8 hover:underline">
            Começar um projeto
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
          <Col title="Navegação">
            <li>
              <Link className={linkCls} href="/">
                Início
              </Link>
            </li>
            {nav.map((l) => (
              <li key={l.href}>
                <Link className={linkCls} href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Col>
          <Col title="Serviços">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link className={linkCls} href={`/#servico-${s.id}`}>
                  {s.name}
                </Link>
              </li>
            ))}
          </Col>
          <Col title="Projetos">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link className={linkCls} href={`/projetos/${p.slug}`}>
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link className={linkCls} href="/projetos">
                Todos os projetos
              </Link>
            </li>
          </Col>
          <Col title="Contato">
            <li>
              <Link className={linkCls} href="/orcamento">
                Pedir orçamento
              </Link>
            </li>
            {wa && (
              <li>
                <a className={linkCls} href={wa} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            )}
            {mail && site.contact.email && (
              <li>
                <a className={linkCls} href={mail}>
                  {site.contact.email}
                </a>
              </li>
            )}
            {socials.map(([k, v]) => (
              <li key={k}>
                <a className={`${linkCls} capitalize`} href={v} target="_blank" rel="noopener noreferrer">
                  {k}
                </a>
              </li>
            ))}
          </Col>
        </div>
      </div>

      {/* Assinatura: a marca em escala de outdoor */}
      <div className="mx-auto mt-20 max-w-[1800px] px-[var(--gutter)] md:mt-28">
        <Logo className="w-full opacity-[0.96]" title={null} />
      </div>

      <div className="mx-auto mt-8 flex max-w-[1800px] flex-wrap items-center justify-between gap-4 border-t border-line px-[var(--gutter)] py-6 text-[0.82rem] text-muted">
        <p>
          © {year} {site.legalName}. Todos os direitos reservados.
        </p>
        <ul className="flex gap-6">
          <li>
            <Link className="hover:text-text" href="/privacidade">
              Privacidade
            </Link>
          </li>
          <li>
            <Link className="hover:text-text" href="/termos">
              Termos de uso
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
