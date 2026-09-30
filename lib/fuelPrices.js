import * as cheerio from "cheerio";

// Makpetrol publishes daily retail prices (MKD per litre) in a table on its price-history page;
// the homepage itself doesn't contain the prices.
export const SOURCE_URL =
  "https://www.makpetrol.com.mk/%d0%b8%d1%81%d1%82%d0%be%d1%80%d0%b8%d1%98%d0%b0%d1%82-%d0%bd%d0%b0-%d0%bf%d1%80%d0%be%d0%bc%d0%b5%d0%bd%d0%b0-%d0%bd%d0%b0-%d1%86%d0%b5%d0%bd%d0%b8/";

export const MKD_PER_EUR = 61.5;

// Column headers on Makpetrol's table. There's no plain "Ultra Diesel": Green Power is their
// standard diesel (Bio Power is the other column).
const COLUMNS = { petrol: "Ultra 95+", diesel: "Ultra Diesel Green Power" };

const parseMkd = (text) => {
  const value = Number(text.trim().replace(/\./g, "").replace(",", "."));
  // Sanity range for a litre of fuel in MKD; anything else means the page changed shape.
  return Number.isFinite(value) && value > 30 && value < 300 ? value : null;
};

const toISO = (ddmmyyyy) => {
  const match = ddmmyyyy.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
};

export const toEur = (mkd) => Math.round((mkd / MKD_PER_EUR) * 100) / 100;

// { date: "YYYY-MM-DD", petrol, diesel } in MKD for the newest complete row; throws if the page
// no longer has the expected table.
export function parsePrices(html) {
  const $ = cheerio.load(html);
  const headersOf = (table) =>
    $(table).find("thead th").map((_, th) => $(th).text().trim()).get();

  // Find the table by its headers rather than its id, in case the id changes.
  const table = $("table")
    .filter((_, el) => Object.values(COLUMNS).every((name) => headersOf(el).includes(name)))
    .first();
  if (!table.length) throw new Error("Price table not found");

  const headers = headersOf(table);
  const index = {
    date: 0,
    petrol: headers.indexOf(COLUMNS.petrol),
    diesel: headers.indexOf(COLUMNS.diesel),
  };

  // Use the newest dated row with both prices, not whichever row happens to be last.
  let latest = null;
  table.find("tbody tr").each((_, tr) => {
    const cells = $(tr).find("td").map((__, td) => $(td).text()).get();
    const date = toISO(cells[index.date] ?? "");
    const petrol = parseMkd(cells[index.petrol] ?? "");
    const diesel = parseMkd(cells[index.diesel] ?? "");
    if (date && petrol && diesel && (!latest || date > latest.date)) {
      latest = { date, petrol, diesel };
    }
  });
  if (!latest) throw new Error("No complete price rows");
  return latest;
}
