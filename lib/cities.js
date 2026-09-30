// Towns in North Macedonia for "Use current location". The browser only gives coordinates;
// rather than sending them to a third-party reverse-geocoding service, we pick the nearest town
// from this list on the visitor's device. `name` (English) is what gets stored with the request;
// `mk` is the label shown on the Macedonian site. Coordinates are town centres (approximate).
export const MK_CITIES = [
  { name: "Skopje", mk: "Скопје", lat: 41.9981, lon: 21.4254 },
  { name: "Kumanovo", mk: "Куманово", lat: 42.1322, lon: 21.7144 },
  { name: "Bitola", mk: "Битола", lat: 41.0297, lon: 21.3292 },
  { name: "Prilep", mk: "Прилеп", lat: 41.3464, lon: 21.5542 },
  { name: "Tetovo", mk: "Тетово", lat: 42.0106, lon: 20.9714 },
  { name: "Veles", mk: "Велес", lat: 41.7156, lon: 21.7756 },
  { name: "Ohrid", mk: "Охрид", lat: 41.1172, lon: 20.8019 },
  { name: "Gostivar", mk: "Гостивар", lat: 41.7972, lon: 20.9083 },
  { name: "Štip", mk: "Штип", lat: 41.7458, lon: 22.1953 },
  { name: "Strumica", mk: "Струмица", lat: 41.4378, lon: 22.6431 },
  { name: "Kavadarci", mk: "Кавадарци", lat: 41.4331, lon: 22.0119 },
  { name: "Kočani", mk: "Кочани", lat: 41.9167, lon: 22.4125 },
  { name: "Kičevo", mk: "Кичево", lat: 41.5142, lon: 20.9631 },
  { name: "Struga", mk: "Струга", lat: 41.1775, lon: 20.6789 },
  { name: "Radoviš", mk: "Радовиш", lat: 41.6381, lon: 22.4644 },
  { name: "Gevgelija", mk: "Гевгелија", lat: 41.1392, lon: 22.5025 },
  { name: "Debar", mk: "Дебар", lat: 41.525, lon: 20.5272 },
  { name: "Kriva Palanka", mk: "Крива Паланка", lat: 42.2019, lon: 22.3317 },
  { name: "Sveti Nikole", mk: "Свети Николе", lat: 41.865, lon: 21.9425 },
  { name: "Negotino", mk: "Неготино", lat: 41.4839, lon: 22.0892 },
  { name: "Delčevo", mk: "Делчево", lat: 41.9661, lon: 22.7747 },
  { name: "Vinica", mk: "Виница", lat: 41.8828, lon: 22.5092 },
  { name: "Resen", mk: "Ресен", lat: 41.0892, lon: 21.0122 },
  { name: "Berovo", mk: "Берово", lat: 41.7033, lon: 22.8561 },
  { name: "Kratovo", mk: "Кратово", lat: 42.0783, lon: 22.1806 },
  { name: "Probištip", mk: "Пробиштип", lat: 42.0033, lon: 22.1789 },
  { name: "Kruševo", mk: "Крушево", lat: 41.3689, lon: 21.2481 },
  { name: "Makedonski Brod", mk: "Македонски Брод", lat: 41.5133, lon: 21.2153 },
  { name: "Valandovo", mk: "Валандово", lat: 41.3169, lon: 22.5611 },
  { name: "Demir Hisar", mk: "Демир Хисар", lat: 41.2208, lon: 21.2031 },
];

// Beyond this the visitor is most likely outside North Macedonia (the country is ~200 km
// across, and every point in it is well within this of a listed town).
const MAX_MATCH_KM = 40;

function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

// The nearest listed town, or null if none is within MAX_MATCH_KM.
export function nearestCity(lat, lon) {
  let best = null;
  for (const city of MK_CITIES) {
    const km = distanceKm(lat, lon, city.lat, city.lon);
    if (!best || km < best.km) best = { city, km };
  }
  return best && best.km <= MAX_MATCH_KM ? best.city : null;
}
