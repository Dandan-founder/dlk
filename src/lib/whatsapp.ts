import { site } from "@/config/site";

/** Link do WhatsApp com mensagem pronta. Retorna null se o número da DLK não estiver configurado. */
export function whatsappUrl(message: string = site.messages.default, number: string | null = site.contact.whatsapp): string | null {
  if (!number || !/^\d{10,15}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Link de e-mail com assunto e corpo. Retorna null se o e-mail não estiver configurado. */
export function mailtoUrl(subject: string, body: string, email: string | null = site.contact.email): string | null {
  if (!email) return null;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
