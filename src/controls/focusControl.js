import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getMainLandmass } from "../utils/geo.js";

export function focusCountry(ctx, feature) {
  if (ctx.isAnimating) return;

  ctx.isAnimating = true;

  const { projection } = ctx;
  const { rotation } = ctx.stateRefs;

  const mainFeature = getMainLandmass(feature);
  const [lon, lat] = d3.geoCentroid(mainFeature);

  const target = [-lon, Math.max(-60, Math.min(60, -lat))];

  const start = [...rotation];
  const startScale = projection.scale();
  const focusScale = 600;

  ctx.targetScale = focusScale;

  const duration = 900;
  const startTime = performance.now();

  function animate(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const ease = 1 - Math.pow(1 - t, 3);

    rotation[0] = start[0] + (target[0] - start[0]) * ease;
    rotation[1] = start[1] + (target[1] - start[1]) * ease;

    const scale = startScale + (focusScale - startScale) * ease;

    projection
      .rotate(rotation)
      .scale(scale);

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      rotation[0] = target[0];
      rotation[1] = target[1];

      projection
        .rotate(rotation)
        .scale(focusScale);

      ctx.targetScale = focusScale;
      ctx.isAnimating = false;
    }
  }

  requestAnimationFrame(animate);
}