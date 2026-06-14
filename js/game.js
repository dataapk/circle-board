// ======================================================
// 🎮 GAME.JS (FINAL CLEAN ENGINE)
// CHIP → BET → SPIN → RESULT → PAYOUT
// ======================================================
// ===============================
// 🚀 GAME INIT START
// ===============================

function initGame() {

    try {

        console.log("🧠 INIT GAME START");

        if (typeof initChipSystem === "function") {
            initChipSystem();
        } else {
            console.log("❌ initChipSystem missing");
        }

        if (typeof setupBoardSystem === "function") {
            setupBoardSystem();
        } else {
            console.log("❌ setupBoardSystem missing");
        }

        if (typeof setupSpinButton === "function") {
            setupSpinButton();
        } else {
            console.log("❌ setupSpinButton missing");
        }

        if (typeof updateBalanceUI === "function") {
            updateBalanceUI();
        } else {
            console.log("❌ updateBalanceUI missing");
        }

        console.log("🎮 GAME READY SAFE");

    } catch (err) {
        console.log("💥 INIT ERROR:", err);
    }
}

// ===============================
// 🚀 GAME INIT END
// ===============================


// ===============================
// 🪙 CHIP SYSTEM
// ===============================

function initChipSystem() {

    const chips = document.querySelectorAll(".chip");

    chips.forEach(chip => {

        chip.addEventListener("click", () => {

            // 🪙 SET SELECTED CHIP
            GameEngine.selectedChip = {
                value: parseFloat(chip.dataset.value),
                element: chip
            };

            console.log("🪙 CHIP:", GameEngine.selectedChip.value);

            // 🎯 VISUAL ACTIVE STATE
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            // 🔊 SOUND
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

    console.log(
        "🧠 SELECTED CHIP:",
        GameEngine.selectedChip
    );

    console.log(
        "🧠 IS SPINNING:",
        GameEngine.isSpinning
    );

    if (GameEngine.isSpinning) {
        console.log("❌ ALREADY SPINNING");
        return;
    }

    if (!GameEngine.selectedChip) {
        console.log("❌ Select chip first");
        return;
    }

    GameEngine.isSpinning = true;

    console.log("✅ SPIN VALIDATED");

    playSpinSound();

    spinWheel();
}

// ===============================
// 🌐 EXPORT (optional safe)
// ===============================

window.handleWheelResult = handleWheelResult;
