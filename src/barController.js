
/* =========================
   FORMAT
========================= */
function formatPercent(value) {
  if (value >= 10) return Math.round(value) + "%";
  if (value >= 1) return value.toFixed(1) + "%";
  return value.toFixed(3) + "%";
}

function formatLabel(text) {
  if (!text) return "";

  return text
    .replace(/_/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
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
            ${p.iso || p.country}
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

export function updateSectorPanel(sectors) {

  const container =
    document.getElementById(
      "categories-content"
    );


  if (!container) return;


  if (!sectors || sectors.length === 0) {

    container.innerHTML = `
      <p class="placeholder">
        No sector data
      </p>
    `;

    return;
  }


  const sorted = [...sectors].sort(
    (a,b)=>b.value-a.value
  );


  const max =
    sorted[0]?.value || 1;


  container.innerHTML =
    sorted.map(sector => {

      const width =
        (sector.value / max) * 100;


      return `

      <div class="trade-row">

        <div class="trade-label">

          <span>
            ${formatPercent(sector.value)}
          </span>

          <span>
            ${formatLabel(sector.name || sector.sector)}
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

    }).join("");



  requestAnimationFrame(()=>{

    container
      .querySelectorAll(".trade-fill")
      .forEach(bar=>{

        bar.style.width =
          bar.dataset.width;

      });

  });

}