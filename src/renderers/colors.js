import { state } from "../state/state.js";
import { theme } from "../theme/theme.js";

export function createColorResolver({ features, getISO }) {
  function getColor(iso) {
    const t = theme.globe;

    const feature = features.find(f => getISO(f) === iso);
    const continent = feature?.properties?.CONTINENT;

    const defaultColor =
      t.continents?.[continent] ?? t.countryDefault;

    // Heatmap mode
    if (state.mapMode === "heatmap") {
      // Selected country / partner heatmap
      if (state.selectedISO || state.pendingISO) {
        if (
          iso === state.pendingISO ||
          iso === state.selectedISO
        ) {
          return t.countrySelected;
        }

        const value = state.partners.get(iso);

        if (value == null) {
          return t.countryDefault;
        }

        const maxValue = Math.max(
          ...state.partners.values(),
          1
        );

        const intensity = Math.max(
          0.08,
          Math.min(1, Math.sqrt(value / maxValue))
        );

        const gb = Math.floor(255 * (1 - intensity));

        return `rgb(255, ${gb}, ${gb})`;
      }

      // Global totals heatmap
      const value = state.totalTrade.get(iso);

      if (value == null) {
        return t.countryDefault;
      }

      const maxValue = Math.max(
        ...state.totalTrade.values(),
        1
      );

      const intensity = Math.max(
        0.08,
        Math.min(1, Math.sqrt(value / maxValue))
      );

      const gb = Math.floor(255 * (1 - intensity));

      return `rgb(255, ${gb}, ${gb})`;
    }

    // Default mode
    if (!state.selectedISO && !state.pendingISO) {
      return defaultColor;
    }

    if (
      iso === state.pendingISO ||
      iso === state.selectedISO
    ) {
      return t.countrySelected;
    }

    return defaultColor;
  }

  return getColor;
}