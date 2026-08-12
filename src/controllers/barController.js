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
       Debug API Response
       ---------------------------------------------------------------------- */

    console.log(
      "World trade API response:",
      response
    );


    /* ----------------------------------------------------------------------
       Normalize Response
       ---------------------------------------------------------------------- */

    let totals = response;


    /*
       Support either:

       [
         { iso: "DEU", total: 123456 }
       ]

       or:

       {
         countries: [
           { iso: "DEU", total: 123456 }
         ]
       }

       or:

       {
         data: [
           { iso: "DEU", total: 123456 }
         ]
       }
    */

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
       Debug Prepared Countries
       ---------------------------------------------------------------------- */

    console.log(
      "Prepared world countries:",
      countries
    );


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