export const state = {
  // Selection
  selectedISO: null,
  selectedCountryName: null,

  pendingISO: null,
  pendingCountryName: null,

  hoveredISO: null,

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