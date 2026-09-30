"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp, CalendarCheck, Mail, MapPin, Phone, Users } from "lucide-react";
import { handleSectionLinkClick, navLinks } from "@/lib/navigation";
import { useBookingModal } from "@/lib/bookingModalContext";
import { format } from "@/lib/i18n";

const contactDetails = [
  { icon: MapPin, label: "1 Aurora Way, San Francisco, CA" },
  { icon: Mail, label: "hello@auravia.com", href: "mailto:hello@auravia.com" },
  { icon: Phone, label: "+1 (555) 019-2044", href: "tel:+15550192044" },
];

export default function Footer({ locale, dict, navLabels, common }) {
  const year = new Date().getFullYear();
  const { openModal } = useBookingModal();

  return (
    <footer className="border-t border-silver/10 bg-obsidian">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <span className="relative block h-10 w-10 overflow-hidden rounded-full ring-1 ring-silver/30">
                <Image
                  src="/images/logo.png"
                  alt="Auravia"
                  width={90}
                  height={90}
                  className="absolute max-w-none"
                  style={{ top: "-16px", left: "-25px" }}
                />
              </span>
              <span className="text-lg font-semibold text-slate-50">Auravia</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-silver">
              {dict.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openModal("test-drive")}
                className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-obsidian transition-transform hover:scale-[1.03]"
              >
                <CalendarCheck className="h-4 w-4" />
                {common.bookTestDrive}
              </button>
              <button
                type="button"
                onClick={() => openModal("waitlist")}
                className="inline-flex items-center gap-2 rounded-full border border-silver/40 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:border-teal hover:text-teal"
              >
                <Users className="h-4 w-4" />
                {common.waitlist}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-50">{dict.explore}</h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  onClick={(event) => handleSectionLinkClick(event, link.href)}
                  className="text-sm text-silver transition-colors hover:text-teal"
                >
                  {navLabels[link.key]}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-50">{dict.getInTouch}</h3>
            <ul className="flex flex-col gap-3">
              {contactDetails.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      className="flex items-start gap-2.5 text-sm text-silver transition-colors hover:text-teal"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{label}</span>
                    </a>
                  ) : (
                    <span className="flex items-start gap-2.5 text-sm text-silver">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{label}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-silver/10 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-silver">{format(dict.rights, { year })}</p>
          <motion.a
            href="#top"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-silver transition-colors hover:text-teal"
          >
            {dict.backToTop}
            <ArrowUp className="h-3.5 w-3.5" />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
