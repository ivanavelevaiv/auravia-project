import Link from "next/link";
import { locale } from "next/root-params";
import { getDictionary } from "@/lib/dictionaries";

export default async function NotFound() {
  const currentLocale = await locale();
  const dict = await getDictionary(currentLocale);

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-24 lg:py-32">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="text-3xl font-semibold text-ink sm:text-4xl">{dict.notFound.title}</h1>
      <p className="max-w-md text-muted">{dict.notFound.description}</p>
      <Link
        href={`/${currentLocale}`}
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-silver/40 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-teal hover:text-accent"
      >
        {dict.notFound.backHome}
      </Link>
    </section>
  );
}
