import { EXPORTS_URL } from "../config/paths.js";
import { fetchAllCountriesTotals } from "../services/api.js";
import { updateTradePanel } from "../render/barRenderer.js";
import { state } from "../state/state.js";


async function getTotals() {
    if (state.year === 2025) {
        const res = await fetch(EXPORTS_URL);
        return res.json();
    }

    return fetchAllCountriesTotals(
        state.mode,
        state.year
    );
}


export async function initBars() {

    try {

        const totals = await getTotals();


        const countries = totals.map(country => ({
            iso: country.iso || country.country,
            value: country.total
        }));


        updateTradePanel(
            "World",
            countries
        );


    } catch(error) {

        console.error(error);

        updateTradePanel(
            "World",
            [],
            {
                error:true
            }
        );
    }
}