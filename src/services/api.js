const BASE_URL = window.location.hostname === "127.0.0.1" ? "http://127.0.0.1:3000" : "https://backend-m5wv.onrender.com";
const TRADE_API = `${BASE_URL}/trade`;

// Shared helper
async function fetchJson(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function checkApiStatus() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAllCountriesTotals(type, year) {
  return fetchJson(`${TRADE_API}/totals?type=${type}&year=${year}`);
}

export async function fetchCountryTotal(country, type, year) {
  return fetchJson(`${TRADE_API}/totals/${country}?type=${type}&year=${year}`);
}

export async function fetchTradePartners(country, type, year) {
  return fetchJson(`${TRADE_API}/partners?country=${country}&type=${type}&year=${year}`);
}

export async function fetchTradeSectors(country, type, year) {
  return fetchJson(`${TRADE_API}/sectors?country=${country}&type=${type}&year=${year}`);
}

export async function fetchGeoJson() {
  return fetchJson(`${BASE_URL}/geojson`);
}