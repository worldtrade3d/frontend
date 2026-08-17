import { createSearchController } from "../controllers/searchController.js";

export function createSearchCompositor({
  features,
  controls,
  onCountrySelected
}) {
  const searchController = createSearchController({
    features,
    controls
  });

  return {
    syncCountry(country) {
      searchController.setSelectedCountry(country);
    },

    onCountrySelected
  };
}