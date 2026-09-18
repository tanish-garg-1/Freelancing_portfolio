import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryBanner from "@/components/CategoryBanner";
import ProjectGrid from "@/components/ProjectGrid";
import { getCategories, getCategory, getProjects, getSite } from "@/lib/content";
import { contactHref } from "@/lib/links";
import { accentStyle } from "@/lib/visual";

type Params = Promise<{ category: string }>;

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const category = getCategory((await params).category);
  return category ? { title: category.title, description: category.oneLiner } : {};
}

export default async function CategoryPage({ params }: { params: Params }) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const projects = getProjects(category.slug);

  return (
    <main
      className="category-page"
      data-accent-scope=""
      style={accentStyle(category.accent, category.accentLight)}
    >
      <CategoryBanner
        title={category.title}
        oneLiner={category.oneLiner}
        cover={category.cover}
        accent={category.accent}
        count={projects.length}
      />
      <section className="container">
        <ProjectGrid projects={projects} accent={category.accent} hireHref={contactHref(getSite())} />
      </section>
    </main>
  );
}
