
const BASE_URL = window.location.hostname === "127.0.0.1" ? "http://127.0.0.1:3000" : "https://backend-m5wv.onrender.com";

export async function checkApiStatus() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchTradePartners(country, type, year) {
  const url = `${BASE_URL}/trade-partners?country=${country}&type=${type}&year=${year}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch partners');
  return res.json();
}

export async function fetchTradeSectors(country, type, year) {
  const url = `${BASE_URL}/trade-sectors?country=${country}&type=${type}&year=${year}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch sectors');
  return res.json();
}