export function setupDrag(ctx) {
  const { canvas, projection } = ctx;
  const { rotation, velocity } = ctx.stateRefs;

  canvas.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    
    ctx.ignoreNextClick = ctx.isAnimating;

    if (ctx.isAnimating) return;
    if (e.ctrlKey) return;

    ctx.isDragging = true;
    ctx.last = [e.clientX, e.clientY];
    ctx.moved = false;
  });

  window.addEventListener("mouseup", () => {
    ctx.isDragging = false;
    canvas.style.cursor = ctx.hovered ? "pointer" : "default";
  });

  window.addEventListener("mousemove", e => {
    if (!ctx.isDragging || ctx.isAnimating) return;

    const dx = e.clientX - ctx.last[0];
    const dy = e.clientY - ctx.last[1];

    if (dx !== 0 || dy !== 0) {
      ctx.moved = true;
    }

    velocity[0] = dx * 0.05;
    velocity[1] = -dy * 0.05;

    rotation[0] += velocity[0];
    rotation[1] += velocity[1];

    rotation[1] = Math.max(-90, Math.min(90, rotation[1]));

    projection.rotate(rotation);

    ctx.last = [e.clientX, e.clientY];

    if (ctx.hovered) {
      ctx.hovered = null;
      ctx.onHover?.(null, e);
    }

    ctx.tooltip.style.opacity = 0;
    canvas.style.cursor = "grabbing";
  });
}