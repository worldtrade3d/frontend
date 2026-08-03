import { state } from "../state/state.js";
import { focusCountry } from "./focus.js";

export function clearSelection(ctx) {
  if (ctx.isAnimating) return;

  state.selectedISO = null;
  state.pendingISO = null;
  state.partners = new Map();

  ctx.hovered = null;

  ctx.tooltip.style.opacity = 0;
  ctx.canvas.style.cursor = "default";

  ctx.onClick?.(null);
}

export function activateCountry(ctx, feature) {
  if (ctx.isAnimating) return;

  if (!feature) {
    clearSelection(ctx);
    return;
  }

  focusCountry(ctx, feature);

  ctx.onClick?.(feature);

  ctx.hovered = null;
  ctx.tooltip.style.opacity = 0;
  ctx.canvas.style.cursor = "default";
}

export function setupSelection(ctx) {
  ctx.canvas.addEventListener("click", e => {
    if (!ctx.hovered) return;
    if (ctx.moved) return;

    if (e.ctrlKey && state.selectedISO) {
      const fromISO = state.selectedISO;
      const toISO = ctx.getISO(ctx.hovered);

      if (fromISO === toISO) return;

      const index = state.links.findIndex(
        l =>
          (l.from === fromISO && l.to === toISO) ||
          (l.from === toISO && l.to === fromISO)
      );

      if (index !== -1) {
        state.links.splice(index, 1);
      } else {
        state.links.push({
          from: fromISO,
          to: toISO
        });
      }

      return;
    }

    activateCountry(ctx, ctx.hovered);
  });
}