import { state } from "../config/state.js";
import { focusCountry } from "./focusControl.js";

function renderLinks() {
  const container = document.getElementById("links-content");

  if (!container) return;

  container.innerHTML = "";

  if (!state.links?.length) {
    container.innerHTML = `<p class="placeholder">No links created.</p>`;
    return;
  }

  state.links.forEach((link, index) => {
    const row = document.createElement("div");

    row.className = "link-row";
    row.innerHTML = `
      <span class="link-number">${index + 1}</span>
      <span class="link-countries">
        ${link.from}
        <span class="link-arrow">↔</span>
        ${link.to}
      </span>
    `;

    container.appendChild(row);
  });
}

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
  renderLinks();

  ctx.canvas.addEventListener("click", e => {
    if (ctx.ignoreNextClick) {
      ctx.ignoreNextClick = false;
      return;
    }

    if (!ctx.hovered) return;

    if (e.ctrlKey && state.pendingISO) {
      const fromISO = state.pendingISO;
      const toISO = ctx.getISO(ctx.hovered);

      if (fromISO === toISO) return;

      const index = state.links.findIndex(
        link =>
          (link.from === fromISO && link.to === toISO) ||
          (link.from === toISO && link.to === fromISO)
      );

      if (index !== -1) {
        state.links.splice(index, 1);
      } else {
        state.links.push({
          from: fromISO,
          to: toISO
        });
      }

      renderLinks();
      return;
    }

    activateCountry(ctx, ctx.hovered);
  });
}