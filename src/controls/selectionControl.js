import { state } from "../state/state.js";
import { focusCountry } from "./focusControl.js";


/* ==========================================================================
   Links Panel
   ========================================================================== */

function renderLinks(ctx) {
  const container = document.getElementById("links-content");

  if (!container) return;

  container.innerHTML = "";

  if (!state.links || state.links.length === 0) {
    container.innerHTML = `
      <p class="placeholder">No links created.</p>
    `;
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


/* ==========================================================================
   Clear Selection
   ========================================================================== */

export function clearSelection(ctx) {
  if (ctx.isAnimating) return;

  state.selectedISO = null;
  state.pendingISO = null;
  state.partners = new Map();

  ctx.hovered = null;

  ctx.tooltip.style.opacity = 0;
  ctx.canvas.style.cursor = "default";

  ctx.onClick?.(null);

  // No initBars() here.
}


/* ==========================================================================
   Activate Country
   ========================================================================== */

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


/* ==========================================================================
   Setup Selection
   ========================================================================== */

export function setupSelection(ctx) {

  // Render existing links when the application starts.
  renderLinks(ctx);

  ctx.canvas.addEventListener("click", e => {

    /* ----------------------------------------------------------------------
       Ignore click after animation / special interaction
       ---------------------------------------------------------------------- */

    if (ctx.ignoreNextClick) {
      ctx.ignoreNextClick = false;
      return;
    }


    /* ----------------------------------------------------------------------
       Nothing hovered
       ---------------------------------------------------------------------- */

    if (!ctx.hovered) return;


    /* ----------------------------------------------------------------------
       Create / Remove Link
       ---------------------------------------------------------------------- */

    if (e.ctrlKey && state.pendingISO) {

      const fromISO = state.pendingISO;
      const toISO = ctx.getISO(ctx.hovered);


      // Don't allow a country to link to itself.
      if (fromISO === toISO) return;


      /* --------------------------------------------------------------------
         Check whether this link already exists.

         Links are treated as bidirectional:
         FIN -> SWE
         is the same as
         SWE -> FIN
         -------------------------------------------------------------------- */

      const index = state.links.findIndex(
        l =>
          (l.from === fromISO && l.to === toISO) ||
          (l.from === toISO && l.to === fromISO)
      );


      /* --------------------------------------------------------------------
         Remove existing link
         -------------------------------------------------------------------- */

      if (index !== -1) {
        state.links.splice(index, 1);
      }


      /* --------------------------------------------------------------------
         Create new link
         -------------------------------------------------------------------- */

      else {
        state.links.push({
          from: fromISO,
          to: toISO
        });
      }


      /* --------------------------------------------------------------------
         Update Links Panel
         -------------------------------------------------------------------- */

      renderLinks(ctx);

      return;
    }


    /* ----------------------------------------------------------------------
       Normal country selection
       ---------------------------------------------------------------------- */

    activateCountry(ctx, ctx.hovered);
  });
}