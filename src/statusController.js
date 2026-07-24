import { checkApiStatus } from "./api.js";
import { showApiConnectionError } from "./loadingController.js";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function initStatus() {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const online = await checkApiStatus();

    if (online) {
      return true;
    }

    if (attempt < maxRetries) {
      await sleep(2000);
    }
  }

  showApiConnectionError();
  return false;
}