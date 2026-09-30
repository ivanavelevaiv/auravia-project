"use client";

import { forwardRef, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDisplayDate, inputClass, invalidInputClass, toLocalISODate } from "@/components/FormControls";

// A small calendar used instead of <input type="date">. Chrome's native picker ignores
// min/max for its month/year list, so visitors could browse back to past years; this one can
// only move between the months that contain bookable days, has no year list, and disables every
// day outside [min, max]. Values are YYYY-MM-DD strings, like the native input.

const parseISODate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const addDays = (iso, days) => {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toLocalISODate(date);
};

// Same day next/previous month, clamped to the target month's length.
const addMonthsISO = (iso, months) => {
  const date = parseISODate(iso);
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return toLocalISODate(target);
};

const clamp = (iso, min, max) => (iso < min ? min : iso > max ? max : iso);
const monthKey = (iso) => iso.slice(0, 7);

// Monday-first grid for the month containing `iso`: leading/trailing nulls pad whole weeks.
function buildMonth(iso) {
  const first = parseISODate(`${monthKey(iso)}-01`);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const leading = (first.getDay() + 6) % 7;
  const cells = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${monthKey(iso)}-${String(day).padStart(2, "0")}`);
  }
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, row) => cells.slice(row * 7, row * 7 + 7));
}

const DatePicker = forwardRef(function DatePicker(
  { value, onChange, min, max, labels, invalid = false, describedBy, id },
  triggerRef
) {
  const [open, setOpen] = useState(false);
  // The day that holds keyboard focus inside the grid (roving tabindex).
  const [focusedDate, setFocusedDate] = useState(() => clamp(value || min, min, max));
  const dialogId = useId();
  const headingId = useId();
  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const moveFocusRef = useRef(false);

  const today = toLocalISODate(new Date());
  const weeks = buildMonth(focusedDate);
  const viewMonth = parseISODate(focusedDate);
  const canGoBack = monthKey(focusedDate) > monthKey(min);
  const canGoForward = monthKey(focusedDate) < monthKey(max);

  const openCalendar = () => {
    setFocusedDate(clamp(value || min, min, max));
    moveFocusRef.current = true;
    setOpen(true);
  };

  const close = (returnFocus) => {
    setOpen(false);
    if (returnFocus) triggerRef?.current?.focus();
  };

  const select = (iso) => {
    onChange(iso);
    close(true);
  };

  // Move DOM focus to the focused day after it (or its month) re-renders.
  useEffect(() => {
    if (!open || !moveFocusRef.current) return;
    moveFocusRef.current = false;
    gridRef.current?.querySelector(`[data-date="${focusedDate}"]`)?.focus();
  }, [open, focusedDate]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  const moveFocus = (iso) => {
    moveFocusRef.current = true;
    setFocusedDate(clamp(iso, min, max));
  };

  const changeMonth = (months) => {
    // Keep keyboard focus on the arrow buttons when they're clicked.
    setFocusedDate((current) => clamp(addMonthsISO(current, months), min, max));
  };

  const onGridKeyDown = (event) => {
    const weekday = (parseISODate(focusedDate).getDay() + 6) % 7;
    const moves = {
      ArrowLeft: () => addDays(focusedDate, -1),
      ArrowRight: () => addDays(focusedDate, 1),
      ArrowUp: () => addDays(focusedDate, -7),
      ArrowDown: () => addDays(focusedDate, 7),
      Home: () => addDays(focusedDate, -weekday),
      End: () => addDays(focusedDate, 6 - weekday),
      PageUp: () => addMonthsISO(focusedDate, -1),
      PageDown: () => addMonthsISO(focusedDate, 1),
    };
    if (moves[event.key]) {
      event.preventDefault();
      moveFocus(moves[event.key]());
    }
  };

  const onDialogKeyDown = (event) => {
    if (event.key === "Escape") {
      // Don't let the booking modal's own Escape handler close the whole form.
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      close(true);
    }
  };

  const dayLabel = (iso) => {
    const date = parseISODate(iso);
    const weekday = labels.weekdaysLong[(date.getDay() + 6) % 7];
    return `${weekday}, ${formatDisplayDate(iso)}`;
  };

  return (
    <div ref={rootRef} className="relative">
      {/* Errors are announced through describedBy (the error has role="alert"); aria-invalid
          isn't a valid attribute on a button. */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={() => (open ? close(false) : openCalendar())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        aria-describedby={describedBy}
        className={`${invalid ? invalidInputClass : inputClass} flex items-center justify-between gap-2 text-left`}
      >
        <span className={value ? "text-slate-50" : "text-silver/50"}>
          {value ? formatDisplayDate(value) : labels.placeholder}
        </span>
        <CalendarDays aria-hidden className="h-4 w-4 shrink-0 text-silver" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={dialogId}
            role="dialog"
            aria-modal="false"
            aria-labelledby={headingId}
            onKeyDown={onDialogKeyDown}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-20 mt-2 w-72 rounded-xl border border-teal/30 bg-obsidian p-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8),0_0_30px_-15px_var(--color-teal)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                disabled={!canGoBack}
                aria-label={labels.prevMonth}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-100 transition-colors hover:bg-white/5 hover:text-teal disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p id={headingId} aria-live="polite" className="text-sm font-semibold text-slate-50">
                {labels.months[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </p>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                disabled={!canGoForward}
                aria-label={labels.nextMonth}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-100 transition-colors hover:bg-white/5 hover:text-teal disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <table ref={gridRef} role="grid" aria-labelledby={headingId} onKeyDown={onGridKeyDown} className="w-full border-collapse">
              <thead>
                <tr>
                  {labels.weekdays.map((day, idx) => (
                    <th key={day} scope="col" abbr={labels.weekdaysLong[idx]} className="pb-1 text-center text-[11px] font-medium text-silver/70">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, row) => (
                  <tr key={row}>
                    {week.map((iso, col) => {
                      if (!iso) return <td key={col} />;
                      const disabled = iso < min || iso > max;
                      const selected = iso === value;
                      const isToday = iso === today;
                      return (
                        <td key={iso} className="p-0.5 text-center">
                          <button
                            type="button"
                            data-date={iso}
                            disabled={disabled}
                            tabIndex={iso === focusedDate ? 0 : -1}
                            onClick={() => select(iso)}
                            aria-label={dayLabel(iso)}
                            aria-pressed={selected}
                            aria-current={isToday ? "date" : undefined}
                            className={`h-9 w-9 rounded-full text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
                              selected
                                ? "bg-teal font-semibold text-obsidian"
                                : disabled
                                  ? "cursor-not-allowed text-silver/25"
                                  : "text-slate-100 hover:bg-white/10"
                            } ${isToday && !selected ? "ring-1 ring-inset ring-teal/60" : ""}`}
                          >
                            {Number(iso.slice(8))}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default DatePicker;
