# Relatório de testes — site DLK

Última execução: 09/11/2026 (após a segunda passagem de design), Linux, Node 22, Chromium do Playwright. Todos os números vêm de execuções reais.

| Verificação | Comando | Resultado |
|---|---|---|
| Lint | `npm run lint` | ✅ sem erros nem avisos |
| Tipos | `npm run typecheck` | ✅ sem erros |
| Build de produção | `npm run build` | ✅ todas as rotas geradas |
| Unitários | `npm test` | ✅ 16/16 |
| Ponta a ponta + acessibilidade + responsivo | `npm run test:e2e` | ✅ 15/15 |
| axe-core (WCAG 2.0/2.1 A e AA), 7 páginas × desktop e celular | dentro do e2e | ✅ nenhuma violação |

## Lighthouse (`next start` local)

| Página | Desempenho celular | Desempenho desktop | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|---|
| `/` | 95–98 | 100 | 100 | 100 | 100 |
| `/projetos` | 86–89 | 99 | 100 | 100 | 100 |
| `/projetos/brace-pizzaria` | 88 | 99 | 100 | 100 | 100 |
| `/orcamento` | 99 | 100 | 100 | 100 | 100 |

Nas páginas internas, o maior elemento é o título; o tempo real de renderização medido foi de ~100 ms, mas a simulação de celular do Lighthouse estima a espera pela fonte de display. Na Vercel/CDN os números podem variar.

## O que os testes cobrem

**Unitários:** telefone brasileiro; schema do orçamento; validação por etapa; resumo sem campo-isca; links de WhatsApp/e-mail nunca gerados sem contato configurado; limite de tentativas; API `/api/leads` (503 sem webhook, 422 inválido, campo-isca descartado, entrega correta, 502 em falha do webhook, 429 por IP).

**Ponta a ponta:** status, console e `h1` único em 7 páginas; 404s; links internos e âncoras; metadados, JSON-LD, sitemap e robots; menu do celular (foco preso, `Esc`); painel de serviços e acordeão; abas da vitrine pelo teclado e alternância de tela; filtros e estado vazio do portfólio; cases com e sem demonstração; **prévia do portfólio rolando a página inteira no hover**; orçamento completo no desktop e no celular com envio real a um webhook de teste; FAQ pelo teclado; cursor só com mouse; abertura só na primeira visita; movimento reduzido sem conteúdo escondido; sem rolagem horizontal de 360 a 2560 px.

## Segunda passagem de design: o que mudou

- Fundo do quase-preto genérico para o azul-marinho da marca; branco frio no lugar do creme
- Tipografia: Bricolage Grotesque condensada + Instrument Sans; fim da fonte mono e dos rótulos em caixa alta
- Hero: telas inclinadas + shader WebGL → um site se montando ao vivo (esqueleto → página real), sem WebGL
- Botões: rótulo rolando + seta → o ponto da marca que se expande para preencher o botão
- Transições: seções claras sobem como folhas sobre a seção anterior (o hero recua e escurece)
- Portfólio: prévia que percorre a página inteira do projeto no hover (captura completa só para mouse)
- Celular: hero com o site se montando no topo; barra fixa "Pedir orçamento" depois do hero
- Animação de entrada de cada bloco removida; ficaram os momentos com propósito
- Textura de granulado removida (decorativa; pesava na medição de LCP)

## Não testado aqui

- Safari e Firefox reais, leitores de tela reais (apenas Chromium + axe)
- Webhook real de produção (testado com receptor local)
- Celulares físicos (apenas emulação)
