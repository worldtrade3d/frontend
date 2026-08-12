import { formatPercent, formatLabel, formatCurrency } from "../utils/format.js";
import { getCountryName } from "../utils/country.js";
import { state } from "../state/state.js";

const tradeRowTemplate = document.getElementById("trade-row-template");

function createTradeRow(partner, maxValue) {
  const clone = tradeRowTemplate.content.cloneNode(true);

  const row = clone.querySelector(".trade-row");
  const country = clone.querySelector(".trade-country");
  const value = clone.querySelector(".trade-value");
  const fill = clone.querySelector(".trade-fill");

  const iso = partner.iso || partner.country;

  row.dataset.iso = iso;
  country.textContent = getCountryName(iso);

  // Show only the trade value
  value.textContent = formatCurrency(partner.value);

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
     COUNTRY TOTAL (Updated)
  ========================= */

  if (options.total !== undefined) {
    const formatted = new Intl.NumberFormat("en", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2
    }).format(options.total);

    // 1. Update the overview card element based on the current mode
    const exportsElement = document.getElementById("country-exports");
    const importsElement = document.getElementById("country-imports");

    if (state.mode === "export" && exportsElement) {
      exportsElement.textContent = formatted;
    } else if (state.mode === "import" && importsElement) {
      importsElement.textContent = formatted;
    }

    // 2. Instead of building the summary card, show the placeholder prompt in Top Partners
    container.innerHTML = `
      <p class="placeholder">
        Click <strong>Apply</strong> to load top trade partners.
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