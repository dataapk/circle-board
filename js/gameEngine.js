
// ======================================================
// 🧠 GAME ENGINE (CORE STATE MANAGER)
// ======================================================
// START: GLOBAL GAME STATE (SINGLE SOURCE OF TRUTH)
// ======================================================

// 🧠 ALL GAME DATA LIVES HERE

window.GameEngine = {

    balance: 1000,
    selectedChip: null,
    bets: {},
    isSpinning: false,
    lastResult: null,

    chipSound: null,
    spinSound: null,
};
// ======================================================
// END: GLOBAL GAME STATE
// ======================================================



// ======================================================
// 🚀 INIT ENGINE (START)
// ======================================================


document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 DOM LOADED");

    setTimeout(() => {

        initGame();

        console.log("🎮 GAME INITIALIZED");

    }, 50);
});

// ======================================================
// INIT ENGINE (END)
// ======================================================
// ===============================
// 💰 BET ENGINE (CORE)
// ===============================

function placeBet(boxId) {

    const chip = GameEngine.selectedChip;

    if (!chip || !chip.value) {
        console.log("❌ No chip selected");
        return;
    }

    if (GameEngine.isSpinning) {
        console.log("❌ Wait for spin");
        return;
    }

    const amount = parseInt(chip.value);

    if (GameEngine.balance < amount) {
        console.log("❌ Not enough balance");
        return;
    }

    // 💰 deduct balance
    GameEngine.balance -= amount;

    // 🎯 store bet
    if (!GameEngine.bets[boxId]) {
        GameEngine.bets[boxId] = 0;
    }

    GameEngine.bets[boxId] += amount;

    console.log("💰 Bet Placed:", boxId, amount);
}
// ===============================
// 💰STEP 2: WHEEL → RESULT CONNECT
// ===============================

function handleWheelResult(angle) {

    const normalized = angle % 360;

    // 🎯 simple mapping (example)
    const resultNumber = Math.floor(normalized / 36);

    GameEngine.lastResult = resultNumber;

    console.log("🎯 RESULT:", resultNumber);

    resolvePayout(resultNumber);
}
// ===============================
// 💰 STEP 3: PAYOUT ENGINE
// ===============================

function resolvePayout(result) {

    let winAmount = 0;

    const bets = GameEngine.bets;

    // 🎯 check all bets
    for (let key in bets) {

        if (parseInt(key) === result) {
            winAmount += bets[key] * 9;
        }
    }

    GameEngine.balance += winAmount;

    console.log("💰 WIN:", winAmount);
    console.log("💰 BALANCE:", GameEngine.balance);

    // reset bets
    GameEngine.bets = {};
}
// ===============================
// STEP 4: CONNECT TO WHEEL ENGINE
// ===============================

// AFTER SPIN END
setTimeout(() => {

    isSpinning = false;

    const finalAngle = currentRotation % 360;

    handleWheelResult(finalAngle);

}, 9000);
// ===============================
// STEP 5: CHIP → BET CONNECT
// ===============================

function onBoxClick(boxId) {
    placeBet(boxId);
}





