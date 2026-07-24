import { createGlobe } from "./globe.js";
import { state } from "./state.js";
import { fetchTradePartners } from "./api.js";
import { updateTradePanel } from "./uiController.js";

const GEOJSON_URL =
  "https://raw.githubusercontent.com/samsol38/3dglobesearch/refs/heads/main/public/data/countries_v2.geojson";

function getISO(f) {
  return f.properties.ISO_A3 !== "-99"
    ? f.properties.ISO_A3
    : f.properties.ADM0_A3;
}

export function initGlobe() {
  const canvas = document.getElementById("globe");

  fetch(GEOJSON_URL)
    .then(res => res.json())
    .then(data => {

      createGlobe(canvas, data.features, {

        onClick: async (country) => {
          const iso = getISO(country);
          const name = country.properties.ADMIN;

          // Show clicked country immediately while loading
          state.pendingISO = iso;

          updateTradePanel(name, null, { loading: true });

          try {
            const partners = await fetchTradePartners(iso, state.mode, state.year);

            // Build a new map first
            const partnerMap = new Map();

            partners.forEach(p => {
              const key = p.iso || p.country;
              if (key) partnerMap.set(key, p.value);
            });

            // Swap everything at once
            state.selectedISO = iso;
            state.pendingISO = null;
            state.partners = partnerMap;

            updateTradePanel(name, partners);

          } catch {
            state.pendingISO = null;
            updateTradePanel(name, null, { error: true });
          }
        }
      });

    })
    .catch(err => console.error("GeoJSON load failed:", err));
}