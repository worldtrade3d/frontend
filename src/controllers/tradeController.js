import { state } from "../state/state.js";

export function initTrade() {
  initMode();
  initYear();
}

function initMode() {
  const buttons = document.querySelectorAll("#mode-toggle button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;

      if (mode === state.mode) return;

      state.mode = mode;
      console.log("Mode changed:", state.mode);

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function initYear() {
    // Initialize year selector
    const prevYear = document.getElementById("prev-year");
    const currentYear = document.getElementById("current-year");
    const nextYear = document.getElementById("next-year");

    const MIN_YEAR = 1962;
    const MAX_YEAR = new Date().getFullYear() - 1;

    // Ensure initial year is within the valid range
    state.year = Math.min(Math.max(state.year, MIN_YEAR), MAX_YEAR);

    function updateYear() {
      prevYear.textContent = state.year - 1;
      currentYear.textContent = state.year;
      nextYear.textContent = state.year + 1;
    }

    prevYear.addEventListener("click", () => {
      if (state.year > MIN_YEAR) {
      state.year--;
      updateYear();
      }
    });

    nextYear.addEventListener("click", () => {
      if (state.year < MAX_YEAR) {
      state.year++;
      updateYear();
      }
    });

    updateYear();
}