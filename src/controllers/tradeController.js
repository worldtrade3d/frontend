import {
  fetchCountryTotal,
  fetchTradePartners,
  fetchTradeSectors
} from "../services/api.js";

import {
  updateCountryPanel
} from "../presenters/countryPresenter.js";

import {
  updateSectorPanel
} from "../presenters/sectorPresenter.js";

import {
  updateCountryOverview
} from "../presenters/overviewPresenter.js";

import { state } from "../state/state.js";


/* ==========================================================================
   Set Pending Country
   ========================================================================== */


export function setPendingCountry(
  iso,
  name
) {

  state.pendingISO =
    iso;

  state.pendingCountryName =
    name;
}


/* ==========================================================================
   Clear Country Selection
   ========================================================================== */


export function clearCountrySelection() {

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
}


/* ==========================================================================
   Load Country Totals
   ==========================================================================

   Loads BOTH exports and imports regardless of state.mode.

   The overview card always displays:

   Total Exports
   Total Imports

   state.mode is NOT used here.
   ========================================================================== */


export async function loadCountryTotal(
  iso,
  name
) {

  try {

    /* ----------------------------------------------------------------------
       Fetch BOTH totals at the same time
       ---------------------------------------------------------------------- */


    const [
      exportResult,
      importResult
    ] = await Promise.all([

      fetchCountryTotal(
        iso,
        "export",
        state.year
      ),

      fetchCountryTotal(
        iso,
        "import",
        state.year
      )

    ]);


    /* ----------------------------------------------------------------------
       Extract Values
       ---------------------------------------------------------------------- */


    const exportsTotal =
      Number(
        exportResult?.total
      ) || 0;


    const importsTotal =
      Number(
        importResult?.total
      ) || 0;


    /* ----------------------------------------------------------------------
       Update Overview
       ---------------------------------------------------------------------- */


    updateCountryOverview(
      name,
      exportsTotal,
      importsTotal
    );

  } catch (error) {

    console.error(
      "Failed to load country totals:",
      error
    );


    /* ----------------------------------------------------------------------
       Keep Country Name Visible

       Totals are unavailable, so reset values to zero.
       ---------------------------------------------------------------------- */


    updateCountryOverview(
      name,
      0,
      0
    );

  }
}


/* ==========================================================================
   Apply Country Trade
   ==========================================================================

   Partners and sectors use the currently selected trade mode.

   state.mode = "export"
   → Top Countries = export partners
   → Top Sectors = export sectors

   state.mode = "import"
   → Top Countries = import partners
   → Top Sectors = import sectors
   ========================================================================== */


export async function applyCountryTrade(
  iso,
  name
) {


  /* ==========================================================================
     Loading State
     ========================================================================== */


  updateCountryPanel(
    null,
    {
      loading: true
    }
  );


  updateSectorPanel(
    null,
    {
      loading: true
    }
  );


  try {

    /* ----------------------------------------------------------------------
       Fetch Partners + Sectors
       ---------------------------------------------------------------------- */


    const [
      partners,
      sectors
    ] = await Promise.all([

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


    /* ----------------------------------------------------------------------
       Build Partner Map
       ---------------------------------------------------------------------- */


    const partnerMap =
      new Map();


    partners.forEach(
      partner => {

        const key =
          partner.iso ||
          partner.country;


        if (key) {

          partnerMap.set(
            key,
            partner.value
          );

        }

      }
    );


    /* ----------------------------------------------------------------------
       Country Is Now Officially Selected
       ---------------------------------------------------------------------- */


    state.selectedISO =
      iso;


    state.selectedCountryName =
      name;


    state.partners =
      partnerMap;


    /* ----------------------------------------------------------------------
       Render Top Countries
       ---------------------------------------------------------------------- */


    updateCountryPanel(
      partners,
      {
        valueType: "currency"
      }
    );


    /* ----------------------------------------------------------------------
       Render Top Sectors
       ---------------------------------------------------------------------- */


    updateSectorPanel(
      sectors
    );

  } catch (error) {

    console.error(
      "Failed to load country trade:",
      error
    );


    /* ----------------------------------------------------------------------
       Country Panel Error
       ---------------------------------------------------------------------- */


    updateCountryPanel(
      null,
      {
        error: true
      }
    );


    /* ----------------------------------------------------------------------
       Sector Panel Error
       ---------------------------------------------------------------------- */


    updateSectorPanel(
      null,
      {
        error: true
      }
    );

  }
}