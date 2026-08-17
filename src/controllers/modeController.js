import { state } from "../config/state.js";

export function initMode() {
  const buttons = document.querySelectorAll("#trade-mode-toggle button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.tradeMode;

      if (mode === state.mode) return;

      state.mode = mode;

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}