"use client";

import { motion } from "framer-motion";
import { Check, ListChecks } from "lucide-react";

// Equipment every L6 and L7 comes with, from Linktour's technical specification sheet.
export default function StandardEquipment({ dict }) {
  return (
    <section id="equipment" className="border-t border-silver/10">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-3">
          <p className="text-sm font-medium text-accent">{dict.eyebrow}</p>
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">{dict.heading}</h2>
          <p className="max-w-xl text-muted">{dict.description}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl border border-silver/15 bg-ink/[0.03] p-6 sm:p-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <ListChecks className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-ink">{dict.standardTitle}</h3>
          </div>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {dict.standard.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
