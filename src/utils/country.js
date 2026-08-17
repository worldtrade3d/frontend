let countryLookup = new Map();

export function buildCountryLookup(features) {
  countryLookup.clear();

  features.forEach(feature => {
    const { properties } = feature;
    const iso = properties.ISO_A3 !== "-99" ? properties.ISO_A3 : properties.ADM0_A3;

    if (iso && properties.ADMIN) {
      countryLookup.set(iso, properties.ADMIN);
    }
  });
}

export function getCountryName(iso) {
  if (!iso) return "Unknown";

  return countryLookup.get(iso) || iso;
}