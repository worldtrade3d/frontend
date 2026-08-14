import { formatPercent, formatLabel } from "../utils/format.js";

const breakdownData = {
  manufacturing: [
    ["Machinery", 38],
    ["Electronics", 27],
    ["Vehicles", 21],
    ["Other manufacturing", 14]
  ],
  raw_materials: [
    ["Metals", 42],
    ["Minerals", 27],
    ["Wood & forestry", 19],
    ["Other raw materials", 12]
  ],
  chemicals: [
    ["Pharmaceuticals", 36],
    ["Industrial chemicals", 29],
    ["Plastics", 21],
    ["Other chemicals", 14]
  ],
  agriculture: [
    ["Crops", 41],
    ["Livestock", 27],
    ["Food products", 20],
    ["Other agriculture", 12]
  ],
  other: [
    ["Services", 39],
    ["Technology", 28],
    ["Energy", 19],
    ["Other", 14]
  ]
};

export function updateSectorPanel(sectors, options = {}) {
  const container = document.getElementById("sector-content");
  if (!container) return;

  if (options.loading) {
    container.innerHTML = `<p class="placeholder">Loading sector data...</p>`;
    return;
  }

  if (options.error) {
    container.innerHTML = `<p class="placeholder">Failed to load sectors</p>`;
    return;
  }

  if (!sectors || sectors.length === 0) {
    container.innerHTML = `<p class="placeholder">Click apply to fetch data</p>`;
    return;
  }

  const sorted = [...sectors].sort(
    (a, b) => Number(b.value) - Number(a.value)
  );

  const max = Number(sorted[0]?.value) || 1;

  container.innerHTML = sorted.map(sector => {
    const value = Number(sector.value) || 0;
    const width = max > 0 ? (value / max) * 100 : 0;
    const name = formatLabel(sector.name || sector.sector);
    const key = sector.sector || sector.name;

    const breakdown = breakdownData[key] || [
      ["Category A", 40],
      ["Category B", 30],
      ["Category C", 20],
      ["Other", 10]
    ];

    return `
      <div class="sector-row" data-expanded="false">
        <div class="sector-info">
          <span class="sector-name">${name}</span>
          <span class="sector-percent">${formatPercent(value)}</span>
        </div>

        <div class="sector-bar">
          <div class="sector-fill" data-width="${width}%"></div>
        </div>

        <div class="sector-breakdown">
          <div class="breakdown-title">Detailed breakdown</div>

          ${breakdown.map(([label, percent]) => `
            <div class="breakdown-row">
              <span>${label}</span>
              <span>${percent}%</span>
            </div>

            <div class="breakdown-bar">
              <div style="width: ${percent}%"></div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  requestAnimationFrame(() => {
    container.querySelectorAll(".sector-fill").forEach(fill => {
      fill.style.width = fill.dataset.width;
    });
  });
}

document.getElementById("sector-content")?.addEventListener("click", event => {
  const row = event.target.closest(".sector-row");
  if (!row) return;

  const expanded = row.dataset.expanded === "true";

  row.dataset.expanded = String(!expanded);
});