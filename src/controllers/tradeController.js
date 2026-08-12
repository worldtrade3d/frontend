import {
  fetchCountryTotal,
  fetchTradePartners,
  fetchTradeSectors
} from "../services/api.js";

import {
  updateTradePanel,
  updateSectorPanel
} from "../render/barRenderer.js";

import { state } from "../state/state.js";


export function setPendingCountry(iso, name) {
  state.pendingISO = iso;
  state.pendingCountryName = name;
}


export function clearCountrySelection() {
  state.selectedISO = null;
  state.selectedCountryName = null;

  state.pendingISO = null;
  state.pendingCountryName = null;

  state.partners = new Map();
}


export async function loadCountryTotal(iso, name) {
  try {
    const total = await fetchCountryTotal(
      iso,
      state.mode,
      state.year
    );

    updateTradePanel(name, null, {
      total: total.total
    });

  } catch (error) {
    console.error(error);

    updateTradePanel(name, null);
  }
}


export async function applyCountryTrade(iso, name) {

  updateTradePanel(name, null, {
    loading: true
  });

  updateSectorPanel(null, {
    loading: true
  });

  try {

    const [partners, sectors] = await Promise.all([
      fetchTradePartners(
        iso,
        state.mode,
        state.year
      ),

      fetchTradeSectors(
        iso,
        state.mode,
        state.year
      )
    ]);


    const partnerMap = new Map();

    partners.forEach(partner => {
      const key = partner.iso || partner.country;

      if (key) {
        partnerMap.set(key, partner.value);
      }
    });


    // The country is now officially applied/selected.
    state.selectedISO = iso;
    state.selectedCountryName = name;

    state.partners = partnerMap;


    updateTradePanel(name, partners);
    updateSectorPanel(sectors);

  } catch (error) {

    console.error(error);

    updateTradePanel(name, null, {
      error: true
    });

    updateSectorPanel(null, {
      error: true
    });
  }
}