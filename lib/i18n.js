// Shared by proxy.js, server code, and client components — keep it dependency-free.
export const LOCALES = ["en", "mk"];
export const DEFAULT_LOCALE = "en";
// Set by the language switcher so the proxy sends returning visitors to their chosen locale.
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value) => LOCALES.includes(value);


// Rounds and groups thousands with the dictionary's separator. Deliberately not Intl: browsers
// ship reduced ICU data without "mk", so toLocaleString("mk-MK") renders "14,600" in Chrome but
// "14.600" in Node, which breaks hydration.
export function formatInteger(value, separator) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

// Fills `{name}` placeholders in a dictionary string.
export function format(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));
}

// Remembers the visitor's choice so proxy.js sends bare URLs (e.g. "/") to that locale.
export function rememberLocale(locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
