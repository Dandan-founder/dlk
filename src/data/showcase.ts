/**
 * "Imagine seu negócio assim": modelos por segmento.
 * - `preview: "shots"` usa capturas reais de um projeto conceito (com link para o case).
 * - `preview: "layout"` usa uma prévia de layout desenhada em código (componente MiniSite),
 *   claramente identificada como prévia — não é um site no ar.
 */
export type Segment = {
  id: "barbearia" | "restaurante" | "clinica" | "loja" | "escritorio";
  label: string;
  title: string;
  text: string;
  features: string[];
  preview: { kind: "shots"; projectSlug: string } | { kind: "layout" };
};

export const segments: Segment[] = [
  {
    id: "barbearia",
    label: "Barbearia Premium",
    title: "Agenda cheia, sem telefone tocando.",
    text: "Site editorial com agendamento online, escolha do barbeiro e lembrete no calendário do cliente.",
    features: ["Agendamento em tempo real", "Perfis da equipe", "Galeria de cortes", "Painel para o dono"],
    preview: { kind: "shots", projectSlug: "blackstone-barber-club" },
  },
  {
    id: "restaurante",
    label: "Restaurante Moderno",
    title: "Um cardápio que dá fome.",
    text: "Cardápio bonito e rápido no celular, pedido montado no site e enviado pronto para o WhatsApp.",
    features: ["Cardápio por categorias", "Pedido via WhatsApp", "Aberto/fechado automático", "Mapa e rota"],
    preview: { kind: "shots", projectSlug: "brace-pizzaria" },
  },
  {
    id: "clinica",
    label: "Clínica Sofisticada",
    title: "Confiança antes da primeira consulta.",
    text: "Especialidades, corpo clínico e convênios explicados com calma, e o agendamento a um toque.",
    features: ["Especialidades e equipe", "Convênios aceitos", "Agendamento ou WhatsApp", "Conteúdo educativo"],
    preview: { kind: "layout" },
  },
  {
    id: "loja",
    label: "Loja Virtual",
    title: "Produto em evidência, checkout sem atrito.",
    text: "Vitrine com fotos valorizadas, filtros úteis e um carrinho que não abandona o cliente no meio do caminho.",
    features: ["Catálogo com filtros", "Carrinho e checkout", "Pagamentos e frete", "Cupons e coleções"],
    preview: { kind: "layout" },
  },
  {
    id: "escritorio",
    label: "Escritório Profissional",
    title: "Autoridade em cada página.",
    text: "Áreas de atuação, equipe e artigos organizados para transmitir seriedade e facilitar o primeiro contato.",
    features: ["Áreas de atuação", "Equipe e credenciais", "Artigos e notícias", "Contato qualificado"],
    preview: { kind: "layout" },
  },
];
