import { DEFAULT_LOCALE, hasLocale } from "@/lib/i18n";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  mk: () => import("@/dictionaries/mk.json").then((module) => module.default),
};

export async function getDictionary(locale) {
  return dictionaries[hasLocale(locale) ? locale : DEFAULT_LOCALE]();
}
