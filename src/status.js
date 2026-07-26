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
  const message = document.getElementById("loading-message");
  const spinner = document.querySelector(".spinner");

  message.innerHTML = 'Please check that the API is running and <a href="#" id="refresh-link" style="color: #9ecbff; text-decoration: underline;">refresh</a> the page.';

  document.getElementById("refresh-link").addEventListener("click", (e) => {
    e.preventDefault();
    location.reload();
  });

  if (spinner) {
    spinner.style.display = "none";
  }
}

async function hideLoadingScreen() {
  await sleep(LOADING_FADE_DELAY);

  const loadingScreen = document.getElementById("loading-scene");
  const applicationScene = document.getElementById("application-scene");
  const logo = document.querySelector(".center-logo");

  if (!loadingScreen || !applicationScene) return;

  // Show app underneath first
  applicationScene.hidden = false;

  // Fade logo to full opacity
  if (logo) {
    logo.classList.add("connected");

    await new Promise(resolve => {
      logo.addEventListener("transitionend", resolve, { once: true });
    });
  }

  // Now fade out the loading screen
  loadingScreen.classList.add("hidden");

  loadingScreen.addEventListener(
    "transitionend",
    () => loadingScreen.remove(),
    { once: true }
  );
}