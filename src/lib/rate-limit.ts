/**
 * Limite de tentativas em memória (janela deslizante por chave).
 * Em hospedagem com várias instâncias o limite vale por instância; para um limite global,
 * troque por um armazenamento compartilhado (ex.: Upstash Redis).
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= limit) {
    hits.set(key, list);
    return false;
  }
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}
