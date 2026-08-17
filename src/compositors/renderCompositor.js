import { createArcsRenderer }    from "../renderers/arcsRenderer.js";
import { createCountryRenderer } from "../renderers/countryRenderer.js";
import { createOceanRenderer }   from "../renderers/oceanRenderer.js";
import { createStarsRenderer }   from "../renderers/starsRenderer.js";

export function createRenderer({ context, projection, path, features, getISO }) {

  const drawArcs = createArcsRenderer({ context, projection, features, getISO });
  const { drawCountries, drawHovered } = createCountryRenderer({ context, path, features, getISO });
  const drawStars = createStarsRenderer({ context });
  const drawOcean = createOceanRenderer({ context, path });

  function render({ hovered, rotation, scale, width, height }) {
    context.clearRect(0, 0, width, height);
    drawStars(width, height, rotation);
    drawOcean(width, height, scale);
    drawCountries(hovered);
    drawHovered(hovered);
    drawArcs();
  }

  return { render };
}