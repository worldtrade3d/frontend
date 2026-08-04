export function setupHover(ctx) {
  const { canvas, path, features } = ctx;

  window.addEventListener("mousemove", e => {
    // Ignore hover while dragging
    if (ctx.isDragging || ctx.isAnimating) return;

    const [x, y] = [e.clientX, e.clientY];

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const mx = x - rect.left;
    const my = y - rect.top;

    ctx.hovered = null;

    for (const feature of features) {
      path.context().beginPath();
      path(feature);

      if (path.context().isPointInPath(mx * dpr, my * dpr)) {
        ctx.hovered = feature;
        break;
      }
    }

    if (ctx.hovered && !ctx.isAnimating) {
      const name =
        ctx.hovered.properties.name ||
        ctx.hovered.properties.ADMIN ||
        ctx.hovered.id ||
        "Unknown";

      ctx.tooltip.style.left = `${x - 4}px`;
      ctx.tooltip.style.top = `${y + 4}px`;
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