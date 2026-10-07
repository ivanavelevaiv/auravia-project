"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Puts `light` or `dark` on <html> (Tailwind's `dark:` variant and the theme tokens in
// globals.css key off it) and sets the matching `color-scheme`. next-themes applies the saved
// or system theme with an inline script before the page paints, so there's no flash of the
// wrong theme.
// That script only matters in the server HTML. When React later creates it in the browser (e.g.
// the layout re-rendering on a language switch), it never runs, and React 19 logs "Encountered a
// script tag while rendering React component". Giving the browser-side copy a non-JavaScript type
// makes it a data block, which React doesn't warn about; next-themes already marks the script
// suppressHydrationWarning, so the differing `type` doesn't trigger a hydration warning.
const scriptProps = { type: typeof window === "undefined" ? "text/javascript" : "text/plain" };

export default function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
}
