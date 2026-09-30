import Link from "next/link";
import { locale } from "next/root-params";
import { getDictionary } from "@/lib/dictionaries";

export default async function NotFound() {
  const currentLocale = await locale();
  const dict = await getDictionary(currentLocale);

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-24 lg:py-32">
      <p className="text-sm font-semibold text-teal">404</p>
      <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">{dict.notFound.title}</h1>
      <p className="max-w-md text-silver">{dict.notFound.description}</p>
      <Link
        href={`/${currentLocale}`}
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-silver/40 px-6 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-teal hover:text-teal"
      >
        {dict.notFound.backHome}
      </Link>
    </section>
  );
}
