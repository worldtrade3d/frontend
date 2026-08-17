import { state } from "../config/state.js";
import { theme } from "../config/theme.js";

export function createCountryRenderer({ context, path, features, getISO }) {
  const getColor = createColorResolver({ features, getISO });

  function drawCountries(hovered) {
    const { globe } = theme;

    for (const feature of features) {
      if (feature === hovered) continue;

      const iso = getISO(feature);

      context.beginPath();
      path(feature);
      context.fillStyle = getColor(iso);
      context.fill();
      context.strokeStyle = globe.strokecolor;
      context.lineWidth = globe.strokethickness;
      context.stroke();
    }
  }

  function drawHovered(feature) {
    if (!feature) return;

    const { globe } = theme;

    context.save();
    context.beginPath();
    path(feature);
    context.fillStyle = globe.countryHovered;
    context.fill();
    context.strokeStyle = globe.strokecolor;
    context.lineWidth = globe.strokethickness;
    context.stroke();
    context.restore();
  }

  return { drawCountries, drawHovered };
}

function createColorResolver({ features, getISO }) {
  function getColor(iso) {
    const { globe } = theme;
    const feature = features.find(feature => getISO(feature) === iso);
    const continent = feature?.properties?.CONTINENT;
    const defaultColor = globe.continents?.[continent] ?? globe.countryDefault;

    if (state.mapMode !== "heatmap") {
      return state.pendingISO === iso ? globe.countrySelected : defaultColor;
    }

    const values = state.selectedISO || state.pendingISO
      ? state.partners
      : state.totalTrade;

    const value = values.get(iso);

    if (state.pendingISO === iso) {
      return globe.countrySelected;
    }

    if (value == null) {
      return globe.countryDefault;
    }

    const maxValue = Math.max(...values.values(), 1);
    const intensity = Math.max(0.08, Math.min(1, Math.sqrt(value / maxValue)));
    const gb = Math.floor(255 * (1 - intensity));

    return `rgb(255, ${gb}, ${gb})`;
  }

  return getColor;
}