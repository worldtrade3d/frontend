// src/controls/hoverControl.js
export function setupHover(ctx) {
  const { canvas, path, features } = ctx;

  window.addEventListener("mousemove", e => {
    if (ctx.isDragging || ctx.isAnimating) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    if (mx < 0 || my < 0 || mx > rect.width || my > rect.height) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    ctx.hovered = null;

    for (const feature of features) {
      path.context().beginPath();
      path(feature);
      if (path.context().isPointInPath(mx * dpr, my * dpr)) {
        ctx.hovered = feature;
        break;
      }
    }

    // tooltip + cursor (same as before)
    if (ctx.hovered && !ctx.isAnimating) {
      const name =
        ctx.hovered.properties.name ||
        ctx.hovered.properties.ADMIN ||
        ctx.hovered.id ||
        "Unknown";
      ctx.tooltip.style.left = `${e.clientX}px`;
      ctx.tooltip.style.top = `${e.clientY}px`;
      ctx.tooltip.textContent = name;
      ctx.tooltip.style.opacity = 1;
      canvas.style.cursor = "pointer";
    } else {
      ctx.tooltip.style.opacity = 0;
      canvas.style.cursor = "default";
    }

    ctx.onHover?.(ctx.hovered, e);
  });
}