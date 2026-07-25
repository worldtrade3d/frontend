import { state } from "../state.js";

import { fetchAllCountriesTotals } from "../api.js";

export function initLayers() {
    const button = document.getElementById("mode-btn");
    const icon = document.getElementById("mode-icon");

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

            icon.src = "assets/default.png";
            icon.alt = "Heatmap";

        } else {

            state.mapMode = "default";

            icon.src = "assets/heatmap.png";
            icon.alt = "Default";
        }
    });
}