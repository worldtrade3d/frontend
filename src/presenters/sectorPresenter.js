import { formatPercent, formatLabel } from "../utils/format.js";

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

  if (!sectors?.length) {
    container.innerHTML = `<p class="placeholder">Click apply to fetch data</p>`;
    return;
  }

  const sorted = [...sectors].sort(
    (a, b) => Number(b.percentage) - Number(a.percentage)
  );

  const max = Math.max(
    ...sorted.map(sector => Number(sector.percentage) || 0),
    1
  );

  container.innerHTML = sorted
    .map(sector => {
      const percentage = Number(sector.percentage) || 0;
      const width = (percentage / max) * 100;
      const name = formatLabel(sector.name || sector.sector);
      const breakdown = Array.isArray(sector.details) ? sector.details : [];

      return `
        <div class="sector-row" data-expanded="false">
          <div class="sector-info">
            <span class="sector-name">${name}</span>
            <span class="sector-percent">${formatPercent(percentage)}</span>
          </div>

          <div class="sector-bar">
            <div class="sector-fill" data-width="${width}%"></div>
          </div>

          <div class="sector-breakdown">
            <div class="breakdown-title">Detailed breakdown</div>
            ${
              breakdown.length
                ? breakdown.map(renderBreakdown).join("")
                : `<div class="breakdown-empty">No detailed data available</div>`
            }
          </div>
        </div>
      `;
    })
    .join("");

  requestAnimationFrame(() => {
    container.querySelectorAll(".sector-fill").forEach(fill => {
      fill.style.width = fill.dataset.width;
    });
  });
}

function renderBreakdown(detail) {
  const percentage = Number(detail.percentage) || 0;

  return `
    <div class="breakdown-row">
      <span>${detail.name}</span>
      <span>${formatPercent(percentage)}</span>
    </div>

    <div class="breakdown-bar">
      <div style="width: ${percentage}%"></div>
    </div>
  `;
}

document.getElementById("sector-content")?.addEventListener("click", event => {
  const row = event.target.closest(".sector-row");

  if (!row) return;

  row.dataset.expanded = String(row.dataset.expanded !== "true");
});