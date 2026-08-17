export const theme = {
  globe: {
    sphere: [
      "#74c9f4",
      "#2b7dbc",
      "#12385f"
    ],

    countryDefault: "#e6e6e6",
    countryHovered: "#00cc66",
    countrySelected: "#fdff96",

    strokecolor: "#555555",
    strokethickness: 1.2,

    stars: "/assets/backgrounds/star-sky.png",

    continents: {
      Africa: "#f4d28c",
      Asia: "#f7c7c3",
      Europe: "#c7ddf4",
      "North America": "#cfe7b5",
      "South America": "#dfe79d",
      Oceania: "#d8c7ef",
      Antarctica: "#f7f7f7"
    },

    // Trade arcs
    arc: {
      color: "#fdff96",
      borderColor: "#000000",
      borderWidth: 3,
      width: 3,
      steps: 48,
      liftFactor: 0.28
    },

    // Arc endpoint dots
    arcDot: {
      radius: 4,
      borderColor: "#000000",
      borderWidth: 2,
      startColor: "#45bbff",   // exporter
      endColor: "#00cc66"     // importer
    }
  }
};