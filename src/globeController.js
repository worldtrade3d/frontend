import { createGlobe } from "./globe.js";
import { state } from "./state.js";
import { fetchTradePartners, fetchTradeSectors } from "./api.js";
import { updateTradePanel, updateSectorPanel } from "./barController.js";


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



          // Store selected country immediately
          state.pendingISO = iso;



          // Loading states
          updateTradePanel(
            name,
            null,
            { loading:true }
          );


          const sectorContainer =
            document.getElementById(
              "categories-content"
            );


          if (sectorContainer) {

            sectorContainer.innerHTML = `

              <div class="loading">

                <div class="spinner"></div>

                <span>
                  Loading sectors...
                </span>

              </div>

            `;

          }



          try {


            /*
              Fetch both datasets together:

              LEFT:
              - trade partners

              RIGHT:
              - trade sectors
            */

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





            /*
              Convert partners
              into lookup map
            */

            const partnerMap = new Map();


            partners.forEach(p => {

              const key =
                p.iso || p.country;


              if (key) {

                partnerMap.set(
                  key,
                  p.value
                );

              }

            });





            /*
              Update application state
            */

            state.selectedISO = iso;

            state.pendingISO = null;

            state.partners = partnerMap;





            /*
              Render left panel:
              Country trade partners
            */

            updateTradePanel(
              name,
              partners
            );





            /*
              Render right panel:
              Trade sectors
            */

            updateSectorPanel(
              sectors
            );




          } catch(error) {


            console.error(
              "Trade loading failed:",
              error
            );


            state.pendingISO = null;



            updateTradePanel(
              name,
              null,
              {
                error:true
              }
            );



            if (sectorContainer) {

              sectorContainer.innerHTML = `

                <p class="placeholder">

                  Failed to load sectors

                </p>

              `;

            }

          }

        }

      });


    })

    .catch(err => {

      console.error(
        "GeoJSON load failed:",
        err
      );

    });

}