import { initStatus } from "./status.js";
import { initGlobe  } from "./controllers/globeController.js";
import { initTrade  } from "./controllers/tradeController.js";
import { initLayers } from "./controllers/layerController.js";

export async function initApp() {
  await initStatus();
  
  initGlobe();
  initTrade();
  initLayers();
}