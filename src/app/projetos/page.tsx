import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Portfólio da DLK: sites, sistemas de agendamento e experiências digitais para barbearias, restaurantes, clínicas, lojas e serviços.",
  alternates: { canonical: "/projetos" },
};

export default function ProjetosPage() {
  return (
    <>
      <PageHero title={["Projetos que", "falam por si"]}>
        <p>
          Cada projeto aqui foi desenhado e desenvolvido pela DLK. Os marcados como <strong className="font-medium text-text">projeto conceito</strong> são demonstrações completas, com negócios e dados fictícios, criadas para mostrar o que entregamos na prática.
        </p>
      </PageHero>
      <section aria-label="Lista de projetos" className="bg-void pb-28 md:pb-40">
        <div className="mx-auto max-w-[1800px] px-[var(--gutter)]">
          <ProjectsGrid />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
