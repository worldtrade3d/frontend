export const state = {
  selectedISO: null,
  pendingISO: null,

  
  mode: "export",
  year: new Date().getFullYear(),

  partners: new Map(),
  totalTrade: new Map(),
  mapMode: "default",

  links: []
};