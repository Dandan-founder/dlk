"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { ArrowLeft, Check, Copy, Loader2, Mail, MessageCircle } from "lucide-react";
import { leadOptions, leadSchema, leadSummary, stepTitles, type Lead } from "@/lib/lead";
import { mailtoUrl, whatsappUrl } from "@/lib/whatsapp";
import { projectBySlug } from "@/data/projects";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const stepFields: FieldPath<Lead>[][] = [["business"], ["siteType"], ["features"], ["identity"], ["budget"], ["timeline"], ["name", "phone", "email", "company", "message", "consent", "website"]];
const single = { 0: "business", 1: "siteType", 3: "identity", 4: "budget", 5: "timeline" } as const;
const singleOptions = { 0: leadOptions.business, 1: leadOptions.siteType, 3: leadOptions.identity, 4: leadOptions.budget, 5: leadOptions.timeline } as const;

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "fallback"; reason: "not_configured" | "error"; message: string };

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const inputCls =
  "h-14 w-full rounded-2xl border border-line-strong bg-ink px-5 text-[1rem] text-text placeholder:text-muted/70 transition-colors focus:border-dot focus:outline-none aria-[invalid=true]:border-danger";

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[0.92rem] font-medium">
        {label} {optional && <span className="font-normal text-muted">(opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} role="alert" className="text-[0.85rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Orçamento em 7 etapas: React Hook Form + Zod, progresso, campo-isca, consentimento e envio real à API. */
export function QuoteForm() {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  const { register, handleSubmit, setValue, watch, trigger, getValues, formState } = useForm<Lead>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: { features: [], name: "", phone: "", email: "", company: "", message: "", website: "" } as Partial<Lead> as Lead,
  });
  const values = watch();
  const errors = formState.errors;

  // Pré-preenche a partir dos links do site (serviço, segmento, plano, projeto)
  useEffect(() => {
    const servico = params.get("servico");
    const map: Record<string, Lead["siteType"]> = { institucional: "Site institucional", landing: "Landing page", local: "Site para negócio local", ecommerce: "Loja virtual", agenda: "Sistema de agendamento", redesign: "Redesign do meu site atual" };
    if (servico && map[servico]) setValue("siteType", map[servico]);
    const seg = params.get("segmento");
    const segMap: Record<string, Lead["business"]> = { barbearia: "Barbearia ou salão", restaurante: "Restaurante ou delivery", clinica: "Clínica ou saúde", loja: "Loja ou e-commerce", escritorio: "Escritório ou serviços profissionais" };
    if (seg && segMap[seg]) setValue("business", segMap[seg]);
    const plano = params.get("plano");
    const projeto = params.get("projeto");
    const p = projeto ? projectBySlug(projeto) : null;
    const note = [plano ? `Tenho interesse no plano ${plano.toUpperCase()}.` : null, p ? `Quero algo parecido com o projeto ${p.name}.` : null].filter(Boolean).join(" ");
    if (note) setValue("message", note);
  }, [params, setValue]);

  // Acessibilidade: ao trocar de etapa, o foco vai para o título da etapa
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const h = heading.current;
    if (!h) return;
    h.focus({ preventScroll: true });
    // rola só na vertical (scrollIntoView também moveria áreas com overflow na horizontal)
    const top = h.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25;
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [step, status.kind]);

  const next = async () => {
    const ok = await trigger(stepFields[step]);
    if (ok) setStep((s) => Math.min(6, s + 1));
  };

  const onSubmit = async (lead: Lead) => {
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
      const body = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (res.ok) return setStatus({ kind: "sent" });
      if (body.error === "not_configured") return setStatus({ kind: "fallback", reason: "not_configured", message: body.message ?? "" });
      setStatus({ kind: "fallback", reason: "error", message: body.message ?? "Não conseguimos enviar agora." });
    } catch {
      setStatus({ kind: "fallback", reason: "error", message: "Sem conexão com o servidor. Verifique sua internet." });
    }
  };

  const progress = status.kind === "sent" ? 100 : Math.round(((step + (status.kind === "idle" ? 0 : 1)) / 7) * 100);

  if (status.kind === "sent" || status.kind === "fallback") {
    const summary = leadSummary(getValues());
    const wa = whatsappUrl(summary);
    const mail = mailtoUrl(`Orçamento pelo site: ${getValues().name}`, summary);
    return (
      <div className="animate-[panel-in_.7s_var(--ease-out)_both]">
        <Progress value={100} label={status.kind === "sent" ? "Pedido enviado" : "Revise como enviar"} />
        {status.kind === "sent" ? (
          <>
            <span aria-hidden className="mt-12 grid h-16 w-16 place-items-center rounded-full bg-dot">
              <Check className="h-7 w-7 text-white" />
            </span>
            <h2 ref={heading} tabIndex={-1} className="display mt-8 text-[clamp(2.4rem,5vw,4.4rem)] outline-none">
              Pedido recebido<span className="text-dot">.</span>
            </h2>
            <p className="mt-6 max-w-xl text-[1.1rem] leading-relaxed text-muted">
              Obrigado, {getValues().name.split(" ")[0]}. Vamos analisar as informações e responder pelo WhatsApp ou e-mail informado com os próximos passos.
            </p>
            <div className="mt-10">
              <ButtonLink href="/projetos" variant="ghost" arrow={false}>
                Enquanto isso, ver projetos
              </ButtonLink>
            </div>
          </>
        ) : (
          <>
            <h2 ref={heading} tabIndex={-1} className="display mt-12 text-[clamp(2.2rem,4.6vw,4rem)] outline-none">
              {status.reason === "not_configured" ? "Falta só um passo" : "Não conseguimos enviar"}
              <span className="text-dot">.</span>
            </h2>
            <p role="alert" className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
              {status.reason === "not_configured"
                ? "O envio automático de orçamentos ainda não está ativo neste site, então seu pedido não foi registrado. Envie o resumo abaixo por um dos canais — as respostas já estão preenchidas."
                : `${status.message} Seu pedido não foi registrado. Tente de novo ou envie o resumo por outro canal.`}
            </p>
            <pre className="mt-8 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-ink p-6 font-mono text-[0.82rem] leading-relaxed text-text/85">{summary}</pre>
            <div className="mt-8 flex flex-wrap gap-3">
              {wa && (
                <ButtonLink href={wa} external arrow={false}>
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" aria-hidden /> Enviar pelo WhatsApp
                  </span>
                </ButtonLink>
              )}
              {mail && (
                <ButtonLink href={mail} variant="ghost" arrow={false}>
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden /> Enviar por e-mail
                  </span>
                </ButtonLink>
              )}
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(summary);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                <span className="inline-flex items-center gap-2">
                  {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />} {copied ? "Resumo copiado" : "Copiar resumo"}
                </span>
              </Button>
              {status.reason === "error" && (
                <Button variant="light" onClick={handleSubmit(onSubmit)}>
                  Tentar de novo
                </Button>
              )}
            </div>
            {!wa && !mail && status.reason === "not_configured" && (
              <p className="mt-6 text-[0.9rem] text-muted">Os canais de contato da DLK ainda estão sendo configurados. Copie o resumo e guarde — ele já tem tudo o que precisamos.</p>
            )}
            <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-10 inline-flex items-center gap-2 text-[0.92rem] text-muted underline-offset-4 hover:text-text hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar e editar respostas
            </button>
          </>
        )}
      </div>
    );
  }

  const singleKey = single[step as keyof typeof single];
  const singleOpts = singleOptions[step as keyof typeof singleOptions];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-describedby="orcamento-ajuda">
      <Progress value={progress} label={`Etapa ${step + 1} de 7`} />
      <p id="orcamento-ajuda" className="sr-only">
        Formulário em sete etapas. Campos opcionais estão indicados.
      </p>

      <div key={step} className="mt-12 animate-[panel-in_.6s_var(--ease-out)_both]">
        <h2 ref={heading} tabIndex={-1} className="text-[clamp(1.9rem,3.6vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.035em] outline-none">
          {stepTitles[step]}
        </h2>

        {singleKey && singleOpts && (
          <fieldset className="mt-8">
            <legend className="sr-only">{stepTitles[step]}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {singleOpts.map((o) => {
                const checked = values[singleKey] === o;
                return (
                  <label key={o} className={cn("group relative flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-[1.02rem] transition-colors", checked ? "border-dot bg-dot/10" : "border-line-strong hover:border-text/50")}>
                    <input
                      type="radio"
                      value={o}
                      className="peer sr-only"
                      {...register(singleKey)}
                      onClick={(e) => {
                        // Avança sozinho só no clique/toque (detail > 0). Com o teclado (setas), o usuário escolhe e segue no "Continuar".
                        if (e.detail > 0) window.setTimeout(() => setStep((s) => (s === step ? Math.min(6, s + 1) : s)), 280);
                      }}
                    />
                    <span>{o}</span>
                    <span aria-hidden className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors", checked ? "border-dot bg-dot" : "border-line-strong")}>
                      {checked && <Check className="h-3.5 w-3.5 text-white" />}
                    </span>
                    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-dot peer-focus-visible:ring-2" />
                  </label>
                );
              })}
            </div>
            {errors[singleKey] && (
              <p role="alert" className="mt-4 text-[0.88rem] text-danger">
                {errors[singleKey]?.message as string}
              </p>
            )}
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="mt-8">
            <legend className="text-[0.98rem] text-muted">Marque quantas quiser. Se ainda não sabe, pode seguir sem marcar.</legend>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {leadOptions.features.map((o) => {
                const checked = values.features?.includes(o);
                return (
                  <label key={o} className={cn("relative inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-3 text-[0.95rem] transition-colors", checked ? "border-dot bg-dot text-void" : "border-line-strong hover:border-text/50")}>
                    <input type="checkbox" value={o} className="peer sr-only" {...register("features")} />
                    {checked && <Check className="h-4 w-4" aria-hidden />}
                    {o}
                    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-text peer-focus-visible:ring-2" />
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 6 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Field id="name" label="Seu nome" error={errors.name?.message}>
              <input id="name" autoComplete="name" className={inputCls} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-erro" : undefined} {...register("name")} />
            </Field>
            <Field id="phone" label="WhatsApp com DDD" error={errors.phone?.message}>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="(11) 91234-5678"
                className={inputCls}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-erro" : undefined}
                {...register("phone", { onChange: (e) => setValue("phone", maskPhone(e.target.value)) })}
              />
            </Field>
            <Field id="email" label="E-mail" optional error={errors.email?.message}>
              <input id="email" type="email" autoComplete="email" className={inputCls} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-erro" : undefined} {...register("email")} />
            </Field>
            <Field id="company" label="Empresa ou marca" optional error={errors.company?.message}>
              <input id="company" autoComplete="organization" className={inputCls} {...register("company")} />
            </Field>
            <div className="sm:col-span-2">
              <Field id="message" label="Conte um pouco sobre o projeto" optional error={errors.message?.message}>
                <textarea id="message" rows={4} maxLength={1000} className={cn(inputCls, "h-auto py-4")} {...register("message")} />
              </Field>
            </div>
            {/* Campo-isca: escondido de pessoas e leitores de tela */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Não preencha</label>
              <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] leading-relaxed text-muted">
                <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[var(--dot)]" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "consent-erro" : undefined} {...register("consent")} />
                <span>
                  Concordo que a DLK use estes dados para responder ao meu pedido de orçamento, conforme a{" "}
                  <a href="/privacidade" target="_blank" className="text-text underline underline-offset-4">
                    política de privacidade
                  </a>
                  .
                </span>
              </label>
              {errors.consent && (
                <p id="consent-erro" role="alert" className="mt-2 text-[0.85rem] text-danger">
                  {errors.consent.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex h-12 items-center gap-2 rounded-full px-2 text-[0.95rem] text-muted hover:text-text">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
          </button>
        ) : (
          <span />
        )}
        {step < 6 ? (
          <Button type="button" onClick={next} arrow>
            {step === 2 && !values.features?.length ? "Pular por enquanto" : "Continuar"}
          </Button>
        ) : (
          <Button type="submit" disabled={status.kind === "sending"} arrow={status.kind !== "sending"}>
            <span className="inline-flex items-center gap-2">
              {status.kind === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {status.kind === "sending" ? "Enviando…" : "Enviar pedido"}
            </span>
          </Button>
        )}
      </div>
    </form>
  );
}

function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[0.88rem] text-muted">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Progresso do orçamento" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <div className="h-full origin-left bg-dot transition-transform duration-700 ease-[var(--ease-out)]" style={{ transform: `scaleX(${value / 100})` }} />
      </div>
    </div>
  );
}
