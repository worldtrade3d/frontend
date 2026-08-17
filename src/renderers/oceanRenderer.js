import { theme } from "../config/theme.js";

export function createOceanRenderer({ context, path }) {
  function drawocean(width, height, scale) {
    const { ocean } = theme.globe;
    const gradient = context.createLinearGradient(0, height / 2 - scale, 0, height / 2 + scale);

    gradient.addColorStop(0, ocean[0]);
    gradient.addColorStop(0.5, ocean[1]);
    gradient.addColorStop(1, ocean[2]);

    context.beginPath();
    path({ type: "Sphere" });
    context.fillStyle = gradient;
    context.fill();
  }

  return drawocean;
}