"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { milestones } from "@/lib/milestones";
import { format } from "@/lib/i18n";

function MilestoneGallery({ images, alt, dict, common }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState({});

  const markFailed = (idx) => setFailed((prev) => ({ ...prev, [idx]: true }));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-silver/15 bg-white/[0.03]">
        {failed[active] ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-silver">
            <Car className="h-8 w-8 text-teal" />
            <span className="text-sm">{common.photoComingSoon}</span>
          </div>
        ) : (
          <Image
            src={images[active]}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            onError={() => markFailed(active)}
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={format(dict.showPhoto, { n: idx + 1 })}
              className={`relative h-14 flex-1 overflow-hidden rounded-lg border transition-colors ${
                active === idx ? "border-teal" : "border-silver/20 hover:border-silver/50"
              }`}
            >
              {failed[idx] ? (
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
                  onError={() => markFailed(idx)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MilestoneItem({ milestone, index, dict, common }) {
  const { title, description } = dict.milestones[milestone.id];

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
      className="relative grid gap-6 lg:grid-cols-2 lg:items-start"
    >
      <span className="absolute -left-14 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-teal/40 bg-obsidian text-xs font-semibold text-teal">
        {milestone.step}
      </span>

      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-semibold text-slate-50">{title}</h3>
        <p className="text-silver">{description}</p>
      </div>

      <MilestoneGallery images={milestone.images} alt={title} dict={dict} common={common} />
    </motion.li>
  );
}

export default function Storyline({ dict, common }) {
  return (
    <section id="our-story" className="border-t border-silver/10">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-12 flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-slate-50 sm:text-4xl">{dict.heading}</h2>
          <p className="max-w-xl text-silver">{dict.description}</p>
        </div>

        <ol className="flex flex-col gap-16 border-l border-silver/15 pl-10">
          {milestones.map((milestone, index) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              index={index}
              dict={dict}
              common={common}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
