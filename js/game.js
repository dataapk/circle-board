// ======================================================
// 🎮 GAME.JS (FINAL CLEAN ENGINE)
// CHIP → BET → SPIN → RESULT → PAYOUT
// ======================================================


// ===============================
// 🧠 GLOBAL STATE LINK
// ===============================

window.GameEngine = window.GameEngine || {};

GameEngine.selectedChip = null;
GameEngine.bets = {};
GameEngine.isSpinning = false;
GameEngine.balance = GameEngine.balance || 1000;


// ===============================
// 🚀 INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    initChipSystem();
    setupBoardSystem();
    setupSpinButton();

    updateBalanceUI();

    console.log("🎮 GAME READY");
});


// ===============================
// 🪙 CHIP SYSTEM
// ===============================

function initChipSystem() {

    const chips = document.querySelectorAll(".chip");

    chips.forEach(chip => {

        chip.addEventListener("click", () => {

            GameEngine.selectedChip = {
                value: parseFloat(chip.dataset.value),
                element: chip
            };

            console.log("🪙 CHIP:", GameEngine.selectedChip.value);

            playChipSound();
        });
    });
}


// ===============================
// 🎯 BOARD SYSTEM
// ===============================

function setupBoardSystem() {

    const boxes = document.querySelectorAll(".symbol-box");

    boxes.forEach(box => {

        box.addEventListener("click", () => {

            const symbol = box.dataset.symbol;
            placeBet(symbol);
        });
    });
}


// ===============================
// 💰 PLACE BET
// ===============================

function placeBet(symbol) {

    if (!GameEngine.selectedChip) {
        console.log("❌ Select chip first");
        return;
    }

    if (GameEngine.isSpinning) {
        console.log("❌ Wait for spin");
        return;
    }

    const amount = GameEngine.selectedChip.value;

    if (GameEngine.balance < amount) {
        console.log("❌ Not enough balance");
        return;
    }

    GameEngine.balance -= amount;

    if (!GameEngine.bets[symbol]) {
        GameEngine.bets[symbol] = 0;
    }

    GameEngine.bets[symbol] += amount;

    updateBalanceUI();

    console.log("💰 BET:", symbol, amount);
}


// ===============================
// 🎰 SPIN BUTTON
// ===============================

function setupSpinButton() {

    const btn = document.getElementById("spinBtn");

    if (!btn) return;

    btn.addEventListener("click", spinGame);
}


// ===============================
// 🎰 SPIN GAME
// ===============================

function spinGame() {

    console.log("🔥 spinGame() RUNNING");

    if (GameEngine.isSpinning) return;

    if (!GameEngine.selectedChip) {
        console.log("❌ Select chip first");
        return;
    }

    GameEngine.isSpinning = true;

    playSpinSound();

    spinWheel();
}

// ===============================
// 🌐 EXPORT (optional safe)
// ===============================

window.handleWheelResult = handleWheelResult;
