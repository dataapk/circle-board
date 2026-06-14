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

    GameEngine.isSpinning = true;

    console.log("🎰 SPIN STARTED");

    if (typeof spinWheel === "function") {
        spinWheel();
    }

}


// ===============================
// 🎡 WHEEL ENGINE
// ===============================

let currentRotation = 0;

function spinWheel() {

    const wheel = document.getElementById("wheel");

    const randomAngle = Math.floor(Math.random() * 360);

    currentRotation += 3600 + randomAngle;

    wheel.style.transition = "transform 8s ease-out";
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {

        const result = Math.floor(randomAngle / 60);

        handleWheelResult(result);

    }, 8000);
}


// ===============================
// 🎯 RESULT + PAYOUT
// ===============================

function handleWheelResult(result) {

    console.log("🎯 RESULT:", result);

    let win = 0;

    for (let key in GameEngine.bets) {

        if (parseInt(key) === result) {
            win += GameEngine.bets[key] * 9;
        }
    }

    GameEngine.balance += win;

    GameEngine.bets = {};
    GameEngine.isSpinning = false;

    updateBalanceUI();

    console.log("💰 WIN:", win);
}


// ===============================
// 📊 UI UPDATE
// ===============================

function updateBalanceUI() {

    const el = document.getElementById("balanceAmount");

    if (!el) return;

    el.innerText = "$" + GameEngine.balance.toFixed(2);
}


// ===============================
// 🔊 SOUND HELPERS
// ===============================

function playChipSound() {

    if (!GameEngine.chipSound) return;

    GameEngine.chipSound.currentTime = 0;
    GameEngine.chipSound.play().catch(() => {});
}

function playSpinSound() {

    if (!GameEngine.spinSound) return;

    GameEngine.spinSound.currentTime = 0;
    GameEngine.spinSound.play().catch(() => {});
}


// ===============================
// 🌐 EXPORT (optional safe)
// ===============================

window.handleWheelResult = handleWheelResult;
