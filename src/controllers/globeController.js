import { createGlobe } from "../services/globe.js";
import { state } from "../state/state.js";
import { fetchTradePartners, fetchTradeSectors } from "../services/api.js";
import { updateTradePanel, updateSectorPanel } from "../render/panelRenderer.js";
import { getISO } from "../utils/geo.js";
import { GEOJSON_URL } from "../config/paths.js";
import { buildCountryLookup } from "../utils/country.js";


export function initGlobe() {

  const canvas = document.getElementById("globe");


  fetch(GEOJSON_URL)

    .then(res => res.json())

    .then(data => {


      // Build ISO_A3 -> country name lookup
      // Example:
      // DEU -> Germany
      // SWE -> Sweden
      // USA -> United States
      buildCountryLookup(
        data.features
      );


      createGlobe(
        canvas,
        data.features,
        {

          onClick: async (country) => {


            // CLEAR SELECTION
            if (!country) {

              state.selectedISO = null;
              state.pendingISO = null;
              state.partners = new Map();

              updateTradePanel(
                "",
                null
              );

              updateSectorPanel(
                null
              );

              return;
            }



            const iso = getISO(country);

            const name = country.properties.ADMIN;


            state.pendingISO = iso;



            updateTradePanel(
              name,
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



              const partnerMap = new Map();



              partners.forEach(partner => {

                const key =
                  partner.iso ||
                  partner.country;


                if (key) {

                  partnerMap.set(
                    key,
                    partner.value
                  );

                }

              });



              state.selectedISO = iso;

              state.pendingISO = null;

              state.partners = partnerMap;



              updateTradePanel(
                name,
                partners
              );


              updateSectorPanel(
                sectors
              );



            } catch (error) {


              console.error(
                error
              );


              state.pendingISO = null;



              updateTradePanel(
                name,
                null,
                {
                  error: true
                }
              );



              updateSectorPanel(
                null,
                {
                  error: true
                }
              );


            }


          }


        }

      );


    })


    .catch(err => {

      console.error(
        "GeoJSON load failed:",
        err
      );

    });


}