import { state } from "../config/state.js";
import { theme } from "../config/theme.js";

export function createCountryRenderer({
  context,
  path,
  features,
  getISO
}) {
  const getColor = createColorResolver({
    features,
    getISO
  });

  function drawCountries(hovered) {
    const t = theme.globe;

    for (const feature of features) {
      if (feature === hovered) {
        continue;
      }

      context.beginPath();
      path(feature);

      const iso = getISO(feature);

      context.fillStyle = getColor(iso);
      context.fill();

      context.strokeStyle = t.strokecolor;
      context.lineWidth = t.strokethickness;
      context.stroke();
    }
  }

  function drawHovered(feature) {
    if (!feature) {
      return;
    }

    const t = theme.globe;

    context.save();

    context.beginPath();
    path(feature);

    context.fillStyle = t.countryHovered;
    context.fill();

    context.strokeStyle = t.strokecolor;
    context.lineWidth = t.strokethickness;
    context.stroke();

    context.restore();
  }

  return {
    drawCountries,
    drawHovered
  };
}

function createColorResolver({ features, getISO }) {
  function getColor(iso) {
    const t = theme.globe;

    const feature = features.find(
      feature => getISO(feature) === iso
    );

    const continent = feature?.properties?.CONTINENT;

    const defaultColor =
      t.continents?.[continent] ??
      t.countryDefault;

    if (state.mapMode === "heatmap") {
      if (state.selectedISO || state.pendingISO) {
        if (iso === state.pendingISO) {
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
          Math.min(
            1,
            Math.sqrt(value / maxValue)
          )
        );

        const gb = Math.floor(
          255 * (1 - intensity)
        );

        return `rgb(255, ${gb}, ${gb})`;
      }

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
        Math.min(
          1,
          Math.sqrt(value / maxValue)
        )
      );

      const gb = Math.floor(
        255 * (1 - intensity)
      );

      return `rgb(255, ${gb}, ${gb})`;
    }

    if (!state.pendingISO) {
      return defaultColor;
    }

    if (iso === state.pendingISO) {
      return t.countrySelected;
    }

    return defaultColor;
  }

  return getColor;
}