import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Política de privacidade", description: "Como a DLK trata os dados enviados pelo site, conforme a LGPD.", alternates: { canonical: "/privacidade" } };

export default function Privacidade() {
  return (
    <LegalPage title={["Política de", "privacidade"]} updated="9 de novembro de 2026">
      <p>
        Esta política explica, de forma direta, quais dados a {site.legalName} recebe pelo site, para que usa e quais são os seus direitos segundo a Lei Geral de Proteção de Dados (Lei 13.709/2018).
      </p>
      <div>
        <h2>Quais dados coletamos</h2>
        <ul>
          <li>No formulário de orçamento: nome, WhatsApp, e-mail (opcional), empresa (opcional) e as respostas sobre o seu projeto.</li>
          <li>Ao clicar em um botão de WhatsApp: a conversa acontece no aplicativo do WhatsApp, sob as regras dele.</li>
          <li>Dados técnicos mínimos de acesso (como endereço IP), usados só para segurança e para limitar envios abusivos.</li>
        </ul>
      </div>
      <div>
        <h2>Para que usamos</h2>
        <p>Exclusivamente para responder ao seu pedido, preparar a proposta e conversar sobre o projeto. Não vendemos, alugamos ou compartilhamos seus dados para publicidade. Base legal: consentimento e procedimentos preliminares a um contrato, a seu pedido (art. 7º, I e V).</p>
      </div>
      <div>
        <h2>Cookies e rastreamento</h2>
        <p>Este site não usa cookies de publicidade. A preferência de ver a animação de abertura apenas uma vez fica guardada só no seu navegador (armazenamento de sessão), sem identificar você.</p>
      </div>
      <div>
        <h2>Por quanto tempo guardamos</h2>
        <p>Pelo tempo necessário para a negociação e, se houver contrato, pelos prazos legais aplicáveis. Pedidos que não avançarem são excluídos em até 12 meses, ou antes, se você pedir.</p>
      </div>
      <div>
        <h2>Seus direitos</h2>
        <p>Você pode pedir acesso, correção, exclusão ou portabilidade dos seus dados, e revogar o consentimento a qualquer momento{site.contact.email ? <>, pelo e-mail <strong>{site.contact.email}</strong></> : ", pelos canais de contato informados no site"}.</p>
      </div>
      <p className="text-[0.9rem]">Este texto é um modelo inicial e deve ser revisado pela assessoria jurídica da DLK antes da publicação definitiva.</p>
    </LegalPage>
  );
}
