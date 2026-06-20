// ======================================================
// 🎮 START: PRO CASINO GAME.JS (FULL SYSTEM LAYER)
// ======================================================

console.log("🎮 GAME JS LOADED");

// ======================================================
// 🚀 DOM READY BOOT
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 DOM READY");

    initGame();

});

// ======================================================
// 🎮 START: GAME INIT CORE
// ======================================================
function initGame() {

    console.log("🧠 GAME INIT START");

    initAudio();
    initTableSystem();
    setupSpinButton();
    initWheelSystem();

    updateBalanceUI();

    console.log("✔ GAME READY");
}

// ======================================================
// 💰 BALANCE UI SYSTEM
// ======================================================
function updateBalanceUI() {

    const el = document.getElementById("balance");
    if (!el) return;

    el.innerText = "$" + GameEngine.getBalance().toFixed(2);
}

// ======================================================
// 🎯 TABLE SYSTEM (BET PLACE)
// ======================================================
function initTableSystem() {

    const cells = document.querySelectorAll(".bet-cell");

    cells.forEach(cell => {

        cell.addEventListener("click", () => {

            if (GameEngine.getState().isSpinning) {
                console.log("⛔ GAME LOCKED");
                return;
            }

            const type = cell.getAttribute("data-type");

            const chipValue = GameEngine.selectedChip || 1;

            const res = GameEngine.placeBet(type, chipValue);

            if (!res.success) {
                console.log("❌ BET FAILED:", res.reason);
                return;
            }

            console.log("💰 BET:", type, chipValue);

            updateBalanceUI();

            playSound("chip");
        });
    });
}

// ======================================================
// 🎡 SPIN SYSTEM
// ======================================================
function setupSpinButton() {

    const btn = document.getElementById("spinBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {

        startSpin();
    });
}

// ======================================================
// 🔥 START SPIN FLOW
// ======================================================
function startSpin() {

    if (GameEngine.getState().isSpinning) {
        console.log("⛔ ALREADY SPINNING");
        return;
    }

    if (Object.keys(GameEngine.getState().bets).length === 0) {
        console.log("❌ NO BETS");
        return;
    }

    GameEngine.lockGame();

    playSound("spin");

    console.log("🔥 SPIN STARTED");

    const angle = Math.random() * 3600;

    animateWheel(angle, () => {

        const result = getResultFromAngle(angle);

        onSpinEnd(result);
    });
}

// ======================================================
// 🎡 WHEEL LOGIC
// ======================================================
function initWheelSystem() {
    console.log("🎡 WHEEL SYSTEM READY");
}

function getResultFromAngle(angle) {

    const symbols = ["heart","diamond","club","spade","crown","flag"];

    const index = Math.floor((angle % 360) / (360 / symbols.length));

    return symbols[index];
}

// ======================================================
// 🏁 SPIN END FLOW
// ======================================================
function onSpinEnd(result) {

    console.log("🎯 RESULT:", result);

    const res = GameEngine.resolvePayout(result);

    updateBalanceUI();

    if (res.win > 0) {
        playSound("win");
    } else {
        playSound("lose");
    }

    resetRoundUI();

    console.log("✔ ROUND COMPLETE");
}

// ======================================================
// 🧹 ROUND RESET
// ======================================================
function resetRoundUI() {

    console.log("🧹 ROUND RESET");

    const cells = document.querySelectorAll(".bet-cell");

    cells.forEach(c => {
        c.innerText = "";
    });
}

// ======================================================
// 🎡 WHEEL ANIMATION
// ======================================================
function animateWheel(angle, callback) {

    console.log("🎡 SPINNING:", angle);

    setTimeout(() => {
        callback();
    }, 2000);
}

// ======================================================
// 🔊 AUDIO SYSTEM
// ======================================================
function initAudio() {

    window.sounds = {
        chip: new Audio("chip.mp3"),
        spin: new Audio("spin.mp3"),
        win: new Audio("win.mp3"),
        lose: new Audio("lose.mp3")
    };

    console.log("🔊 AUDIO READY");
}

function playSound(key) {

    const s = window.sounds?.[key];
    if (!s) return;

    s.currentTime = 0;
    s.play().catch(() => {});
}

// ======================================================
// 🎮 END: PRO CASINO GAME.JS
// ======================================================
