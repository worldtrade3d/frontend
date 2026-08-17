import { state } from "../config/state.js";

export function initYear() {
  const prevYear = document.getElementById("prev-year");
  const currentYear = document.getElementById("current-year");
  const nextYear = document.getElementById("next-year");
  const yearSlider = document.getElementById("year-slider");
  const timelineProgress = document.getElementById("timeline-progress");
  const minLabel = document.getElementById("min-year-label");
  const maxLabel = document.getElementById("max-year-label");

  const MIN_YEAR = 1962;
  const MAX_YEAR = new Date().getFullYear() - 1;

  // Set min/max bounds
  currentYear.min = MIN_YEAR;
  currentYear.max = MAX_YEAR;
  yearSlider.min = MIN_YEAR;
  yearSlider.max = MAX_YEAR;

  if (minLabel) minLabel.textContent = MIN_YEAR;
  if (maxLabel) maxLabel.textContent = MAX_YEAR;

  state.year = Math.max(MIN_YEAR, Math.min(state.year, MAX_YEAR));

  function updateYearUI() {
    currentYear.value = state.year;
    yearSlider.value = state.year;

    // Calculate percentage fill for the progress track
    const pct = ((state.year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
    timelineProgress.style.width = `${pct}%`;

    prevYear.disabled = state.year <= MIN_YEAR;
    nextYear.disabled = state.year >= MAX_YEAR;
  }

  function setYear(year) {
    year = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));

    if (year === state.year) return;

    state.year = year;
    updateYearUI();
  }

  // Stepper buttons
  prevYear.addEventListener("click", () => setYear(state.year - 1));
  nextYear.addEventListener("click", () => setYear(state.year + 1));

  // Slider change & dynamic dragging
  yearSlider.addEventListener("input", (e) => {
    setYear(Number(e.target.value));
  });

  // Direct number input box
  currentYear.addEventListener("change", () => {
    const year = Number(currentYear.value);
    if (Number.isNaN(year)) {
      updateYearUI();
      return;
    }
    setYear(year);
  });

  currentYear.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      currentYear.blur();
    }
  });

  // Initial render setup
  updateYearUI();
}