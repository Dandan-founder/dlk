"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { nav, site } from "@/config/site";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { useLenis } from "./SmoothScroll";

/**
 * Cabeçalho fixo: transparente no topo, vidro escuro depois de rolar; some ao descer e volta ao subir.
 * No celular, menu em tela cheia (Radix Dialog: foco preso, Esc fecha, foco volta ao botão).
 */
export function Header() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      setHidden(y > 320 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  const wa = whatsappUrl(site.messages.default);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out)]",
        solid ? "border-b border-line bg-void/70 backdrop-blur-xl" : "border-b border-transparent",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <nav aria-label="Principal" className="mx-auto flex h-[var(--header-h)] max-w-[1800px] items-center justify-between gap-6 px-[var(--gutter)]">
        <Link href="/" className="relative z-10 -m-2 p-2" aria-label="DLK, página inicial">
          <Logo className="w-[3.6rem] md:w-[4.1rem]" title={null} />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((l) => {
            const active = l.href === "/projetos" ? pathname.startsWith("/projetos") : false;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative inline-flex h-10 items-center px-4 text-[0.92rem] text-muted transition-colors hover:text-text",
                    active && "text-text",
                  )}
                >
                  {l.label}
                  <span aria-hidden className={cn("absolute bottom-1.5 left-4 right-4 h-px origin-left bg-dot transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100", active ? "scale-x-100" : "scale-x-0")} />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <ButtonLink href="/orcamento" size="md" className="hidden h-11 sm:inline-flex">
            Quero meu site
          </ButtonLink>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="relative grid h-11 w-11 place-items-center rounded-full border border-line-strong lg:hidden" aria-label="Abrir menu">
              <span aria-hidden className="flex w-4 flex-col gap-[5px]">
                <span className="h-[1.5px] w-full bg-text" />
                <span className="h-[1.5px] w-2/3 bg-text" />
              </span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content
                className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-void px-[var(--gutter)] pb-[max(2rem,env(safe-area-inset-bottom))] data-[state=open]:animate-[menu-in_.6s_var(--ease-out)]"
                aria-describedby={undefined}
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between">
                  <Logo className="w-[3.6rem]" title={null} />
                  <Dialog.Close className="grid h-11 w-11 place-items-center rounded-full border border-line-strong" aria-label="Fechar menu">
                    <X className="h-5 w-5" aria-hidden />
                  </Dialog.Close>
                </div>
                <ul className="mt-10 flex flex-col gap-1">
                  {[{ href: "/", label: "Início" }, ...nav, { href: "/orcamento", label: "Orçamento" }].map((l, i) => (
                    <li key={l.href} style={{ animationDelay: `${0.08 + i * 0.05}s` }} className="animate-[menu-item_.7s_var(--ease-out)_both]">
                      <Link href={l.href} onClick={() => setOpen(false)} className="group flex items-baseline gap-4 py-1.5 font-display text-[clamp(2.8rem,13vw,4.2rem)] font-bold leading-none [font-stretch:78%]">
                                                <span className="transition-colors group-hover:text-dot">{l.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-12">
                  <p className="text-[0.95rem] text-muted">Vamos conversar</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <ButtonLink href="/orcamento" magnetic={false}>
                      Pedir orçamento
                    </ButtonLink>
                    {wa && (
                      <ButtonLink href={wa} external variant="ghost" magnetic={false} arrow={false}>
                        WhatsApp
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
      <style>{`@keyframes menu-in{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0 0)}}@keyframes menu-item{from{opacity:0;transform:translateY(40%)}}`}</style>
    </header>
  );
}
