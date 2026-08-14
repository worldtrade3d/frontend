import { createGlobe } from "../compositors/globeCompositor.js";
import { state } from "../state/state.js";
import { fetchGeoJson } from "../services/api.js";
import { updateSectorPanel } from "../presenters/sectorPresenter.js";
import { updateCountryPanel } from "../presenters/countryPresenter.js";
import { resetCountryOverview } from "../presenters/overviewPresenter.js";
import { getISO } from "../utils/geo.js";
import { buildCountryLookup } from "../utils/country.js";
import { loadWorldTrade, loadCountryTotal, applyCountryTrade } from "./tradeController.js";

export async function initGlobe() {
  const canvas = document.getElementById("globe");
  const applyButton = document.getElementById("apply-selection");

  try {
    const data = await fetchGeoJson();

    buildCountryLookup(data.features);

    createGlobe(canvas, data.features, {
      onClick: async country => {
        if (!country) {
          state.selectedISO = null;
          state.selectedCountryName = null;
          state.pendingISO = null;
          state.pendingCountryName = null;
          state.partners = new Map();

          resetCountryOverview();
          updateCountryPanel(null);
          updateSectorPanel(null);
          return;
        }

        const iso = getISO(country);
        const name = country.properties.ADMIN;

        state.pendingISO = iso;
        state.pendingCountryName = name;

        updateCountryPanel(null);
        updateSectorPanel(null);

        await loadCountryTotal(iso, name);
      }
    });

    applyButton.addEventListener("click", async () => {
      if (!state.pendingISO) {
        await loadWorldTrade();
        return;
      }

      await applyCountryTrade(
        state.pendingISO,
        state.pendingCountryName
      );
    });
  } catch (err) {
    console.error("GeoJSON load failed:", err);
  }
}