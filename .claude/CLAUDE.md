# DLK (agência) — instruções do projeto para o Claude

**Stack:** Next.js 15 (servidor) · React 19 · TypeScript · Tailwind 4 · GSAP + ScrollTrigger + Lenis.
Leia o `README.md` antes de mudar algo: ele diz onde fica cada conteúdo editável.

## Estúdio (agentes e skills deste repositório)
Os agentes ficam em `.claude/agents/` e as skills em `.claude/skills/`. As skills foram copiadas das fontes
originais, com licença MIT/Apache, para o projeto funcionar em qualquer computador.
Skills deste projeto: `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react`, `gsap-plugins`, `gsap-performance`, `cinematic-gsap-lenis-motion-system`, `frontend-design`, `webapp-testing`, `verification-before-completion`.

Quem edita o quê (um agente por arquivo; revisores só leem):

| Agente | Arquivos |
|---|---|
| senior-frontend | `src/app/**`, `src/components/{layout,sections,projects,showcase,forms,ui,brand}/**`, `src/lib/{lead,rate-limit,utils,whatsapp}.ts` |
| motion-designer | `src/lib/gsap.ts`, `src/components/motion/**`, `src/components/layout/{SmoothScroll,Cursor}.tsx` |
| creative-director, ui-ux-designer, performance-engineer, visual-qa | não editam; entregam brief, revisão ou medição |

## Regras de movimento (não negociáveis)
- Animar só `transform` (inclui `translate`/`scale`/`rotate` do Tailwind 4) e `opacity`. Nada de `width`, `height`,
  `top`/`left`, `padding`, `filter`, `clip-path` ou `background-position` em animação ou transição.
- No Tailwind 4, `translate-*`, `scale-*` e `rotate-*` usam as propriedades CSS próprias: a transição precisa
  listá-las (`transition-[transform,translate,rotate,scale]` ou `transition-transform`).
- Sem `backdrop-filter` em elementos fixos/sticky; use fundo sólido.
- Máscara/cortina: use uma "folha" que anda com transform, ou o par moldura + conteúdo em sentidos opostos.
- Animações contínuas pausam fora da tela; as abaixo da dobra são preparadas no ocioso.
- `prefers-reduced-motion`: tudo visível e parado.

## Antes de dizer "pronto"
```bash
npm run lint
npm run typecheck
npm test
npm run build
NODE_PATH=$(npm root -g) npm run test:e2e
```
E medir a rolagem no celular simulado com CPU 4x mais lenta: meta ~60 fps e ~0 quadros acima de 50 ms
(peça ao agente `performance-engineer`).
