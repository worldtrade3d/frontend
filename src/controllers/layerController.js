import { state } from "../state/state.js";

import { fetchAllCountriesTotals } from "../services/api.js";

export function initLayers() {
    const button = document.getElementById("layer-btn");
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