import { state } from "../state/state.js";
import { fetchAllCountriesTotals } from "../services/api.js";

export function initLayers() {
    const button = document.getElementById("layer-toggle");
    const icon = document.getElementById("layer-icon");

    if (!button || !icon) return;

    state.mapMode = "default";

    button.addEventListener("click", async () => {
        if (state.mapMode === "default") {

            const totals = await fetchAllCountriesTotals(state.mode, state.year);

            const map = new Map();

            totals.forEach(country => {
                map.set(country.country, country.total);
            });

            state.totalTrade = map;
            state.mapMode = "heatmap";

            icon.src = "assets/graphics/default.png";
            icon.alt = "Heatmap";

        } else {

            state.mapMode = "default";

            icon.src = "assets/graphics/heatmap.png";
            icon.alt = "Default";
        }
    });
}

const panel = document.getElementById("settings-panel");
const toggle = document.getElementById("settings-toggle");

toggle.addEventListener("click", () => {
    panel.classList.toggle("collapsed");

    toggle.textContent = panel.classList.contains("collapsed")
        ? "▶"
        : "◀";
});






const infoButton = document.getElementById("info-button");
const infoLogos = document.getElementById("info-logos");

infoButton?.addEventListener("click", (event) => {
  event.stopPropagation();

  infoLogos.hidden = !infoLogos.hidden;
});

document.addEventListener("click", (event) => {
  if (
    !infoLogos.hidden &&
    !infoLogos.contains(event.target) &&
    !infoButton.contains(event.target)
  ) {
    infoLogos.hidden = true;
  }
});