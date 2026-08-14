import { createColorResolver } from "../renderers/colors.js";
import { createStarsRenderer } from "../renderers/stars.js";
import { createSphereRenderer } from "../renderers/sphere.js";
import { createCountriesRenderer } from "../renderers/countries.js";
import { createTradeArcsRenderer } from "../renderers/arcs.js";

export function createRenderer({
  context,
  projection,
  path,
  features,
  getISO
}) {
  const getColor = createColorResolver({
    features,
    getISO
  });

  const drawStars = createStarsRenderer({
    context
  });

  const drawSphere = createSphereRenderer({
    context,
    path
  });

  const {
    drawCountries,
    drawHovered
  } = createCountriesRenderer({
    context,
    path,
    features,
    getISO,
    getColor
  });

  const drawTradeArcs = createTradeArcsRenderer({
    context,
    projection,
    features,
    getISO
  });

  function render({
    hovered,
    rotation,
    scale,
    width,
    height
  }) {
    context.clearRect(
      0,
      0,
      width,
      height
    );

    drawStars(
      width,
      height,
      rotation
    );

    drawSphere(
      width,
      height,
      scale
    );

    drawCountries(hovered);
    drawHovered(hovered);
    drawTradeArcs();
  }

  return {
    render
  };
}