import { createGlobe } from "../compositors/globeCompositor.js";
import { state } from "../state/state.js";
import { fetchCountryTotal, fetchTradePartners, fetchTradeSectors } from "../services/api.js";
import { updateTradePanel, updateSectorPanel } from "../render/barRenderer.js";
import { getISO } from "../utils/geo.js";
import { GEOJSON_URL } from "../config/paths.js";
import { buildCountryLookup } from "../utils/country.js";

export function initGlobe() {

  const canvas = document.getElementById("globe");
  const applyButton = document.getElementById("apply-selection");

  fetch(GEOJSON_URL)
    .then(res => res.json())
    .then(data => {

      buildCountryLookup(data.features);

      createGlobe(
        canvas,
        data.features,
        {
          onClick: async (country) => {

            if (!country) {
              state.selectedISO = null;
              state.pendingISO = null;
              state.partners = new Map();

              updateTradePanel("", null);
              updateSectorPanel(null);

              return;
            }

            const iso = getISO(country);
            const name = country.properties.ADMIN;

            state.pendingISO = iso;
            state.pendingCountryName = name;

            try {
              const total = await fetchCountryTotal(
                iso,
                state.mode,
                state.year
              );

              updateTradePanel(name, null, {
                total: total.total
              });

            } catch (err) {
              console.error(err);
              updateTradePanel(name, null);
            }
          }
        }
      );

      applyButton.addEventListener("click", async () => {

        if (!state.pendingISO)
          return;

        const iso = state.pendingISO;
        const name = state.pendingCountryName;

        updateTradePanel(
          name,
          null,
          { loading: true }
        );

        updateSectorPanel(
          null,
          { loading: true }
        );

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
          state.partners = partnerMap;

          updateTradePanel(
            name,
            partners
          );

          updateSectorPanel(
            sectors
          );

        } catch (error) {

          console.error(error);

          updateTradePanel(
            name,
            null,
            { error: true }
          );

          updateSectorPanel(
            null,
            { error: true }
          );
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