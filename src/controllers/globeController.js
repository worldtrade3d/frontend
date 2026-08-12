import { createGlobe } from "../compositors/globeCompositor.js";
import { state } from "../state/state.js";
import { fetchGeoJson } from "../services/api.js";

import { updateSectorPanel } from "../render/barRenderer.js";

import { getISO } from "../utils/geo.js";
import { buildCountryLookup } from "../utils/country.js";

import { loadWorldTrade } from "./barController.js";

import {
  loadCountryTotal,
  applyCountryTrade
} from "./tradeController.js";


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
          state.pendingISO = null;
          state.partners = new Map();

          updateSectorPanel(null);

          await loadWorldTrade();

          return;
        }


        const iso = getISO(country);
        const name = country.properties.ADMIN;


        state.pendingISO = iso;
        state.pendingCountryName = name;


        await loadCountryTotal(iso, name);
      }

    });


    applyButton.addEventListener("click", async () => {

      if (!state.pendingISO) return;


      const iso = state.pendingISO;
      const name = state.pendingCountryName;


      await applyCountryTrade(iso, name);
    });


  } catch (err) {

    console.error("GeoJSON load failed:", err);

  }
}