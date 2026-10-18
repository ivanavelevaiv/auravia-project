import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, hasLocale } from "@/lib/i18n";

// A saved choice from the language switcher wins; otherwise Macedonian browsers get /mk and
// everyone else the default (/en).
function preferredLocale(request) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (hasLocale(saved)) return saved;

  const accepted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase().split("-")[0]);
  return accepted.find(hasLocale) ?? DEFAULT_LOCALE;
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocalePrefix) return;

  // The bare domain lands on the blog; the /en and /mk homepages stay reachable directly.
  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname === "/" ? "/blog" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, the chat API, and anything with a file extension (images, favicon).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
