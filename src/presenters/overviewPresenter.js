import { formatCurrency } from "../utils/format.js";

const countryElement = document.getElementById("selected-country");
const exportsElement = document.getElementById("country-exports");
const importsElement = document.getElementById("country-imports");

export function updateCountryOverview(countryName, exportsTotal, importsTotal) {
  if (countryElement) {
    countryElement.textContent = countryName || "World";
  }

  if (exportsElement) {
    exportsElement.textContent = formatCurrency(exportsTotal);
  }

  if (importsElement) {
    importsElement.textContent = formatCurrency(importsTotal);
  }
}

export function resetCountryOverview() {
  if (countryElement) countryElement.textContent = "World";
  if (exportsElement) exportsElement.textContent = "$26.3T";
  if (importsElement) importsElement.textContent = "$26.3T";
}