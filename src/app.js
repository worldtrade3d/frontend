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

  // Load the globe and country lookup first.
  // This guarantees country names are available
  // before trade data is rendered.
  await initGlobe();

  // Then load the initial world trade data.
  await loadWorldTrade();

  initLayers();
}


initApp();