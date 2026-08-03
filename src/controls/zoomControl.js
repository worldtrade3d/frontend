export function setupZoom(ctx) {
  const { canvas, projection } = ctx;

  function smoothZoom() {
    const current = projection.scale();
    const next = current + (ctx.targetScale - current) * 0.12;

    projection.scale(next);

    if (Math.abs(next - ctx.targetScale) > 0.1) {
      requestAnimationFrame(smoothZoom);
    } else {
      projection.scale(ctx.targetScale);
      ctx.zoomAnimating = false;
    }
  }

  function zoomBy(amount) {
    if (ctx.isAnimating) return;

    if (!ctx.zoomAnimating) {
      ctx.targetScale = projection.scale();
    }

    ctx.targetScale += amount;
    ctx.targetScale = Math.max(200, Math.min(600, ctx.targetScale));

    if (!ctx.zoomAnimating) {
      ctx.zoomAnimating = true;
      requestAnimationFrame(smoothZoom);
    }
  }

  canvas.addEventListener(
    "wheel",
    e => {
      if (ctx.isAnimating) return;

      e.preventDefault();
      zoomBy(e.deltaY * -0.3);
    },
    { passive: false }
  );

  document
    .getElementById("zoom-in")
    ?.addEventListener("click", () => zoomBy(40));

  document
    .getElementById("zoom-out")
    ?.addEventListener("click", () => zoomBy(-40));
}