"use client";

import { useState } from "react";
import { categories, projects, type Category } from "@/data/projects";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

/** Portfólio filtrável. Categorias sem projeto mostram um convite honesto, nunca um projeto inventado. */
export function ProjectsGrid() {
  const [cat, setCat] = useState<Category | "Todos">("Todos");
  const list = cat === "Todos" ? projects : projects.filter((p) => p.category === cat);
  const count = (c: Category) => projects.filter((p) => p.category === c).length;

  return (
    <>
      <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
        {(["Todos", ...categories] as const).map((c) => {
          const n = c === "Todos" ? projects.length : count(c);
          return (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn("inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[0.92rem] transition-colors", cat === c ? "border-dot bg-dot text-void" : "border-line-strong text-muted hover:border-text/50 hover:text-text")}
            >
              {c}
              <span className={cn("tabular-nums text-[0.8rem]", cat === c ? "text-void/70" : "text-muted")}>{n}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" role="status">
        {list.length ? `${list.length} projeto(s) em ${cat}` : `Ainda não há projetos em ${cat}`}
      </p>

      <div key={cat} className="mt-14 grid animate-[panel-in_.7s_var(--ease-out)_both] gap-x-10 gap-y-20 md:grid-cols-2">
        {list.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} size="md" headingLevel={2} />
        ))}
        {list.length === 0 && (
          <div className="flex min-h-[22rem] flex-col items-start justify-end rounded-3xl border border-dashed border-line-strong p-8 md:col-span-2 md:p-12">
            <p className="text-[0.95rem] text-muted">{cat}, em breve</p>
            <p className="mt-4 max-w-2xl text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-tight tracking-[-0.03em]">
              Ainda não publicamos um projeto de {cat.toLowerCase()}. O primeiro pode ser o seu<span className="text-dot">.</span>
            </p>
            <div className="mt-8">
              <ButtonLink href="/orcamento">Quero ser o primeiro</ButtonLink>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
