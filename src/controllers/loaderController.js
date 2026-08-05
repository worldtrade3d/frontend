import { checkApiStatus } from "../services/api.js";

const LOADING_FADE_DELAY = 300;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function initStatus() {
  // Check API only once
  const online = await checkApiStatus();

  // Update status panel
  updateApiStatus(online);

  // Continue loading regardless of API status
  await playLoadingSequence();
  await hideLoadingScreen();

  return online;
}

function setLoadingStatus(text) {
  const message = document.getElementById("loader-message");
  if (!message) return;

  message.textContent = text;
  message.style.display = "block";
}

function updateApiStatus(online) {
  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  const applyButton = document.getElementById("apply-selection");

  if (!dot || !text) return;

  if (online) {
    dot.style.background = "#2ecc71";
    text.textContent = "API Online";

    if (applyButton) {
      applyButton.disabled = false;
      applyButton.classList.remove("disabled");
    }
  } else {
    dot.style.background = "#e74c3c";
    text.textContent = "API Offline";

    if (applyButton) {
      applyButton.disabled = true;
      applyButton.classList.add("disabled");
    }
  }
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