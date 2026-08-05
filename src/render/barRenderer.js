import { formatPercent, formatLabel, formatCurrency } from "../utils/format.js";
import { getCountryName } from "../utils/country.js";
import { state } from "../state/state.js";

const tradeRowTemplate = document.getElementById("trade-row-template");

function createTradeRow(partner, maxValue, totalValue) {

  const clone = tradeRowTemplate.content.cloneNode(true);

  const row = clone.querySelector(".trade-row");
  const country = clone.querySelector(".trade-country");
  const value = clone.querySelector(".trade-value");
  const fill = clone.querySelector(".trade-fill");

  const iso = partner.iso || partner.country;

  row.dataset.iso = iso;

  country.textContent = getCountryName(iso);

  const percent = totalValue
    ? (partner.value / totalValue) * 100
    : 0;

  value.textContent =
    `${formatCurrency(partner.value)} (${formatPercent(percent)})`;

  const width = (partner.value / maxValue) * 100;
  fill.dataset.width = `${width}%`;

  return clone;
}

export function updateTradePanel(countryName, partners, options = {}) {
  const container = document.getElementById("trade-content");
  const title = document.getElementById("selected-country");

  if (!container || !title) return;

  title.textContent = countryName || "Explore";

  /* =========================
     LOADING
  ========================= */

  if (options.loading) {
    container.innerHTML = `
      <p class="placeholder">
        Loading trade data...
      </p>
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
     COUNTRY TOTAL
  ========================= */

  if (options.total !== undefined) {
    const formatted = new Intl.NumberFormat("en", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2
    }).format(options.total);

    container.innerHTML = `
      <div class="trade-summary">
        <h3>Total ${state.mode === "import" ? "Imports" : "Exports"}</h3>

        <div class="trade-total-value">
          ${formatted}
        </div>

        <p class="placeholder">
          Click <strong>Apply</strong> to load trade partners.
        </p>
      </div>
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
     SORT PARTNERS
  ========================= */

  const sorted = [...partners].sort((a, b) => b.value - a.value);

  const maxValue = sorted[0]?.value || 1;

  /* =========================
     RENDER ROWS
  ========================= */

  container.replaceChildren();

  sorted.forEach(partner => {
    container.appendChild(
      createTradeRow(partner, maxValue)
    );
  });

  /* =========================
     ANIMATE BARS
  ========================= */

  requestAnimationFrame(() => {
    container.querySelectorAll(".trade-fill").forEach(fill => {
      fill.style.width = fill.dataset.width;
    });
  });
}

/* =========================
   SECTOR PANEL
========================= */

export function updateSectorPanel(sectors, options = {}) {
  const container = document.getElementById("categories-content");

  if (!container) return;

  /* =========================
     LOADING
  ========================= */
  
  if (options.loading) {
    container.innerHTML = `
      <p class="placeholder">
        Loading sector data...
      </p>
    `;
    return;
  }

  /* =========================
     ERROR
  ========================= */

  if (options.error) {
    container.innerHTML = `
      <p class="placeholder">
        Failed to load sectors
      </p>
    `;
    return;
  }

  /* =========================
     EMPTY
  ========================= */

  if (!sectors || sectors.length === 0) {
    container.innerHTML = `
      <p class="placeholder">
        No sector data
      </p>
    `;
    return;
  }

  const sorted = [...sectors].sort((a, b) => b.value - a.value);

  const max = sorted[0]?.value || 1;

  container.innerHTML = sorted.map(sector => {
    const width = (sector.value / max) * 100;

    return `
      <div class="trade-row">

        <div class="trade-label">
          <span>${formatPercent(sector.value)}</span>
          <span>${formatLabel(sector.name || sector.sector)}</span>
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

  requestAnimationFrame(() => {
    container.querySelectorAll(".trade-fill").forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
  });
}