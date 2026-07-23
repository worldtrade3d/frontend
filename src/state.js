import { themes } from "./theme.js";

export const state = {
  selectedISO: null,
  pendingISO: null,
  partners: new Map(),
  mode: "export",
  theme: themes.dark,
  year: new Date().getFullYear()
};