import { MKD_PER_EUR, SOURCE_URL, parsePrices, toEur } from "@/lib/fuelPrices";

export const runtime = "nodejs";

// Prices change at most daily; keep the last good result for a few hours so visitors don't
// each trigger a request to Makpetrol. Failures aren't cached.
const CACHE_MS = 6 * 60 * 60 * 1000;
let cached = null;

export async function GET() {
  if (!cached || Date.now() - cached.fetchedAt > CACHE_MS) {
    try {
      const response = await fetch(SOURCE_URL, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; AuraviaFuelPrices/1.0)" },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error(`Makpetrol responded ${response.status}`);
      cached = { latest: parsePrices(await response.text()), fetchedAt: Date.now() };
    } catch (error) {
      console.error("Fuel price scrape failed:", error);
      // A stale price beats none; only fail if we've never had one.
      if (!cached) {
        return Response.json(
          { error: "Fuel prices are temporarily unavailable." },
          { status: 502, headers: { "Cache-Control": "no-store" } }
        );
      }
    }
  }

  const { latest } = cached;
  return Response.json(
    {
      petrol: toEur(latest.petrol),
      diesel: toEur(latest.diesel),
      currency: "EUR",
      date: latest.date,
      mkd: { petrol: latest.petrol, diesel: latest.diesel },
      mkdPerEur: MKD_PER_EUR,
      source: "Makpetrol",
    },
    { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } }
  );
}
