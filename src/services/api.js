const BASE_URL = window.location.hostname === "127.0.0.1" ? "http://127.0.0.1:3000" : "https://backend-m5wv.onrender.com";

export async function checkApiStatus() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAllCountriesTotals(type, year) {
  return fetchJson(`${BASE_URL}/trade-totals?type=${type}&year=${year}`);
}

export async function fetchCountryTotal(country, type, year) {
  return fetchJson(
    `${BASE_URL}/trade-country-total?country=${country}&type=${type}&year=${year}`
  );
}

export async function fetchTradePartners(country, type, year) {
  return fetchJson(`${BASE_URL}/trade-partners?country=${country}&type=${type}&year=${year}`);
}

export async function fetchTradeSectors(country, type, year) {
  return fetchJson(`${BASE_URL}/trade-sectors?country=${country}&type=${type}&year=${year}`);
}

// Shared helper
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}