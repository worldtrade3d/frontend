import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { state } from "./state.js";
import { theme } from "./theme.js";
import { getMainLandmass } from "./utils.js";

export function createRenderer({ context, projection, path, features, getISO }) {
  
  const starImage = new Image();
  starImage.src = theme.globe.stars;

  function getColor(iso) {
    const t = theme.globe;

    const feature = features.find(f => getISO(f) === iso);
    const continent = feature?.properties?.CONTINENT;
    const defaultColor = t.continents?.[continent] ?? t.countryDefault;

    // Heatmap mode
    if (state.mapMode === "heatmap") {
      if (state.selectedISO || state.pendingISO) {
        if (iso === state.pendingISO || iso === state.selectedISO) {
          return t.countrySelected;
        }

        const p = state.partners.get(iso);

        if (p == null) {
          return t.countryDefault;
        }

        const intensity = Math.max(0.08, Math.min(1, Math.sqrt(p / 20)));
        const gb = Math.floor(255 * (1 - intensity));
        return `rgb(255, ${gb}, ${gb})`;
      }

      // Global totals heatmap
      const value = state.totalTrade.get(iso);

      if (value == null) {
        return t.countryDefault;
      }

      const maxValue = Math.max(...state.totalTrade.values(), 1);
      const intensity = Math.max(0.08, Math.min(1, Math.sqrt(value / maxValue)));
      const gb = Math.floor(255 * (1 - intensity));
      return `rgb(255, ${gb}, ${gb})`;
    }

    // Default mode
    if (!state.selectedISO && !state.pendingISO) {
      return defaultColor;
    }

    if (iso === state.pendingISO || iso === state.selectedISO) {
      return t.countrySelected;
    }

    return defaultColor;
  }

  function drawStars(width, height, rotation) {
    if (!starImage.complete) return;

    const imgW = starImage.width;
    const imgH = starImage.height;

    context.save();

    // Calculate horizontal and vertical offsets based on globe rotation
    // rotation[0] is yaw (left/right), rotation[1] is pitch (up/down)
    let offsetX = rotation[0] % imgW;
    if (offsetX < 0) offsetX += imgW;

    let offsetY = rotation[1] % imgH;
    if (offsetY < 0) offsetY += imgH;

    // Apply both horizontal and vertical translation
    context.translate(-offsetX, -offsetY);

    // Tile the image in BOTH directions to cover the entire canvas
    // The extra buffer (-imgW/H to +width/height+imgW/H) guarantees no white stripes
    for (let x = -imgW; x < width + imgW; x += imgW) {
    for (let y = -imgH; y < height + imgH; y += imgH) {
      context.drawImage(starImage, x, y, imgW, imgH);
    }
    }

    context.restore();
  }

  function drawSphere(width, height, scale) {
    const t = theme.globe;

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
    const t = theme.globe;

    for (const f of features) {
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

    const t = theme.globe;

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

  function drawTradeArcs() {
    const t = theme.globe;
    const center = projection.translate();

    const { color, width, borderColor: arcBorderColor, borderWidth: arcBorderWidth, steps, liftFactor } = t.arc;
    const { radius, borderColor: dotBorderColor, borderWidth: dotBorderWidth, startColor, endColor } = t.arcDot;

    context.save();

    context.lineCap = "round";
    context.lineJoin = "round";

    for (const link of state.links) {
      const fromFeature = features.find(f => getISO(f) === link.from);
      const toFeature = features.find(f => getISO(f) === link.to);

      if (!fromFeature || !toFeature) continue;

      const from = d3.geoCentroid(getMainLandmass(fromFeature));
      const to = d3.geoCentroid(getMainLandmass(toFeature));

      // Skip if both endpoints are hidden
      if (projection(from) === null && projection(to) === null) continue;

      const interpolate = d3.geoInterpolate(from, to);
      const dist = d3.geoDistance(from, to);

      const height = 1 + liftFactor * (dist / Math.PI);

      let started = false;
      let startPoint = null;
      let endPoint = null;

      context.beginPath();

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;

        const p = interpolate(u);
        const projected = projection(p);

        if (projected === null) {
          started = false;
          continue;
        }

        let [x, y] = projected;

        // Arc lift effect
        if (i > 0 && i < steps) {
          const lift = Math.sin(u * Math.PI);

          x = center[0] + 
              (x - center[0]) * (1 + (height - 1) * lift);

          y = center[1] + 
              (y - center[1]) * (1 + (height - 1) * lift);
        }

        if (!started) {
          context.moveTo(x, y);
          started = true;
          startPoint = [x, y];
        } else {
          context.lineTo(x, y);
        }

        endPoint = [x, y];
      }


      // ============================
      // ARC BORDER
      // ============================
      context.strokeStyle = arcBorderColor;
      context.lineWidth = width + arcBorderWidth;
      context.stroke();


      // ============================
      // ARC COLOR
      // ============================
      context.strokeStyle = color;
      context.lineWidth = width;
      context.stroke();


      // ============================
      // ENDPOINT DOTS
      // ============================
      context.strokeStyle = dotBorderColor;
      context.lineWidth = dotBorderWidth;


      if (startPoint) {
        context.fillStyle = startColor;

        context.beginPath();
        context.arc(
          startPoint[0],
          startPoint[1],
          radius,
          0,
          Math.PI * 2
        );

        context.fill();
        context.stroke();
      }


      if (endPoint) {
        context.fillStyle = endColor;

        context.beginPath();
        context.arc(
          endPoint[0],
          endPoint[1],
          radius,
          0,
          Math.PI * 2
        );

        context.fill();
        context.stroke();
      }
    }

    context.restore();
  }

  function render({ hovered, rotation, scale, width, height }) {
    context.clearRect(0, 0, width, height);

    drawStars(width, height, rotation);
    drawSphere(width, height, scale);
    drawCountries(hovered);
    drawHovered(hovered);
    drawTradeArcs();
  }

  return { render };
}