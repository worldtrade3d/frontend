export const state = {
  // Selection
  selectedISO: null,
  pendingISO: null,
  pendingCountryName: null,

  // Filters
  mode: "export",
  year: 2025,

  // Trade data
  partners: new Map(),
  totalTrade: new Map(),
  links: [],

  // View
  mapMode: "default"
};