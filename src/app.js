import { initStatus } from "./controllers/statusController.js";
import { initGlobe  } from "./controllers/globeController.js";
import { initTrade  } from "./controllers/tradeController.js";
import { initLayers } from "./controllers/layerController.js";

async function initApp() {
  if (!(await initStatus())) return;
  
  initGlobe();
  initTrade();
  initLayers();
}

initApp();