"use client";

import { useLayoutEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LOCALES, rememberLocale } from "@/lib/i18n";

// Translations change text length, so the same scrollY lands somewhere else in the other
// language. Before switching we note which section is at the top of the viewport and how far
// into it the reader is, then restore that once the new locale has rendered. Module scope
// (not state) because the Navbar holding this switcher may remount with the new locale.
let pendingAnchor = null;

function captureAnchor(targetLocale) {
  const line = window.innerHeight * 0.3;
  let current = null;
  for (const section of document.querySelectorAll("main section[id]")) {
    if (section.getBoundingClientRect().top <= line) current = section;
  }
  pendingAnchor = current
    ? { locale: targetLocale, id: current.id, offset: current.getBoundingClientRect().top }
    : null;
}

export default function LanguageSwitcher({ locale, labels }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  useLayoutEffect(() => {
    if (!pendingAnchor || pendingAnchor.locale !== locale) return;
    const { id, offset } = pendingAnchor;
    pendingAnchor = null;
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "instant",
      });
    }
  }, [locale]);

  const switchTo = (nextLocale) => {
    if (nextLocale === locale || isPending) return;

    rememberLocale(nextLocale);
    captureAnchor(nextLocale);

    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const target = `${segments.join("/")}${window.location.hash}`;
    startTransition(() => router.push(target, { scroll: false }));
  };

  return (
    <div
      role="group"
      aria-label={labels.label}
      className={`inline-flex items-center gap-0.5 rounded-full border border-silver/25 bg-ink/5 p-0.5 transition-opacity ${
        isPending ? "opacity-60" : ""
      }`}
    >
      {LOCALES.map((code) => {
        const isActive = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => switchTo(code)}
            aria-pressed={isActive}
            title={labels[`${code}Name`]}
            className={`relative rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              isActive ? "text-obsidian" : "text-muted hover:text-ink"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="locale-pill"
                className="absolute inset-0 rounded-full bg-teal"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{labels[code]}</span>
          </button>
        );
      })}
    </div>
  );
}
