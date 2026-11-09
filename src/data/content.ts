/** Textos editáveis das seções da home. */

export const hero = {
  lines: ["Seu negócio", "merece mais", "que um site"],
  sub: "Criamos experiências digitais que destacam sua marca e transformam visitantes em oportunidades.",
  note: "Orçamento sem custo: você recebe escopo, prazo e investimento antes de decidir.",
  primary: "Quero meu site",
  secondary: "Explorar projetos",
};

export const about = {
  eyebrow: "Sobre a DLK",
  title: ["Design que impressiona.", "Tecnologia que entrega."],
  lead:
    "A DLK é uma agência digital brasileira que cria sites sob medida para empresas, negócios locais e profissionais que querem ser levados a sério na internet.",
  blocks: [
    {
      k: "O que fazemos",
      v: "Sites institucionais, landing pages, lojas virtuais e sistemas de agendamento. Do primeiro rascunho ao site no ar, com design, desenvolvimento e publicação no mesmo time.",
    },
    {
      k: "Para quem",
      v: "Barbearias, restaurantes, clínicas, escritórios, academias, lojas e profissionais autônomos. Negócios em que a primeira impressão decide se o cliente entra em contato ou vai para o concorrente.",
    },
    {
      k: "Por que importa",
      v: "Hoje o cliente pesquisa antes de ligar. Um site rápido, bonito e claro passa a mesma confiança que um bom atendimento, e trabalha por você o dia inteiro.",
    },
  ],
  marquee: ["Design autoral", "Mobile first", "Performance", "SEO técnico", "Acessibilidade", "Conversão"],
};

export const process = [
  { n: "01", title: "Descoberta", text: "Entendemos seu negócio, seu público e seus objetivos. Uma conversa e um questionário curto bastam para começar." },
  { n: "02", title: "Estratégia", text: "Planejamos a estrutura do site, as páginas e o caminho que o visitante faz até entrar em contato." },
  { n: "03", title: "Design", text: "Criamos uma identidade visual digital personalizada e você aprova as telas antes de qualquer linha de código." },
  { n: "04", title: "Desenvolvimento", text: "Transformamos o design em um site rápido, responsivo e acessível, testado em celular, tablet e computador." },
  { n: "05", title: "Lançamento", text: "Publicamos no seu domínio, configuramos o básico de SEO e validamos formulários, links e integrações." },
  { n: "06", title: "Evolução", text: "Seguimos com ajustes, novas páginas e melhorias, conforme o plano de manutenção contratado." },
];

export const differentials = [
  { n: "01", title: "Design personalizado", text: "Nada de template genérico: cada site nasce da identidade do seu negócio." },
  { n: "02", title: "Experiência mobile", text: "Pensado primeiro para o celular, onde a maioria dos clientes vai te encontrar." },
  { n: "03", title: "Performance", text: "Código enxuto, imagens otimizadas e carregamento rápido, medido antes da entrega." },
  { n: "04", title: "SEO técnico", text: "Estrutura, metadados e dados estruturados que ajudam o Google a entender seu site." },
  { n: "05", title: "Facilidade de contato", text: "WhatsApp, formulário e telefone sempre a um toque, nos lugares certos." },
  { n: "06", title: "Integrações", text: "Agendamento, pagamentos, mapas, analytics e ferramentas que você já usa." },
  { n: "07", title: "Navegação intuitiva", text: "O visitante encontra o que procura sem pensar. Menos cliques, mais contatos." },
  { n: "08", title: "Estrutura escalável", text: "Base sólida para crescer com novas páginas, idiomas ou funcionalidades." },
];

/**
 * Planos. Preços configuráveis: deixe `price: null` para mostrar "sob consulta".
 * Exemplo: price: "a partir de R$ 1.990".
 */
export const plans = [
  {
    id: "start",
    name: "Start",
    tagline: "Para negócios que precisam de presença digital profissional.",
    price: null as string | null,
    features: ["Site de uma página (one page)", "Design personalizado", "Versão mobile caprichada", "Botão de WhatsApp e mapa", "SEO técnico básico", "Publicação no seu domínio"],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Para empresas que desejam uma experiência mais personalizada.",
    price: null as string | null,
    features: ["Site com várias páginas", "Animações e interações sob medida", "Formulários e integrações", "Blog ou portfólio gerenciável", "SEO técnico completo", "Relatório de performance na entrega"],
    highlight: true,
  },
  {
    id: "custom",
    name: "Custom",
    tagline: "Para projetos avançados e funcionalidades específicas.",
    price: null as string | null,
    features: ["Agendamento, área do cliente ou loja virtual", "Painel administrativo", "Integrações com sistemas e APIs", "Arquitetura sob medida", "Testes automatizados", "Plano de evolução contínua"],
    highlight: false,
  },
];

export const faq = [
  {
    q: "Quanto custa desenvolver um site?",
    a: "Depende do tamanho e das funcionalidades. Um site de uma página custa bem menos que uma loja virtual ou um sistema de agendamento. Preencha o orçamento (leva uns 2 minutos) e respondemos com uma proposta clara, sem custo e sem compromisso.",
  },
  {
    q: "Quanto tempo leva para ficar pronto?",
    a: "Sites de uma página costumam ficar prontos em algumas semanas. Projetos maiores, com várias páginas ou sistemas, levam mais. O prazo exato entra na proposta, combinado com você antes de começarmos.",
  },
  {
    q: "O site funciona no celular?",
    a: "Sim, e desenhamos pensando no celular primeiro. Testamos em diferentes tamanhos de tela, do celular pequeno ao monitor ultrawide, antes de entregar.",
  },
  {
    q: "Posso solicitar alterações?",
    a: "Pode. Você aprova o design antes do desenvolvimento, e a proposta define quantas rodadas de ajustes estão incluídas. Depois do lançamento, alterações entram na manutenção ou são orçadas à parte.",
  },
  {
    q: "Vocês desenvolvem sistemas de agendamento?",
    a: "Sim. Fazemos agendamento online com horários reais de cada profissional, regras de cancelamento e painel para a equipe. Veja o projeto conceito Blackstone Barber Club no portfólio.",
  },
  {
    q: "Posso ter um site parecido com os modelos?",
    a: "Pode usar os modelos como ponto de partida. Mesmo assim, o seu site recebe identidade própria: cores, textos, fotos e estrutura pensados para o seu negócio, não uma cópia.",
  },
  {
    q: "Como funciona a manutenção?",
    a: "É opcional e contratada à parte, em formato mensal ou por demanda. Inclui atualizações de conteúdo, ajustes, atualizações técnicas e novas páginas, conforme o escopo combinado.",
  },
];

export const finalCta = {
  lines: ["Seu próximo nível", "começa aqui"],
  sub: "Vamos transformar sua ideia em uma presença digital que merece ser vista.",
  button: "Começar meu projeto",
};
