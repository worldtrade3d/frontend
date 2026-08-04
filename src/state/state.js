export const state = {
  // Selection
  selectedISO: null,
  pendingISO: null,
  pendingCountryName: null,

  // Filters
  mode: "export",
  year: new Date().getFullYear(),

  // Trade data
  partners: new Map(),
  totalTrade: new Map(),
  links: [],

  // View
  mapMode: "default"
};