// Equipment by version, from Linktour's technical specification sheet
// (TechnicalSpecifications(en).pdf). Trim names are Linktour's own; the L6 is sold by Linktour
// as the Alumi and the L7 as the Alumi Elite. Labels are localized in dictionaries/*.json
// under trims.features.<key>; `true`/`false` render as included/not included, and a string is
// a dictionary key under trims.values.
export const trims = [
  { id: "alumi", model: "L6", name: "Alumi" },
  { id: "alumi-plus", model: "L6", name: "Alumi Plus" },
  { id: "alumi-pro", model: "L6", name: "Alumi Pro" },
  { id: "alumi-elite", model: "L7", name: "Alumi Elite" },
  { id: "alumi-elite-plus", model: "L7", name: "Alumi Elite+" },
];

// One entry per trim, in the same order as `trims`.
export const trimFeatures = [
  { key: "infotainment", values: [false, true, true, false, true] },
  { key: "rearCamera", values: [false, true, true, false, true] },
  { key: "usbC", values: [false, false, true, false, true] },
  { key: "climate", values: ["heatingOnly", "heatingOnly", "airCon", "heatingOnly", "airCon"] },
  { key: "twoLevelHeating", values: [false, false, true, false, true] },
  { key: "airCirculation", values: [false, false, true, true, true] },
  { key: "seats", values: ["fabric", "fabric", "fabric", "fabric", "leather"] },
  { key: "keyless", values: [false, false, false, true, true] },
  { key: "roofRack", values: [false, false, false, true, true] },
  { key: "appRemote", values: [false, false, false, true, true] },
  { key: "appStatusClimate", values: [false, false, false, false, true] },
];
