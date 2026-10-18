import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatPostDate, getAllPosts } from "@/lib/blog";
import { getDictionary } from "@/lib/dictionaries";
import { format } from "@/lib/i18n";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: `${dict.blog.title} — Auravia`,
    description: dict.blog.metaDescription,
    alternates: { canonical: `/${locale}/blog` },
  };
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const [dict, posts] = await Promise.all([getDictionary(locale), getAllPosts(locale)]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      {/* The button comes first so it sits above the title on mobile; from `sm` it moves to the
          right of the heading. */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-2 self-start rounded-full bg-teal px-4 py-2 text-sm font-semibold text-obsidian shadow-sm transition-transform hover:scale-[1.03] sm:order-last sm:shrink-0"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          {dict.blog.mainSite}
        </Link>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            {dict.blog.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">{dict.blog.title}</h1>
          <p className="mt-4 max-w-xl text-muted">{dict.blog.description}</p>
        </div>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-muted">{dict.blog.empty}</p>
      ) : (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-silver/20 bg-ink/[0.02] p-6 transition-colors hover:border-teal/60 hover:bg-ink/[0.04]"
              >
                <time dateTime={post.date} className="text-xs font-medium text-muted">
                  {formatPostDate(post.date, locale)}
                </time>
                <h2 className="text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                {post.author && (
                  <p className="text-sm text-muted">
                    {format(dict.blog.by, { author: post.author })}
                  </p>
                )}
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  {dict.blog.readMore}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
