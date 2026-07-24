import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { state } from "./state.js";
import { theme } from "./theme.js";

const starCache = new Map();

function getStarImage(src) {
  if (!src) return null;

  if (!starCache.has(src)) {
    const img = new Image();
    img.src = src;
    starCache.set(src, img);
  }

  return starCache.get(src);
}

export function createRenderer({ context, projection, path, features, getISO }) {

  function getTheme() {
    return theme.globe;
  }

  function getColor(iso) {
    const t = getTheme();

    const feature = features.find(f => getISO(f) === iso);
    const continent = feature?.properties?.CONTINENT;
    const defaultColor =
      t.continents?.[continent] ?? t.countryDefault;

    // ==================================================
    // HEATMAP MODE
    // ==================================================
    if (state.mapMode === "heatmap") {

      // If a country is selected, show its trade heatmap
      if (state.selectedISO || state.pendingISO) {

        if (iso === state.pendingISO || iso === state.selectedISO) {
          return t.countrySelected;
        }

        const p = state.partners.get(iso);

        if (p == null) {
          return t.countryDefault;
        }

        const intensity = Math.max(
          0.08,
          Math.min(1, Math.sqrt(p / 20))
        );

        const gb = Math.floor(255 * (1 - intensity));

        return `rgb(255, ${gb}, ${gb})`;
      }

      // No country selected -> global totals heatmap
      const value = state.totalTrade.get(iso);

      if (value == null) {
        return t.countryDefault;
      }

      const maxValue = Math.max(...state.totalTrade.values(), 1);

      const intensity = Math.max(
        0.08,
        Math.min(1, Math.sqrt(value / maxValue))
      );

      const gb = Math.floor(255 * (1 - intensity));

      return `rgb(255, ${gb}, ${gb})`;
    }

    // ==================================================
    // DEFAULT MODE
    // ==================================================

    // No country selected -> continent colors
    if (!state.selectedISO && !state.pendingISO) {
      return defaultColor;
    }

    // Selected country stays orange
    if (iso === state.pendingISO || iso === state.selectedISO) {
      return t.countrySelected;
    }

    // Everything else keeps the default color
    return defaultColor;
  }

  function drawStars(width, height, rotation) {
    const t = getTheme();
    const img = getStarImage(t.stars);

    if (!img || !img.complete) return;

    const imgW = img.width;
    const imgH = img.height;

    context.save();

    let offsetX = rotation[0] % imgW;
    if (offsetX < 0) offsetX += imgW;

    context.translate(-offsetX, 0);

    for (let x = -imgW; x < width + imgW; x += imgW) {
      context.drawImage(img, x, 0, imgW, height);
    }

    context.restore();
  }

  function drawSphere(width, height, scale) {
    const t = getTheme();

    const gradient = context.createLinearGradient(
      0,
      height / 2 - scale,
      0,
      height / 2 + scale
    );

    gradient.addColorStop(0, t.sphere[0]);
    gradient.addColorStop(0.5, t.sphere[1]);
    gradient.addColorStop(1, t.sphere[2]);

    context.beginPath();
    path({ type: "Sphere" });
    context.fillStyle = gradient;
    context.fill();
  }

  function drawCountries(hovered) {
    const t = getTheme();

    for (let f of features) {
      if (f === hovered) continue;

      context.beginPath();
      path(f);

      const iso = getISO(f);

      context.fillStyle = getColor(iso);
      context.fill();

      context.strokeStyle = t.strokecolor;
      context.lineWidth = t.strokethickness;
      context.stroke();
    }
  }

  function drawHovered(f) {
    if (!f) return;

    const t = getTheme();

    context.save();

    context.beginPath();
    path(f);

    context.fillStyle = t.countryHovered;
    context.fill();

    context.strokeStyle = t.strokecolor;
    context.lineWidth = t.strokethickness;
    context.stroke();

    context.restore();
  }

  function render({ hovered, rotation, scale, width, height }) {
    context.clearRect(0, 0, width, height);

    drawStars(width, height, rotation);
    drawSphere(width, height, scale);
    drawCountries(hovered);
    drawHovered(hovered);
  }

  return { render };
}