import {
  fetchCountryTotal,
  fetchAllTradePartners,
  fetchAllTradeSectors,
  fetchBilateralPartners,
  fetchBilateralSectors
} from "../services/api.js";

import {
  updateCountryPanel
} from "../presenters/countryPresenter.js";

import {
  updateSectorPanel
} from "../presenters/sectorPresenter.js";

import {
  updateCountryOverview
} from "../presenters/overviewPresenter.js";

import { state } from "../state/state.js";


/* ==========================================================================
   Set Pending Country
   ========================================================================== */

export function setPendingCountry(
  iso,
  name
) {
  state.pendingISO = iso;
  state.pendingCountryName = name;
}


/* ==========================================================================
   Clear Country Selection
   ========================================================================== */

export function clearCountrySelection() {

  state.selectedISO = null;

  state.selectedCountryName = null;

  state.pendingISO = null;

  state.pendingCountryName = null;

  state.partners = new Map();

  state.bilateralLinks = [];
}


/* ==========================================================================
   Load Country Totals
   ========================================================================== */

export async function loadCountryTotal(
  iso,
  name
) {

  try {

    const [
      exportResult,
      importResult
    ] = await Promise.all([

      fetchCountryTotal(
        iso,
        "export",
        state.year
      ),

      fetchCountryTotal(
        iso,
        "import",
        state.year
      )

    ]);

    const exportsTotal =
      Number(exportResult?.total) || 0;

    const importsTotal =
      Number(importResult?.total) || 0;

    updateCountryOverview(
      name,
      exportsTotal,
      importsTotal
    );

  } catch (error) {

    console.error(
      "Failed to load country totals:",
      error
    );

    updateCountryOverview(
      name,
      0,
      0
    );
  }
}


/* ==========================================================================
   Load Bilateral Links
   ========================================================================== */

/*
  Loads bilateral data for every link in state.links.

  Each link becomes:

  {
    from,
    to,
    value,
    sectors
  }

  Example:

  FIN → NOR

  {
    from: "FI",
    to: "NO",
    value: 1234567890,
    sectors: [
      {
        sector: "manufacturing",
        value: 52
      },
      ...
    ]
  }
*/

async function loadBilateralLinks() {

  if (
    !state.links ||
    state.links.length === 0
  ) {
    return [];
  }


  const results =
    await Promise.all(
      state.links.map(async link => {

        try {

          const [
            partnerResult,
            sectorResult
          ] = await Promise.all([

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

            from:
              link.from,

            to:
              link.to,

            /*
              Preserve null instead of converting
              missing bilateral data into zero.
            */

            value:
              partnerResult?.value == null
                ? null
                : Number(
                    partnerResult.value
                  ),

            sectors:
              Array.isArray(sectorResult)
                ? sectorResult
                : []

          };

        } catch (error) {

          console.error(
            "Failed to load bilateral link:",
            link,
            error
          );

          return {

            from:
              link.from,

            to:
              link.to,

            value:
              null,

            sectors:
              []

          };

        }

      })
    );


  return results;
}


/* ==========================================================================
   Build Bilateral Country Bars
   ========================================================================== */

/*
  Converts:

  [
    {
      from: "FI",
      to: "SE",
      value: 100000000
    },
    {
      from: "FI",
      to: "NO",
      value: 50000000
    }
  ]

  into:

  [
    {
      iso: "SE",
      value: 100000000
    },
    {
      iso: "NO",
      value: 50000000
    }
  ]

  This is exactly the format expected
  by updateCountryPanel().
*/

function buildBilateralCountryBars(
  links
) {

  return links

    .filter(link =>
      link.to &&
      link.value != null &&
      Number.isFinite(
        Number(link.value)
      )
    )

    .map(link => ({

      iso:
        link.to,

      value:
        Number(link.value)

    }));

}


/* ==========================================================================
   Build Bilateral Partner Map
   ========================================================================== */

function buildBilateralPartnerMap(
  countries
) {

  const partnerMap =
    new Map();

  countries.forEach(country => {

    if (!country.iso) {
      return;
    }

    partnerMap.set(
      country.iso,
      country.value
    );

  });

  return partnerMap;
}


/* ==========================================================================
   Combine Bilateral Sectors
   ========================================================================== */

/*
  IMPORTANT:

  fetchBilateralSectors() returns percentages.

  Example:

  FI → SE
    manufacturing = 60%
    chemicals     = 40%

  FI → NO
    manufacturing = 20%
    chemicals     = 80%

  If:

    FI → SE = €1000
    FI → NO = €500

  We must NOT simply do:

    60 + 20 = 80%

  because the bilateral trade values are different.

  Instead:

    SE manufacturing:
      €1000 × 60% = €600

    NO manufacturing:
      €500 × 20% = €100

    Combined:
      €700 / €1500 = 46.67%

  This function performs that weighted calculation.
*/

function combineBilateralSectors(
  links
) {

  const sectorTotals = {};

  let totalTrade =
    0;


  links.forEach(link => {

    const tradeValue =
      Number(link.value);


    /*
      Ignore links where bilateral
      trade data is unavailable.
    */

    if (
      !Number.isFinite(tradeValue) ||
      tradeValue <= 0
    ) {
      return;
    }


    const sectors =
      Array.isArray(link.sectors)
        ? link.sectors
        : [];


    if (sectors.length === 0) {
      return;
    }


    totalTrade +=
      tradeValue;


    sectors.forEach(sector => {

      const sectorName =
        sector.sector ||
        sector.name;


      if (!sectorName) {
        return;
      }


      const percentage =
        Number(sector.value);


      if (
        !Number.isFinite(
          percentage
        )
      ) {
        return;
      }


      /*
        Convert the percentage back
        into an approximate absolute
        bilateral trade amount.
      */

      const absoluteValue =
        tradeValue *
        (percentage / 100);


      sectorTotals[sectorName] =
        (
          sectorTotals[sectorName] || 0
        ) +
        absoluteValue;

    });

  });


  /*
    No valid bilateral trade.
  */

  if (
    totalTrade <= 0
  ) {
    return [];
  }


  /*
    Convert weighted absolute values
    back into percentages.
  */

  return Object.entries(
    sectorTotals
  )

    .map(
      ([sector, value]) => ({

        sector,

        value:
          (
            value /
            totalTrade
          ) * 100

      })
    )

    .sort(
      (a, b) =>
        Number(b.value) -
        Number(a.value)
    );

}


/* ==========================================================================
   Apply Country Trade
   ========================================================================== */

/*
  NORMAL MODE:

    No bilateral links
        ↓
    All partners
    All sectors


  BILATERAL MODE:

    state.links exists
        ↓
    Bilateral partners
    Bilateral sectors
        ↓
    Country bars show bilateral partners
    Sector bars show combined bilateral sectors
*/

export async function applyCountryTrade(
  iso,
  name
) {

  /* ==========================================================================
     Loading State
     ========================================================================== */

  updateCountryPanel(
    null,
    {
      loading: true
    }
  );


  updateSectorPanel(
    null,
    {
      loading: true
    }
  );


  try {

    /* ==========================================================================
       BILATERAL MODE
       ========================================================================== */

    if (
      state.links &&
      state.links.length > 0
    ) {

      console.log(
        "Applying bilateral trade:",
        state.links
      );


      /* ----------------------------------------------------------------------
         Fetch bilateral data
         ---------------------------------------------------------------------- */

      const bilateralLinks =
        await loadBilateralLinks();


      console.log(
        "Bilateral trade results:",
        bilateralLinks
      );


      /* ----------------------------------------------------------------------
         Store bilateral data
         ---------------------------------------------------------------------- */

      state.bilateralLinks =
        bilateralLinks;


      /* ----------------------------------------------------------------------
         Country selection
         ---------------------------------------------------------------------- */

      state.selectedISO =
        iso;

      state.selectedCountryName =
        name;


      /* ----------------------------------------------------------------------
         Build country bars
         ---------------------------------------------------------------------- */

      const bilateralCountries =
        buildBilateralCountryBars(
          bilateralLinks
        );


      /* ----------------------------------------------------------------------
         Build partner map
         ---------------------------------------------------------------------- */

      state.partners =
        buildBilateralPartnerMap(
          bilateralCountries
        );


      /* ----------------------------------------------------------------------
         Build combined sectors
         ---------------------------------------------------------------------- */

      const bilateralSectors =
        combineBilateralSectors(
          bilateralLinks
        );


      console.log(
        "Bilateral country bars:",
        bilateralCountries
      );

      console.log(
        "Bilateral sector bars:",
        bilateralSectors
      );


      /* ----------------------------------------------------------------------
         Render bilateral country bars
         ---------------------------------------------------------------------- */

      updateCountryPanel(
        bilateralCountries,
        {
          valueType: "currency"
        }
      );


      /* ----------------------------------------------------------------------
         Render bilateral sector bars
         ---------------------------------------------------------------------- */

      updateSectorPanel(
        bilateralSectors
      );


      return;
    }


    /* ==========================================================================
       NORMAL ALL-COUNTRY MODE
       ========================================================================== */

    const [
      partners,
      sectors
    ] = await Promise.all([

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


    /* ----------------------------------------------------------------------
       Build Partner Map
       ---------------------------------------------------------------------- */

    const partnerMap =
      new Map();


    partners.forEach(
      partner => {

        const key =
          partner.iso ||
          partner.country;


        if (key) {

          partnerMap.set(
            key,
            partner.value
          );

        }

      }
    );


    /* ----------------------------------------------------------------------
       Country Is Now Officially Selected
       ---------------------------------------------------------------------- */

    state.selectedISO =
      iso;

    state.selectedCountryName =
      name;


    state.partners =
      partnerMap;


    /* ----------------------------------------------------------------------
       Clear old bilateral data
       ---------------------------------------------------------------------- */

    state.bilateralLinks =
      [];


    /* ----------------------------------------------------------------------
       Render Top Countries
       ---------------------------------------------------------------------- */

    updateCountryPanel(
      partners,
      {
        valueType: "currency"
      }
    );


    /* ----------------------------------------------------------------------
       Render Top Sectors
       ---------------------------------------------------------------------- */

    updateSectorPanel(
      sectors
    );

  } catch (error) {

    console.error(
      "Failed to load country trade:",
      error
    );


    updateCountryPanel(
      null,
      {
        error: true
      }
    );


    updateSectorPanel(
      null,
      {
        error: true
      }
    );

  }

}