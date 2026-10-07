"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useCookieConsent } from "@/lib/cookieConsent";

// Google Analytics 4 measurement ID.
const GA_MEASUREMENT_ID = "G-S0CG947QXM";

// Google Analytics, loaded only with consent. Unless the stored choice is exactly "accepted",
// this renders nothing: no gtag scripts are injected and nothing is requested from Google. That
// covers "declined", no choice yet, and the server/hydration pass (where consent is "unknown").
// If the visitor accepts mid-visit, the scripts load straight away without a reload.
//
// Page views on client-side navigation (language switch, section links) are recorded by GA4's
// default enhanced measurement, which listens to browser history changes.
export default function Analytics() {
  const consent = useCookieConsent();

  // Once gtag has loaded it can't be unloaded, so if consent is later withdrawn (e.g. declined in
  // another tab) Google's documented opt-out flag stops it sending anything further.
  useEffect(() => {
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = consent !== "accepted";
  }, [consent]);

  if (consent !== "accepted") return null;

  return (
    <>
      <Script
        id="ga-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
