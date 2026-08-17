import { checkApiStatus } from "../services/api.js";

const RETRY_DELAY = 2000;
const LOADING_FADE_DELAY = 300;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function initStatus() {
  // Keep checking forever until the API is available
  await waitForApi();

  // API is available, hide loader
  await hideLoadingScreen();

  return true;
}

async function waitForApi() {
  while (true) {
    try {
      if (await checkApiStatus()) {
        return true;
      }
    } catch {
      // Ignore connection errors and keep trying
    }

    await sleep(RETRY_DELAY);
  }
}

async function hideLoadingScreen() {
  await sleep(LOADING_FADE_DELAY);

  const loadingScreen = document.getElementById("loading-scene");
  const applicationScene = document.getElementById("application-scene");

  if (!loadingScreen || !applicationScene) return;

  applicationScene.hidden = false;
  loadingScreen.classList.add("hidden");

  loadingScreen.addEventListener(
    "transitionend",
    () => loadingScreen.remove(),
    { once: true }
  );
}