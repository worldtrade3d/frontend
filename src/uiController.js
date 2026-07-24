import { state } from "./state.js";
import { fetchAllCountriesTotals } from "./api.js";

/* =========================
   FORMAT
========================= */
function formatPercent(value) {
  if (value >= 10) return Math.round(value) + "%";
  if (value >= 1) return value.toFixed(1) + "%";
  return value.toFixed(3) + "%";
}

/* =========================
   TRADE PANEL
========================= */
export function updateTradePanel(countryName, partners, options = {}) {
  const container = document.getElementById("trade-content");
  const title = document.getElementById("country-name");

  if (!container || !title) return;

  title.textContent = countryName
    ? `${countryName}`
    : "Select a country";


  /* =========================
     LOADING
  ========================= */
  if (options.loading) {
    container.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <span>Loading trade data...</span>
      </div>
    `;
    return;
  }


  /* =========================
     ERROR
  ========================= */
  if (options.error) {
    container.innerHTML = `
      <p class="placeholder">
        Failed to load data
      </p>
    `;
    return;
  }


  /* =========================
     EMPTY
  ========================= */
  if (!partners || partners.length === 0) {
    container.innerHTML = `
      <p class="placeholder">
        No data
      </p>
    `;
    return;
  }


  /* =========================
     SORT ALL PARTNERS
  ========================= */
  const sorted = [...partners].sort(
    (a, b) => b.value - a.value
  );


  const all = sorted;

  const maxValue = all[0]?.value || 1;


  /* =========================
     BUILD ROWS
  ========================= */
  const rows = all.map(p => {

    const width = (p.value / maxValue) * 100;

    return `
      <div 
        class="trade-row" 
        data-iso="${p.iso || p.country}"
      >

        <div class="trade-label">
          <span>
            ${p.name || p.iso || p.country}
          </span>

          <span>
            ${formatPercent(p.value)}
          </span>
        </div>

        <div class="trade-bar">
          <div 
            class="trade-fill" 
            data-width="${width}%"
          ></div>
        </div>

      </div>
    `;
  });


  /* =========================
     RENDER
  ========================= */
  container.innerHTML = rows.join("");


  /* =========================
     ANIMATE BARS
  ========================= */
  requestAnimationFrame(() => {

    const fills = container.querySelectorAll(
      ".trade-fill"
    );


    fills.forEach(el => {
      el.style.width = el.dataset.width;
    });

  });

}

export function initOptionsMenu() {
    const button = document.getElementById("mode-btn");
    const icon = document.getElementById("mode-icon");

    if (!button || !icon) return;

    state.mapMode = "default";

    button.addEventListener("click", async () => {
        if (state.mapMode === "default") {

            const totals = await fetchAllCountriesTotals(
                "export",
                state.year
            );

            const map = new Map();

            totals.forEach(country => {
                map.set(country.country, country.total);
            });

            state.totalTrade = map;
            state.mapMode = "heatmap";

            icon.src = "assets/default.png";
            icon.alt = "Heatmap";

        } else {

            state.mapMode = "default";

            icon.src = "assets/heatmap.png";
            icon.alt = "Default";
        }
    });
}