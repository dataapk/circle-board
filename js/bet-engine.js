// ===============================
// 🎰 iGaming CORE ENGINE (STABLE FINAL)
// ===============================

// ===============================
// 🧠 GAME STATE
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

    GameState.chipSound =
        document.getElementById("chipSound");

    GameState.spinSound =
        document.getElementById("spinSound");

    if (GameState.spinSound) {
        GameState.spinSound.volume = 0.7;
    }

    initChipSystem();

    console.log("🎰 iGaming CORE READY");

});
// ===============================
// 🪙 CHIP SYSTEM
// ===============================
function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    if (!container || !chips.length || !defaultChip) {
        console.log("CHIP SYSTEM ERROR: missing DOM");
        return;
    }

    // TOGGLE
    defaultChip.addEventListener("click", (e) => {

    console.log("DEFAULT CHIP CLICKED");

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

            GameState.selectedChip = chip.dataset.value;

            // SWAP UI (optional casino effect)
            if (!chip.classList.contains("default-chip")) {

                const img1 = defaultChip.querySelector("img");
                const txt1 = defaultChip.querySelector("span");

                const img2 = chip.querySelector("img");
                const txt2 = chip.querySelector("span");

                [img1.src, img2.src] = [img2.src, img1.src];
                [txt1.textContent, txt2.textContent] = [txt2.textContent, txt1.textContent];

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

// ===============================
// 🎯 SYMBOL + BET SYSTEM
// ===============================
function initSymbolSystem() {

    const boxes = document.querySelectorAll(".symbol-box");
    const tableSound = new Audio("assets/table.mp3");
    tableSound.volume = 0.35;

    if (!boxes.length) return;

    boxes.forEach(box => {

        box.addEventListener("click", () => {

            if (!GameState.selectedChip) return;

            const symbol = box.dataset.symbol;

            GameState.selectedSymbol = symbol;

            tableSound.currentTime = 0;
            tableSound.play();

            boxes.forEach(b => b.classList.remove("active"));
            box.classList.add("active");

            const chipValue = parseFloat(GameState.selectedChip);

            // INIT BET OBJECT
            if (!GameState.bets[symbol]) {
                GameState.bets[symbol] = {
                    total: 0,
                    chips: []
                };
            }

            const bet = GameState.bets[symbol];

            bet.total += chipValue;
            bet.chips.push(GameState.selectedChip);

            GameState.betHistory.push({
                symbol,
                amount: chipValue
            });

            // ===============================
            // 🎯 BET MARKER UI
            // ===============================
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

            const stack = marker.querySelector(".chip-stack");
            stack.innerHTML = "";

            bet.chips.slice(-4).forEach((v, i) => {

                const img = document.createElement("img");

                img.src = chipMap[String(v)];
                img.className = "stack-chip";

                img.style.bottom = `${i * 8}px`;
                img.style.zIndex = i + 1;

                stack.appendChild(img);
            });

            console.log("BET PLACED:", symbol, chipValue);
        });
    });
}
