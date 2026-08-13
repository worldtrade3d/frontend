import {
  fetchAllCountriesTotals
} from "../services/api.js";

import {
  updateCountryPanel
} from "../presenters/countryPresenter.js";

import { state } from "../state/state.js";


/* ==========================================================================
   Load World Trade
   ========================================================================== */

export async function loadWorldTrade() {

  try {

    /* ----------------------------------------------------------------------
       Fetch World Trade Totals
       ---------------------------------------------------------------------- */

    const response =
      await fetchAllCountriesTotals(
        state.mode,
        state.year
      );


    /* ----------------------------------------------------------------------
       Normalize Response
       ---------------------------------------------------------------------- */

    let totals = response;

    if (!Array.isArray(totals)) {

      if (Array.isArray(response?.countries)) {

        totals =
          response.countries;

      } else if (Array.isArray(response?.data)) {

        totals =
          response.data;

      } else if (Array.isArray(response?.results)) {

        totals =
          response.results;

      } else {

        totals = [];

      }

    }


    /* ----------------------------------------------------------------------
       Prepare Countries
       ---------------------------------------------------------------------- */

    const countries =
      totals
        .map(country => {

          const iso =
            country.iso ||
            country.country ||
            country.code;

          const value =
            Number(
              country.total ??
              country.value
            ) || 0;


          return {
            iso,
            value
          };

        })
        .filter(country => country.iso);


    /* ----------------------------------------------------------------------
       Render Country Bars
       ---------------------------------------------------------------------- */

    updateCountryPanel(
      countries,
      {
        valueType: "currency"
      }
    );

  } catch (error) {

    console.error(
      "Failed to load world trade:",
      error
    );


    /* ----------------------------------------------------------------------
       Render Error
       ---------------------------------------------------------------------- */

    updateCountryPanel(
      null,
      {
        error: true
      }
    );

  }

}