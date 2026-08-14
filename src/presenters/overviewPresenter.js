import { formatCurrency } from "../utils/format.js";


/* ==========================================================================
   Country Overview Elements
   ========================================================================== */

const countryElement =
  document.getElementById("selected-country");

const exportsElement =
  document.getElementById("country-exports");

const importsElement =
  document.getElementById("country-imports");


/* ==========================================================================
   Update Country Overview
   ========================================================================== */

export function updateCountryOverview(
  countryName,
  exportsTotal,
  importsTotal
) {

  /* ------------------------------------------------------------------------
     Country Name
     ------------------------------------------------------------------------ */

  if (countryElement) {
    countryElement.textContent =
      countryName || "World";
  }


  /* ------------------------------------------------------------------------
     Total Exports
     ------------------------------------------------------------------------ */

  if (exportsElement) {
    exportsElement.textContent =
      formatCurrency(exportsTotal);
  }


  /* ------------------------------------------------------------------------
     Total Imports
     ------------------------------------------------------------------------ */

  if (importsElement) {
    importsElement.textContent =
      formatCurrency(importsTotal);
  }
}


/* ==========================================================================
   Reset Country Overview
   ========================================================================== */

export function resetCountryOverview() {

  if (countryElement) {
    countryElement.textContent = "World";
  }

  if (exportsElement) {
    exportsElement.textContent = "$26.3T";
  }

  if (importsElement) {
    importsElement.textContent = "$26.3T";
  }
}