import {
  formatPercent,
  formatLabel
} from "../utils/format.js";


export function updateSectorPanel(
  sectors,
  options = {}
) {
  const container =
    document.getElementById(
      "sector-content"
    );

  if (!container) return;


  // ==========================================================================
  // LOADING
  // ==========================================================================

  if (options.loading) {
    container.innerHTML =
      `<p class="placeholder">
        Loading sector data...
      </p>`;

    return;
  }


  // ==========================================================================
  // ERROR
  // ==========================================================================

  if (options.error) {
    container.innerHTML =
      `<p class="placeholder">
        Failed to load sectors
      </p>`;

    return;
  }


  // ==========================================================================
  // EMPTY
  // ==========================================================================

  if (
    !sectors ||
    sectors.length === 0
  ) {
    container.innerHTML =
      `<p class="placeholder">
        Click apply to fetch data
      </p>`;

    return;
  }


  // ==========================================================================
  // SORT SECTORS
  // ==========================================================================

  const sorted =
    [...sectors].sort(
      (a, b) =>
        Number(b.percentage) -
        Number(a.percentage)
    );

  /*
   * The main sector bar represents
   * the sector's percentage of total trade.
   *
   * We use percentage here rather than
   * the raw trade value.
   */

  const max =
    Math.max(
      ...sorted.map(
        sector =>
          Number(
            sector.percentage
          ) || 0
      ),
      1
    );


  // ==========================================================================
  // RENDER
  // ==========================================================================

  container.innerHTML =
    sorted
      .map(sector => {

        const percentage =
          Number(
            sector.percentage
          ) || 0;


        const width =
          max > 0
            ? (percentage / max) * 100
            : 0;


        const name =
          formatLabel(
            sector.name ||
            sector.sector
          );


        /*
         * These are the actual HS-2
         * details returned by Comtrade.
         */

        const breakdown =
          Array.isArray(
            sector.details
          )
            ? sector.details
            : [];


        return `
          <div
            class="sector-row"
            data-expanded="false"
          >

            <div class="sector-info">

              <span class="sector-name">
                ${name}
              </span>

              <span class="sector-percent">
                ${formatPercent(
                  percentage
                )}
              </span>

            </div>


            <div class="sector-bar">

              <div
                class="sector-fill"
                data-width="${width}%"
              ></div>

            </div>


            <div class="sector-breakdown">

              <div class="breakdown-title">
                Detailed breakdown
              </div>


              ${
                breakdown.length > 0

                  ? breakdown
                      .map(detail => {

                        const detailPercentage =
                          Number(
                            detail.percentage
                          ) || 0;


                        return `
                          <div
                            class="breakdown-row"
                          >

                            <span>
                              ${detail.name}
                            </span>

                            <span>
                              ${formatPercent(
                                detailPercentage
                              )}
                            </span>

                          </div>


                          <div
                            class="breakdown-bar"
                          >

                            <div
                              style="
                                width: ${detailPercentage}%;
                              "
                            ></div>

                          </div>
                        `;

                      })
                      .join("")

                  : `
                    <div
                      class="breakdown-empty"
                    >
                      No detailed data available
                    </div>
                  `
              }

            </div>

          </div>
        `;

      })
      .join("");


  // ==========================================================================
  // ANIMATE MAIN SECTOR BARS
  // ==========================================================================

  requestAnimationFrame(() => {

    container
      .querySelectorAll(
        ".sector-fill"
      )
      .forEach(fill => {

        fill.style.width =
          fill.dataset.width;

      });

  });

}


// ============================================================================
// EXPAND / COLLAPSE
// ============================================================================

document
  .getElementById("sector-content")
  ?.addEventListener(
    "click",
    event => {

      const row =
        event.target.closest(
          ".sector-row"
        );


      if (!row) return;


      const expanded =
        row.dataset.expanded ===
        "true";


      row.dataset.expanded =
        String(!expanded);

    }
  );