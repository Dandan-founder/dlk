import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { ButtonLink } from "./Button";

/**
 * Botão de WhatsApp com a mensagem do contexto. Enquanto o número da DLK não estiver configurado
 * (NEXT_PUBLIC_WHATSAPP_NUMBER), o botão leva ao formulário de orçamento — nunca a um link falso.
 */
export function WhatsAppButton({
  message,
  children = "Falar com a DLK",
  variant = "ghost",
  size = "md",
  className,
  magnetic = true,
}: {
  magnetic?: boolean;
  message: string;
  children?: React.ReactNode;
  variant?: "primary" | "ghost" | "light" | "dark";
  size?: "md" | "lg";
  className?: string;
}) {
  const url = whatsappUrl(message);
  const label = (
    <span className="inline-flex items-center gap-2">
      {url && <MessageCircle className="h-4 w-4" aria-hidden />}
      {children}
    </span>
  );
  return url ? (
    <ButtonLink href={url} external variant={variant} size={size} arrow={false} magnetic={magnetic} className={className}>
      {label}
    </ButtonLink>
  ) : (
    <ButtonLink href="/orcamento" variant={variant} size={size} magnetic={magnetic} className={className}>
      {label}
    </ButtonLink>
  );
}
