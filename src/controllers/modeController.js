import { state } from "../state.js";

export function initTrade() {
  const buttons = document.querySelectorAll("#mode-toggle button");

  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const mode = btn.dataset.mode;

      if (mode === state.mode) return;

      state.mode = mode;
      console.log("Mode changed:", state.mode);
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}