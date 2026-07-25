import { state } from "./state.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

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
  const { rotation, velocity } = stateRefs;

  let hovered = null;

  let isDragging = false;
  let last = null;
  let moved = false;

  // Animation lock (used for country focus only)
  let isAnimating = false;

  // =========================
  // SMOOTH ZOOM VARIABLES
  // =========================
  let targetScale = projection.scale();
  let zoomAnimating = false;

  // Tooltip
  const tooltip = document.getElementById("tooltip");

  // =========================
  // SMOOTH ZOOM ANIMATION
  // =========================
  function smoothZoom() {
    const current = projection.scale();
    const next = current + (targetScale - current) * 0.12;

    projection.scale(next);

    if (Math.abs(next - targetScale) > 0.1) {
      requestAnimationFrame(smoothZoom);
    } else {
      projection.scale(targetScale);
      zoomAnimating = false;
    }
  }

  // =========================
  // COUNTRY ACTIVATION
  // =========================
  function activateCountry(feature) {
    if (!feature || isAnimating) return;

    focusCountry(feature);
    onClick?.(feature);

    hovered = null;
    tooltip.style.opacity = 0;
    canvas.style.cursor = "default";
  }

  // =========================
  // MOUSE DOWN
  // =========================
  canvas.addEventListener("mousedown", e => {
    if (isAnimating) return;
    if (e.ctrlKey) return;
    
    isDragging = true;
    last = [e.clientX, e.clientY];
    moved = false;
  });

  // =========================
  // MOUSE UP
  // =========================
  window.addEventListener("mouseup", () => {
    isDragging = false;
    canvas.style.cursor = hovered ? "pointer" : "default";
  });

  // =========================
  // MOUSE MOVE
  // =========================
  window.addEventListener("mousemove", e => {
    const [x, y] = [e.clientX, e.clientY];

    // ===== DRAG ROTATION =====
    if (isDragging && !isAnimating) {
      const dx = x - last[0];
      const dy = y - last[1];

      if (dx !== 0 || dy !== 0) moved = true;

      velocity[0] = dx * 0.05;
      velocity[1] = -dy * 0.05;

      rotation[0] += velocity[0];
      rotation[1] += velocity[1];

      rotation[1] = Math.max(-90, Math.min(90, rotation[1]));

      projection.rotate(rotation);

      last = [x, y];

      if (hovered) {
        hovered = null;
        onHover?.(null, e);
      }

      tooltip.style.opacity = 0;
      canvas.style.cursor = "grabbing";

      return;
    }

    // ===== HOVER DETECTION =====
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    hovered = null;

    for (const f of features) {
      path.context().beginPath();
      path(f);

      if (path.context().isPointInPath(mx * dpr, my * dpr)) {
        hovered = f;
        break;
      }
    }

    // ===== TOOLTIP =====
    if (hovered && !isAnimating) {
      const name =
        hovered.properties.name ||
        hovered.properties.ADMIN ||
        hovered.id ||
        "Unknown";

      tooltip.style.left = `${x - 4}px`;
      tooltip.style.top = `${y + 4}px`;
      tooltip.textContent = name;
      tooltip.style.opacity = 1;

      canvas.style.cursor = "pointer";
    } else {
      tooltip.style.opacity = 0;
      canvas.style.cursor = "default";
    }

    onHover?.(hovered, e);
  });

  // =========================
  // SMOOTH SCROLL ZOOM
  // =========================
  canvas.addEventListener(
    "wheel",
    e => {
      if (isAnimating) return;

      e.preventDefault();

      if (!zoomAnimating) {
        targetScale = projection.scale();
      }

      targetScale += e.deltaY * -0.3;
      targetScale = Math.max(200, Math.min(600, targetScale));

      if (!zoomAnimating) {
        zoomAnimating = true;
        requestAnimationFrame(smoothZoom);
      }
    },
    { passive: false }
  );

  // =========================
  // CLICK
  // =========================
  canvas.addEventListener("click", e => {
    if (!hovered) return;
    if (moved) return;

    // Ctrl + click when a country is already selected
    if (e.ctrlKey && state.selectedISO) {
      const fromISO = state.selectedISO;
      const toISO = getISO(hovered);

      if (fromISO === toISO) return;

      const index = state.links.findIndex(
        l =>
          (l.from === fromISO && l.to === toISO) ||
          (l.from === toISO && l.to === fromISO)
      );

      // If link exists, remove it
      if (index !== -1) {
        state.links.splice(index, 1);
      } else {
        // Otherwise create it
        state.links.push({
          from: fromISO,
          to: toISO
        });
      }

      return;
    }

    activateCountry(hovered);
  });

  // =========================
  // FOCUS COUNTRY ANIMATION
  // =========================
  function focusCountry(feature) {
    if (isAnimating) return;

    isAnimating = true;

    const [lon, lat] = d3.geoCentroid(feature);
    const target = [-lon, Math.max(-60, Math.min(60, -lat))];

    const start = [...rotation];
    const startScale = projection.scale();
    const focusScale = 600;

    targetScale = focusScale;

    const duration = 900;
    const startTime = performance.now();

    function animate(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - t, 3);

      rotation[0] = start[0] + (target[0] - start[0]) * ease;
      rotation[1] = start[1] + (target[1] - start[1]) * ease;

      const scale =
        startScale + (focusScale - startScale) * ease;

      projection
        .rotate(rotation)
        .scale(scale);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        rotation[0] = target[0];
        rotation[1] = target[1];

        projection
          .rotate(rotation)
          .scale(focusScale);

        targetScale = focusScale;
        isAnimating = false;
      }
    }

    requestAnimationFrame(animate);
  }

  return {
    getHovered: () => hovered,
    focusCountry,
    activateCountry
  };
}