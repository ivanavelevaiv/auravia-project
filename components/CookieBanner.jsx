"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { setCookieConsent, useCookieConsent } from "@/lib/cookieConsent";

export default function CookieBanner({ dict }) {
  // Only shown once the browser has confirmed there's no stored choice ("unknown" on the
  // server and during hydration, so it never flashes).
  const visible = useCookieConsent() === null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          role="region"
          aria-label={dict.label}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.4 }}
          // Bottom-left so it never covers the chat bubble (bottom-right); on phones it stops short
          // of the bubble's column.
          className="fixed bottom-4 left-4 right-24 z-50 rounded-xl border border-ink/10 bg-page p-4 text-ink shadow-2xl sm:right-auto sm:max-w-sm sm:p-5"
        >
          <div className="flex items-start gap-3">
            <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/10 text-accent sm:flex">
              <Cookie aria-hidden className="h-4 w-4" />
            </span>
            <p className="text-sm leading-relaxed text-muted">{dict.message}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setCookieConsent("declined")}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-silver/40 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-teal hover:text-accent sm:flex-none"
            >
              {dict.decline}
            </button>
            <button
              type="button"
              onClick={() => setCookieConsent("accepted")}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-teal px-4 py-2 text-sm font-semibold text-obsidian transition-transform hover:scale-[1.03] sm:flex-none"
            >
              {dict.accept}
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
