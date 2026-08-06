import { fetchAllCountriesTotals } from "../services/api.js";
import { updateTradePanel } from "../render/barRenderer.js";
import { state } from "../state/state.js";

export async function initBars() {

    try {

        const totals = await fetchAllCountriesTotals(state.mode, state.year);

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