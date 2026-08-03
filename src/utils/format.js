export function formatPercent(value) {
  if (value >= 10) return Math.round(value) + "%";
  if (value >= 1) return value.toFixed(1) + "%";
  return value.toFixed(3) + "%";
}

export function formatLabel(text) {
  if (!text) return "";
  return text.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}