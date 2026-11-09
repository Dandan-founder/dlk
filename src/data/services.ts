export type Service = {
  id: string;
  n: string;
  name: string;
  /** Uma linha, usada na lista. */
  line: string;
  description: string;
  benefits: string[];
  /** Visual desenhado em código para o serviço (ver ServiceVisual). */
  visual: "institucional" | "landing" | "local" | "ecommerce" | "agenda" | "redesign" | "manutencao";
};

export const services: Service[] = [
  {
    id: "institucional",
    n: "01",
    name: "Sites Institucionais",
    line: "A vitrine oficial da sua marca, do jeito que ela merece.",
    description:
      "Site completo para apresentar empresa, serviços e equipe com identidade visual própria, textos que explicam o que você faz e caminhos claros para o contato.",
    benefits: ["Design autoral, sem template", "Páginas que o Google entende", "Fácil de atualizar"],
    visual: "institucional",
  },
  {
    id: "landing",
    n: "02",
    name: "Landing Pages de Alta Conversão",
    line: "Uma página, um objetivo, nenhuma distração.",
    description:
      "Páginas focadas em uma oferta ou campanha, com estrutura pensada para levar o visitante até a ação: comprar, agendar, chamar no WhatsApp ou deixar o contato.",
    benefits: ["Copy orientada à ação", "Carregamento rápido para anúncios", "Pronta para medir resultados"],
    visual: "landing",
  },
  {
    id: "local",
    n: "03",
    name: "Sites para Negócios Locais",
    line: "Para quem é encontrado no mapa e escolhido pelo celular.",
    description:
      "Barbearias, restaurantes, clínicas, academias e lojas: horários, localização, cardápio ou serviços e contato direto, tudo a um toque no celular.",
    benefits: ["Experiência mobile em primeiro lugar", "Mapa, rota e WhatsApp integrados", "SEO local técnico"],
    visual: "local",
  },
  {
    id: "ecommerce",
    n: "04",
    name: "E-commerce",
    line: "Uma loja que vende pelo produto, não apesar do site.",
    description:
      "Lojas virtuais com catálogo, carrinho e checkout claros, fotos valorizadas e integração com meios de pagamento e frete escolhidos para o seu negócio.",
    benefits: ["Catálogo e filtros que ajudam a escolher", "Checkout com menos atrito", "Integrações de pagamento e frete"],
    visual: "ecommerce",
  },
  {
    id: "agenda",
    n: "05",
    name: "Sistemas de Agendamento",
    line: "Sua agenda aberta 24 horas, sem conflito de horário.",
    description:
      "Agendamento online com horários reais de cada profissional, regras de antecedência e cancelamento, painel para a equipe e confirmação para o cliente.",
    benefits: ["Horários calculados em tempo real", "Painel com permissões por equipe", "Cancelar e remarcar sem ligação"],
    visual: "agenda",
  },
  {
    id: "redesign",
    n: "06",
    name: "Redesign de Sites",
    line: "Seu site atual, reconstruído para o nível do seu negócio.",
    description:
      "Analisamos o site que você já tem, mantemos o que funciona e reconstruímos visual, estrutura e velocidade, com cuidado para não perder o que já está no Google.",
    benefits: ["Diagnóstico do site atual", "Visual e navegação modernizados", "Migração cuidadosa de páginas"],
    visual: "redesign",
  },
  {
    id: "manutencao",
    n: "07",
    name: "Manutenção e Evolução Digital",
    line: "Site no ar não é fim de projeto. É começo.",
    description:
      "Atualizações de conteúdo, ajustes, novas páginas, monitoramento e melhorias contínuas, no ritmo e no escopo definidos em contrato.",
    benefits: ["Ajustes e novas páginas", "Atualizações técnicas e de segurança", "Melhorias a partir do uso real"],
    visual: "manutencao",
  },
];
