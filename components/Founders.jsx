"use client";

import { motion } from "framer-motion";
import {
  BatteryCharging,
  Container,
  Handshake,
  History,
  ShieldCheck,
  Truck,
  Warehouse,
  Wrench,
} from "lucide-react";

// Years, summary, and capability labels are localized in dict.founders.partners.<id>;
// capabilityIcons pair with those capabilities by position.
const partners = [
  {
    id: "avc-sm",
    name: "AVC-SM CO., LTD.",
    icon: Wrench,
    capabilityIcons: [BatteryCharging, Wrench, ShieldCheck],
  },
  {
    id: "betasped",
    name: "BetaSped",
    icon: Container,
    capabilityIcons: [Truck, Warehouse, History],
  },
];

export default function Founders({ dict }) {
  return (
    <section id="founders" className="border-t border-silver/10">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-12 flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-slate-50 sm:text-4xl">{dict.heading}</h2>
          <p className="max-w-xl text-silver">{dict.description}</p>
        </div>

        <div className="relative grid gap-8 lg:grid-cols-2">
          {partners.map((partner, index) => {
            const copy = dict.partners[partner.id];
            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                className="flex flex-col gap-6 rounded-2xl border border-silver/15 bg-white/[0.03] p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/10 text-teal">
                      <partner.icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-xl font-semibold text-slate-50">{partner.name}</h3>
                  </div>
                  <span className="rounded-full border border-silver/30 px-3 py-1 text-xs font-medium text-silver">
                    {copy.years}
                  </span>
                </div>

                <p className="text-sm text-silver">{copy.summary}</p>

                <ul className="flex flex-col gap-3 border-t border-silver/10 pt-5">
                  {copy.capabilities.map((label, capIdx) => {
                    const Icon = partner.capabilityIcons[capIdx];
                    return (
                      <li key={label} className="flex items-center gap-3 text-sm text-slate-100">
                        <Icon className="h-4 w-4 shrink-0 text-teal" />
                        {label}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}

          <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-silver/20 bg-obsidian text-teal lg:flex">
            <Handshake className="h-5 w-5" />
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-10 flex items-start gap-3 rounded-2xl border border-teal/20 bg-teal/5 p-6"
        >
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
          <p className="text-sm text-silver">{dict.closing}</p>
        </motion.div>
      </div>
    </section>
  );
}
