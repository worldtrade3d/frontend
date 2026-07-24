import { initStatus } from "./statusController.js";
import { initTrade } from "./tradeController.js";
import { initGlobe } from "./globeController.js";
import { initYear } from "./yearController.js";
import { hideLoadingScreen } from "./loadingController.js";

import { initOptionsMenu } from "./layerController.js";

export async function initApp() {
  const online = await initStatus();

  if (!online) {
    return;
  }

  initTrade();
  initGlobe();
  initYear();

  initOptionsMenu();
  hideLoadingScreen();
}