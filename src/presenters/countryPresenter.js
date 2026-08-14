import { formatPercent, formatCurrency } from "../utils/format.js";
import { getCountryName } from "../utils/country.js";
import { state } from "../state/state.js";

const countryRowTemplate = document.getElementById("trade-row-template");

function createCountryRow(country, maxValue, valueType = "percentage") {
  const clone = countryRowTemplate.content.cloneNode(true);
  const row = clone.querySelector(".country-row");
  const name = clone.querySelector(".country-name");
  const valueElement = clone.querySelector(".country-value");
  const fill = clone.querySelector(".country-fill");

  const iso = country.iso || country.country;
  const value = Number(country.value) || 0;

  if (row) {
    row.dataset.iso = iso || "";

    row.addEventListener("mouseenter", () => {
      state.hoveredISO = iso || null;
    });

    row.addEventListener("mouseleave", () => {
      if (state.hoveredISO === iso) state.hoveredISO = null;
    });
  }

  if (name) name.textContent = getCountryName(iso);

  if (valueElement) {
    valueElement.textContent =
      valueType === "currency" ? formatCurrency(value) : formatPercent(value);
  }

  const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
  if (fill) fill.dataset.width = `${width}%`;

  return clone;
}

export function updateCountryPanel(countries, options = {}) {
  const container = document.getElementById("country-content");
  if (!container) return;

  if (options.loading) {
    container.innerHTML = `<p class="placeholder">Loading country data...</p>`;
    return;
  }

  if (options.error) {
    container.innerHTML = `<p class="placeholder">Failed to load country data</p>`;
    return;
  }

  if (!countries || !Array.isArray(countries) || countries.length === 0) {
    container.innerHTML = `<p class="placeholder">Click apply to fetch data</p>`;
    return;
  }

  const sorted = [...countries].sort((a, b) => Number(b.value) - Number(a.value));
  const maxValue = Number(sorted[0]?.value) || 1;
  const valueType = options.valueType || "percentage";

  container.replaceChildren();

  sorted.forEach(country => {
    container.appendChild(createCountryRow(country, maxValue, valueType));
  });

  requestAnimationFrame(() => {
    container.querySelectorAll(".country-fill").forEach(fill => {
      fill.style.width = fill.dataset.width;
    });
  });
}