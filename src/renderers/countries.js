import { theme } from "../theme/theme.js";

export function createCountriesRenderer({
  context,
  path,
  features,
  getISO,
  getColor
}) {
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