export function showApiConnectionError() {
  const title = document.getElementById("loading-title");
  const message = document.getElementById("loading-message");
  const spinner = document.querySelector(".spinner");

  if (title) {
    title.textContent = "Cannot connect to API";
  }

  if (message) {
    message.textContent =
      "Please check that the API is running and refresh the page.";
  }

  if (spinner) {
    spinner.style.display = "none";
  }
}

export async function hideLoadingScreen() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const loadingScreen = document.getElementById("loading-screen");

    if (!loadingScreen) return;

    loadingScreen.classList.add("hidden");

    // Remove it after the fade-out finishes
    loadingScreen.addEventListener(
    "transitionend",
    () => loadingScreen.remove(),
    { once: true }
    );
}