import { checkApiStatus } from "../services/api.js";

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;
const LOADING_FADE_DELAY = 300;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function initStatus() {
  const online = await waitForApi();

  if (!online) {
    showApiConnectionError();
    return false;
  }

  await playLoadingSequence();
  await hideLoadingScreen();

  return true;
}

function setLoadingStatus(text) {
  const message = document.getElementById("loader-message");
  if (!message) return;

  message.textContent = text;
  message.style.display = "block";
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

async function playLoadingSequence() {
  const steps = [
    { text: "Connecting to server", delay: 300 },
    { text: "Initializing globe", delay: 500 },
    { text: "Loading countries", delay: 450 },
    { text: "Loading trade routes", delay: 500 },
    { text: "Loading interface", delay: 400 },
    { text: "Starting application", delay: 350 }
  ];

  for (const step of steps) {
    setLoadingStatus(step.text);
    await sleep(step.delay);
  }
}

function showApiConnectionError() {
  const spinner = document.querySelector(".loader-spinner");
  const message = document.getElementById("loader-message");

  if (spinner) {
    spinner.classList.add("stopped");
  }

  message.innerHTML = 'Connection to the server failed';
  message.style.display = "block";
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