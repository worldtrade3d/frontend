import { theme } from "../theme/theme.js";

export function createSphereRenderer({
  context,
  path
}) {
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

  return drawSphere;
}