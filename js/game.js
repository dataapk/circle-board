
// ===============================
// 🎮 GAME.JS (MAIN GAME LOOP)
// ===============================
// 🧠 THIS FILE CONTROLS EVERYTHING:
// - Chip → Bet → Spin → Result → Payout
// ===============================



// ===============================
// 🚀 INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    initGame();

    console.log("🎮 GAME READY");
});



// ===============================
// 🧠 INIT GAME
// ===============================

function initGame() {

    setupBalanceUI();
    setupBoardSystem();
    setupSpinButton();

}



// ===============================
// 💰 BALANCE UI
// ===============================

function setupBalanceUI() {

    if (!window.GameEngine) return;

    updateBalanceUI();
}



// ===============================
// 🎯 UPDATE BALANCE UI
// ===============================

function updateBalanceUI() {

    const el = document.getElementById("balanceAmount");

    if (!el) return;

    el.innerText = "$" + GameEngine.balance.toFixed(2);
}



// ===============================
// 🎯 BOARD SYSTEM
// ===============================

function setupBoardSystem() {

    const boxes = document.querySelectorAll(".symbol-box");

    boxes.forEach(box => {

        box.addEventListener("click", () => {

            const symbol = box.getAttribute("data-symbol");

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

    const amount = parseFloat(GameEngine.selectedChip.value);

    if (GameEngine.balance < amount) {
        console.log("❌ Not enough balance");
        return;
    }

    // deduct balance
    GameEngine.balance -= amount;

    // store bet
    if (!GameEngine.bets[symbol]) {
        GameEngine.bets[symbol] = 0;
    }

    GameEngine.bets[symbol] += amount;

    console.log("💰 Bet placed:", symbol, amount);

    updateBalanceUI();
}



// ===============================
// 🎰 SPIN SYSTEM
// ===============================

function setupSpinButton() {

    const btn = document.getElementById("spinBtn");

    if (!btn) return;

    btn.addEventListener("click", spinGame);
}



// ===============================
// 🔄 SPIN GAME
// ===============================

function spinGame() {

    if (GameEngine.isSpinning) return;

    GameEngine.isSpinning = true;

    console.log("🎰 SPIN STARTED");

    // call wheel engine spin (if exists)
    if (typeof spinWheel === "function") {
        spinWheel();
    }

}



// ===============================
// 🎯 RESULT HANDLER (CALLED FROM WHEEL ENGINE)
// ===============================

function handleWheelResult(result) {

    GameEngine.lastResult = result;

    console.log("🎯 RESULT:", result);

    resolvePayout(result);

    GameEngine.isSpinning = false;
}



// ===============================
// 💰 PAYOUT SYSTEM
// ===============================

function resolvePayout(result) {

    let win = 0;

    for (let key in GameEngine.bets) {

        if (key === result) {
            win += GameEngine.bets[key] * 9;
        }
    }

    GameEngine.balance += win;

    console.log("💰 WIN:", win);

    GameEngine.bets = {};

    updateBalanceUI();
}



// ===============================
// 🌐 GLOBAL EXPORT (for wheel engine)
// ===============================

window.handleWheelResult = handleWheelResult;
