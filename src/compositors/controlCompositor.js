import { setupDrag      } from "../controls/dragControl.js";
import { setupHover     } from "../controls/hoverControl.js";
import { setupZoom      } from "../controls/zoomControl.js";
import { focusCountry   } from "../controls/focusControl.js";
import { setupSelection, activateCountry, clearSelection } from "../controls/selectionControl.js";

import { state } from "../state/state.js";

export function createControls({
  canvas,
  projection,
  path,
  features,
  getISO,
  stateRefs,
  onClick,
  onHover
}) {
  const ctx = {
    canvas,
    projection,
    path,
    features,
    getISO,
    stateRefs,
    onClick,
    onHover,

    tooltip: document.getElementById("tooltip"),

    hovered: null,

    isDragging: false,
    last: null,
    moved: false,

    isAnimating: false,

    targetScale: projection.scale(),
    zoomAnimating: false
  };

  setupDrag(ctx);
  setupHover(ctx);
  setupZoom(ctx);
  setupSelection(ctx);

  return {
    getHovered: () => {
      if (ctx.hovered) return ctx.hovered;

      // Bar hover → find matching feature by ISO
      if (state.hoveredISO) {
        return (
          ctx.features.find(f => ctx.getISO(f) === state.hoveredISO) ||
          null
        );
      }

      return null;
    },
    focusCountry: feature => focusCountry(ctx, feature),
    activateCountry: feature => activateCountry(ctx, feature),
    clearSelection: () => clearSelection(ctx)
  };
}