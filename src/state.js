export const state = {
  // Currently selected country
  selectedISO: null,
  pendingISO: null,        // temporary while data is loading

  // Filters
  mode: "export",          // "export" | "import"
  year: new Date().getFullYear(),

  // Data
  partners: new Map(),     // iso → value (for selected country)
  totalTrade: new Map(),   // iso → total (for heatmap)
  links: [],               // manual trade arcs { from, to }

  // View
  mapMode: "default"       // "default" | "heatmap"
};