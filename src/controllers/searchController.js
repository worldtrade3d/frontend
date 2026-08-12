import { formatPercent, formatLabel, formatCurrency } from "../utils/format.js";
import { getCountryName } from "../utils/country.js";
import { state } from "../state/state.js";

export function createSearchController({
  features,
  controls
}) {
  const search = document.getElementById("country-search");
  const results = document.getElementById("search-results");
  const clearButton = document.getElementById("search-clear");

  // Sort countries alphabetically
  const countries = [...features].sort((a, b) =>
    a.properties.ADMIN.localeCompare(b.properties.ADMIN)
  );

  let selectedIndex = -1;

  function updateClearButton() {
    if (!clearButton) return;

    clearButton.classList.toggle(
      "show",
      search.value.trim().length > 0
    );
  }

  function hideResults() {
    results.classList.remove("show");
    results.innerHTML = "";
    selectedIndex = -1;
  }

  function showResults(matches) {
    results.innerHTML = "";

    if (matches.length === 0) {
      hideResults();
      return;
    }

    matches.forEach((feature, index) => {
      const item = document.createElement("div");

      item.className = "country-option";
      item.textContent = feature.properties.ADMIN;

      item.addEventListener("mouseenter", () => {
        selectedIndex = index;
        updateSelection();
      });

      item.addEventListener("click", () => {
        setSelectedCountry(feature);

        controls.activateCountry(feature);

        hideResults();
        search.blur();
      });

      results.appendChild(item);
    });

    results.classList.add("show");
    updateSelection();
  }

  function updateSelection() {
    [...results.children].forEach((el, i) => {
      el.classList.toggle("selected", i === selectedIndex);
    });
  }

  function setSelectedCountry(feature) {
    search.value = feature ? feature.properties.ADMIN : "";
    hideResults();
    updateClearButton();
  }

  search.addEventListener("input", () => {
    updateClearButton();

    const query = search.value.trim().toLowerCase();

    if (!query) {
      hideResults();
      return;
    }

    const matches = countries.filter(feature =>
      feature.properties.ADMIN
        .toLowerCase()
        .startsWith(query)
    );

    showResults(matches);
  });

  search.addEventListener("keydown", e => {
    const items = [...results.children];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();

        if (!items.length) return;

        selectedIndex = Math.min(
          selectedIndex + 1,
          items.length - 1
        );

        updateSelection();
        break;

      case "ArrowUp":
        e.preventDefault();

        if (!items.length) return;

        selectedIndex = Math.max(
          selectedIndex - 1,
          0
        );

        updateSelection();
        break;

      case "Enter":
        e.preventDefault();

        if (selectedIndex >= 0) {
          items[selectedIndex].click();
        }

        break;

      case "Escape":
        hideResults();
        break;
    }
  });

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      setSelectedCountry(null);

      // Deactivating country will handle re-fetching world totals
      controls.activateCountry(null);

      search.focus();
    });
  }

  document.addEventListener("click", e => {
    if (!e.target.closest("#search-container")) {
      hideResults();
    }
  });

  updateClearButton();

  return {
    setSelectedCountry
  };
}