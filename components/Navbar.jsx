"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Menu, Users, X } from "lucide-react";
import {
  handleSectionLinkClick,
  navLinks,
  scrollToSection,
  SECTION_SCROLL_EVENT,
} from "@/lib/navigation";
import { useBookingModal } from "@/lib/bookingModalContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  // Mobile: scroll only after the menu has collapsed, so the shrinking header doesn't shift the target.
  const [pendingHref, setPendingHref] = useState(null);
  const barRef = useRef(null);
  const [activeHref, setActiveHref] = useState(null);
  // While a link-triggered scroll is running, the scrollspy holds the clicked section.
  const scrollLock = useRef({ active: false, timer: null });
  // The open mobile menu sits in the sticky header's flow and pushes the page down, which would
  // read as the previous section being active — so the scrollspy pauses while it's open.
  const menuOpenRef = useRef(menuOpen);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);
  const { openModal } = useBookingModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sections use this as their scroll-margin-top so anchored titles land below the sticky bar.
  useEffect(() => {
    const bar = barRef.current;
    const sync = () =>
      document.documentElement.style.setProperty("--nav-height", `${bar.offsetHeight}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  // Scrollspy: the active section is the last one whose top has passed a line 30% down the
  // visible area below the navbar; at the very bottom of the page it's the last section,
  // which may be too short to ever reach that line.
  useEffect(() => {
    const sections = navLinks.map((link) => document.getElementById(link.href.slice(1)));
    const lock = scrollLock.current;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (menuOpenRef.current) return;
      const navHeight = barRef.current.offsetHeight;
      const line = navHeight + (window.innerHeight - navHeight) * 0.3;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      let current = null;
      sections.forEach((section, idx) => {
        if (section && section.getBoundingClientRect().top <= line) current = navLinks[idx].href;
      });
      if (atBottom && sections.at(-1)) current = navLinks.at(-1).href;
      setActiveHref(current);
    };

    const releaseLockAfter = (ms) => {
      clearTimeout(lock.timer);
      lock.timer = setTimeout(() => {
        lock.active = false;
        update();
      }, ms);
    };

    const onScroll = () => {
      // Smooth scrolling fires scroll events until it settles; release once they stop.
      if (lock.active) return releaseLockAfter(150);
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onSectionScroll = (event) => {
      lock.active = true;
      setActiveHref(event.detail);
      // Fallback for when the page is already at the target and no scroll event follows.
      releaseLockAfter(1000);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener(SECTION_SCROLL_EVENT, onSectionScroll);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(lock.timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener(SECTION_SCROLL_EVENT, onSectionScroll);
    };
  }, []);

  const handleMobileLinkClick = (event, href) => {
    if (document.getElementById(href.slice(1))) {
      event.preventDefault();
      setPendingHref(href);
      // Hold the highlight now: the header collapsing before the scroll starts would otherwise
      // briefly re-select the section the user is leaving.
      window.dispatchEvent(new CustomEvent(SECTION_SCROLL_EVENT, { detail: href }));
    }
    setMenuOpen(false);
  };

  return (
    <motion.header
      id="top"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-silver/10 bg-obsidian/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        ref={barRef}
        className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3"
      >
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="relative block h-10 w-10 overflow-hidden rounded-full ring-1 ring-silver/30">
            <Image
              src="/images/logo.png"
              alt="Auravia"
              width={90}
              height={90}
              priority
              className="absolute max-w-none"
              style={{ top: "-16px", left: "-25px" }}
            />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-50">
            Auravia
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${link.href}`}
              onClick={(event) => handleSectionLinkClick(event, link.href)}
              onMouseEnter={() => setHovered(link.href)}
              aria-current={activeHref === link.href ? "location" : undefined}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                activeHref === link.href ? "text-teal" : "text-silver hover:text-slate-50"
              }`}
            >
              {link.label}
              {(hovered ?? activeHref) === link.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-px h-px bg-teal shadow-[0_0_8px_var(--color-teal)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={() => openModal("waitlist")}
            className="inline-flex items-center gap-2 rounded-full border border-silver/40 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:border-teal hover:text-teal"
          >
            <Users className="h-4 w-4" />
            Waitlist
          </button>
          <button
            type="button"
            onClick={() => openModal("test-drive")}
            className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-obsidian transition-transform hover:scale-[1.03]"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Test Drive
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-silver/30 text-slate-100 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence
        onExitComplete={() => {
          if (pendingHref) scrollToSection(pendingHref);
          setPendingHref(null);
        }}
      >
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-silver/10 bg-obsidian/95 backdrop-blur-md lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${link.href}`}
                  onClick={(event) => handleMobileLinkClick(event, link.href)}
                  aria-current={activeHref === link.href ? "location" : undefined}
                  className={`rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-white/5 ${
                    activeHref === link.href ? "text-teal" : "text-silver hover:text-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 px-6 pb-6">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openModal("waitlist");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-silver/40 px-4 py-2.5 text-sm font-medium text-slate-100"
              >
                <Users className="h-4 w-4" />
                Waitlist
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openModal("test-drive");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-4 py-2.5 text-sm font-semibold text-obsidian"
              >
                <CalendarCheck className="h-4 w-4" />
                Book Test Drive
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
