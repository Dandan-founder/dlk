/* eslint-disable */
/**
 * Testes ponta a ponta da DLK (Playwright + axe-core).
 *
 *   npm run build && npm run test:e2e
 *
 * Sobe `next start` numa porta livre com um receptor de webhook local (para testar o envio real
 * do orçamento), percorre o site em desktop e celular e imprime um relatório. Sai com 1 se algo falhar.
 */
const { chromium, devices } = require("playwright");
const { spawn } = require("node:child_process");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 3499;
const HOOK_PORT = 4599;
const BASE = process.env.BASE_URL || `http://localhost:${PORT}`;
const OUT = process.env.E2E_OUT || path.join(__dirname, "..", "..", "test-results", "e2e");
fs.mkdirSync(OUT, { recursive: true });
const PAGES = ["/", "/projetos", "/projetos/blackstone-barber-club", "/projetos/brace-pizzaria", "/orcamento", "/privacidade", "/termos"];

const results = [];
async function test(name, fn) {
  const t0 = Date.now();
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✓ ${name} (${Date.now() - t0} ms)`);
  } catch (e) {
    results.push({ name, ok: false, error: e.message.split("\n")[0] });
    console.log(`  ✗ ${name}\n      ${e.message.split("\n").slice(0, 4).join("\n      ")}`);
  }
}
const assert = (c, m) => {
  if (!c) throw new Error(m);
};

// receptor de webhook: guarda os pedidos recebidos
const received = [];
const hook = http.createServer((req, res) => {
  let b = "";
  req.on("data", (c) => (b += c));
  req.on("end", () => {
    try {
      received.push({ headers: req.headers, body: JSON.parse(b) });
    } catch {}
    res.writeHead(200).end("ok");
  });
});

async function startServer() {
  if (process.env.BASE_URL) return null;
  const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "-p", String(PORT)], {
    cwd: path.join(__dirname, "..", ".."),
    env: { ...process.env, LEADS_WEBHOOK_URL: `http://localhost:${HOOK_PORT}/hook`, LEADS_WEBHOOK_SECRET: "teste" },
    stdio: "ignore",
  });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE + "/robots.txt")).ok) return child;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  child.kill();
  throw new Error("servidor não subiu (rodou npm run build?)");
}

async function open(ctx, url) {
  const p = await ctx.newPage();
  p.errors = [];
  p.on("pageerror", (e) => p.errors.push("pageerror: " + e.message.slice(0, 200)));
  p.on("console", (m) => m.type() === "error" && !/status of 404/.test(m.text()) && p.errors.push(m.text().slice(0, 200)));
  await p.goto(BASE + url, { waitUntil: "load" });
  return p;
}

(async () => {
  await new Promise((r) => hook.listen(HOOK_PORT, r));
  const server = await startServer();
  const browser = await chromium.launch();
  const desktop = { viewport: { width: 1440, height: 900 } };
  const phone = { ...devices["iPhone 13"] };
  try {
    console.log(`\nDLK e2e — ${BASE}\n`);

    await test("todas as páginas respondem 200, sem erros no console, com um único h1", async () => {
      const ctx = await browser.newContext(desktop);
      for (const u of PAGES) {
        const p = await open(ctx, u);
        const r = await p.request.get(BASE + u);
        assert(r.status() === 200, `${u} → ${r.status()}`);
        await p.waitForTimeout(500);
        assert((await p.locator("h1").count()) === 1, `${u}: precisa de exatamente 1 h1`);
        assert(p.errors.length === 0, `${u}: ${p.errors.join(" | ")}`);
        await p.close();
      }
      const nf = await fetch(BASE + "/pagina-que-nao-existe");
      assert(nf.status === 404, "404 esperado");
      const bad = await fetch(BASE + "/projetos/nao-existe");
      assert(bad.status === 404, "case inexistente deve dar 404");
      await ctx.close();
    });

    await test("links internos: nenhum quebrado, âncoras existem", async () => {
      const ctx = await browser.newContext(desktop);
      const hrefs = new Set();
      for (const u of PAGES) {
        const p = await open(ctx, u);
        (await p.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))).forEach((h) => hrefs.add(h));
        await p.close();
      }
      const internal = [...hrefs].filter((h) => h.startsWith("/"));
      for (const h of internal) {
        const [pathname, hash] = h.split("#");
        const r = await fetch(BASE + (pathname || "/"));
        assert(r.status === 200, `${h} → ${r.status}`);
        if (hash) {
          const html = await r.text();
          assert(html.includes(`id="${hash}"`), `âncora #${hash} não existe em ${pathname || "/"}`);
        }
      }
      const external = [...hrefs].filter((h) => /^https?:/.test(h));
      assert(external.every((h) => !/wa\.me\/(undefined|null)|example\.com/.test(h)), "link externo suspeito: " + external.join(", "));
      console.log(`      ${internal.length} links internos e ${external.length} externos verificados`);
      await ctx.close();
    });

    await test("SEO: metadados, canonical, Open Graph, JSON-LD, sitemap e robots", async () => {
      for (const u of PAGES) {
        const html = await (await fetch(BASE + u)).text();
        const head = html.slice(0, html.indexOf("</head>"));
        assert(/<title>[^<]{10,}<\/title>/.test(head), `${u}: título`);
        assert(/name="description" content="[^"]{50,}"/.test(head), `${u}: descrição`);
        assert(/rel="canonical"/.test(head), `${u}: canonical`);
        assert(/property="og:image"/.test(head), `${u}: og:image`);
        assert(/<html lang="pt-BR"/.test(html), `${u}: lang`);
      }
      const home = await (await fetch(BASE + "/")).text();
      assert(home.includes('"@type":"ProfessionalService"') && home.includes('"@type":"FAQPage"'), "JSON-LD da home");
      const sm = await (await fetch(BASE + "/sitemap.xml")).text();
      assert(sm.includes("/projetos/blackstone-barber-club") && !sm.includes("/api"), "sitemap");
      const rb = await (await fetch(BASE + "/robots.txt")).text();
      assert(/Disallow: \/api\//.test(rb) && /Sitemap:/.test(rb), "robots");
    });

    await test("[celular] menu: abre, prende o foco, Esc fecha e devolve o foco", async () => {
      const ctx = await browser.newContext(phone);
      const p = await open(ctx, "/");
      await p.waitForTimeout(2200);
      const trigger = p.getByRole("button", { name: "Abrir menu" });
      await trigger.click();
      const dlg = p.getByRole("dialog");
      await dlg.waitFor();
      for (let i = 0; i < 12; i++) await p.keyboard.press("Tab");
      assert(await dlg.evaluate((d) => d.contains(document.activeElement)), "foco escapou do menu");
      await p.keyboard.press("Escape");
      await dlg.waitFor({ state: "detached" });
      assert(await trigger.evaluate((b) => b === document.activeElement), "foco não voltou ao botão");
      await p.getByRole("button", { name: "Abrir menu" }).click();
      await p.getByRole("dialog").getByRole("link", { name: /Projetos/ }).click();
      await p.waitForURL(/\/projetos$/);
      await ctx.close();
    });

    await test("serviços: painel troca no desktop e acordeão abre no celular", async () => {
      let ctx = await browser.newContext(desktop);
      let p = await open(ctx, "/");
      await p.locator("#servico-agenda button").hover();
      await p.getByRole("complementary", { name: "Detalhes do serviço" }).getByText("Sistemas de Agendamento").waitFor();
      await ctx.close();
      ctx = await browser.newContext(phone);
      p = await open(ctx, "/");
      const b = p.locator("#servico-ecommerce button");
      await b.scrollIntoViewIfNeeded();
      await b.click();
      assert((await b.getAttribute("aria-expanded")) === "true", "acordeão não abriu");
      assert(await p.locator("#servico-painel-ecommerce").isVisible(), "painel não visível");
      await ctx.close();
    });

    await test("modelos: abas pelo teclado e alternância computador/celular", async () => {
      const ctx = await browser.newContext(desktop);
      const p = await open(ctx, "/");
      const first = p.getByRole("tab", { name: "Barbearia Premium" });
      await first.scrollIntoViewIfNeeded();
      await first.focus();
      await p.keyboard.press("ArrowRight");
      await p.keyboard.press("ArrowRight");
      const sel = p.getByRole("tab", { name: "Clínica Sofisticada" });
      assert((await sel.getAttribute("aria-selected")) === "true", "seta não trocou de aba");
      assert(await sel.evaluate((t) => t === document.activeElement), "foco não acompanhou a aba");
      await p.getByText("Prévia de layout · ilustrativa").waitFor();
      await p.getByRole("button", { name: "Celular", exact: true }).click();
      assert((await p.getByRole("button", { name: "Celular", exact: true }).getAttribute("aria-pressed")) === "true", "alternância");
      await p.getByRole("tab", { name: "Barbearia Premium" }).click();
      await p.getByText("Capturas reais · projeto conceito").waitFor();
      await ctx.close();
    });

    await test("portfólio: filtros, estado vazio honesto e cases com/sem demonstração", async () => {
      const ctx = await browser.newContext(desktop);
      const p = await open(ctx, "/projetos");
      await p.getByRole("button", { name: /^Clínicas/ }).click();
      await p.getByText("Ainda não publicamos um projeto de clínicas").waitFor();
      await p.getByRole("button", { name: /^Barbearias/ }).click();
      await p.getByRole("link", { name: /Blackstone Barber Club.*Ver estudo de caso/ }).waitFor();
      assert((await p.getByRole("link", { name: /Brace Pizzaria.*Ver estudo de caso/ }).count()) === 0, "filtro não filtrou");
      assert((await p.getByText("Projeto conceito").count()) >= 1, "selo de projeto conceito ausente");
      const b = await open(ctx, "/projetos/blackstone-barber-club");
      await b.getByRole("heading", { name: /Demonstração ao vivo em breve/ }).waitFor();
      assert((await b.getByRole("link", { name: /Abrir demonstração/ }).count()) === 0, "barbearia não tem demo pública");
      const r = await open(ctx, "/projetos/brace-pizzaria");
      const demo = r.getByRole("link", { name: /Abrir demonstração/ });
      assert((await demo.getAttribute("target")) === "_blank" && (await demo.getAttribute("rel")).includes("noopener"), "link externo seguro");
      await ctx.close();
    });

    for (const [label, opts] of [["desktop", desktop], ["celular", phone]]) {
      await test(`[${label}] orçamento: pré-preenchimento, validação e envio real ao webhook`, async () => {
        const ctx = await browser.newContext(opts);
        const p = await open(ctx, "/orcamento?servico=agenda&plano=pro");
        const before = received.length;
        await p.getByText("Barbearia ou salão").click();
        await p.getByRole("heading", { name: "Qual tipo de site você precisa?" }).waitFor();
        assert(await p.getByRole("radio", { name: "Sistema de agendamento" }).isChecked(), "não pré-preencheu pelo link");
        await p.getByRole("button", { name: /Continuar/ }).click();
        await p.getByText("Agendamento online").click();
        await p.getByRole("button", { name: /Continuar/ }).click();
        await p.getByText("Tenho só o logotipo").click();
        await p.getByText("Prefiro conversar antes").click();
        await p.getByText("Sem pressa").click();
        await p.getByRole("heading", { name: "Como falamos com você?" }).waitFor();
        assert((await p.getByLabel(/Conte um pouco/).inputValue()).includes("plano PRO"), "mensagem do plano não veio");
        await p.getByRole("button", { name: /Enviar pedido/ }).click();
        await p.getByText("Informe seu nome.").waitFor();
        await p.getByText(/Precisamos do seu consentimento/).waitFor();
        await p.getByLabel("Seu nome").fill("Ana Teste");
        await p.getByLabel("WhatsApp com DDD").pressSequentially("11987654321");
        assert((await p.getByLabel("WhatsApp com DDD").inputValue()) === "(11) 98765-4321", "máscara do telefone");
        await p.getByRole("checkbox", { name: /Concordo/ }).check();
        await p.getByRole("button", { name: /Enviar pedido/ }).click();
        await p.getByRole("heading", { name: /Pedido recebido/ }).waitFor({ timeout: 10000 });
        assert(received.length === before + 1, "webhook não recebeu o pedido");
        const last = received[received.length - 1];
        assert(last.body.lead.phone === "5511987654321" && last.body.lead.siteType === "Sistema de agendamento", "conteúdo do pedido");
        assert(last.headers["x-dlk-signature"] === "teste", "assinatura do webhook");
        await p.screenshot({ path: path.join(OUT, `orcamento-${label}.png`) });
        assert(p.errors.length === 0, p.errors.join(" | "));
        await ctx.close();
      });
    }

    await test("perguntas frequentes: acordeão pelo teclado", async () => {
      const ctx = await browser.newContext(desktop);
      const p = await open(ctx, "/");
      const q = p.getByRole("button", { name: "Como funciona a manutenção?" });
      await q.scrollIntoViewIfNeeded();
      await q.focus();
      await p.keyboard.press("Enter");
      assert((await q.getAttribute("aria-expanded")) === "true", "não abriu com Enter");
      await p.getByText(/opcional e contratada à parte/).waitFor();
      await ctx.close();
    });

    await test("cursor personalizado só com mouse; abertura só na 1ª visita", async () => {
      let ctx = await browser.newContext(desktop);
      let p = await open(ctx, "/");
      await p.mouse.move(400, 400);
      await p.waitForFunction(() => document.documentElement.classList.contains("has-cursor"), null, { timeout: 5000 }).catch(() => {});
      assert(await p.evaluate(() => document.documentElement.classList.contains("has-cursor")), "cursor não ativou com mouse");
      assert(!(await p.evaluate(() => document.documentElement.classList.contains("intro-skip"))), "abertura deveria tocar na 1ª visita");
      await p.goto(BASE + "/projetos");
      assert(await p.evaluate(() => document.documentElement.classList.contains("intro-skip")), "abertura repetiu na mesma sessão");
      await ctx.close();
      ctx = await browser.newContext(phone);
      p = await open(ctx, "/");
      await p.waitForTimeout(500);
      assert(!(await p.evaluate(() => document.documentElement.classList.contains("has-cursor"))), "cursor ativou no toque");
      await ctx.close();
    });

    await test("movimento reduzido: nada escondido, sem abertura, sem rolagem suave", async () => {
      const ctx = await browser.newContext({ ...desktop, reducedMotion: "reduce" });
      for (const u of ["/", "/projetos", "/orcamento"]) {
        const p = await open(ctx, u);
        await p.waitForTimeout(800);
        const hidden = await p.evaluate(() => [...document.querySelectorAll("[data-hide], [data-reveal]")].filter((e) => getComputedStyle(e).visibility === "hidden" || Number(getComputedStyle(e).opacity) < 0.5).length);
        assert(hidden === 0, `${u}: ${hidden} elementos invisíveis`);
        assert(!(await p.locator("#intro").isVisible()), `${u}: abertura apareceu`);
        assert(!(await p.evaluate(() => document.documentElement.classList.contains("lenis"))), `${u}: rolagem suave ativa`);
        await p.close();
      }
      await ctx.close();
    });

    await test("acessibilidade (axe, WCAG 2.1 AA) em todas as páginas, desktop e celular", async () => {
      const report = [];
      for (const [label, opts] of [["desktop", desktop], ["celular", phone]]) {
        const ctx = await browser.newContext({ ...opts, reducedMotion: "reduce" });
        for (const u of PAGES) {
          const p = await open(ctx, u);
          await p.waitForTimeout(600);
          await p.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
          const v = await p.evaluate(async () => (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } })).violations.map((x) => ({ id: x.id, impact: x.impact, n: x.nodes.length, t: x.nodes[0]?.target.join(" ") })));
          v.forEach((x) => report.push(`[${label}] ${u} ${x.impact} ${x.id} ×${x.n} (${x.t})`));
          await p.close();
        }
        await ctx.close();
      }
      fs.writeFileSync(path.join(OUT, "axe.txt"), report.join("\n") || "sem violações");
      const bad = report.filter((l) => / (serious|critical) /.test(l));
      assert(bad.length === 0, bad.join("\n"));
    });

    await test("responsivo: sem rolagem horizontal em 360, 768, 1024, 1440 e 2560 px", async () => {
      for (const w of [360, 768, 1024, 1440, 2560]) {
        const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
        for (const u of PAGES) {
          const p = await open(ctx, u);
          await p.waitForTimeout(300);
          const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          assert(over <= 1, `${u} @${w}px: ${over}px de rolagem horizontal`);
          if (u === "/") await p.screenshot({ path: path.join(OUT, `home-${w}.png`) });
          await p.close();
        }
        await ctx.close();
      }
    });
  } finally {
    await browser.close();
    server?.kill();
    hook.close();
  }
  const fail = results.filter((r) => !r.ok);
  console.log(`\n${results.length - fail.length}/${results.length} testes passaram. Capturas em ${OUT}\n`);
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(results, null, 2));
  process.exit(fail.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
