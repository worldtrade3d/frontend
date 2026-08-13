import { initStatus } from "./controllers/loaderController.js";
import { initGlobe } from "./controllers/globeController.js";
import { initMode } from "./controllers/modeController.js";
import { initYear } from "./controllers/yearController.js";
import { initLayers } from "./controllers/layerController.js";
import { loadWorldTrade } from "./controllers/barController.js";


async function initApp() {
  if (!(await initStatus())) return;

  initMode();
  initYear();
  
  await initGlobe();
  await loadWorldTrade();

  initLayers();
}


initApp();