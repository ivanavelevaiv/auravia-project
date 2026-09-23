"use client";

import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";

export const inputClass =
  "w-full rounded-lg border border-silver/20 bg-transparent px-3 py-2.5 text-sm text-slate-50 placeholder:text-silver/50 focus:border-teal focus:outline-none";

export const labelClass = "flex flex-col gap-1.5 text-sm text-silver";

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

export function SubmitButton({ status, children }) {
  const submitting = status === "submitting";
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-obsidian transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
      {submitting ? "Submitting…" : children}
    </button>
  );
}
