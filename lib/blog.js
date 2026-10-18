import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { hasLocale } from "@/lib/i18n";

// Posts live in the `content` git submodule as content/<locale>/<slug>.md.
const CONTENT_DIR = path.join(process.cwd(), "content");

// Slugs come from the URL, so only plain kebab-case names may reach the filesystem.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

function summarize(data, fileSlug) {
  return {
    title: data.title ?? fileSlug,
    // YAML parses unquoted dates as Date objects; keep everything as an ISO string.
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
    author: data.author ?? "",
    // The URL always follows the file name, so a stale `slug` in frontmatter can't break links.
    slug: fileSlug,
  };
}

export async function getAllPosts(locale) {
  if (!hasLocale(locale)) return [];

  let files;
  try {
    files = await fs.readdir(path.join(CONTENT_DIR, locale));
  } catch {
    // An uninitialised submodule just means no posts yet.
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const slug = file.slice(0, -".md".length);
        const source = await fs.readFile(path.join(CONTENT_DIR, locale, file), "utf8");
        return summarize(matter(source).data, slug);
      })
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

// Server-only, so Intl is safe here: the browser's reduced ICU data (see formatInteger in
// lib/i18n.js) never renders these. UTC keeps a "YYYY-MM-DD" date from shifting a day.
export function formatPostDate(date, locale) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(locale === "mk" ? "mk-MK" : "en-GB", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(parsed);
}

// Returns null when the post doesn't exist in this locale.
export async function getPostBySlug(slug, locale) {
  if (!hasLocale(locale) || !SLUG_PATTERN.test(slug)) return null;

  let source;
  try {
    source = await fs.readFile(path.join(CONTENT_DIR, locale, `${slug}.md`), "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(source);
  // remark-html sanitizes by default, so the result is safe to inject.
  const contentHtml = String(await remark().use(html).process(content));
  return { ...summarize(data, slug), contentHtml };
}
