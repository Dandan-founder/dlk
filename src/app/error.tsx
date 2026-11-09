"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <section className="grid min-h-[100svh] place-items-center bg-void px-[var(--gutter)] text-center">
      <div>
        <p className="text-[0.95rem] text-muted">Algo deu errado</p>
        <h1 className="display mt-6 text-[clamp(2.6rem,7vw,6rem)]">
          Tivemos um problema<span className="text-dot">.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-muted">Não foi culpa sua. Tente de novo; se continuar, volte ao início.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Tentar de novo</Button>
          <ButtonLink href="/" variant="ghost" arrow={false}>
            Voltar ao início
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
