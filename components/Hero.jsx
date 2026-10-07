"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  Car,
  CircleParking,
  PackageSearch,
  PiggyBank,
  ShieldCheck,
} from "lucide-react";
import { useBookingModal } from "@/lib/bookingModalContext";
import ContainedImage, { imageFrameClass } from "@/components/ContainedImage";

const models = [
  { id: "L6", label: "L6", src: "/images/L6/img-5-12.jpg" },
  { id: "L7", label: "L7", src: "/images/L7/img-5-1.jpg" },
];

// Paired by position with dict.hero.highlights.
const highlightIcons = [PiggyBank, CircleParking, ShieldCheck];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero({ dict, common }) {
  const [active, setActive] = useState(models[0].id);
  const [failed, setFailed] = useState({});
  const { openModal } = useBookingModal();

  const activeModel = models.find((model) => model.id === active);

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[32rem] w-[32rem] rounded-full bg-teal/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
          <motion.div
            variants={item}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-silver/30 bg-ink/5 px-4 py-1.5 text-sm text-ink"
          >
            <span aria-hidden>🟢</span>
            {dict.badge}
          </motion.div>

          <motion.h1 variants={item} className="text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            {dict.title}
          </motion.h1>

          <motion.p variants={item} className="max-w-md text-lg text-muted">
            {dict.subtitle}
          </motion.p>

          {/* Full-width stack on phones; from sm up one row that wraps, with buttons growing to fill
              each row so a wrap reads as a tidy block. Each action is prefilled
              with the model currently selected in the showcase tabs. */}
          <motion.div variants={item} className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => openModal("test-drive", { model: active })}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full sm:grow bg-teal px-6 py-3 text-sm font-semibold text-obsidian transition-transform hover:scale-[1.03]"
            >
              <CalendarCheck className="h-4 w-4" />
              {common.bookTestDrive}
            </button>
            <button
              type="button"
              onClick={() => openModal("availability", { model: active })}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full sm:grow border border-teal/50 px-6 py-3 text-sm font-medium text-accent transition-colors hover:border-teal hover:bg-teal/10"
            >
              <PackageSearch className="h-4 w-4" />
              {common.checkAvailability}
            </button>
            <button
              type="button"
              onClick={() => openModal("reserve", { model: active })}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full sm:grow border border-silver/40 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-teal hover:text-accent"
            >
              {common.reserve}
            </button>
          </motion.div>

          <motion.dl variants={item} className="mt-4 grid gap-5 sm:grid-cols-3">
            {dict.highlights.map(({ title, description }, idx) => {
              const Icon = highlightIcons[idx];
              return (
                <div key={title} className="flex flex-col gap-2 border-t border-silver/10 pt-4">
                  <Icon className="h-5 w-5 text-accent" />
                  <dt className="text-sm font-medium text-ink">{title}</dt>
                  <dd className="text-sm text-muted">{description}</dd>
                </div>
              );
            })}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-silver/20 bg-ink/5 p-1">
            {models.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => setActive(model.id)}
                className="relative rounded-full px-5 py-2 text-sm font-medium text-muted transition-colors"
              >
                {active === model.id && (
                  <motion.span
                    layoutId="model-tab"
                    className="absolute inset-0 rounded-full bg-teal"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative z-10 ${active === model.id ? "text-obsidian" : ""}`}>
                  {model.label}
                </span>
              </button>
            ))}
          </div>

          <div className={`${imageFrameClass} aspect-[16/10]`}>
            <AnimatePresence mode="wait">
              {failed[activeModel.id] ? (
                <motion.div
                  key={`${activeModel.id}-fallback`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-full flex-col items-center justify-center gap-3 text-muted"
                >
                  <Car className="h-10 w-10 text-accent" />
                  <span className="text-lg font-semibold text-ink">Linktour {activeModel.label}</span>
                  <span className="text-sm">{common.photosComingSoon}</span>
                </motion.div>
              ) : (
                <motion.div
                  key={activeModel.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <ContainedImage
                    src={activeModel.src}
                    alt={`Linktour ${activeModel.label}`}
                    sizes="(min-width: 1024px) 560px, 100vw"
                    priority={activeModel.id === models[0].id}
                    onError={() =>
                      setFailed((prev) => ({ ...prev, [activeModel.id]: true }))
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
