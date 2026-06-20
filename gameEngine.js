
// ======================================================
// 🧠 GAME ENGINE (PRO CLEAN SINGLE SOURCE)
// ======================================================

console.log("🧠 GAME ENGINE LOADED");

// =========================
// 🧠 CORE ENGINE
// =========================

window.GameEngine = {

    // =========================
    // 💰 STATE
    // =========================
    balance: 1000,
    bets: {},
    isSpinning: false,
    lastResult: null,
    currentRotation: 0,

    // =========================
    // 🖥️ UI SYNC (ONLY SOURCE OF TRUTH)
// =========================
    syncUI() {
        const el = document.getElementById("balance");
        if (!el) return;

        el.innerText = "$" + Number(this.balance).toFixed(2);
    },

    // =========================
    // 🎯 PLACE BET (DEDUCT BALANCE HERE ONLY)
// =========================
    placeBet(type, amount) {

        amount = Number(amount);
        if (isNaN(amount) || amount <= 0) return false;

        if (this.balance < amount) {
            console.log("❌ NOT ENOUGH BALANCE");
            return false;
        }

        this.balance -= amount;

        if (!this.bets[type]) {
            this.bets[type] = 0;
        }

        this.bets[type] += amount;

        this.syncUI();

        console.log("💰 BET PLACED:", type, amount);
        console.log("💸 BALANCE:", this.balance);

        return true;
    },

    // =========================
    // 💸 PAYOUT ENGINE
    // =========================
    resolvePayout(result) {

        this.lastResult = result;

        const PAYOUT = {
            heart: 2,
            diamond: 2,
            club: 2,
            spade: 2,
            crown: 3,
            flag: 3
        };

        let win = 0;

        if (this.bets[result]) {
            win = this.bets[result] * (PAYOUT[result] || 0);
        }

        if (win > 0) {
            this.balance += win;
            console.log("✅ WIN:", win);
        } else {
            console.log("❌ NO WIN");
        }

        // reset bets
        this.bets = {};

        // update UI
        this.syncUI();

        // unlock game
        this.unlockGame();

        console.log("✔ PAYOUT COMPLETE");
    },

    // =========================
    // 🔒 GAME CONTROL
    // =========================
    lockGame() {
        this.isSpinning = true;
    },

    unlockGame() {
        this.isSpinning = false;
    },

    // =========================
    // 🎡 WHEEL CONTROL
    // =========================
    setRotation(angle) {
        this.currentRotation = angle;
    },

    getRotation() {
        return this.currentRotation;
    }
};

// ======================================================
// 🎡 WHEEL RESULT HANDLER (GLOBAL BRIDGE)
// ======================================================

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

    console.log("🎯 RESULT:", result);

    GameEngine.resolvePayout(result);
}

// ======================================================
// 🎮 SPIN END CONTROLLER
// ======================================================

function onSpinEnd(result) {

    console.log("🏁 SPIN END");

    GameEngine.resolvePayout(result);

    resetWheelState();
    resetBoardUI();
    startNewRound();
    unlockGameUI();

    console.log("✔ READY NEXT ROUND");
}

// ======================================================
// 🧹 RESET SYSTEM
// ======================================================

function resetWheelState() {
    GameEngine.isSpinning = false;
    GameEngine.currentRotation = 0;
    GameEngine.lastResult = null;
}

// dummy UI hooks (safe placeholders)
function resetBoardUI() {}
function startNewRound() {}
function unlockGameUI() {}

// ======================================================
// 🧪 DEBUG
// ======================================================

function debugEngine() {
    console.log("🧠 ENGINE STATE:", GameEngine);
}
