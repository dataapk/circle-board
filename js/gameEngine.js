
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
    spinSound: null
};

// ===============================
// 🎡 WHEEL GLOBAL STATE START
// ===============================

let currentRotation = 0;

// ===============================
// 🎡 WHEEL GLOBAL STATE END
// ===============================
// ======================================================
// END: GLOBAL GAME STATE
// ======================================================
// ===============================
// 🔊 AUDIO INIT START
// ===============================

GameEngine.chipSound =
document.getElementById("chipSound");

GameEngine.spinSound =
document.getElementById("spinSound");

console.log(
    "🔊 CHIP SOUND:",
    GameEngine.chipSound
);

console.log(
    "🔊 SPIN SOUND:",
    GameEngine.spinSound
);

// ===============================
// 🔊 AUDIO INIT END
// ===============================

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

    const symbols = [
        "heart",
        "diamond",
        "club",
        "spade",
        "crown",
        "flag"
    ];

    const segmentSize = 360 / symbols.length;

    const index =
    Math.floor(normalized / segmentSize);

    const result =
    symbols[index];

    GameEngine.lastResult = result;

    console.log("🎯 RESULT:", result);

    resolvePayout(result);
}

// ===============================
// 💰STEP 2: WHEEL → RESULT END
// ===============================

// ===============================
// 🔊 SPIN SOUND START
// ===============================

function playSpinSound() {

    if (!GameEngine.spinSound) return;

    GameEngine.spinSound.currentTime = 0;

    GameEngine.spinSound.play().catch(err => {

        console.log(
            "⚠️ Spin sound blocked:",
            err
        );
    });
}

// ===============================
// 🔊 SPIN SOUND END
// ===============================
// ===============================
// 💰 STEP 3: PAYOUT ENGINE
// ===============================

function resolvePayout(result) {

    let winAmount = 0;

    const bets = GameEngine.bets;

    // 🎯 check all bets
    for (let key in bets) {

        if (key === result) {

            winAmount += bets[key] * 6;

        }
    }

    GameEngine.balance += winAmount;

    console.log("💰 WIN:", winAmount);
    console.log("💰 BALANCE:", GameEngine.balance);

    // reset bets
    GameEngine.bets = {};

    GameEngine.isSpinning = false;

    updateBalanceUI();
}
// ===============================
// 💰 BALANCE UI START
// ===============================

function updateBalanceUI() {

    const el =
    document.getElementById("balanceAmount");

    if (!el) return;

    el.innerText =
    "$" + GameEngine.balance.toFixed(2);
}

// ===============================
// 💰 BALANCE UI END
// ===============================

// ===============================
// STEP 5: CHIP → BET CONNECT
// ===============================
// ===============================
// 🔊 CHIP SOUND START
// ===============================

function playChipSound() {

    if (!GameEngine.chipSound) return;

    GameEngine.chipSound.currentTime = 0;

    GameEngine.chipSound
        .play()
        .catch(() => {});
}

// ===============================
// 🔊 CHIP SOUND END
// ===============================


function onBoxClick(boxId) {
    placeBet(boxId);
}
