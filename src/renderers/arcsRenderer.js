import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { state } from "../config/state.js";
import { theme } from "../config/theme.js";
import { getMainLandmass } from "../utils/geo.js";

export function createArcsRenderer({
  context,
  projection,
  features,
  getISO
}) {
  function drawArcs() {
    const t = theme.globe;
    const center = projection.translate();

    const {
      color,
      width,
      borderColor: arcBorderColor,
      borderWidth: arcBorderWidth,
      steps,
      liftFactor
    } = t.arc;

    const {
      radius,
      borderColor: dotBorderColor,
      borderWidth: dotBorderWidth,
      startColor,
      endColor
    } = t.arcDot;

    context.save();

    context.lineCap = "round";
    context.lineJoin = "round";

    for (const link of state.links) {
      const fromFeature = features.find(
        feature => getISO(feature) === link.from
      );

      const toFeature = features.find(
        feature => getISO(feature) === link.to
      );

      if (!fromFeature || !toFeature) {
        continue;
      }

      const from = d3.geoCentroid(
        getMainLandmass(fromFeature)
      );

      const to = d3.geoCentroid(
        getMainLandmass(toFeature)
      );

      if (
        projection(from) === null &&
        projection(to) === null
      ) {
        continue;
      }

      const interpolate = d3.geoInterpolate(from, to);
      const distance = d3.geoDistance(from, to);

      const height =
        1 + liftFactor * (distance / Math.PI);

      let started = false;
      let startPoint = null;
      let endPoint = null;

      context.beginPath();

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;

        const point = interpolate(u);
        const projected = projection(point);

        if (projected === null) {
          started = false;
          continue;
        }

        let [x, y] = projected;

        if (i > 0 && i < steps) {
          const lift = Math.sin(u * Math.PI);
          const multiplier =
            1 + (height - 1) * lift;

          x =
            center[0] +
            (x - center[0]) * multiplier;

          y =
            center[1] +
            (y - center[1]) * multiplier;
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

      drawArcStroke({
        color: arcBorderColor,
        lineWidth: width + arcBorderWidth
      });

      drawArcStroke({
        color,
        lineWidth: width
      });

      drawEndpoint({
        point: startPoint,
        color: startColor,
        radius,
        borderColor: dotBorderColor,
        borderWidth: dotBorderWidth
      });

      drawEndpoint({
        point: endPoint,
        color: endColor,
        radius,
        borderColor: dotBorderColor,
        borderWidth: dotBorderWidth
      });
    }

    context.restore();
  }

  function drawArcStroke({ color, lineWidth }) {
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
  }

  function drawEndpoint({
    point,
    color,
    radius,
    borderColor,
    borderWidth
  }) {
    if (!point) {
      return;
    }

    context.fillStyle = color;
    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;

    context.beginPath();

    context.arc(
      point[0],
      point[1],
      radius,
      0,
      Math.PI * 2
    );

    context.fill();
    context.stroke();
  }

  return drawArcs;
}