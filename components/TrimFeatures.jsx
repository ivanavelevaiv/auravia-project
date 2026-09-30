"use client";

import { motion } from "framer-motion";
import { Check, ListChecks, Minus } from "lucide-react";
import { trimFeatures, trims } from "@/lib/trims";

const modelGroups = ["L6", "L7"].map((model) => ({
  model,
  count: trims.filter((trim) => trim.model === model).length,
}));

// The first trim of each model gets a left divider so the L6 and L7 columns read as two groups.
const startsGroup = (idx) => idx > 0 && trims[idx].model !== trims[idx - 1].model;

function Cell({ value, dict }) {
  if (value === true) {
    return (
      <>
        <Check aria-hidden className="mx-auto h-4 w-4 text-teal" />
        <span className="sr-only">{dict.included}</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus aria-hidden className="mx-auto h-4 w-4 text-silver/40" />
        <span className="sr-only">{dict.notIncluded}</span>
      </>
    );
  }
  return <span className="text-slate-100">{dict.values[value]}</span>;
}

export default function TrimFeatures({ dict }) {
  return (
    <section id="trims" className="border-t border-silver/10">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-3">
          <p className="text-sm font-medium text-teal">{dict.eyebrow}</p>
          <h2 className="text-3xl font-semibold text-slate-50 sm:text-4xl">{dict.heading}</h2>
          <p className="max-w-xl text-silver">{dict.description}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 rounded-2xl border border-silver/15 bg-white/[0.03] p-6 sm:p-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <ListChecks className="h-5 w-5 text-teal" />
            <h3 className="text-lg font-semibold text-slate-50">{dict.standardTitle}</h3>
          </div>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {dict.standard.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-100">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <h3 className="mb-4 text-lg font-semibold text-slate-50">{dict.matrixTitle}</h3>
        {/* `relative` keeps the absolutely positioned sr-only labels inside the scroll box;
            otherwise they escape it and widen the page on narrow screens. */}
        <div className="relative overflow-x-auto rounded-2xl border border-silver/15">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-silver/10">
                <th rowSpan={2} className="px-4 py-3 text-sm font-medium text-silver sm:px-6">
                  {dict.featureColumn}
                </th>
                {modelGroups.map((group, idx) => (
                  <th
                    key={group.model}
                    colSpan={group.count}
                    scope="colgroup"
                    className={`px-3 pt-4 pb-1 text-center text-xs font-semibold tracking-wide text-teal ${
                      idx > 0 ? "border-l border-silver/15" : ""
                    }`}
                  >
                    Linktour {group.model}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-silver/15">
                {trims.map((trim, idx) => (
                  <th
                    key={trim.id}
                    scope="col"
                    className={`px-3 pb-4 pt-1 text-center text-sm font-semibold text-slate-50 ${
                      startsGroup(idx) ? "border-l border-silver/15" : ""
                    }`}
                  >
                    {trim.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trimFeatures.map((feature, rowIdx) => (
                <tr key={feature.key} className={rowIdx % 2 === 1 ? "bg-white/[0.02]" : undefined}>
                  <th scope="row" className="px-4 py-3 text-sm font-normal text-silver sm:px-6">
                    {dict.features[feature.key]}
                  </th>
                  {feature.values.map((value, idx) => (
                    <td
                      key={trims[idx].id}
                      className={`px-3 py-3 text-center text-sm ${
                        startsGroup(idx) ? "border-l border-silver/15" : ""
                      }`}
                    >
                      <Cell value={value} dict={dict} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-silver/70">{dict.note}</p>
      </div>
    </section>
  );
}
