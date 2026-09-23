"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { models, SPEC_PLACEHOLDER, specFields } from "@/lib/models";

function ComparisonTable() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="overflow-x-auto rounded-2xl border border-silver/15">
      <table className="w-full min-w-[480px] border-collapse text-left">
        <thead>
          <tr className="border-b border-silver/15">
            <th className="px-4 py-4 text-sm font-medium text-silver sm:px-6">Specification</th>
            {models.map((model) => (
              <th
                key={model.id}
                onMouseEnter={() => setHovered(model.id)}
                onMouseLeave={() => setHovered(null)}
                className={`px-4 py-4 text-base font-semibold transition-colors sm:px-6 ${
                  hovered === model.id ? "bg-teal/10 text-teal" : "text-slate-50"
                }`}
              >
                {model.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specFields.map((field, rowIdx) => (
            <tr key={field.key} className={rowIdx % 2 === 1 ? "bg-white/[0.02]" : undefined}>
              <td className="px-4 py-3 text-sm text-silver sm:px-6">{field.label}</td>
              {models.map((model) => {
                const value = model.specs[field.key];
                const isPlaceholder = value === SPEC_PLACEHOLDER;
                return (
                  <td
                    key={model.id}
                    onMouseEnter={() => setHovered(model.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`whitespace-nowrap px-4 py-3 text-sm transition-colors sm:px-6 ${
                      hovered === model.id ? "bg-teal/10" : ""
                    } ${isPlaceholder ? "italic text-silver/70" : "text-slate-100"}`}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const defaultAssumptions = {
  evConsumption: 12,
  electricityPrice: 0.15,
  petrolConsumption: 7,
  petrolPrice: 1.6,
};

function FuelSavingsCalculator() {
  const [distance, setDistance] = useState(40);
  const [assumptions, setAssumptions] = useState(defaultAssumptions);

  const results = useMemo(() => {
    const monthlyKm = distance * 30;
    const evCost = (monthlyKm / 100) * assumptions.evConsumption * assumptions.electricityPrice;
    const petrolCost =
      (monthlyKm / 100) * assumptions.petrolConsumption * assumptions.petrolPrice;
    const monthlySavings = petrolCost - evCost;
    return { evCost, petrolCost, monthlySavings, yearlySavings: monthlySavings * 12 };
  }, [distance, assumptions]);

  const formatEUR = (value) =>
    `€${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  const updateAssumption = (key) => (event) => {
    const value = Number(event.target.value);
    setAssumptions((prev) => ({ ...prev, [key]: Number.isNaN(value) ? prev[key] : value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-16 rounded-2xl border border-silver/15 bg-white/[0.03] p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <Calculator className="h-5 w-5 text-teal" />
        <h3 className="text-xl font-semibold text-slate-50">Fuel-Savings Calculator</h3>
      </div>

      <label className="flex flex-col gap-3">
        <span className="flex items-center justify-between text-sm text-silver">
          <span>Daily commuting distance</span>
          <span className="font-medium text-slate-50">{distance} km/day</span>
        </span>
        <input
          type="range"
          min={5}
          max={150}
          step={5}
          value={distance}
          onChange={(event) => setDistance(Number(event.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-silver/20 accent-teal"
        />
      </label>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-silver/10 p-5">
          <p className="text-sm text-silver">Estimated monthly savings</p>
          <p className="mt-2 text-3xl font-semibold text-teal">
            {formatEUR(results.monthlySavings)}
          </p>
          <p className="mt-1 text-xs text-silver">
            vs. {formatEUR(results.petrolCost)} petrol / {formatEUR(results.evCost)} electricity
          </p>
        </div>
        <div className="rounded-xl border border-silver/10 p-5">
          <p className="text-sm text-silver">Estimated yearly savings</p>
          <p className="mt-2 text-3xl font-semibold text-teal">
            {formatEUR(results.yearlySavings)}
          </p>
          <p className="mt-1 text-xs text-silver">
            Based on {(distance * 365).toLocaleString("en-US")} km/year
          </p>
        </div>
      </div>

      <details className="mt-6 text-sm text-silver">
        <summary className="cursor-pointer select-none text-silver hover:text-teal">
          Adjust cost assumptions
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span>EV consumption (kWh/100km)</span>
            <input
              type="number"
              min={1}
              step={0.5}
              value={assumptions.evConsumption}
              onChange={updateAssumption("evConsumption")}
              className="rounded-lg border border-silver/20 bg-transparent px-3 py-2 text-slate-50 focus:border-teal focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Electricity price (€/kWh)</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={assumptions.electricityPrice}
              onChange={updateAssumption("electricityPrice")}
              className="rounded-lg border border-silver/20 bg-transparent px-3 py-2 text-slate-50 focus:border-teal focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Petrol car consumption (L/100km)</span>
            <input
              type="number"
              min={1}
              step={0.5}
              value={assumptions.petrolConsumption}
              onChange={updateAssumption("petrolConsumption")}
              className="rounded-lg border border-silver/20 bg-transparent px-3 py-2 text-slate-50 focus:border-teal focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>Petrol price (€/L)</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={assumptions.petrolPrice}
              onChange={updateAssumption("petrolPrice")}
              className="rounded-lg border border-silver/20 bg-transparent px-3 py-2 text-slate-50 focus:border-teal focus:outline-none"
            />
          </label>
        </div>
        <p className="mt-4 text-xs text-silver/70">
          Defaults are illustrative estimates, not confirmed Linktour figures — adjust them to
          match your own driving and local prices.
        </p>
      </details>
    </motion.div>
  );
}

export default function ModelComparison() {
  return (
    <section id="compare" className="border-t border-silver/10">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-slate-50 sm:text-4xl">Compare L6 vs. L7</h2>
          <p className="max-w-xl text-silver">
            See both models side by side, then estimate what switching from petrol could save
            you.
          </p>
        </div>

        <ComparisonTable />
        <FuelSavingsCalculator />
      </div>
    </section>
  );
}
