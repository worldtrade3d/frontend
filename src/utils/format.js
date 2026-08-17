export function formatPercent(value) {
  const number = Number(value) || 0;

  if (number >= 10) {
    return Math.round(number) + "%";
  }

  if (number >= 1) {
    return number.toFixed(1) + "%";
  }

  return number.toFixed(3) + "%";
}

export function formatLabel(text) {
  if (!text) return "";

  return text
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function formatCurrency(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2
  }).format(number);
}