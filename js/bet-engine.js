 // ===============================
// 🪙 GLOBAL STATE (iGaming CORE)
// ===============================
const GameState = {
    chipSound: null,      // chip click sound
    spinSound: null,      // spin sound
    selectedChip: null,   // currently selected chip value
    selectedSymbol: null, // which box user clicked
    bets: {},             // all bets stored here
    betHistory: []        // full history tracking
};
const chipMap = {
    "0.10": "assets/chip_0.10c.png",
    "0.20": "assets/chip_20c.png",
    "0.50": "assets/chip_50c.png",
    "1": "assets/chip_1.png",
    "2": "assets/chip_2.png",
    "5": "assets/chip_5.png"
};
// ===============================
// 🚀 SAFE GAME INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    chipSound = document.getElementById("chipSound");
    spinSound = document.getElementById("spinSound");

    if (chipSound) {

    console.log("Chip Clicked");
    console.log(chipSound);

    chipSound.currentTime = 0;
    chipSound.play().catch(() => {});

    }
    if (spinSound) {
        spinSound.volume = 0.7;
    }

    initChipSystem();

    console.log("🎰 Chip System Ready");

});
// START: PREMIUM SYMBOL ENGINE

const symbolBoxes =
document.querySelectorAll(
    ".symbol-box"
);

const tableSound =
new Audio(
    "assets/table.mp3"
);

tableSound.volume = 0.35;

let selectedSymbol = null;

symbolBoxes.forEach(box => {

    box.addEventListener(
        "click",
        () => {

            tableSound.currentTime = 0;

            tableSound.play();

            symbolBoxes.forEach(item => {
                item.classList.remove(
                    "active"
                );
            });

            box.classList.add(
                "active"
            );

            selectedSymbol =
            box.dataset.symbol;

            console.log(
                "Selected Symbol:",
                selectedSymbol
            );

        }
    );

});

// END: PREMIUM SYMBOL ENGINE
// START: BET MARKER

if(selectedChip){

    const oldMarker =
    box.querySelector(
        ".bet-marker"
    );

    if(oldMarker){

        oldMarker.remove();
    }

    const marker =
    document.createElement(
        "div"
    );

    marker.className =
    "bet-marker";

    marker.textContent =
    selectedChip;

    box.appendChild(
        marker
    );
}

// END: BET MARKER

// ===============================
// 🪙 CHIP SYSTEM
// ===============================
// ===============================
// 🪙 CHIP SYSTEM
// ===============================

function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    if (!container || !chips.length || !defaultChip) return;

    // DEFAULT TOGGLE
    defaultChip.addEventListener("click", (e) => {
        e.stopPropagation();
        container.classList.toggle("expanded");
        container.classList.toggle("collapsed");
    });

    // CHIP CLICK
    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            GameState.selectedChip = chip.dataset.value;

            // SWAP UI
            if (!chip.classList.contains("default-chip")) {

                const defaultImg = defaultChip.querySelector("img");
                const defaultText = defaultChip.querySelector("span");

                const selectedImg = chip.querySelector("img");
                const selectedText = chip.querySelector("span");

                [defaultImg.src, selectedImg.src] =
                [selectedImg.src, defaultImg.src];

                [defaultText.textContent, selectedText.textContent] =
                [selectedText.textContent, defaultText.textContent];

                const temp = defaultChip.dataset.value;
                defaultChip.dataset.value = chip.dataset.value;
                chip.dataset.value = temp;
            }

            // SOUND
            if (GameState.chipSound) {
                GameState.chipSound.currentTime = 0;
                GameState.chipSound.play().catch(()=>{});
            }

            container.classList.remove("expanded");
            container.classList.add("collapsed");
        });
    });

    document.addEventListener("click", () => {
        container.classList.remove("expanded");
        container.classList.add("collapsed");
    });
}
