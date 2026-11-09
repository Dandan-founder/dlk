import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Termos de uso", description: "Termos de uso do site da DLK Agência Digital: conteúdo, projetos conceito, orçamentos, resultados e links externos.", alternates: { canonical: "/termos" } };

export default function Termos() {
  return (
    <LegalPage title={["Termos", "de uso"]} updated="9 de novembro de 2026">
      <p>Ao navegar neste site, você concorda com os termos abaixo. Eles valem para o uso do site, não substituem o contrato de prestação de serviços firmado com cada cliente.</p>
      <div>
        <h2>Conteúdo e projetos</h2>
        <p>
          Os textos, o design e o código deste site pertencem à {site.legalName}. Projetos marcados como <strong>projeto conceito</strong> são demonstrações criadas pela DLK: os negócios, nomes, endereços e dados que aparecem neles são fictícios. Fotografias de terceiros usadas nas demonstrações seguem as licenças de seus bancos de imagem.
        </p>
      </div>
      <div>
        <h2>Orçamentos</h2>
        <p>Enviar o formulário não gera contratação nem cobrança. Escopo, prazo, investimento e condições são definidos em proposta formal, aceita pelas duas partes.</p>
      </div>
      <div>
        <h2>Resultados</h2>
        <p>Trabalhamos para entregar sites rápidos, acessíveis e tecnicamente preparados para buscadores, mas não garantimos posições no Google nem resultados de vendas, que dependem de fatores fora do site.</p>
      </div>
      <div>
        <h2>Links externos</h2>
        <p>Demonstrações e redes sociais podem abrir em outros sites, que têm suas próprias políticas.</p>
      </div>
      <p className="text-[0.9rem]">Este texto é um modelo inicial e deve ser revisado pela assessoria jurídica da DLK antes da publicação definitiva.</p>
    </LegalPage>
  );
}
