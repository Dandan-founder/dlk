# Relatório de testes — site DLK

Execução de 09/11/2026, Linux, Node 22, Chromium do Playwright. Todos os números vêm de execuções reais.

| Verificação | Comando | Resultado |
|---|---|---|
| Lint | `npm run lint` | ✅ sem erros nem avisos |
| Tipos | `npm run typecheck` | ✅ sem erros |
| Build de produção | `npm run build` | ✅ todas as rotas geradas |
| Unitários | `npm test` | ✅ 16/16 |
| Ponta a ponta + acessibilidade + responsivo | `npm run test:e2e` | ✅ 14/14 |
| axe-core (WCAG 2.0/2.1 A e AA), 7 páginas × desktop e celular | dentro do e2e | ✅ nenhuma violação |

## Lighthouse (`next start` local)

| Página | Desempenho celular | Desempenho desktop | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|---|
| `/` | 94–97 (3 medições) | 98 | 100 | 100 | 100 |
| `/projetos` | 93 | 99 | 100 | 100 | 100 |
| `/projetos/blackstone-barber-club` | 93 | 99 | 100 | 100 | 100 |
| `/orcamento` | 96 | 100 | 100 | 100 | 100 |

Os valores de desktop de `/` e das páginas internas são da medição anterior às últimas otimizações (que só reduziram trabalho). Na Vercel/CDN os números podem variar.

## O que os testes cobrem

**Unitários:** normalização e validação de telefone brasileiro; schema completo do orçamento (consentimento, nome, opções válidas, e-mail); validação por etapa; resumo sem o campo-isca; links de WhatsApp/e-mail nunca gerados sem contato configurado; limite de tentativas; API `/api/leads`: 503 sem webhook (sem simular sucesso), 422 para dados inválidos, campo-isca descartado em silêncio, entrega com telefone normalizado, 502 quando o webhook falha e 429 após 5 envios do mesmo IP.

**Ponta a ponta:**
- 7 páginas com status 200, sem erros no console e um único `h1`; 404 real para rota e projeto inexistentes
- 24 links internos sem quebra e todas as âncoras existentes; nenhum link externo inventado
- título, descrição, canonical, `og:image` e `lang` em todas as páginas; JSON-LD `ProfessionalService` e `FAQPage`; sitemap e robots
- menu do celular: abre, prende o foco, `Esc` fecha e o foco volta ao botão
- serviços: painel do desktop troca ao passar o mouse; acordeão abre no celular
- vitrine: abas pelas setas do teclado e alternância computador/celular
- portfólio: filtros, estado vazio honesto, selo "Projeto conceito", demonstração só onde existe (com `noopener`)
- orçamento (desktop e celular): pré-preenchimento pelo link, mensagens de erro, máscara de telefone e **envio real** recebido pelo webhook de teste, com assinatura
- FAQ pelo teclado; cursor só com mouse; abertura só na primeira visita da sessão
- movimento reduzido: nada invisível, sem abertura, sem rolagem suave
- sem rolagem horizontal em 360, 768, 1024, 1440 e 2560 px

## Problemas encontrados e corrigidos

- Revelações com `visibility: hidden` escondiam perguntas, serviços e títulos de leitores de tela até serem rolados → trocado por `opacity`
- Texto branco sobre o laranja da marca com contraste 2,98:1 → texto quase preto (6,5:1) em botões, filtros, abas e CTA final
- Campo-isca preenchido recebia 422 (revelando a detecção ao robô) → agora é descartado em silêncio
- Etapa pré-preenchida não avançava ao clicar na opção já marcada; setas do teclado avançavam etapa sem querer → só o clique avança
- Rolagem automática do formulário deslocava a página na horizontal no celular → rolagem só vertical e `overflow: clip` nas seções decorativas
- Contador do processo deslocava a lista inteira → cálculo corrigido
- Gatilhos de rolagem do processo não eram desfeitos ao sair da página → passam a ser limpos
- Desempenho móvel da home 72 → 94–97: shader a 30 fps, resolução menor, imagem parada sem GPU, animações abaixo da dobra preparadas em momento ocioso e abertura mais curta
- Hierarquia de títulos em `/projetos` (h1 → h3) → cartões usam h2 nessa página

## Não testado aqui

- Safari e Firefox reais, leitores de tela reais (apenas Chromium + axe)
- Webhook real de produção (testado com receptor local)
- Celulares físicos (apenas emulação)
