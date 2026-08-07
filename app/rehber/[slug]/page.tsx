import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllGuides, getGuideBySlug } from "@/lib/guides";

interface PageParams {
  slug: string;
}

export function generateStaticParams(): PageParams[] {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return { title: "Rehber Bulunamadı | YükseltPC" };
  }
  return {
    title: `${guide.title} | YükseltPC`,
    description: guide.description,
  };
}

export default async function RehberDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb
        items={[
          { label: "Rehberler", href: "/rehber" },
          { label: guide.title },
        ]}
      />
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{guide.title}</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Son güncelleme: {guide.date}
      </p>

      <article className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <ReactMarkdown>{guide.content}</ReactMarkdown>
      </article>
    </div>
  );
}
