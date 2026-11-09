import { z } from "zod";

/** Opções do formulário de orçamento (editáveis). */
export const leadOptions = {
  business: ["Barbearia ou salão", "Restaurante ou delivery", "Clínica ou saúde", "Escritório ou serviços profissionais", "Academia ou estúdio", "Loja ou e-commerce", "Profissional autônomo", "Outro"],
  siteType: ["Site institucional", "Landing page", "Site para negócio local", "Loja virtual", "Sistema de agendamento", "Redesign do meu site atual", "Ainda não sei"],
  features: ["Botão de WhatsApp", "Agendamento online", "Cardápio ou catálogo", "Pagamento online", "Blog ou notícias", "Formulário de contato", "Galeria ou portfólio", "Área do cliente", "Mais de um idioma", "Integração com outro sistema"],
  identity: ["Sim, tenho identidade completa", "Tenho só o logotipo", "Não, preciso criar"],
  budget: ["Até R$ 2.000", "De R$ 2.000 a R$ 5.000", "De R$ 5.000 a R$ 10.000", "Acima de R$ 10.000", "Prefiro conversar antes"],
  timeline: ["O quanto antes", "Em até 30 dias", "Entre 1 e 3 meses", "Sem pressa"],
} as const;

const oneOf = <T extends readonly [string, ...string[]]>(list: T, msg: string) => z.enum(list, { error: msg });

/** Celular/telefone brasileiro → só dígitos com 55. Aceita (11) 91234-5678, 11912345678, +55 11 ... */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("55") && (d.length === 12 || d.length === 13)) d = d.slice(2);
  if (d.length !== 10 && d.length !== 11) return null;
  if (Number(d.slice(0, 2)) < 11) return null;
  if (d.length === 11 && d[2] !== "9") return null;
  return "55" + d;
}

export const formatPhone = (digits55: string) => {
  const d = digits55.slice(2);
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
};

/** Cada etapa valida só os seus campos (para o "Continuar"). */
export const stepSchemas = [
  z.object({ business: oneOf(leadOptions.business, "Escolha o tipo do seu negócio.") }),
  z.object({ siteType: oneOf(leadOptions.siteType, "Escolha o tipo de site.") }),
  z.object({ features: z.array(oneOf(leadOptions.features, "Opção inválida.")).max(leadOptions.features.length) }),
  z.object({ identity: oneOf(leadOptions.identity, "Conte se você já tem identidade visual.") }),
  z.object({ budget: oneOf(leadOptions.budget, "Escolha uma faixa de investimento.") }),
  z.object({ timeline: oneOf(leadOptions.timeline, "Escolha um prazo.") }),
  z.object({
    name: z.string().trim().min(2, "Informe seu nome.").max(80, "Nome muito longo."),
    phone: z
      .string()
      .trim()
      .refine((v) => normalizePhone(v) !== null, "Informe um WhatsApp com DDD, ex.: (11) 91234-5678."),
    email: z.union([z.literal(""), z.email("E-mail inválido.").max(120)]),
    company: z.string().trim().max(100, "Texto muito longo.").optional().or(z.literal("")),
    message: z.string().trim().max(1000, "Use até 1.000 caracteres.").optional().or(z.literal("")),
    consent: z.literal(true, { error: "Precisamos do seu consentimento para responder." }),
    /** Campo-isca: invisível para pessoas; robôs preenchem. */
    website: z.string().max(0).optional().or(z.literal("")),
  }),
] as const;

export const leadSchema = stepSchemas[0]
  .merge(stepSchemas[1])
  .merge(stepSchemas[2])
  .merge(stepSchemas[3])
  .merge(stepSchemas[4])
  .merge(stepSchemas[5])
  .merge(stepSchemas[6]);

export type Lead = z.infer<typeof leadSchema>;

export const stepTitles = [
  "Qual é o seu tipo de negócio?",
  "Qual tipo de site você precisa?",
  "Quais funcionalidades você deseja?",
  "Você já possui identidade visual?",
  "Qual sua faixa de investimento?",
  "Qual seu prazo desejado?",
  "Como falamos com você?",
] as const;

/** Resumo legível do pedido (WhatsApp, e-mail e webhook). Nunca inclui o campo-isca. */
export function leadSummary(l: Lead): string {
  const phone = normalizePhone(l.phone);
  return [
    "Olá! Quero um orçamento da DLK.",
    "",
    `Nome: ${l.name}${l.company ? ` (${l.company})` : ""}`,
    `WhatsApp: ${phone ? formatPhone(phone) : l.phone}`,
    l.email ? `E-mail: ${l.email}` : null,
    "",
    `Negócio: ${l.business}`,
    `Tipo de site: ${l.siteType}`,
    `Funcionalidades: ${l.features.length ? l.features.join(", ") : "a definir"}`,
    `Identidade visual: ${l.identity}`,
    `Investimento: ${l.budget}`,
    `Prazo: ${l.timeline}`,
    l.message ? `\nSobre o projeto: ${l.message}` : null,
  ]
    .filter((x) => x !== null)
    .join("\n");
}
