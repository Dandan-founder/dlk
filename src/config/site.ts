/**
 * ════════════════════════════════════════════════════════════════
 *  Dados editáveis da DLK. Tudo o que muda com frequência mora aqui
 *  (e em src/data/*). Contatos reais vêm de variáveis de ambiente
 *  para não ficarem fixos no código — veja .env.example.
 * ════════════════════════════════════════════════════════════════
 */

const env = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

export const site = {
  name: "DLK",
  legalName: "DLK Agência Digital",
  tagline: "Agência digital",
  /** Frase curta usada no rodapé e em metadados. */
  statement: "Sites que fazem negócios parecerem tão bons quanto são.",
  description:
    "A DLK é uma agência digital brasileira que cria sites, landing pages, lojas virtuais e sistemas de agendamento com design autoral, performance e foco em conversão.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dlk.com.br").replace(/\/$/, ""),
  locale: "pt-BR",

  contact: {
    /** Só dígitos, com DDI e DDD (ex.: 5511912345678). Sem número, os botões de WhatsApp avisam que o canal não está configurado. */
    whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, "") ?? null,
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    city: env(process.env.NEXT_PUBLIC_CITY) ?? "Brasil",
  },

  /** Redes: deixe null para não exibir. */
  social: {
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    linkedin: env(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    behance: env(process.env.NEXT_PUBLIC_BEHANCE_URL),
  },

  /** Mensagens de WhatsApp por contexto. */
  messages: {
    default: "Olá! Conheci a DLK pelo site e gostaria de solicitar um orçamento para meu projeto.",
    hero: "Olá! Vim pelo site da DLK e quero criar o site do meu negócio.",
    plans: (plan: string) => `Olá! Vi o plano ${plan} no site da DLK e quero conversar sobre o meu projeto.`,
    service: (service: string) => `Olá! Tenho interesse em ${service.toLowerCase()} e gostaria de uma proposta da DLK.`,
    project: (project: string) => `Olá! Vi o projeto ${project} no site da DLK e quero algo parecido para o meu negócio.`,
    showcase: (segment: string) => `Olá! Gostei do modelo de ${segment.toLowerCase()} no site da DLK e quero um site assim.`,
  },
} as const;

export const nav = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/projetos", label: "Projetos" },
  { href: "/#processo", label: "Processo" },
  { href: "/#planos", label: "Planos" },
  { href: "/#faq", label: "Dúvidas" },
] as const;
