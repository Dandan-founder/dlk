import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projetos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({ url: `${site.url}/projetos/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.7 })),
    { url: `${site.url}/orcamento`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
