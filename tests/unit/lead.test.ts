import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { leadSchema, leadSummary, normalizePhone, formatPhone, stepSchemas } from "@/lib/lead";
import { whatsappUrl, mailtoUrl } from "@/lib/whatsapp";
import { rateLimit } from "@/lib/rate-limit";

const valid = {
  business: "Barbearia ou salão",
  siteType: "Sistema de agendamento",
  features: ["Agendamento online", "Botão de WhatsApp"],
  identity: "Tenho só o logotipo",
  budget: "De R$ 2.000 a R$ 5.000",
  timeline: "Em até 30 dias",
  name: "Ana Teste",
  phone: "(11) 98765-4321",
  email: "",
  company: "",
  message: "",
  consent: true,
  website: "",
};

describe("telefone", () => {
  it("normaliza formatos brasileiros comuns", () => {
    expect(normalizePhone("(11) 98765-4321")).toBe("5511987654321");
    expect(normalizePhone("+55 11 98765-4321")).toBe("5511987654321");
    expect(normalizePhone("1132654321")).toBe("551132654321");
    expect(formatPhone("5511987654321")).toBe("(11) 98765-4321");
  });
  it("recusa números inválidos", () => {
    expect(normalizePhone("1199")).toBeNull();
    expect(normalizePhone("(01) 98765-4321")).toBeNull();
    expect(normalizePhone("11 88765-4321")).toBeNull(); // celular sem o 9
  });
});

describe("schema do orçamento", () => {
  it("aceita um pedido completo", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });
  it("exige consentimento, nome e WhatsApp válido", () => {
    const r = leadSchema.safeParse({ ...valid, consent: false, name: "A", phone: "123" });
    expect(r.success).toBe(false);
    const paths = r.success ? [] : r.error.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["consent", "name", "phone"]));
  });
  it("recusa opções fora da lista e e-mail inválido", () => {
    expect(leadSchema.safeParse({ ...valid, business: "Hackers" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, email: "nao-e-email" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, features: ["Inventada"] }).success).toBe(false);
  });
  it("cada etapa valida só os seus campos", () => {
    expect(stepSchemas[0].safeParse({ business: valid.business }).success).toBe(true);
    expect(stepSchemas[2].safeParse({ features: [] }).success).toBe(true);
    expect(stepSchemas[6].safeParse({ ...valid }).success).toBe(true);
  });
  it("resumo traz as respostas e nunca o campo-isca", () => {
    const s = leadSummary({ ...valid, website: "spam" } as never);
    expect(s).toContain("Barbearia ou salão");
    expect(s).toContain("(11) 98765-4321");
    expect(s).not.toContain("spam");
  });
});

describe("links de contato", () => {
  it("não cria link de WhatsApp sem número configurado", () => {
    expect(whatsappUrl("Olá", null)).toBeNull();
    expect(whatsappUrl("Olá", "123")).toBeNull();
    expect(mailtoUrl("a", "b", null)).toBeNull();
  });
  it("codifica a mensagem com número válido", () => {
    expect(whatsappUrl("Olá & tchau", "5511900001111")).toBe("https://wa.me/5511900001111?text=Ol%C3%A1%20%26%20tchau");
  });
});

describe("limite de tentativas", () => {
  it("bloqueia depois do limite e libera após a janela", () => {
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 1000, t + i)).toBe(true);
    expect(rateLimit("k", 3, 1000, t + 10)).toBe(false);
    expect(rateLimit("k", 3, 1000, t + 2000)).toBe(true);
  });
});

describe("API /api/leads", () => {
  const post = async (body: unknown, ip = String(Math.random())) => {
    const { POST } = await import("@/app/api/leads/route");
    return POST(new Request("http://x/api/leads", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body) }));
  };
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    delete process.env.LEADS_WEBHOOK_URL;
  });
  afterEach(() => vi.unstubAllGlobals());

  it("sem webhook configurado responde 503 e não finge sucesso", async () => {
    const r = await post(valid);
    expect(r.status).toBe(503);
    expect((await r.json()).error).toBe("not_configured");
  });
  it("dados inválidos: 422", async () => {
    process.env.LEADS_WEBHOOK_URL = "https://hook.test/x";
    const r = await post({ ...valid, consent: false });
    expect(r.status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("campo-isca preenchido: descarta sem entregar", async () => {
    process.env.LEADS_WEBHOOK_URL = "https://hook.test/x";
    const r = await post({ ...valid, website: "http://spam" });
    expect(r.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("entrega ao webhook com telefone normalizado e sem o campo-isca", async () => {
    process.env.LEADS_WEBHOOK_URL = "https://hook.test/x";
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
    const r = await post(valid);
    expect(r.status).toBe(200);
    const [, init] = fetchMock.mock.calls[0];
    const sent = JSON.parse(init.body);
    expect(sent.lead.phone).toBe("5511987654321");
    expect(sent.lead).not.toHaveProperty("website");
    expect(sent.summary).toContain("Ana Teste");
  });
  it("falha do webhook vira 502 (o visitante é avisado)", async () => {
    process.env.LEADS_WEBHOOK_URL = "https://hook.test/x";
    fetchMock.mockResolvedValue(new Response("erro", { status: 500 }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await post(valid)).status).toBe(502);
  });
  it("limita envios repetidos do mesmo IP", async () => {
    const codes = [];
    for (let i = 0; i < 6; i++) codes.push((await post(valid, "9.9.9.9")).status);
    expect(codes.slice(0, 5).every((c) => c === 503)).toBe(true);
    expect(codes[5]).toBe(429);
  });
});
