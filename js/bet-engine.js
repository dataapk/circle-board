// ===============================
// 🪙 GLOBAL STATE (iGaming CORE)
// ===============================

let chipSound = null;
let spinSound = null;

let selectedChip = null;
let selectedSymbol = null;

// ===============================
// 🎯 BET STORAGE
// ===============================

const bets = {};
const betHistory = [];

// ===============================
// 🪙 CHIP MAP
// ===============================

const chipMap = {
    "0.10": "assets/chip_0.10c.png",
    "0.20": "assets/chip_20c.png",
    "0.50": "assets/chip_50c.png",
    "1": "assets/chip_1.png",
    "2": "assets/chip_2.png",
    "5": "assets/chip_5.png"
};

// ===============================
// 🚀 SAFE INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    chipSound = document.getElementById("chipSound");
    spinSound = document.getElementById("spinSound");

    if (spinSound) {
        spinSound.volume = 0.7;
    }

    initChipSystem();

    console.log("🎰 Chip System Ready");
});

// ===============================
// 🪙 CHIP SYSTEM
// ===============================

function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    if (!container || !defaultChip) return;

    // DEFAULT CHIP OPEN/CLOSE
    defaultChip.addEventListener("click", (e) => {

        e.stopPropagation();

        container.classList.toggle("expanded");
        container.classList.toggle("collapsed");

    });

    // CHIP SELECT
    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            selectedChip = (chip.dataset.value || chip.getAttribute("data-value"))?.toString();

            // SWAP UI (if not default)
            if (!chip.classList.contains("default-chip")) {

                const defaultImg = defaultChip.querySelector("img");
                const defaultText = defaultChip.querySelector("span");

                const selectedImg = chip.querySelector("img");
                const selectedText = chip.querySelector("span");

                // swap image
                [defaultImg.src, selectedImg.src] = [selectedImg.src, defaultImg.src];

                // swap text
                [defaultText.textContent, selectedText.textContent] =
                [selectedText.textContent, defaultText.textContent];

                // swap value
                const tempValue = defaultChip.getAttribute("data-value");

                defaultChip.setAttribute(
                    "data-value",
                    chip.getAttribute("data-value")
                );

                chip.setAttribute("data-value", tempValue);

                // close container
                container.classList.remove("expanded");
                container.classList.add("collapsed");
            }

            // sound
            if (chipSound) {
                chipSound.currentTime = 0;
                chipSound.play().catch(() => {});
            }
        });
    });

    // OUTSIDE CLICK CLOSE
    document.addEventListener("click", () => {
        container.classList.remove("expanded");
        container.classList.add("collapsed");
    });
}

// ===============================
// 🎯 SYMBOL ENGINE
// ===============================

const symbolBoxes = document.querySelectorAll(".symbol-box");
const tableSound = new Audio("assets/table.mp3");
tableSound.volume = 0.35;

symbolBoxes.forEach(box => {

    box.addEventListener("click", () => {

        if (!selectedChip) return;

        tableSound.currentTime = 0;
        tableSound.play();

        symbolBoxes.forEach(item => item.classList.remove("active"));
        box.classList.add("active");

        selectedSymbol = box.dataset.symbol;

        const chipValue = parseFloat(selectedChip);

        if (!bets[selectedSymbol]) {
            bets[selectedSymbol] = {
                total: 0,
                chips: []
            };
        }

        bets[selectedSymbol].total += chipValue;
        bets[selectedSymbol].chips.push(selectedChip);

        betHistory.push({
            symbol: selectedSymbol,
            amount: chipValue
        });

        let marker = box.querySelector(".bet-marker");

        if (!marker) {
            marker = document.createElement("div");
            marker.className = "bet-marker";
            box.appendChild(marker);
        }

        marker.innerHTML = `
<div class="bet-total">
    $${bets[selectedSymbol].total.toFixed(2)}
</div>

<div class="chip-stack"></div>
`;

        const chipStack = marker.querySelector(".chip-stack");

        chipStack.innerHTML = "";

        const visibleChips = bets[selectedSymbol].chips.slice(-4);

        visibleChips.forEach((chipValue, index) => {

            const chipImg = document.createElement("img");

            chipImg.src = chipMap[String(chipValue)];
            chipImg.className = "stack-chip";

            chipImg.style.zIndex = index + 1;
            chipImg.style.bottom = `${index * 8}px`;

            chipStack.appendChild(chipImg);
        });

        console.log("Selected Symbol:", selectedSymbol);
        console.log("Chip Added:", chipValue);
    });
});
