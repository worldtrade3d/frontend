import { state } from "./state.js";

const MIN_YEAR = 1962;
const MAX_YEAR = new Date().getFullYear() - 1;

export function initYear() {
    const prevYear = document.getElementById("prev-year");
    const currentYear = document.getElementById("current-year");
    const nextYear = document.getElementById("next-year");

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

export function getYear() {
    return state.year;
}