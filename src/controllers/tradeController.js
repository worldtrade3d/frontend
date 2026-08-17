import { fetchAllCountriesTotals, fetchCountryTotal, fetchAllTradePartners, fetchAllTradeSectors, fetchBilateralPartners, fetchBilateralSectors } from "../services/api.js";
import { updateCountryPanel } from "../presenters/countryPresenter.js";
import { updateSectorPanel } from "../presenters/sectorPresenter.js";
import { updateCountryOverview } from "../presenters/overviewPresenter.js";
import { state } from "../config/state.js";

export function setPendingCountry(iso, name) {
  state.pendingISO = iso;
  state.pendingCountryName = name;
}

export function clearCountrySelection() {
  state.selectedISO = null;
  state.selectedCountryName = null;
  state.pendingISO = null;
  state.pendingCountryName = null;
  state.partners = new Map();
  state.bilateralLinks = [];
}

export async function loadCountryTotal(iso, name) {
  updateCountryOverview(name, 0, 0, { loading: true });

  try {
    const [exportResult, importResult] = await Promise.all([
      fetchCountryTotal(iso, "export", state.year),
      fetchCountryTotal(iso, "import", state.year)
    ]);

    const exportsTotal = Number(exportResult?.total) || 0;
    const importsTotal = Number(importResult?.total) || 0;

    updateCountryOverview(name, exportsTotal, importsTotal);
  } catch {
    updateCountryOverview(name, 0, 0);
  }
}

async function loadBilateralLinks() {
  if (!state.links?.length) return [];

  return Promise.all(
    state.links.map(async link => {
      try {
        const [partnerResult, sectorResult] = await Promise.all([
          fetchBilateralPartners(
            link.from,
            link.to,
            state.mode,
            state.year
          ),
          fetchBilateralSectors(
            link.from,
            link.to,
            state.mode,
            state.year
          )
        ]);

        return {
          from: link.from,
          to: link.to,
          value:
            partnerResult?.value == null
              ? null
              : Number(partnerResult.value),
          sectors: Array.isArray(sectorResult) ? sectorResult : []
        };
      } catch {
        return {
          from: link.from,
          to: link.to,
          value: null,
          sectors: []
        };
      }
    })
  );
}

function buildBilateralCountryBars(links) {
  return links
    .filter(
      link =>
        link.to &&
        link.value != null &&
        Number.isFinite(Number(link.value))
    )
    .map(link => ({
      iso: link.to,
      value: Number(link.value)
    }));
}

function buildBilateralPartnerMap(countries) {
  const partnerMap = new Map();

  countries.forEach(country => {
    if (country.iso) {
      partnerMap.set(country.iso, country.value);
    }
  });

  return partnerMap;
}

function combineBilateralSectors(links) {
  const sectorTotals = {};
  let totalTrade = 0;

  links.forEach(link => {
    const tradeValue = Number(link.value);

    if (!Number.isFinite(tradeValue) || tradeValue <= 0) return;

    const sectors =
      Array.isArray(link.sectors)
        ? link.sectors
        : [];

    if (!sectors.length) return;

    totalTrade += tradeValue;

    sectors.forEach(sector => {
      const sectorName =
        sector.sector || sector.name;

      if (!sectorName) return;

      const percentage =
        Number(sector.percentage ?? sector.value);

      if (!Number.isFinite(percentage)) return;

      const absoluteValue =
        tradeValue * (percentage / 100);

      // ------------------------------------------------------------
      // CREATE SECTOR
      // ------------------------------------------------------------

      if (!sectorTotals[sectorName]) {
        sectorTotals[sectorName] = {
          value: 0,
          details: {}
        };
      }

      sectorTotals[sectorName].value +=
        absoluteValue;


      // ------------------------------------------------------------
      // COMBINE HS-2 DETAILS
      // ------------------------------------------------------------

      const details =
        Array.isArray(sector.details)
          ? sector.details
          : [];

      details.forEach(detail => {
        const detailName =
          detail.name ||
          detail.label ||
          detail.code;

        if (!detailName) return;

        const detailPercentage =
          Number(
            detail.percentage ??
            detail.value
          );

        if (!Number.isFinite(detailPercentage)) {
          return;
        }

        const detailAbsoluteValue =
          absoluteValue *
          (detailPercentage / 100);

        if (
          !sectorTotals[sectorName]
            .details[detailName]
        ) {
          sectorTotals[sectorName]
            .details[detailName] = 0;
        }

        sectorTotals[sectorName]
          .details[detailName] +=
            detailAbsoluteValue;
      });
    });
  });


  if (totalTrade <= 0) return [];


  // ------------------------------------------------------------
  // BUILD FINAL SECTOR DATA
  // ------------------------------------------------------------

  return Object.entries(sectorTotals)
    .map(([sector, data]) => {

      const sectorPercentage =
        (data.value / totalTrade) * 100;


      const detailTotal =
        Object.values(data.details)
          .reduce(
            (sum, value) => sum + value,
            0
          );


      const details =
        Object.entries(data.details)
          .map(([name, value]) => ({
            name,
            percentage:
              detailTotal > 0
                ? (value / detailTotal) * 100
                : 0
          }))
          .sort(
            (a, b) =>
              b.percentage -
              a.percentage
          );


      return {
        sector,
        percentage: sectorPercentage,
        details
      };
    })
    .sort(
      (a, b) =>
        b.percentage -
        a.percentage
    );
}

export async function applyCountryTrade(iso, name) {
  updateCountryPanel(null, { loading: true });
  updateSectorPanel(null, { loading: true });

  try {
    if (state.links?.length) {
      const bilateralLinks = await loadBilateralLinks();

      state.bilateralLinks = bilateralLinks;
      state.selectedISO = iso;
      state.selectedCountryName = name;

      const bilateralCountries =
        buildBilateralCountryBars(bilateralLinks);

      state.partners =
        buildBilateralPartnerMap(bilateralCountries);

      const bilateralSectors =
        combineBilateralSectors(bilateralLinks);

      updateCountryPanel(
        bilateralCountries,
        { valueType: "currency" }
      );

      updateSectorPanel(bilateralSectors);

      return;
    }

    const [partners, sectors] = await Promise.all([
      fetchAllTradePartners(
        iso,
        state.mode,
        state.year
      ),
      fetchAllTradeSectors(
        iso,
        state.mode,
        state.year
      )
    ]);

    const partnerMap = new Map();

    partners.forEach(partner => {
      const key = partner.iso || partner.country;

      if (key) {
        partnerMap.set(key, partner.value);
      }
    });

    state.selectedISO = iso;
    state.selectedCountryName = name;
    state.partners = partnerMap;
    state.bilateralLinks = [];

    updateCountryPanel(
      partners,
      { valueType: "currency" }
    );

    updateSectorPanel(sectors);
  } catch {
    updateCountryPanel(null, { error: true });
    updateSectorPanel(null, { error: true });
  }
}

export async function loadWorldTrade() {
  try {
    const response = await fetchAllCountriesTotals(state.mode, state.year);

    const totals = Array.isArray(response)
      ? response
      : response?.countries || response?.data || response?.results || [];

    const countries = totals
      .map(country => ({
        iso: country.iso || country.country || country.code,
        value: Number(country.total ?? country.value) || 0
      }))
      .filter(country => country.iso);

    updateCountryPanel(countries, { valueType: "currency" });
  } catch (error) {
    console.error("Failed to load world trade:", error);
    updateCountryPanel(null, { error: true });
  }
}