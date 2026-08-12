import { createGlobe } from "../compositors/globeCompositor.js";

import { state } from "../state/state.js";

import { fetchGeoJson } from "../services/api.js";

import {
  updateSectorPanel
} from "../presenters/sectorPresenter.js";

import {
  getISO
} from "../utils/geo.js";

import {
  buildCountryLookup
} from "../utils/country.js";

import {
  loadWorldTrade
} from "./barController.js";

import {
  loadCountryTotal,
  applyCountryTrade
} from "./tradeController.js";


/* ==========================================================================
   Initialize Globe
   ========================================================================== */


export async function initGlobe() {

  const canvas =
    document.getElementById(
      "globe"
    );


  const applyButton =
    document.getElementById(
      "apply-selection"
    );


  try {

    /* ======================================================================
       Load GeoJSON
       ====================================================================== */


    const data =
      await fetchGeoJson();


    /* ======================================================================
       Build Country Lookup
       ====================================================================== */


    buildCountryLookup(
      data.features
    );


    /* ======================================================================
       Create Globe
       ====================================================================== */


    createGlobe(
      canvas,
      data.features,
      {

        /* ==================================================================
           Country Click
           ================================================================== */


        onClick: async country => {

          /* ================================================================
             World / Clear Selection
             ================================================================ */


          if (!country) {

            state.selectedISO =
              null;

            state.selectedCountryName =
              null;

            state.pendingISO =
              null;

            state.pendingCountryName =
              null;

            state.partners =
              new Map();


            /* --------------------------------------------------------------
               Clear Sector Panel
               -------------------------------------------------------------- */


            updateSectorPanel(
              null
            );


            /* --------------------------------------------------------------
               Load World Trade
               -------------------------------------------------------------- */


            await loadWorldTrade();

            return;
          }


          /* ================================================================
             Get Country Information
             ================================================================ */


          const iso =
            getISO(country);


          const name =
            country.properties.ADMIN;


          /* ================================================================
             Set Pending Country
             ================================================================ */


          state.pendingISO =
            iso;

          state.pendingCountryName =
            name;


          /* ================================================================
             Load Country Overview
             
             Loads BOTH:
             - Total Exports
             - Total Imports
             
             This does NOT depend on state.mode.
             ================================================================ */


          await loadCountryTotal(
            iso,
            name
          );

        }

      }
    );


    /* ======================================================================
       Apply Button
       ====================================================================== */


    applyButton.addEventListener(
      "click",
      async () => {

        if (!state.pendingISO) {
          return;
        }


        const iso =
          state.pendingISO;


        const name =
          state.pendingCountryName;


        /* ------------------------------------------------------------------
           Load Country Partners + Sectors
           
           These DO use state.mode.
           ------------------------------------------------------------------ */


        await applyCountryTrade(
          iso,
          name
        );

      }
    );


  } catch (err) {

    console.error(
      "GeoJSON load failed:",
      err
    );

  }

}