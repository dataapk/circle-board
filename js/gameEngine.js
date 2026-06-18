// ======================================================
// TOP GUARD
// ======================================================
if (window.__ENGINE_INIT__) {
    console.log("⚠ ENGINE ALREADY INIT - SKIP");
} else {
    window.__ENGINE_INIT__ = true;
}

// ======================================================
// GAME ENGINE (ONLY STATE)
// ======================================================
window.GameEngine = {

    // 💰 STATE
    balance: 1000,
    selectedChip: null,
    bets: {},

    // 🎰 GAME STATE
    isSpinning: false,
    lastResult: null,
    currentRotation: 0,
    spinDirection: 1,

    // 🔊 AUDIO REFERENCES
    chipSound: null,
    tableSound: null,
    spinButtonSound: null,
    spinSound: null,
    winSound: null,
    loseSound: null,

    // 🎧 AUDIO CONTROLLER
    audio: {

        play(sound) {
            if (!sound) return;
            sound.currentTime = 0;
            sound.play().catch(() => {});
        },

        stop(sound) {
            if (!sound) return;
            sound.pause();
            sound.currentTime = 0;
        }
    }
};

// ======================================================
// AUDIO INIT
// ======================================================
function initAudio() {

    GameEngine.chipSound = document.getElementById("chipSound");
    GameEngine.tableSound = document.getElementById("tableSound");
    GameEngine.spinButtonSound = document.getElementById("spinButtonSound");
    GameEngine.spinSound = document.getElementById("spinSound");
    GameEngine.winSound = document.getElementById("winSound");
    GameEngine.loseSound = document.getElementById("loseSound");

    console.log("🔊 AUDIO READY");
}

// ======================================================
// BET SYSTEM
// ======================================================
function resetBetsUI() {

    document.querySelectorAll(".chip").forEach(chip => {
        chip.remove();
    });

    GameEngine.selectedChip = null;
    GameEngine.bets = {};

    console.log("🧹 BOARD RESET");
}

// ======================================================
// ROUND FLOW (ONLY ONE VERSION)
// ======================================================
function resetWheelState() {

    GameEngine.isSpinning = false;
    GameEngine.currentRotation = 0;
    GameEngine.lastResult = null;

    if (GameEngine.spinSound) {
        GameEngine.spinSound.pause();
        GameEngine.spinSound.currentTime = 0;
    }

    console.log("🔄 WHEEL RESET COMPLETE");
}

function startNewRound() {

    GameEngine.bets = {};
    GameEngine.isSpinning = false;
    GameEngine.lastResult = null;

    console.log("🔄 NEW ROUND ACTIVE");
}

// ======================================================
// RESULT HANDLER
// ======================================================
function handleWheelResult(angle) {

    const symbols = ["heart","diamond","club","spade","crown","flag"];
    const index = Math.floor((angle % 360) / (360 / symbols.length));

    const result = symbols[index];

    GameEngine.lastResult = result;

    console.log("🎯 RESULT:", result);

    onSpinEnd(result);
}

// ======================================================
// PAYOUT FLOW (SINGLE CLEAN PATH)
// ======================================================
function onSpinEnd(result) {

    console.log("🏁 SPIN END");

    resolvePayout(result);
    resetWheelState();
    startNewRound();

    unlockGameUI?.();
    unlockBets?.();

    console.log("✔ READY NEXT ROUND");
}

// ======================================================
// PAYOUT ENGINE
// ======================================================
const PAYOUT_TABLE = {
    spade: 2,
    heart: 2,
    diamond: 2,
    club: 2,
    crown: 3,
    flag: 3
};

function calculateWin(resultSymbol) {

    let win = 0;

    for (const key in GameEngine.bets) {

        if (key === resultSymbol) {
            win += GameEngine.bets[key] * (PAYOUT_TABLE[key] || 0);
        }
    }

    return Math.round(win * 100) / 100;
}

function applyWin(amount) {

    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) return 0;

    GameEngine.balance =
        Math.round((GameEngine.balance + amount) * 100) / 100;

    updateBalanceUI?.();

    console.log("💰 WIN:", amount);

    return amount;
}

function handlePayout(result) {

    const win = calculateWin(result);
    GameEngine.lastResult = result;

    applyWin(win);

    return win;
}

function resolvePayout(result) {
    return handlePayout(result);
}

// ======================================================
// SAFE SPIN CONTROL
// ======================================================
function startSpin() {

    if (GameEngine.isSpinning) return false;

    GameEngine.isSpinning = true;

    console.log("🎰 SPIN LOCKED");

    return true;
}

function stopSpin() {

    GameEngine.isSpinning = false;

    console.log("🛑 SPIN STOPPED");
}
