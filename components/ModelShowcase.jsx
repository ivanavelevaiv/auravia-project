"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowUpFromLine,
  BadgeCheck,
  BatteryCharging,
  CalendarCheck,
  Car,
  CircleDot,
  Clock,
  Cog,
  Gauge,
  Mountain,
  MoveHorizontal,
  RotateCw,
  Route,
  Ruler,
  SlidersHorizontal,
  Weight,
  Zap,
} from "lucide-react";
import { getModelSpecs, models, SPEC_PLACEHOLDER, specFields } from "@/lib/models";
import { format } from "@/lib/i18n";
import { useBookingModal } from "@/lib/bookingModalContext";

const iconMap = {
  ArrowLeftRight,
  ArrowUpFromLine,
  BadgeCheck,
  BatteryCharging,
  CircleDot,
  Clock,
  Cog,
  Gauge,
  Mountain,
  MoveHorizontal,
  RotateCw,
  Route,
  Ruler,
  SlidersHorizontal,
  Weight,
  Zap,
};

export default function ModelShowcase({ dict, common }) {
  const [activeId, setActiveId] = useState(models[0].id);
  const [activeImage, setActiveImage] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const [renderedId, setRenderedId] = useState(activeId);
  const { openModal } = useBookingModal();

  const activeModel = models.find((model) => model.id === activeId);
  const activeCopy = dict[activeModel.id];
  const activeSpecs = getModelSpecs(activeModel, activeCopy);

  if (activeId !== renderedId) {
    setRenderedId(activeId);
    setActiveImage(0);
  }

  const galleryKey = (modelId, idx) => `${modelId}-${idx}`;
  const markFailed = (modelId, idx) =>
    setFailedImages((prev) => ({ ...prev, [galleryKey(modelId, idx)]: true }));

  return (
    <section id="models" className="border-t border-silver/10">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-slate-50 sm:text-4xl">{dict.heading}</h2>
          <p className="max-w-xl text-silver">{dict.description}</p>
        </div>

        <div className="mb-8 inline-flex items-center gap-1 rounded-full border border-silver/20 bg-white/5 p-1">
          {models.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => setActiveId(model.id)}
              className="relative rounded-full px-6 py-2 text-sm font-medium text-silver transition-colors"
            >
              {activeId === model.id && (
                <motion.span
                  layoutId="model-detail-tab"
                  className="absolute inset-0 rounded-full bg-teal"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className={`relative z-10 ${activeId === model.id ? "text-obsidian" : ""}`}>
                {model.name}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeModel.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid gap-10 lg:grid-cols-2 lg:items-start"
          >
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-semibold text-slate-50">{activeModel.name}</h3>
                <p className="mt-1 text-silver">{activeCopy.tagline}</p>
              </div>

              <dl className="divide-y divide-silver/10 border-y border-silver/10">
                {specFields.map((field) => {
                  const Icon = iconMap[field.icon];
                  const value = activeSpecs[field.key];
                  const isPlaceholder = value === SPEC_PLACEHOLDER;
                  return (
                    <div key={field.key} className="flex items-center justify-between gap-4 py-3">
                      <dt className="flex items-center gap-2 text-sm text-silver">
                        <Icon className="h-4 w-4 text-teal" />
                        {dict.specLabels[field.key]}
                      </dt>
                      <dd
                        className={`text-right text-sm font-medium ${
                          isPlaceholder ? "italic text-silver/70" : "text-slate-50"
                        }`}
                      >
                        {isPlaceholder ? common.comingSoon : value}
                      </dd>
                    </div>
                  );
                })}
              </dl>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openModal("test-drive", { model: activeModel.id })}
                  className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-obsidian transition-transform hover:scale-[1.03]"
                >
                  <CalendarCheck className="h-4 w-4" />
                  {common.bookTestDrive}
                </button>
                <button
                  type="button"
                  onClick={() => openModal("reserve", { model: activeModel.id })}
                  className="inline-flex items-center gap-2 rounded-full border border-silver/40 px-6 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-teal hover:text-teal"
                >
                  {common.reserve}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-silver/15 bg-white/[0.03]">
                <AnimatePresence mode="wait">
                  {failedImages[galleryKey(activeModel.id, activeImage)] ? (
                    <motion.div
                      key={`${activeModel.id}-${activeImage}-fallback`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-full flex-col items-center justify-center gap-3 text-silver"
                    >
                      <Car className="h-10 w-10 text-teal" />
                      <span className="text-sm">{common.photoComingSoon}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`${activeModel.id}-${activeImage}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activeModel.gallery[activeImage]}
                        alt={format(dict.photoAlt, { name: activeModel.name, n: activeImage + 1 })}
                        fill
                        sizes="(min-width: 1024px) 560px, 100vw"
                        className="object-cover object-top"
                        onError={() => markFailed(activeModel.id, activeImage)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wraps instead of squeezing: the L7 has nine photos, too many for one row. */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2">
                {activeModel.gallery.map((src, idx) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    aria-label={format(dict.showPhoto, { n: idx + 1, name: activeModel.name })}
                    className={`relative h-16 overflow-hidden rounded-lg border transition-colors ${
                      activeImage === idx ? "border-teal" : "border-silver/20 hover:border-silver/50"
                    }`}
                  >
                    {failedImages[galleryKey(activeModel.id, idx)] ? (
                      <span className="flex h-full items-center justify-center bg-white/[0.03]">
                        <Car className="h-4 w-4 text-silver/50" />
                      </span>
                    ) : (
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                        onError={() => markFailed(activeModel.id, idx)}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
