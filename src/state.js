export const state = {
  // Currently selected country
  selectedISO: null,
  pendingISO: null,

  // Filters
  mode: "export",
  year: new Date().getFullYear(),

  // Data
  partners: new Map(),
  totalTrade: new Map(),
  links: [],

  // View
  mapMode: "default"
};