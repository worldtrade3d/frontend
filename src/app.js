import { initStatus } from "./statusController.js";
import { initTrade } from "./tradeController.js";
import { initGlobe } from "./globeController.js";
import { initYear } from "./yearController.js";

export function initApp() {
  initStatus();
  initTrade();
  initGlobe();

  initYear();
}