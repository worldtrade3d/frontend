let countryLookup = new Map();

export function buildCountryLookup(features) {

  countryLookup.clear();

  features.forEach(feature => {

    const props = feature.properties;

    const iso =
      props.ISO_A3 !== "-99"
        ? props.ISO_A3
        : props.ADM0_A3;

    const name = props.ADMIN;

    if (iso && name) {

      countryLookup.set(
        iso,
        name
      );

    }

  });

}

export function getCountryName(iso) {

  if (!iso) {
    return "Unknown";
  }

  return countryLookup.get(iso) || iso;

}