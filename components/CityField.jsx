"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, LocateFixed } from "lucide-react";
import { inputClass, labelClass } from "@/components/FormControls";
import { nearestCity } from "@/lib/cities";
import { format } from "@/lib/i18n";

// The name to show for a town on the current locale's site.
const cityLabel = (city, locale) => (locale === "mk" ? city.mk : city.name);

// Geolocation error codes (GeolocationPositionError) mapped to our messages.
const GEO_ERRORS = { 1: "denied", 2: "unavailable", 3: "unavailable" };

export default function CityField({ value, onChange, locale, labels }) {
  const [geo, setGeo] = useState({ state: "idle", message: "" });
  const inputId = useId();
  const statusId = useId();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const detect = () => {
    // Needs a secure context (https or localhost) and browser support.
    if (!("geolocation" in navigator) || !window.isSecureContext) {
      setGeo({ state: "error", message: labels.unsupported });
      return;
    }
    setGeo({ state: "locating", message: "" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!mounted.current) return;
        const city = nearestCity(coords.latitude, coords.longitude);
        if (!city) {
          setGeo({ state: "error", message: labels.outside });
          return;
        }
        const name = cityLabel(city, locale);
        onChange(name);
        setGeo({ state: "found", message: format(labels.found, { city: name }) });
      },
      (error) => {
        if (!mounted.current) return;
        setGeo({ state: "error", message: labels[GEO_ERRORS[error.code] ?? "unavailable"] });
      },
      // City-level accuracy is plenty; a cached fix up to 10 minutes old is fine.
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  };

  const locating = geo.state === "locating";
  const note = geo.message || (value.trim() ? "" : labels.emptyHint);

  return (
    <div className={labelClass}>
      <label htmlFor={inputId}>{labels.label}</label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          if (geo.state !== "locating") setGeo({ state: "idle", message: "" });
        }}
        autoComplete="address-level2"
        placeholder={labels.placeholder}
        aria-describedby={note ? statusId : undefined}
        className={inputClass}
      />
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <button
          type="button"
          onClick={detect}
          disabled={locating}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-ink disabled:cursor-wait disabled:opacity-70"
        >
          {locating ? (
            <Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LocateFixed aria-hidden className="h-3.5 w-3.5" />
          )}
          {locating ? labels.detecting : labels.useLocation}
        </button>
        <span
          id={statusId}
          role="status"
          aria-live="polite"
          className={`text-xs ${geo.state === "error" ? "text-amber-700 dark:text-amber-300" : "text-muted/70"}`}
        >
          {note}
        </span>
      </div>
    </div>
  );
}
