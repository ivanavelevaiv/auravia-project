// Labels are localized in dictionaries/*.json under nav.links.<key>.
export const navLinks = [
  { key: "models", href: "#models" },
  { key: "compare", href: "#compare" },
  { key: "ourStory", href: "#our-story" },
  { key: "founders", href: "#founders" },
  { key: "faq", href: "#faq" },
];

// Separate routes (not home-page sections), so they stay out of the scrollspy. Same label lookup.
export const pageLinks = [{ key: "blog", href: "/blog" }];

export const isPageLinkActive = (pathname, locale, href) =>
  pathname === `/${locale}${href}` || pathname.startsWith(`/${locale}${href}/`);

// Fired just before a programmatic scroll so the navbar's scrollspy can highlight the target
// right away instead of stepping through every section the smooth scroll passes.
export const SECTION_SCROLL_EVENT = "auravia:section-scroll";

// The sticky-header offset comes from `scroll-margin-top` on section[id] (see globals.css),
// which scrollIntoView honors.
export function scrollToSection(href) {
  const target = document.getElementById(href.replace(/^\/?#/, ""));
  if (!target) return false;

  window.dispatchEvent(new CustomEvent(SECTION_SCROLL_EVENT, { detail: `#${target.id}` }));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  window.history.pushState(null, "", `#${target.id}`);
  return true;
}

// For in-page links: smooth-scroll when the section is on this page, otherwise let the link
// navigate to the home page anchor (e.g. from the 404 page).
export function handleSectionLinkClick(event, href) {
  if (scrollToSection(href)) event.preventDefault();
}
