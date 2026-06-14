// ======================================================
// 🎮 GAME.JS (FINAL CLEAN VERSION)
// CHIP → BET → SPIN → RESULT → PAYOUT
// ======================================================


// ===============================
// 🚀 DOM READY ENTRY POINT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 DOM LOADED");

    initGame();

    console.log("🎮 GAME READY");
});


// ===============================
// 🚀 GAME INIT
// ===============================

function initGame() {

    try {

        console.log("🧠 INIT GAME START");

        initChipSystem();
        setupBoardSystem();
        setupSpinButton();
        updateBalanceUI();

        console.log("🎮 GAME READY SAFE");

    } catch (err) {
        console.log("💥 INIT ERROR:", err);
    }
}


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

            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            if (GameEngine.chipSound) {
                GameEngine.chipSound.currentTime = 0;
                GameEngine.chipSound.play().catch(()=>{});
            }

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

            placeBet(box.dataset.symbol);
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

    if (!btn) {
        console.log("❌ SPIN BUTTON NOT FOUND");
        return;
    }

    btn.addEventListener("click", spinGame);
}


// ===============================
// 🎰 SPIN GAME
// ===============================

function spinGame() {

    console.log("🔥 SPIN CLICKED");

    if (GameEngine.isSpinning) {
        console.log("❌ ALREADY SPINNING");
        return;
    }

    if (!GameEngine.selectedChip) {
        console.log("❌ Select chip first");
        return;
    }

    GameEngine.isSpinning = true;

    console.log("✅ SPIN STARTED");

    playSpinSound();

    spinWheel();
}
