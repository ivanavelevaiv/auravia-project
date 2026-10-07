"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { models } from "@/lib/models";
import { format } from "@/lib/i18n";
import { imageFrameClass } from "@/components/ContainedImage";

const colorModels = models.filter((model) => model.colors?.length);

// The colour PNGs are 1243×550 with the car spanning x = 40–968 and transparent space to the
// right. The stage is sized to the car (928×550) and the image is shifted left by the 40px
// margin, so the car sits centred without cropping or editing the source files.
const CAR_LEFT = 40;
const CAR_WIDTH = 928;

export default function ColorShowcase({ dict }) {
  const [modelId, setModelId] = useState(colorModels[0].id);
  const [activeId, setActiveId] = useState(colorModels[0].colors[0].id);

  const model = colorModels.find((entry) => entry.id === modelId);
  // Colour ids are shared, so the chosen colour carries over when switching model.
  const active = model.colors.find((color) => color.id === activeId) ?? model.colors[0];
  // The model actually pictured: the L7 borrows the L6 renders until it has its own.
  const pictured = models.find((entry) => entry.id === (model.colorImagesFrom ?? model.id));

  return (
    <section id="colors" className="border-t border-silver/10">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-3">
          <p className="text-sm font-medium text-teal">{dict.eyebrow}</p>
          <h2 className="text-3xl font-semibold text-slate-50 sm:text-4xl">{dict.heading}</h2>
          <p className="max-w-xl text-silver">{dict.description}</p>
        </div>

        <div
          role="group"
          aria-label={dict.modelsLabel}
          className="mb-8 inline-flex items-center gap-1 rounded-full border border-silver/20 bg-white/5 p-1"
        >
          {colorModels.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setModelId(entry.id)}
              aria-pressed={entry.id === modelId}
              className="relative rounded-full px-6 py-2 text-sm font-medium text-silver transition-colors"
            >
              {entry.id === modelId && (
                <motion.span
                  layoutId="color-model-tab"
                  className="absolute inset-0 rounded-full bg-teal"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className={`relative z-10 ${entry.id === modelId ? "text-obsidian" : ""}`}>
                {entry.name}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`${imageFrameClass} px-6 pb-6 pt-10 sm:px-10`}
          >
            {/* A neutral spotlight keeps the darker paints readable on the dark page; the tint
                layer follows the selected colour. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_62%,rgba(148,163,184,0.22),transparent_70%)]"
            />
            <div
              aria-hidden
              className="absolute inset-0 transition-[background] duration-700"
              style={{
                background: `radial-gradient(ellipse 55% 45% at 50% 60%, ${active.swatch}40, transparent 70%)`,
              }}
            />

            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: `${CAR_WIDTH} / 550` }}
            >
              {/* All four stay mounted and crossfade, so switching never waits on a download
                  and the identically framed cars appear to repaint in place. */}
              {model.colors.map((color) => {
                const isActive = color.id === active.id;
                return (
                  <Image
                    key={color.image}
                    src={color.image}
                    alt={
                      isActive ? format(dict.imageAlt, { model: pictured.name, color: color.name }) : ""
                    }
                    aria-hidden={!isActive}
                    width={1243}
                    height={550}
                    sizes="(min-width: 1024px) 900px, 135vw"
                    className={`absolute top-0 h-full w-auto max-w-none transition-opacity duration-500 ease-out ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ left: `${(-CAR_LEFT / CAR_WIDTH) * 100}%` }}
                  />
                );
              })}
            </div>
            {pictured.id !== model.id && (
              <p className="relative mt-4 text-center text-xs text-silver">
                {format(dict.borrowedImageNote, { pictured: pictured.name, model: model.name })}
              </p>
            )}
          </motion.div>

          <div className="flex flex-col gap-8">
            <div>
              <p className="text-sm text-silver">{model.name}</p>
              <p aria-live="polite" className="mt-1 text-3xl font-semibold text-slate-50">
                {active.name}
              </p>
            </div>

            <div role="group" aria-label={dict.swatchesLabel} className="flex flex-wrap gap-5">
              {model.colors.map((color) => {
                const isActive = color.id === active.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setActiveId(color.id)}
                    aria-pressed={isActive}
                    className="group flex w-16 flex-col items-center gap-2"
                  >
                    <span className="relative flex h-12 w-12 items-center justify-center">
                      {isActive && (
                        <motion.span
                          layoutId="color-ring"
                          className="absolute inset-0 rounded-full border-2 border-teal shadow-[0_0_12px_-2px_var(--color-teal)]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span
                        className="h-9 w-9 rounded-full border border-silver/30 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: color.swatch }}
                      />
                    </span>
                    <span
                      className={`text-center text-xs leading-tight transition-colors ${
                        isActive ? "text-slate-50" : "text-silver group-hover:text-slate-100"
                      }`}
                    >
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
