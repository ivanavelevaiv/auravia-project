export const navLinks = [
  { label: "Models", href: "#models" },
  { label: "Compare", href: "#compare" },
  { label: "Our Story", href: "#our-story" },
  { label: "Founders", href: "#founders" },
  { label: "FAQ", href: "#faq" },
];

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
