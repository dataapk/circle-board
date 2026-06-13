// ===============================
// 🪙 BET ENGINE (FINAL iGaming CORE)
// ===============================

let chipSound = null;
let selectedChip = null;

document.addEventListener("DOMContentLoaded", () => {

    chipSound = document.getElementById("chipSound");

    initChipSystem();

    setupOutsideClickClose();

});

// ===============================
// 🪙 INIT CHIP SYSTEM
// ===============================
function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    if (!container || !chips.length) return;

    // default state
    container.classList.add("collapsed");

    // =========================
    // DEFAULT CHIP → EXPAND
    // =========================
    if (defaultChip) {
        defaultChip.addEventListener("click", (e) => {
            e.stopPropagation();

            container.classList.toggle("expanded");
            container.classList.remove("collapsed");
        });
    }

    // =========================
    // CHIP SELECT SYSTEM
    // =========================
    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            // SOUND
            if (chipSound) {
                chipSound.currentTime = 0;
                chipSound.play();
            }

            // ACTIVE STATE
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            // STORE VALUE
            selectedChip = chip.getAttribute("data-value");

            // COLLAPSE AFTER SELECT
            container.classList.remove("expanded");
            container.classList.add("collapsed");

            console.log("Selected Chip:", selectedChip);

        });

    });

}

// ===============================
// 🪙 OUTSIDE CLICK → COLLAPSE
// ===============================
function setupOutsideClickClose() {

    document.addEventListener("click", () => {

        const container = document.querySelector(".chips-container");

        if (!container) return;

        container.classList.remove("expanded");
        container.classList.add("collapsed");

    });

}
