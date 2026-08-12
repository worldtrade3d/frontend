import {
  formatPercent,
  formatLabel
} from "../utils/format.js";


/* ==========================================================================
   Sector Presenter
   ========================================================================== */

/* ==========================================================================
   Update Sector Panel
   ========================================================================== */

export function updateSectorPanel(
  sectors,
  options = {}
) {

  const container =
    document.getElementById("sector-content");

  if (!container) {
    return;
  }


  /* ==========================================================================
     LOADING
     ========================================================================== */

  if (options.loading) {

    container.innerHTML = `
      <p class="placeholder">
        Loading sector data...
      </p>
    `;

    return;
  }


  /* ==========================================================================
     ERROR
     ========================================================================== */

  if (options.error) {

    container.innerHTML = `
      <p class="placeholder">
        Failed to load sectors
      </p>
    `;

    return;
  }


  /* ==========================================================================
     EMPTY
     ========================================================================== */

  if (
    !sectors ||
    sectors.length === 0
  ) {

    container.innerHTML = `
      <p class="placeholder">
        No sector data
      </p>
    `;

    return;
  }


  /* ==========================================================================
     SORT SECTORS
     ========================================================================== */

  const sorted =
    [...sectors].sort(
      (a, b) =>
        Number(b.value) -
        Number(a.value)
    );


  /* ==========================================================================
     MAXIMUM SECTOR VALUE
     ========================================================================== */

  const max =
    Number(sorted[0]?.value) || 1;


  /* ==========================================================================
     RENDER SECTORS
     ========================================================================== */

  container.innerHTML =
    sorted
      .map(sector => {

        const value =
          Number(sector.value) || 0;

        const width =
          max > 0
            ? (value / max) * 100
            : 0;

        const name =
          formatLabel(
            sector.name ||
            sector.sector
          );

        return `
          <div class="sector-row">

            <div class="sector-info">

              <span class="sector-name">
                ${name}
              </span>

              <span class="sector-percent">
                ${formatPercent(value)}
              </span>

            </div>

            <div class="sector-bar">

              <div
                class="sector-fill"
                data-width="${width}%"
              ></div>

            </div>

          </div>
        `;

      })
      .join("");


  /* ==========================================================================
     ANIMATE SECTOR BARS
     ========================================================================== */

  requestAnimationFrame(() => {

    container
      .querySelectorAll(".sector-fill")
      .forEach(fill => {

        fill.style.width =
          fill.dataset.width;

      });

  });

}