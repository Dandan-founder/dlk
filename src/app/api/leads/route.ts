import { NextResponse } from "next/server";
import { leadSchema, leadSummary, normalizePhone } from "@/lib/lead";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Recebe pedidos de orçamento.
 * Entrega: POST JSON para LEADS_WEBHOOK_URL (Make, Zapier, n8n, Formspree, Slack, planilha…),
 * com o cabeçalho X-DLK-Signature = LEADS_WEBHOOK_SECRET quando definido.
 * Sem webhook configurado, responde 503 `not_configured` — o formulário então oferece WhatsApp/e-mail
 * e avisa o visitante. Nunca simula um envio.
 */
export const runtime = "nodejs";

const json = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
  if (!rateLimit(`lead:${ip}`, 5, 10 * 60_000)) return json(429, { error: "rate_limited", message: "Muitos envios seguidos. Aguarde alguns minutos." });

  const type = req.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) return json(415, { error: "unsupported" });
  const raw = await req.text();
  if (raw.length > 10_000) return json(413, { error: "too_large" });

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid_json" });
  }
  // Campo-isca preenchido: robô. Responde como sucesso (para não ensinar o robô) e descarta.
  if (data && typeof data === "object" && typeof (data as { website?: unknown }).website === "string" && (data as { website: string }).website.length > 0) return json(200, { ok: true });

  const parsed = leadSchema.safeParse(data);
  if (!parsed.success) return json(422, { error: "invalid", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) });

  const lead = parsed.data;

  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return json(503, { error: "not_configured", message: "O recebimento de orçamentos pelo site ainda não foi configurado." });

  const { website: _ignored, ...clean } = lead;
  void _ignored;
  const payload = {
    source: "site-dlk",
    createdAt: new Date().toISOString(),
    lead: { ...clean, phone: normalizePhone(lead.phone) },
    summary: leadSummary(lead),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.LEADS_WEBHOOK_SECRET ? { "X-DLK-Signature": process.env.LEADS_WEBHOOK_SECRET } : {}) },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch (e) {
    console.error("[leads] falha ao entregar:", (e as Error).message);
    return json(502, { error: "delivery_failed", message: "Não conseguimos registrar seu pedido agora." });
  }
  return json(200, { ok: true });
}
