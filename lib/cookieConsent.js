"use client";

import { useSyncExternalStore } from "react";

// Shared cookie-consent state: the banner writes it, analytics (and anything else that needs
// consent) reads it. Stored in localStorage as "accepted" | "declined".
const STORAGE_KEY = "cookieConsent";
const CHANGE_EVENT = "cookie-consent-change";

// "accepted" | "declined" | null (not chosen yet). localStorage can throw (e.g. blocked storage),
// which is treated as "no choice".
export function getCookieConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setCookieConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage unavailable: the choice still applies for this page view via the event below.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }));
}

// Forgets the choice, so the banner reappears and consent-gated features (analytics) treat the
// visitor as undecided until they choose again. Used by the footer's "Cookie settings" link.
export function clearCookieConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable: nothing stored to clear.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: null }));
}

const subscribe = (onChange) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  // Choices made in other tabs.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

// The current choice, live. Uses useSyncExternalStore rather than useEffect + setState: on the
// server and during hydration it returns "unknown", so consent-dependent UI renders nothing
// there (no flash, no hydration mismatch) and appears once the browser has read localStorage.
export function useCookieConsent() {
  return useSyncExternalStore(subscribe, getCookieConsent, () => "unknown");
}
