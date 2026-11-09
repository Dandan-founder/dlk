/**
 * Portfólio. Para adicionar um projeto real: copie um item, troque os textos e as imagens
 * (em /public/projects/<slug>/) e marque `kind: "cliente"`. Projetos conceito ficam
 * sempre identificados como tal no site.
 */

export const categories = ["Barbearias", "Restaurantes", "Clínicas", "E-commerce", "Serviços", "Landing Pages"] as const;
export type Category = (typeof categories)[number];

export type Shot = { src: string; alt: string; w: number; h: number; device: "desktop" | "mobile" };

export type Project = {
  slug: string;
  name: string;
  /** "conceito" = demonstração criada pela DLK; "cliente" = projeto real entregue. */
  kind: "conceito" | "cliente";
  category: Category;
  year: number;
  summary: string;
  /** Cor de destaque do próprio projeto (usada em detalhes da página de case). */
  accent: string;
  cover: Shot;
  /** Captura da página inteira (1000×6400), usada na prévia que rola no hover. */
  full: Shot;
  mobile: Shot;
  gallery: Shot[];
  services: string[];
  stack: string[];
  overview: string;
  objective: string;
  challenge: string;
  solution: string;
  design: string;
  features: string[];
  /** Link de demonstração público. null = sem demonstração no ar (não inventamos links). */
  demoUrl: string | null;
};

const shot = (slug: string, file: string, alt: string, device: Shot["device"] = "desktop"): Shot => ({
  src: `/projects/${slug}/${file}.webp`,
  alt,
  w: device === "desktop" ? 1600 : 780,
  h: device === "desktop" ? 1000 : 1688,
  device,
});

export const projects: Project[] = [
  {
    slug: "blackstone-barber-club",
    name: "Blackstone Barber Club",
    kind: "conceito",
    category: "Barbearias",
    year: 2026,
    summary: "Barbearia premium com agendamento online em tempo real e painel completo para a equipe.",
    accent: "#B89B65",
    cover: shot("blackstone-barber-club", "cover", "Página inicial do Blackstone Barber Club: título grande sobre foto escura de um barbeiro aparando uma barba"),
    full: { src: "/projects/blackstone-barber-club/full.webp", alt: "Página inicial completa do Blackstone Barber Club", w: 1000, h: 6400, device: "desktop" },
    mobile: shot("blackstone-barber-club", "mobile", "Tela de agendamento do Blackstone no celular", "mobile"),
    gallery: [
      shot("blackstone-barber-club", "ritual", "Seção O ritual, com um poste de barbeiro em 3D e os passos do atendimento"),
      shot("blackstone-barber-club", "agendar", "Fluxo de agendamento: escolha de data e horários livres"),
      shot("blackstone-barber-club", "painel", "Painel administrativo com métricas e gráfico de agendamentos"),
      shot("blackstone-barber-club", "agenda", "Agenda da equipe em visão semanal"),
    ],
    services: ["Site institucional", "Sistema de agendamento", "Painel administrativo"],
    stack: ["Next.js", "TypeScript", "Supabase", "Three.js"],
    overview:
      "Projeto conceito de uma barbearia de alto padrão: site editorial, agendamento online de ponta a ponta e um painel para dono e barbeiros. Os dados da demonstração são fictícios.",
    objective: "Mostrar como um negócio local pode ter presença premium e uma agenda que funciona sozinha, sem depender de ligações e mensagens.",
    challenge:
      "Agendamento parece simples até aparecerem duração de serviços, pausas, folgas, feriados, antecedência mínima e dois clientes tentando o mesmo horário ao mesmo tempo.",
    solution:
      "Um motor de disponibilidade que calcula horários reais a partir das regras da casa, confirmação revalidada no servidor e uma restrição no banco de dados que torna a reserva dupla impossível. Cliente cancela e remarca por um link seguro.",
    design:
      "Paleta escura com dourado discreto, serifa de alto contraste nos títulos e fotografia em preto e branco. Animações de entrada contidas e uma seção em 3D, em que o poste de barbeiro gira com a rolagem.",
    features: [
      "Agendamento em etapas com horários reais",
      "Proteção contra reserva dupla no banco de dados",
      "Cancelar e remarcar pelo link de confirmação",
      "Painel com agenda dia/semana/mês e bloqueios",
      "Permissões separadas para administrador e barbeiro",
      "Métricas do mês e receita estimada",
    ],
    demoUrl: null,
  },
  {
    slug: "brace-pizzaria",
    name: "Brace Pizzaria",
    kind: "conceito",
    category: "Restaurantes",
    year: 2026,
    summary: "Pizzaria napolitana com cardápio interativo, pedido montado no site e envio pelo WhatsApp.",
    accent: "#B3261E",
    cover: shot("brace-pizzaria", "cover", "Página inicial da Brace Pizzaria: pizza girando sobre fundo escuro e o título Fogo, farinha e tempo"),
    full: { src: "/projects/brace-pizzaria/full.webp", alt: "Página inicial completa da Brace Pizzaria", w: 1000, h: 6400, device: "desktop" },
    mobile: shot("brace-pizzaria", "mobile", "Cardápio da Brace no celular", "mobile"),
    gallery: [
      shot("brace-pizzaria", "forno", "Seção O forno, com um forno a lenha em 3D aceso"),
      shot("brace-pizzaria", "cardapio", "Cardápio com categorias e botões de adicionar ao pedido"),
      shot("brace-pizzaria", "historia", "Seção Nossa história, em página clara com retrato da pizzaiola"),
    ],
    services: ["Site para negócio local", "Pedido online via WhatsApp"],
    stack: ["Next.js", "TypeScript", "GSAP", "Three.js"],
    overview:
      "Projeto conceito de uma pizzaria napolitana: um site que dá vontade de pedir, com cardápio completo, personalização de pizzas e o pedido enviado já formatado para o WhatsApp da casa.",
    objective: "Trocar o cardápio em PDF e as mensagens soltas por um pedido claro, com itens, observações, entrega e forma de pagamento.",
    challenge:
      "Restaurante vende pelo apetite: o site precisava ser rápido no celular e, ao mesmo tempo, cinematográfico o bastante para transmitir forno a lenha, ingredientes e cuidado.",
    solution:
      "Site estático, muito rápido, com cardápio, carrinho e checkout no próprio navegador. A mensagem do pedido sai pronta para o WhatsApp da pizzaria, sem depender de plataforma de delivery.",
    design:
      "Tons de forno e farinha, tipografia Bodoni e ilustrações de ingredientes. A pizza do topo gira devagar e, mais abaixo, um forno em 3D acende conforme a rolagem.",
    features: [
      "Cardápio com categorias e destaques",
      "Personalização de itens e observações",
      "Carrinho e checkout com entrega ou retirada",
      "Pedido formatado enviado pelo WhatsApp",
      "Status de aberto/fechado pelo horário",
      "Acessibilidade e movimento reduzido respeitados",
    ],
    demoUrl: "https://claude.ai/artifact/26zEuMD77YFVuygwWRUYeQ",
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug) ?? null;
