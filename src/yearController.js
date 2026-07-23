let selectedYear = new Date().getFullYear();

export function initYear() {

    const prevYear = document.getElementById("prev-year");
    const currentYear = document.getElementById("current-year");
    const nextYear = document.getElementById("next-year");

    function updateYear() {
        prevYear.textContent = selectedYear - 1;
        currentYear.textContent = selectedYear;
        nextYear.textContent = selectedYear + 1;
    }

    prevYear.addEventListener("click", () => {
        selectedYear--;
        updateYear();
    });


    nextYear.addEventListener("click", () => {
        selectedYear++;
        updateYear();
    });


    updateYear();
}


export function getYear() {
    return selectedYear;
}