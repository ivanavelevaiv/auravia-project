"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { getModelSpecs, models, SPEC_PLACEHOLDER, specFields } from "@/lib/models";
import { format, formatInteger } from "@/lib/i18n";
import { formatDisplayDate } from "@/components/FormControls";

function ComparisonTable({ models: modelsDict, specificationLabel, comingSoon }) {
  const [hovered, setHovered] = useState(null);
  const specsById = Object.fromEntries(
    models.map((model) => [model.id, getModelSpecs(model, modelsDict[model.id])])
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-silver/15">
      <table className="w-full min-w-[480px] border-collapse text-left">
        <thead>
          <tr className="border-b border-silver/15">
            <th className="px-4 py-4 text-sm font-medium text-muted sm:px-6">
              {specificationLabel}
            </th>
            {models.map((model) => (
              <th
                key={model.id}
                onMouseEnter={() => setHovered(model.id)}
                onMouseLeave={() => setHovered(null)}
                className={`px-4 py-4 text-base font-semibold transition-colors sm:px-6 ${
                  hovered === model.id ? "bg-teal/10 text-accent" : "text-ink"
                }`}
              >
                {model.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specFields.map((field, rowIdx) => (
            <tr key={field.key} className={rowIdx % 2 === 1 ? "bg-ink/[0.02]" : undefined}>
              <td className="px-4 py-3 text-sm text-muted sm:px-6">
                {modelsDict.specLabels[field.key]}
              </td>
              {models.map((model) => {
                const value = specsById[model.id][field.key];
                const isPlaceholder = value === SPEC_PLACEHOLDER;
                return (
                  <td
                    key={model.id}
                    onMouseEnter={() => setHovered(model.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`whitespace-nowrap px-4 py-3 text-sm transition-colors sm:px-6 ${
                      hovered === model.id ? "bg-teal/10" : ""
                    } ${isPlaceholder ? "italic text-muted/70" : "text-ink"}`}
                  >
                    {isPlaceholder ? comingSoon : value}
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

const FUEL_TYPES = ["petrol", "diesel"];

// Used until /api/fuel-prices answers, and if it fails.
const FALLBACK_FUEL_PRICE = 1.3;

const defaultAssumptions = {
  evConsumption: 12,
  electricityPrice: 0.15,
  fuelConsumption: 7,
  // null = follow today's price for the selected fuel; a number = the visitor's own value.
  fuelPrice: null,
};

function FuelSavingsCalculator({ dict }) {
  const [distance, setDistance] = useState(40);
  const [assumptions, setAssumptions] = useState(defaultAssumptions);
  const [fuelType, setFuelType] = useState("petrol");
  // { status: "loading" } | { status: "live", petrol, diesel, date, mkd, mkdPerEur } | { status: "fallback" }
  const [livePrices, setLivePrices] = useState({ status: "loading" });
  const fuelTypeGroup = useId();
  const priceNoteId = useId();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/fuel-prices", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data) => {
        if (!(data.petrol > 0 && data.diesel > 0)) throw new Error("Unexpected fuel price data");
        setLivePrices({ status: "live", ...data });
      })
      .catch((error) => {
        if (error?.name !== "AbortError") setLivePrices({ status: "fallback" });
      });
    return () => controller.abort();
  }, []);

  const todaysPrice = livePrices.status === "live" ? livePrices[fuelType] : FALLBACK_FUEL_PRICE;
  const priceEdited = assumptions.fuelPrice !== null;
  const fuelPrice = priceEdited ? assumptions.fuelPrice : todaysPrice;

  // Switching fuel (or "use today's price") drops any typed price, so the field shows the live
  // price for that fuel — including once it finishes loading.
  const applyLivePrice = (type) => {
    setFuelType(type);
    setAssumptions((prev) => ({ ...prev, fuelPrice: null }));
  };

  const results = useMemo(() => {
    const monthlyKm = distance * 30;
    const evCost = (monthlyKm / 100) * assumptions.evConsumption * assumptions.electricityPrice;
    const fuelCost = (monthlyKm / 100) * assumptions.fuelConsumption * fuelPrice;
    const monthlySavings = fuelCost - evCost;
    return { evCost, fuelCost, monthlySavings, yearlySavings: monthlySavings * 12 };
  }, [distance, assumptions, fuelPrice]);

  const formatEUR = (value) => `€${formatInteger(value, dict.thousandsSeparator)}`;
  const formatDecimal = (value, digits = 2) =>
    value.toFixed(digits).replace(".", dict.decimalSeparator);

  const updateAssumption = (key) => (event) => {
    const value = Number(event.target.value);
    setAssumptions((prev) => ({ ...prev, [key]: Number.isNaN(value) ? prev[key] : value }));
  };

  const priceNote =
    livePrices.status === "loading"
      ? dict.priceLoading
      : livePrices.status === "fallback"
        ? format(dict.priceFallback, { price: formatDecimal(FALLBACK_FUEL_PRICE) })
        : format(dict.priceSource, {
            date: formatDisplayDate(livePrices.date),
            mkd: formatDecimal(livePrices.mkd[fuelType]),
            rate: formatDecimal(livePrices.mkdPerEur, 1),
          });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-16 rounded-2xl border border-silver/15 bg-ink/[0.03] p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <Calculator className="h-5 w-5 text-accent" />
        <h3 className="text-xl font-semibold text-ink">{dict.title}</h3>
      </div>

      <label className="flex flex-col gap-3">
        <span className="flex items-center justify-between text-sm text-muted">
          <span>{dict.dailyDistance}</span>
          <span className="font-medium text-ink">
            {format(dict.kmPerDay, { n: distance })}
          </span>
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
          <p className="text-sm text-muted">{dict.monthlySavings}</p>
          <p className="mt-2 text-3xl font-semibold text-accent">
            {formatEUR(results.monthlySavings)}
          </p>
          <p className="mt-1 text-xs text-muted">
            {format(dict.vsLine, {
              fuelCost: formatEUR(results.fuelCost),
              fuel: dict.fuelNames[fuelType],
              ev: formatEUR(results.evCost),
            })}
          </p>
        </div>
        <div className="rounded-xl border border-silver/10 p-5">
          <p className="text-sm text-muted">{dict.yearlySavings}</p>
          <p className="mt-2 text-3xl font-semibold text-accent">
            {formatEUR(results.yearlySavings)}
          </p>
          <p className="mt-1 text-xs text-muted">
            {format(dict.basedOn, { km: formatInteger(distance * 365, dict.thousandsSeparator) })}
          </p>
        </div>
      </div>

      <details className="mt-6 text-sm text-muted">
        <summary className="cursor-pointer select-none text-muted hover:text-accent">
          {dict.adjust}
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Real radio inputs (visually hidden) styled as a pill toggle: native keyboard and
              screen-reader behaviour for free. */}
          <fieldset className="flex flex-col gap-2 sm:col-span-2">
            <legend className="mb-2">{dict.fuelType}</legend>
            <div className="inline-flex w-fit flex-wrap gap-1 rounded-full border border-silver/20 bg-ink/5 p-1">
              {FUEL_TYPES.map((type) => (
                <label
                  key={type}
                  className={`relative cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    fuelType === type
                      ? "bg-teal font-medium text-obsidian"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name={fuelTypeGroup}
                    value={type}
                    checked={fuelType === type}
                    onChange={() => applyLivePrice(type)}
                    className="sr-only"
                  />
                  {dict.fuelTypes[type]}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex flex-col gap-1">
            <span>{dict.evConsumption}</span>
            <input
              type="number"
              min={1}
              step={0.5}
              value={assumptions.evConsumption}
              onChange={updateAssumption("evConsumption")}
              className="rounded-lg border border-silver/20 bg-transparent px-3 py-2 text-ink focus:border-accent focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>{dict.electricityPrice}</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={assumptions.electricityPrice}
              onChange={updateAssumption("electricityPrice")}
              className="rounded-lg border border-silver/20 bg-transparent px-3 py-2 text-ink focus:border-accent focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span>{dict.fuelConsumption[fuelType]}</span>
            <input
              type="number"
              min={1}
              step={0.5}
              value={assumptions.fuelConsumption}
              onChange={updateAssumption("fuelConsumption")}
              className="rounded-lg border border-silver/20 bg-transparent px-3 py-2 text-ink focus:border-accent focus:outline-none"
            />
          </label>
          <div className="flex flex-col gap-1">
            <label className="flex flex-col gap-1">
              <span>{dict.fuelPrice[fuelType]}</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={fuelPrice}
                onChange={updateAssumption("fuelPrice")}
                aria-describedby={priceNoteId}
                className="rounded-lg border border-silver/20 bg-transparent px-3 py-2 text-ink focus:border-accent focus:outline-none"
              />
            </label>
            <p id={priceNoteId} aria-live="polite" className="text-xs text-muted/70">
              {priceNote}
            </p>
            {priceEdited && fuelPrice !== todaysPrice && (
              <button
                type="button"
                onClick={() => applyLivePrice(fuelType)}
                className="w-fit text-xs font-medium text-accent hover:text-ink"
              >
                {format(dict.useTodaysPrice, { price: formatDecimal(todaysPrice) })}
              </button>
            )}
          </div>
        </div>
        <p className="mt-4 text-xs text-muted/70">{dict.disclaimer}</p>
      </details>
    </motion.div>
  );
}

export default function ModelComparison({ dict, models: modelsDict, common }) {
  return (
    <section id="compare" className="border-t border-silver/10">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">{dict.heading}</h2>
          <p className="max-w-xl text-muted">{dict.description}</p>
        </div>

        <ComparisonTable
          models={modelsDict}
          specificationLabel={dict.specification}
          comingSoon={common.comingSoon}
        />
        <FuelSavingsCalculator dict={dict.calculator} />
      </div>
    </section>
  );
}
