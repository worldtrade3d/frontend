import { state } from "../state/state.js";

export function initMode() {
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