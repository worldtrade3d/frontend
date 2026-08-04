import { initStatus } from "./controllers/loaderController.js";
import { initGlobe  } from "./controllers/globeController.js";
import { initMode   } from "./controllers/modeController.js";
import { initYear   } from "./controllers/yearController.js";
import { initLayers } from "./controllers/layerController.js";
import { initBars   } from "./controllers/barController.js";

async function initApp() {
  if (!(await initStatus())) return;
  
  initGlobe();
  initMode();
  initYear();
  initBars();
  initLayers();
}

initApp();