"use client";

import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";

// color-scheme: dark makes the browser draw its native parts of form controls (select popups,
// the date picker and its calendar icon, autofill) in dark mode to match the page.
export const inputClass =
  "w-full rounded-lg border border-silver/20 bg-transparent px-3 py-2.5 text-sm text-slate-50 [color-scheme:dark] placeholder:text-silver/50 focus:border-teal focus:outline-none";

// Native <select> popups are drawn by the OS and don't inherit the field's transparent
// background, so on light-themed systems the options showed near-white text on white. Give the
// options an explicit dark background and light text.
export const selectClass = `${inputClass} [&>option]:bg-obsidian [&>option]:text-slate-100`;

export const labelClass = "flex flex-col gap-1.5 text-sm text-silver";

// Same look as inputClass, with a red border while the field has an error.
// Swapped rather than appended: two border colours on one element would resolve by stylesheet
// order, not class order.
export const invalidInputClass = inputClass
  .replace("border-silver/20", "border-red-400/70")
  .replace("focus:border-teal", "focus:border-red-400");

// YYYY-MM-DD in the visitor's local time zone. toISOString() would give the UTC date, which in
// North Macedonia (UTC+1/+2) is still yesterday until 1–2 am.
export function toLocalISODate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Calendar months, clamped to the last day of shorter months:
// 30 Nov + 3 months = 28 Feb (not 2 Mar).
function addMonths(date, months) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return target;
}

// { min, max } as YYYY-MM-DD, from today through `months` months ahead, inclusive.
export function getDateRange(months, today = new Date()) {
  return { min: toLocalISODate(today), max: toLocalISODate(addMonths(today, months)) };
}

// null if the value is empty (callers handle "required") or within range; otherwise the reason.
// YYYY-MM-DD strings compare correctly as plain strings.
export function checkDateInRange(value, { min, max }) {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "invalid";
  if (value < min) return "past";
  if (value > max) return "tooLate";
  return null;
}

// DD.MM.YYYY: the usual format in North Macedonia and unambiguous for English readers,
// and it avoids Intl, whose Macedonian locale data many browsers don't ship.
export function formatDisplayDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

export function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <span id={id} role="alert" className="flex items-start gap-1.5 text-xs text-red-300">
      <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
      {children}
    </span>
  );
}

export function StatusBanner({ status, successMessage, errorMessage }) {
  if (status === "success") {
    return (
      <div className="flex items-start gap-2.5 rounded-lg border border-teal/30 bg-teal/10 px-4 py-3 text-sm text-slate-50">
        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
        <span>{successMessage}</span>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-slate-50">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
        <span>{errorMessage}</span>
      </div>
    );
  }
  return null;
}

export function SubmitButton({ status, submittingLabel, children }) {
  const submitting = status === "submitting";
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-obsidian transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
      {submitting ? submittingLabel : children}
    </button>
  );
}
