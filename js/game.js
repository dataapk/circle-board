
function initChipSystem() {

    const chips = document.querySelectorAll(".chip");

    chips.forEach(chip => {

        chip.addEventListener("click", () => {

            GameEngine.selectedChip = {
                value: parseFloat(chip.getAttribute("data-value")),
                element: chip
            };

            console.log("🪙 CHIP:", GameEngine.selectedChip.value);
        });

    });
}
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
// CHIP SELECT START
// ===============================
      
chip.addEventListener("click", () => {

    GameEngine.selectedChip = {
        value: parseFloat(chip.getAttribute("data-value")),
        element: chip
    };

    if (GameEngine.chipSound) {
        GameEngine.chipSound.currentTime = 0;
        GameEngine.chipSound.play().catch(()=>{});
    }

    console.log("🪙 CHIP SELECTED:", GameEngine.selectedChip.value);
});
// ===============================
// 🎯 BET PLACE (board click)
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
// 🎰 SPIN BUTTON CLICK
// ===============================

     function spinGame() {

    if (GameEngine.isSpinning) return;

    if (!GameEngine.spinSound) return;

    GameEngine.isSpinning = true;

    GameEngine.spinSound.currentTime = 0;
    GameEngine.spinSound.play().catch(()=>{});

    spinWheel(); // from wheel-engine.js

    console.log("🎰 SPIN STARTED");
}
// ===============================
// 🔊 SPIN SOUND + WHEEL ANIMATION
// ===============================


function spinWheel() {

    const wheel = document.getElementById("wheel");

    const randomAngle = Math.floor(Math.random() * 360);
    const rotation = 3600 + randomAngle;

    wheel.style.transition = "transform 8s ease-out";
    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {

        const result = Math.floor(randomAngle / 60); // example mapping

        window.handleWheelResult(result);

    }, 8000);
}
// ===============================
//  🎯 PAYOUT ENGINE
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
//  📊 UI UPDATE (balance + reset bets)
// ===============================

function updateBalanceUI() {

    const el = document.getElementById("balanceAmount");

    if (!el) return;

    el.innerText = "$" + GameEngine.balance.toFixed(2);
}



// ===============================
// 🌐 GLOBAL EXPORT (for wheel engine)
// ===============================

window.handleWheelResult = handleWheelResult;
