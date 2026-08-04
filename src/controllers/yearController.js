import { state } from "../state/state.js";

export function initYear() {
  const prevYear = document.getElementById("prev-year");
  const currentYear = document.getElementById("current-year");
  const nextYear = document.getElementById("next-year");

  const MIN_YEAR = 1962;
  const MAX_YEAR = new Date().getFullYear() - 1;

  currentYear.min = MIN_YEAR;
  currentYear.max = MAX_YEAR;

  state.year = Math.max(MIN_YEAR, Math.min(state.year, MAX_YEAR));

  function updateYear() {
    currentYear.value = state.year;

    prevYear.disabled = state.year <= MIN_YEAR;
    nextYear.disabled = state.year >= MAX_YEAR;
  }

  function setYear(year) {
    year = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));

    if (year === state.year) return;

    state.year = year;
    updateYear();

    // update visualization here
  }

  prevYear.addEventListener("click", () => setYear(state.year - 1));
  nextYear.addEventListener("click", () => setYear(state.year + 1));

  currentYear.addEventListener("change", () => {
    const year = Number(currentYear.value);

    if (Number.isNaN(year)) {
      updateYear();
      return;
    }

    setYear(year);
  });

  currentYear.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      currentYear.blur();
    }
  });

  updateYear();
}