import { state } from "../state/state.js";
import { fetchAllCountriesTotals } from "../services/api.js";
import { EXPORTS_URL } from "../config/paths.js";

async function getTotals() {
    if (state.year === 2025) {
        return fetch(EXPORTS_URL).then(res => res.json());
    }

    return fetchAllCountriesTotals(state.mode, state.year);
}

export function initLayers() {
    const button = document.getElementById("layer-toggle");
    const icon = document.getElementById("layer-icon");

    if (!button || !icon) return;

    state.mapMode = "default";

    button.addEventListener("click", async () => {
        if (state.mapMode === "default") {

            const totals = await getTotals();

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