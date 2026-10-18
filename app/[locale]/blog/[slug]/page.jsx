import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatPostDate, getAllPosts, getPostBySlug } from "@/lib/blog";
import { getDictionary } from "@/lib/dictionaries";
import { format } from "@/lib/i18n";

// Prerenders every post of each locale the parent layout generates. Slugs added to the content
// submodule later still render on demand; ones missing in this locale hit notFound() below.
export async function generateStaticParams({ params: { locale } }) {
  const posts = await getAllPosts(locale);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  if (!post) return {};
  return {
    title: `${post.title} — Auravia`,
    alternates: { canonical: `/${locale}/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }) {
  const { locale, slug } = await params;
  const [dict, post] = await Promise.all([getDictionary(locale), getPostBySlug(slug, locale)]);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        {dict.blog.backToBlog}
      </Link>

      <header className="mt-8 border-b border-silver/15 pb-8">
        <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">{post.title}</h1>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
          {post.author && (
            <>
              <span aria-hidden="true">·</span>
              <span>{format(dict.blog.by, { author: post.author })}</span>
            </>
          )}
        </p>
      </header>

      {/* Sanitized by remark-html in lib/blog.js. */}
      <div
        className="prose prose-auravia mt-10 max-w-none sm:prose-lg"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
