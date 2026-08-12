import {
  formatPercent,
  formatCurrency
} from "../utils/format.js";

import { getCountryName } from "../utils/country.js";


/* ==========================================================================
   Country Row Template
   ========================================================================== */

const countryRowTemplate =
  document.getElementById("trade-row-template");


/* ==========================================================================
   Create Country Row
   ========================================================================== */

function createCountryRow(
  country,
  maxValue,
  valueType = "percentage"
) {

  const clone =
    countryRowTemplate.content.cloneNode(true);


  const row =
    clone.querySelector(".country-row");

  const name =
    clone.querySelector(".country-name");

  const valueElement =
    clone.querySelector(".country-value");

  const fill =
    clone.querySelector(".country-fill");


  /* ------------------------------------------------------------------------
     Country Data
     ------------------------------------------------------------------------ */

  const iso =
    country.iso ||
    country.country;

  const value =
    Number(country.value) || 0;


  /* ------------------------------------------------------------------------
     Country ISO
     ------------------------------------------------------------------------ */

  if (row) {
    row.dataset.iso = iso || "";
  }


  /* ------------------------------------------------------------------------
     Country Name
     ------------------------------------------------------------------------ */

  if (name) {
    name.textContent =
      getCountryName(iso);
  }


  /* ------------------------------------------------------------------------
     Display Value
     ------------------------------------------------------------------------ */

  if (valueElement) {

    if (valueType === "currency") {

      valueElement.textContent =
        formatCurrency(value);

    } else {

      valueElement.textContent =
        formatPercent(value);

    }

  }


  /* ------------------------------------------------------------------------
     Progress Bar Width
     ------------------------------------------------------------------------ */

  const width =
    maxValue > 0
      ? (value / maxValue) * 100
      : 0;


  if (fill) {

    fill.dataset.width =
      `${width}%`;

  }


  return clone;
}


/* ==========================================================================
   Update Country Panel
   ========================================================================== */

export function updateCountryPanel(
  countries,
  options = {}
) {

  const container =
    document.getElementById(
      "country-content"
    );


  if (!container) {
    return;
  }


  /* ==========================================================================
     LOADING
     ========================================================================== */

  if (options.loading) {

    container.innerHTML = `
      <p class="placeholder">
        Loading country data...
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
        Failed to load country data
      </p>
    `;

    return;
  }


  /* ==========================================================================
     EMPTY
     ========================================================================== */

  if (
    !countries ||
    !Array.isArray(countries) ||
    countries.length === 0
  ) {

    container.innerHTML = `
      <p class="placeholder">
        No country data
      </p>
    `;

    return;
  }


  /* ==========================================================================
     SORT COUNTRIES
     ========================================================================== */

  const sorted =
    [...countries].sort(
      (a, b) =>
        Number(b.value) -
        Number(a.value)
    );


  /* ==========================================================================
     MAXIMUM COUNTRY VALUE
     ========================================================================== */

  const maxValue =
    Number(
      sorted[0]?.value
    ) || 1;


  /* ==========================================================================
     VALUE TYPE
     ========================================================================== */

  const valueType =
    options.valueType ||
    "percentage";


  /* ==========================================================================
     RENDER COUNTRY BARS
     ========================================================================== */

  container.replaceChildren();


  sorted.forEach(country => {

    container.appendChild(
      createCountryRow(
        country,
        maxValue,
        valueType
      )
    );

  });


  /* ==========================================================================
     ANIMATE COUNTRY BARS
     ========================================================================== */

  requestAnimationFrame(() => {

    container
      .querySelectorAll(
        ".country-fill"
      )
      .forEach(fill => {

        fill.style.width =
          fill.dataset.width;

      });

  });

}