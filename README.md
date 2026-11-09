# DLK Agência Digital — site oficial

Site institucional e comercial da **DLK**, agência digital brasileira de sites, landing pages, lojas virtuais e sistemas de agendamento.

- **Home:** abertura animada, hero com shader WebGL reativo ao cursor, sobre, serviços (lista + painel interativo), portfólio, vitrine "Imagine seu negócio assim" (desktop/celular), processo com linha do tempo na rolagem, diferenciais, planos, perguntas frequentes e CTA final.
- **Portfólio:** `/projetos` com filtros por categoria e `/projetos/[slug]` com estudo de caso completo. Os dois projetos atuais são **projetos conceito** (Blackstone Barber Club e Brace Pizzaria), identificados como tal em todo o site.
- **Orçamento:** `/orcamento`, formulário em 7 etapas (React Hook Form + Zod), com pré-preenchimento pelos links do site, campo anti-robô, consentimento LGPD e envio real para um webhook configurável.
- **Legal:** `/privacidade` e `/termos` (modelos para revisão jurídica).

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + SplitText · Lenis · WebGL puro (shader do hero) · Radix UI · Lucide · React Hook Form · Zod · Vitest · Playwright · axe-core.

## Identidade visual

Paleta tirada do logotipo da DLK, em vez da sugestão de verde-limão: azul-marinho institucional `#13213C` levado ao quase-preto `#070B16` como fundo, e o **laranja do ponto `#F26A1C`** como única cor de destaque. O ponto do logotipo é o motivo visual do site: ele cai no lugar no fim do título do hero, cresce na seção Sobre, segue o cursor e toma a tela no CTA final. Tipografia: Inter Tight (títulos gigantes, tracking negativo) e JetBrains Mono (rótulos, como o "AGÊNCIA DIGITAL" do logo). O logotipo foi vetorizado a partir do arquivo original (`src/components/brand/Logo.tsx`).

Botões laranja usam texto quase preto: texto branco sobre esse laranja dá contraste 2,98:1, abaixo do mínimo de acessibilidade (4,5:1).

## Rodar localmente

Requisitos: Node.js 20+.

```bash
npm install
```

```bash
npm run dev
```

Abra http://localhost:3000. Funciona sem nenhuma variável de ambiente (veja abaixo o que muda quando elas estão definidas).

Build de produção:

```bash
npm run build && npm start
```

## Configuração

Copie `.env.example` para `.env.local` e preencha:

| Variável | Para quê | Sem ela |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Domínio final (SEO, sitemap, Open Graph) | Usa `https://dlk.com.br` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Botões de WhatsApp com mensagem por contexto | Botões levam ao formulário de orçamento |
| `NEXT_PUBLIC_CONTACT_EMAIL` | E-mail no rodapé, na privacidade e no fallback do formulário | Não aparece |
| `NEXT_PUBLIC_*_URL` (redes) | Links de Instagram, LinkedIn, Behance | Não aparecem |
| `LEADS_WEBHOOK_URL` | Recebe os pedidos de orçamento (POST JSON) | O formulário avisa que o envio automático não está ativo e oferece WhatsApp, e-mail ou copiar o resumo. **Nunca simula sucesso.** |
| `LEADS_WEBHOOK_SECRET` | Enviado em `X-DLK-Signature` para o webhook validar a origem | — |

Exemplo de pedido entregue ao webhook:

```json
{
  "source": "site-dlk",
  "createdAt": "2026-11-09T12:00:00.000Z",
  "lead": { "business": "Barbearia ou salão", "siteType": "Sistema de agendamento", "features": ["Agendamento online"], "identity": "Tenho só o logotipo", "budget": "Prefiro conversar antes", "timeline": "Sem pressa", "name": "Ana", "phone": "5511987654321", "email": "", "company": "", "message": "", "consent": true },
  "summary": "Olá! Quero um orçamento da DLK. ..."
}
```

Ferramentas como Make, Zapier, n8n ou Pipedream recebem esse JSON e podem enviar para e-mail, WhatsApp, planilha ou CRM.

## Editando o conteúdo

Tudo o que muda com frequência fica fora dos componentes:

- `src/config/site.ts` — nome, frase institucional, contatos (via env), redes, mensagens de WhatsApp por contexto, menu.
- `src/data/services.ts` — os 7 serviços.
- `src/data/projects.ts` — portfólio. Para adicionar um projeto real: copie um item, troque textos e imagens (`public/projects/<slug>/`) e use `kind: "cliente"`.
- `src/data/content.ts` — textos do hero, sobre, processo, diferenciais, **planos (preço configurável: `price: null` mostra "Sob consulta")**, FAQ e CTA final.
- `src/data/showcase.ts` — segmentos da vitrine "Imagine seu negócio assim".
- `src/lib/lead.ts` — opções e validação do formulário de orçamento.

## Publicar na Vercel

1. Envie o código para um repositório **privado** no GitHub.
2. Em https://vercel.com, entre com o GitHub → **Add New > Project** → escolha o repositório → **Deploy**.
3. Em **Settings > Environment Variables**, cadastre as variáveis do `.env.example` e faça um novo deploy.
4. Domínio próprio em **Settings > Domains**; depois atualize `NEXT_PUBLIC_SITE_URL`.

## Testes

| Comando | O que faz |
|---|---|
| `npm run lint` · `npm run typecheck` | ESLint e TypeScript |
| `npm test` | Unitários: validação do orçamento, telefone, links de WhatsApp, limite de tentativas e a API `/api/leads` em todos os cenários |
| `npm run test:e2e` | Ponta a ponta (rode `npm run build` antes): sobe o site com um receptor de webhook local e testa navegação, links, SEO, menu, serviços, vitrine, filtros, cases, orçamento completo, FAQ, cursor, movimento reduzido, axe (WCAG 2.1 AA) e responsividade de 360 a 2560 px |

Resultados da última execução: [`docs/TESTES.md`](docs/TESTES.md).

## Desempenho e acessibilidade (decisões)

- A abertura e a entrada do título do hero são **CSS puro**: aparecem na primeira pintura, sem esperar o JavaScript (LCP ≈ 0,9 s no celular simulado).
- Animações das seções abaixo da dobra são preparadas em momento ocioso do navegador.
- O shader do hero roda a 30 fps, em resolução reduzida, pausa fora da tela e vira imagem parada sem GPU ou com movimento reduzido.
- Revelações usam `opacity`, nunca `visibility`: o conteúdo segue acessível a leitores de tela antes de animar.
- `prefers-reduced-motion`: sem abertura, sem rolagem suave, sem cursor personalizado e sem animações contínuas.
- Cursor personalizado só com mouse; em campos de texto volta o cursor do sistema.

## Pendências que dependem da DLK

- Número de WhatsApp, e-mail, cidade e redes sociais reais.
- Webhook de recebimento de orçamentos (`LEADS_WEBHOOK_URL`).
- Domínio final.
- Revisão jurídica de `/privacidade` e `/termos`.
- Preços dos planos, se quiser exibi-los.
- Projetos reais de clientes, quando houver (hoje só há projetos conceito, sinalizados).
- Link público da demonstração da barbearia (ainda não publicada).
