import { checkApiStatus } from "./api.js";

const MAX_RETRIES = 7;
const RETRY_DELAY = 2000;
const LOADING_FADE_DELAY = 300;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function initStatus() {
  const online = await waitForApi();

  if (!online) {
    showApiConnectionError();
    return false;
  }

  await hideLoadingScreen();
  return true;
}

async function waitForApi() {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    if (await checkApiStatus()) {
      return true;
    }

    if (attempt < MAX_RETRIES) {
      await sleep(RETRY_DELAY);
    }
  }

  return false;
}

function showApiConnectionError() {
  const spinner = document.querySelector(".spinner");
  const message = document.getElementById("error-message");

  if (spinner) {
    spinner.style.display = "none";
  }

  message.innerHTML = 'Please check that the API is running and <a href="#" id="refresh-link" style="color: #9ecbff; text-decoration: underline;">refresh</a> the page.';
  message.style.display = "block";

  document.getElementById("refresh-link").addEventListener("click", (e) => {
    e.preventDefault();
    location.reload();
  });
}

async function hideLoadingScreen() {
  await sleep(LOADING_FADE_DELAY);

  const loadingScreen = document.getElementById("loading-scene");
  const applicationScene = document.getElementById("application-scene");

  if (!loadingScreen || !applicationScene) return;

  // Show app underneath first
  applicationScene.hidden = false;

  // Now fade out the loading screen
  loadingScreen.classList.add("hidden");

  loadingScreen.addEventListener(
    "transitionend",
    () => loadingScreen.remove(),
    { once: true }
  );
}