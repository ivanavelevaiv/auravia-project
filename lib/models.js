// Marks a value Linktour hasn't published yet; components show the localized "coming soon"
// text (common.comingSoon) in a muted style instead.
export const SPEC_PLACEHOLDER = "Coming soon";

// Sourced from Linktour's technical specification sheet (TechnicalSpecifications(en).pdf) and
// linktour-auto.com/en/product/alumi — see docs/linktour-specs.md.
// Labels, taglines, and spec values containing words or decimals (classification, battery,
// motorPower, drive, driveModes, chargingTime, turningCircle, tires) are localized in
// dictionaries/*.json under models.<id>.specs; only language-neutral values live here.
export const specFields = [
  { key: "classification", icon: "BadgeCheck" },
  { key: "battery", icon: "BatteryCharging" },
  { key: "range", icon: "Route" },
  { key: "motorPower", icon: "Zap" },
  { key: "topSpeed", icon: "Gauge" },
  { key: "drive", icon: "Cog" },
  { key: "driveModes", icon: "SlidersHorizontal" },
  { key: "chargingTime", icon: "Clock" },
  { key: "dimensions", icon: "Ruler" },
  { key: "wheelbase", icon: "MoveHorizontal" },
  { key: "track", icon: "ArrowLeftRight" },
  { key: "groundClearance", icon: "ArrowUpFromLine" },
  { key: "turningCircle", icon: "RotateCw" },
  { key: "maxMass", icon: "Weight" },
  { key: "gradeability", icon: "Mountain" },
  { key: "tires", icon: "CircleDot" },
];

// Linktour's four factory colours, in the order its site lists them. Names are official product
// names, so they aren't translated. The images are L6 (Alumi) side views with identical framing
// (transparent PNGs).
const FACTORY_COLORS = [
  { id: "moon-white", name: "Moon White", swatch: "#d9dbe0", image: "/images/L6/diffcolors/img-11-31.png" },
  { id: "sprout-green", name: "Sprout Green", swatch: "#a9bf9c", image: "/images/L6/diffcolors/img-11-41.png" },
  { id: "rock-grey", name: "Rock Grey", swatch: "#5b5d66", image: "/images/L6/diffcolors/img-11-21.png" },
  { id: "starlit-black", name: "Starlit Black", swatch: "#1f2024", image: "/images/L6/diffcolors/img-11-11.png" },
];

export const models = [
  {
    id: "L6",
    name: "Linktour L6",
    // Whole-car and whole-cabin views only, exteriors first. Detail close-ups (e.g. the headlight
    // shot img-5-14) are left out because they read like crops in the gallery. side-profile.png
    // is the Moon White colour render trimmed of its transparent margin.
    gallery: [
      "/images/L6/img-5-12.jpg",
      "/images/L6/side-profile.png",
      "/images/L6/img-5-11.jpg",
      "/images/L6/img-18-1-5.jpg",
      "/images/L6/interior2.jpg",
      "/images/L6/img-5-13.jpg",
    ],
    colors: FACTORY_COLORS,
    // Linktour "Alumi"
    specs: {
      range: "120 km (WMTC)",
      topSpeed: "45 km/h",
      dimensions: "2685 × 1500 × 1555 mm",
      wheelbase: "1800 mm",
      track: "1310 / 1300 mm",
      groundClearance: "140 mm",
      maxMass: "760 kg",
      gradeability: "30%",
    },
  },
  {
    id: "L7",
    name: "Linktour L7",
    // Exteriors first, then the cabin; the headlight (img-5-4) and steering-wheel (img-18-5)
    // close-ups are left out because they read like crops in the gallery.
    gallery: [
      "/images/L7/img-5-1.jpg",
      "/images/L7/img-5-2.jpg",
      "/images/L7/img-18-2.jpg",
      "/images/L7/img-17-1.jpg",
      "/images/L7/img-18-1.jpg",
      "/images/L7/img-18-3.jpg",
      "/images/L7/img-5-3.jpg",
    ],
    // The interior shots show the two-tone leather cabin, which Linktour's spec sheet lists only
    // on the top Alumi Elite+ version (see docs/linktour-specs.md).
    // Same four factory colours. There are no L7 colour renders yet, so the colour section shows
    // the L6 images with a visible note: the L7 differs (14" wheels, roof rack). Once L7 renders
    // exist, give it its own colour list with its own `image` paths and drop colorImagesFrom.
    colors: FACTORY_COLORS,
    colorImagesFrom: "L6",
    // Linktour "Alumi Elite". Top speed confirmed by the Auravia team (not on Linktour's site).
    specs: {
      range: "180 km (WMTC)",
      topSpeed: "90 km/h",
      dimensions: "2685 × 1500 × 1590 mm",
      wheelbase: "1800 mm",
      track: "1310 / 1300 mm",
      groundClearance: "130 mm",
      maxMass: "820 kg",
      gradeability: "35%",
    },
  },
];

// Language-neutral specs merged with the dictionary's localized ones (dict.models.<id>.specs).
export function getModelSpecs(model, modelDict) {
  return { ...model.specs, ...modelDict.specs };
}
