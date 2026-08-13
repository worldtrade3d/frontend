import { BASE_URL } from "../config.js";
const TRADE_API = `${BASE_URL}/trade`;


/* ==========================================================================
   Shared helper
   ========================================================================== */

async function fetchJson(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `API request failed: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}


/* ==========================================================================
   API Status
   ========================================================================== */

export async function checkApiStatus() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}


/* ==========================================================================
   World Bank — Totals
   ========================================================================== */

export async function fetchAllCountriesTotals(type, year) {
  return fetchJson(
    `${TRADE_API}/totals?type=${type}&year=${year}`
  );
}


export async function fetchCountryTotal(
  country,
  type,
  year
) {
  return fetchJson(
    `${TRADE_API}/totals/${country}?type=${type}&year=${year}`
  );
}


/* ==========================================================================
   UN Comtrade — All
   ========================================================================== */

export async function fetchAllTradePartners(
  country,
  type,
  year
) {
  return fetchJson(
    `${TRADE_API}/all/partners?country=${country}&type=${type}&year=${year}`
  );
}


export async function fetchAllTradeSectors(
  country,
  type,
  year
) {
  return fetchJson(
    `${TRADE_API}/all/sectors?country=${country}&type=${type}&year=${year}`
  );
}


/* ==========================================================================
   UN Comtrade — Bilateral
   ========================================================================== */

export async function fetchBilateralPartners(
  from,
  to,
  type,
  year
) {
  return fetchJson(
    `${TRADE_API}/bilateral/partners?from=${from}&to=${to}&type=${type}&year=${year}`
  );
}


export async function fetchBilateralSectors(
  from,
  to,
  type,
  year
) {
  return fetchJson(
    `${TRADE_API}/bilateral/sectors?from=${from}&to=${to}&type=${type}&year=${year}`
  );
}


/* ==========================================================================
   GeoJSON
   ========================================================================== */

export async function fetchGeoJson() {
  return fetchJson(`${BASE_URL}/geojson`);
}