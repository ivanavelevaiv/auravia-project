// Values not published by Linktour yet; components render this string in a muted style.
export const SPEC_PLACEHOLDER = "Coming soon";

// Sourced from linktour-auto.com/en/product/alumi and /en/product/detail — see docs/linktour-specs.md.
export const specFields = [
  { key: "classification", label: "Quadricycle classification", icon: "BadgeCheck" },
  { key: "battery", label: "Battery capacity", icon: "BatteryCharging" },
  { key: "range", label: "Driving range", icon: "Route" },
  { key: "motorPower", label: "Motor power", icon: "Zap" },
  { key: "topSpeed", label: "Top speed", icon: "Gauge" },
  { key: "chargingTime", label: "Charging time", icon: "Clock" },
  { key: "dimensions", label: "Dimensions (L × W × H)", icon: "Ruler" },
  { key: "groundClearance", label: "Ground clearance", icon: "ArrowUpFromLine" },
  { key: "maxMass", label: "Max. permissible mass", icon: "Weight" },
  { key: "gradeability", label: "Gradeability", icon: "Mountain" },
  { key: "tires", label: "Tyres", icon: "CircleDot" },
];

export const models = [
  {
    id: "L6",
    name: "Linktour L6",
    tagline: "Built for tight city streets.",
    gallery: [
      "/images/L6/hero.jpg",
      "/images/L6/side.jpg",
      "/images/L6/interior.jpg",
      "/images/L6/rear.jpg",
    ],
    // Linktour "Alumi"
    specs: {
      classification: "L6e quadricycle",
      battery: "7.2 kWh LFP",
      range: "120 km (WMTC)",
      motorPower: "6 kW rated · 12 kW peak · 65 N·m",
      topSpeed: "45 km/h",
      chargingTime: "4 h (0–100%, 2 kW AC)",
      dimensions: "2685 × 1500 × 1555 mm",
      groundClearance: "140 mm",
      maxMass: "760 kg",
      gradeability: "30%",
      tires: "155/70 R13, steel rims",
    },
  },
  {
    id: "L7",
    name: "Linktour L7",
    tagline: "More range, more performance.",
    gallery: [
      "/images/L7/hero.jpg",
      "/images/L7/side.jpg",
      "/images/L7/interior.jpg",
      "/images/L7/rear.jpg",
    ],
    // Linktour "Alumi Elite". Top speed confirmed by the Auravia team (not on Linktour's site).
    specs: {
      classification: "L7e quadricycle",
      battery: "12.96 kWh LFP",
      range: "180 km (WMTC)",
      motorPower: "10 kW rated · 23 kW peak · 95 N·m",
      topSpeed: "90 km/h",
      chargingTime: "4.5 h (0–100%, 3.3 kW AC)",
      dimensions: "2685 × 1500 × 1590 mm",
      groundClearance: "130 mm",
      maxMass: "820 kg",
      gradeability: "35%",
      tires: "155/65 R14, steel rims",
    },
  },
];
