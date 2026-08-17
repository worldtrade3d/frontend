export function initSettings() {
    const panel = document.getElementById("settings-panel");
    const toggle = document.getElementById("settings-toggle");
    const infoButton = document.getElementById("info-button");
    const infoLogos = document.getElementById("info-logos");

    toggle.addEventListener("click", () => {
        panel.classList.toggle("collapsed");
        toggle.textContent = panel.classList.contains("collapsed") ? "▶" : "◀";
    });

    infoButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        infoLogos.hidden = !infoLogos.hidden;
    });

    document.addEventListener("click", (event) => {
        if (
            !infoLogos.hidden &&
            !infoLogos.contains(event.target) &&
            !infoButton.contains(event.target)
        ) {
            infoLogos.hidden = true;
        }
    });
}