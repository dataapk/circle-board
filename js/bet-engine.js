// ===============================
// 🎰 iGaming BET ENGINE v2 (CLEAN CORE)
// ===============================

// ===============================
// 🧠 GAME STATE (NO DUPLICATION)
// ===============================

const GameState = {
    chipSound: null,
    spinSound: null,
    selectedChip: null,
    selectedSymbol: null,
    bets: {},
    betHistory: []
};

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
// 🚀 INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    GameState.chipSound = document.getElementById("chipSound");
    GameState.spinSound = document.getElementById("spinSound");

    if (GameState.spinSound) {
        GameState.spinSound.volume = 0.7;
    }

    initChipSystem();
    initSymbolEngine();

    console.log("🎰 iGaming Engine v2 Ready");
});

// ===============================
// 🪙 CHIP SYSTEM
// ===============================

function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    if (!container || !defaultChip) return;

    defaultChip.addEventListener("click", (e) => {
        e.stopPropagation();
        container.classList.toggle("expanded");
        container.classList.toggle("collapsed");
    });

    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            GameState.selectedChip =
                (chip.dataset.value || chip.getAttribute("data-value"))?.toString();

            // swap UI (if not default)
            if (!chip.classList.contains("default-chip")) {

                const defaultImg = defaultChip.querySelector("img");
                const defaultText = defaultChip.querySelector("span");

                const selectedImg = chip.querySelector("img");
                const selectedText = chip.querySelector("span");

                [defaultImg.src, selectedImg.src] =
                [selectedImg.src, defaultImg.src];

                [defaultText.textContent, selectedText.textContent] =
                [selectedText.textContent, defaultText.textContent];

                const tempValue = defaultChip.getAttribute("data-value");

                defaultChip.setAttribute(
                    "data-value",
                    chip.getAttribute("data-value")
                );

                chip.setAttribute("data-value", tempValue);

                container.classList.remove("expanded");
                container.classList.add("collapsed");
            }

            // SOUND SAFE
            if (GameState.chipSound) {
                GameState.chipSound.currentTime = 0;
                GameState.chipSound.play().catch(() => {});
            }
        });
    });

    document.addEventListener("click", () => {
        container.classList.remove("expanded");
        container.classList.add("collapsed");
    });
}

// ===============================
// 🎯 SYMBOL ENGINE
// ===============================

function initSymbolEngine() {

    const symbolBoxes = document.querySelectorAll(".symbol-box");
    const tableSound = new Audio("assets/table.mp3");
    tableSound.volume = 0.35;

    symbolBoxes.forEach(box => {

        box.addEventListener("click", () => {

            if (!GameState.selectedChip) return;

            tableSound.currentTime = 0;
            tableSound.play();

            symbolBoxes.forEach(b => b.classList.remove("active"));
            box.classList.add("active");

            GameState.selectedSymbol = box.dataset.symbol;

            const chipValue = parseFloat(GameState.selectedChip);

            if (!GameState.bets[GameState.selectedSymbol]) {
                GameState.bets[GameState.selectedSymbol] = {
                    total: 0,
                    chips: []
                };
            }

            const bet = GameState.bets[GameState.selectedSymbol];

            bet.total += chipValue;
            bet.chips.push(GameState.selectedChip);

            GameState.betHistory.push({
                symbol: GameState.selectedSymbol,
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
    $${bet.total.toFixed(2)}
</div>

<div class="chip-stack"></div>
`;

            const chipStack = marker.querySelector(".chip-stack");
            chipStack.innerHTML = "";

            bet.chips.slice(-4).forEach((chipValue, index) => {

                const chipImg = document.createElement("img");

                chipImg.src = chipMap[String(chipValue)];
                chipImg.className = "stack-chip";

                chipImg.style.zIndex = index + 1;
                chipImg.style.bottom = `${index * 8}px`;

                chipStack.appendChild(chipImg);
            });

            console.log("Bet placed:", GameState.selectedSymbol, chipValue);
        });
    });
}
