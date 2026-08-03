let countryLookup = new Map();


/*
  Build ISO_A3 -> country name lookup
*/
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


/*
  Get country name from ISO_A3
*/
export function getCountryName(iso) {

  if (!iso) {
    return "Unknown";
  }

  return countryLookup.get(iso) || iso;

}