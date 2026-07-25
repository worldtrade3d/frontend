import { initStatus } from "./controllers/statusController.js";
import { initTrade } from "./controllers/modeController.js";
import { initGlobe } from "./controllers/globeController.js";
import { initYear } from "./controllers/yearController.js";

import { initOptionsMenu } from "./controllers/layerController.js";
import { hideLoadingScreen } from "./controllers/loadingController.js";

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