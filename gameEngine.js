// ======================================================
// 🧠🧠🧠 START: ENGINE GLOBAL GUARD 🧠🧠🧠
// ======================================================
if (window.__ENGINE_INIT__) {
    console.log("⚠ ENGINE ALREADY INIT - SKIP");
} else {
    window.__ENGINE_INIT__ = true;
}
// ======================================================
// 🔴🔴🔴 END: ENGINE GLOBAL GUARD 🔴🔴🔴
// ======================================================
// ======================================================

// ======================================================
// 🟢 START: CORE ENGINE STATE 🟢
// ======================================================
// ======================================================
window.GameEngine = {

    // =========================
    // 💰 STATE
    // =========================
    balance: 1000,
    bets: {},
    isSpinning: false,
    lastResult: null,

    // =========================
    // 🎯 INIT
    // =========================
    init() {
        this.syncUI();
    },

    // =========================
    // 🖥️ UI SYNC (ONLY ONE SOURCE)
    // =========================
    syncUI() {
        const el = document.getElementById("balance");
        if (!el) return;

        el.innerText = "$" + Number(this.balance).toFixed(2);
    },

    // =========================
    // 💰 PLACE BET
    // =========================
    placeBet(type, amount) {

        amount = Number(amount);
        if (isNaN(amount) || amount <= 0) return false;

        if (this.balance < amount) return false;

        this.balance -= amount;

        this.bets[type] = (this.bets[type] || 0) + amount;

        this.syncUI();

        return true;
    },

    // =========================
    // 💸 PAYOUT
    // =========================
    resolvePayout(result) {

        this.lastResult = result;

        let winAmount = this.bets[result] || 0;

        if (winAmount > 0) {
            this.balance += winAmount * 2;
        }

        this.bets = {};

        this.syncUI();

        this.unlockGame();
    },

    // =========================
    // 🔒 GAME STATE
    // =========================
    lockGame() {
        this.isSpinning = true;
    },

    unlockGame() {
        this.isSpinning = false;
     },
    
    // =========================
    // 🔊 AUDIO (STATE ONLY)
    // =========================
    chipSound: null,
    tableSound: null,
    spinButtonSound: null,
    spinSound: null,
    tickSound: null,
    winSound: null,
    loseSound: null
};
// ======================================================
//    🔊 START: AUDIO INIT (CLEAN FIXED)
// ======================================================

function initAudio() {

    GameEngine.chipSound = document.getElementById("chipSound");
    GameEngine.tableSound = document.getElementById("tableSound");
    GameEngine.spinButtonSound = document.getElementById("spinButtonSound");
    GameEngine.spinSound = document.getElementById("spinSound");
    GameEngine.tickSound = document.getElementById("tickSound");
    GameEngine.winSound = document.getElementById("winSound");
    GameEngine.loseSound = document.getElementById("loseSound");

    console.log("🔊 AUDIO READY");
}

// START: AUDIO SYSTEM CORE

GameEngine.sounds = {};   // empty now → backend fill করবে later

// default safe loader (future backend use)
GameEngine.loadSounds = function(soundMap) {
    this.sounds = {};

    for (const key in soundMap) {
        this.sounds[key] = new Audio(soundMap[key]);
    }
};

// END: AUDIO SYSTEM CORE

// START: AUDIO PLAY FUNCTION
GameEngine.playSound = function (key) {
    const sound = this.sounds?.[key];
    if (!sound) return;

    try {
        sound.currentTime = 0;
        sound.play();
    } catch (e) {
        console.log("🔇 SOUND ERROR:", key);
    }
};
// END: AUDIO PLAY FUNCTION
// ======================================================
//     PLACE BET 
// ======================================================
  function placeBet(type, amount) {
   
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) return;

    if (GameEngine.balance < amount) {
        console.log("❌ NOT ENOUGH BALANCE");
        return;
    }

    GameEngine.balance -= amount;

    if (!GameEngine.bets[type]) {
        GameEngine.bets[type] = 0;
    }

    GameEngine.bets[type] += amount;

    console.log("💰 BET PLACED:", type, amount);
    console.log("💸 BALANCE:", GameEngine.balance);

    // 🔥 THIS IS THE MISSING PART
    updateBalance();
}

// ======================================================
//    💰 START: BALANCE SYSTEM (SAFE)
// ======================================================

function subtractBalance(amount) {

    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) return false;

    if (GameEngine.balance < amount) {
        console.log("❌ NOT ENOUGH BALANCE");
        return false;
    }

    GameEngine.balance -= amount;

    console.log("💸 BALANCE:", GameEngine.balance);

    return true;
}

function addBalance(amount) {

    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) return;

    GameEngine.balance += amount;

    console.log("💰 BALANCE ADDED:", amount);
}
// ======================================================
//    🎯 START: BET SYSTEM
// ======================================================

function addBet(symbol, amount) {

    if (!GameEngine.bets[symbol]) {
        GameEngine.bets[symbol] = 0;
    }

    GameEngine.bets[symbol] += amount;
}

function clearBets() {
    GameEngine.bets = {};
}



function handleWheelResult(angle) {

    const symbols = [
        "heart",
        "diamond",
        "club",
        "spade",
        "crown",
        "flag"
    ];

    const index = Math.floor((angle % 360) / (360 / symbols.length));

    const result = symbols[index];

    GameEngine.lastResult = result;

    console.log("🎯 RESULT:", result);

    onSpinEnd(result);
}

// ======================================================
//    💰 START: PAYOUT ENGINE
// ======================================================

const PAYOUT = {
    heart: 2,
    diamond: 2,
    club: 2,
    spade: 2,
    crown: 3,
    flag: 3
};

function calculateWin(result) {

    let win = 0;

    for (let symbol in GameEngine.bets) {

        if (symbol === result) {
            win += GameEngine.bets[symbol] * (PAYOUT[symbol] || 0);
        }
    }

    return Math.round(win * 100) / 100;
}

function applyWin(amount) {

    GameEngine.balance += amount;

    console.log("💰 WIN APPLIED:", amount);
}

// ======================================================
//    🧹 START: ROUND RESET
// ======================================================


function resetWheelState() {

    GameEngine.isSpinning = false;
    GameEngine.currentRotation = 0;
    GameEngine.lastResult = null;
}

// ======================================================
//   🏁 START: FLOW CONTROLLER
// ======================================================

function onSpinEnd(result) {

    const win = calculateWin(result);

    applyWin(win);

    clearBets();
    resetWheelState();

    console.log("✔ ROUND COMPLETE");
}

// ======================================================
//   🎡 START: WHEEL STATE CONTROL
// ======================================================



function setRotation(angle) {
    GameEngine.currentRotation = angle;
}

function getRotation() {
    return GameEngine.currentRotation;
}

// ======================================================
//   🧪 START: DEBUG SYSTEM
// ======================================================


function debugEngine() {
    console.log("🧠 ENGINE STATE:", GameEngine);
}

