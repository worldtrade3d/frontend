import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const BG = "https://unpkg.com/three-globe/example/img/night-sky.png";

export const themes = {
  dark: {
    name: "dark",

    globe: {
        sphere: [
        "#e8f7ff",
        "#9ed8f3",
        "#4ea5d9"
  ],

      countryDefault: "#e6e6e6",
      countryHovered: "#00cc66",
      countrySelected: "#ffd54a",
      strokecolor: "#555555",
      strokethickness: "1.2",
      stars: BG,

      continents: {
        Africa: "#f4d28c",          // sand
        Asia: "#f7c7c3",            // soft pink
        Europe: "#c7ddf4",          // pale blue
        "North America": "#cfe7b5", // light green
        "South America": "#dfe79d", // yellow-green
        Oceania: "#d8c7ef",         // lavender
        Antarctica: "#f7f7f7"
      }
    }
  }
};