// ======================================================
// 🚀 BOOT / DOM READY SYSTEM
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

    try {

        // ==================================================
        // 🔐 ENGINE CHECK
        // ==================================================
        if (!window.GameEngine) {
            console.error("❌ GameEngine not loaded!");
            return;
        }

        console.log("🧠 Game Engine Detected");

        // ==================================================
        // 🚀 SAFE GAME INIT WRAPPER
        // ==================================================
        if (typeof initGame !== "function") {
            console.error("❌ initGame() not found!");
            return;
        }

        // ==================================================
        // 🎮 START GAME
        // ==================================================
        initGame();

        console.log("🎮 GAME READY (SAFE MODE)");

    } catch (err) {

        console.error("💥 GAME BOOT ERROR:", err);

    }
});
// ======================================================
// 🚀 BOOT / DOM READY SYSTEM END
// ======================================================

// ======================================================
// 🧠 GAME INIT CORE
// ======================================================
let gameInitialized = false;

function startGame() {
    initGame();
}

function initGame() {

    if (gameInitialized) {
        console.log("⚠ GAME ALREADY INITIALIZED - SKIP");
        return;
    }

    gameInitialized = true;

    console.log("🧠 GAME INIT START");

    try {
        GameEngine.audioSystem.bind();
        initChipSystem();
        setupBoardSystem();
        setupSpinButton();

        console.log("🎮 GAME READY");

    } catch (err) {
        console.log("💥 GAME INIT ERROR:", err);
    }
}
// ======================================================
// 🛑🛑🛑 END: GAME INIT CORE 🛑🛑🛑
// ======================================================



// ======================================================
// 🪙🪙🪙 START: CHIP SYSTEM (FAN FIXED) 🪙🪙🪙
// ======================================================

function initChipSystem() {

  const container = document.querySelector(".chips-container");
  const chips = document.querySelectorAll(".chip");
  const defaultChip = document.querySelector(".default-chip");

  if (!container || !defaultChip || chips.length === 0) return;

  // =========================
  // STATE (ONLY SOURCE OF TRUTH)
  // =========================
  const state = {
    open: false,
    selectedValue: 0.1
  };

  // =========================
  // INIT SAFE STATE
  // =========================
  container.classList.remove("fan");
  container.classList.add("closed");

  // =========================
  // OPEN / CLOSE FAN
  // =========================
 defaultChip.addEventListener("click", (e) => {

    e.stopPropagation();

    if (window.GameEngine?.isSpinning) return;

    state.open = !state.open;

    if (state.open) {

        container.classList.add("fan");
        container.classList.remove("closed");

        // 🔊 CHIP SOUND
        GameEngine.audioSystem.play("chipSound");

    } else {

        container.classList.remove("fan");
        container.classList.add("closed");

        // 🔊 CHIP SOUND
        GameEngine.audioSystem.play("chipSound");
    }
});

  // =========================
  // CHIP SELECT
  // =========================
chips.forEach(chip => {

    if (chip.classList.contains("default-chip")) return;

    chip.addEventListener("click", (e) => {

        e.stopPropagation();

        if (!state.open) return;

        const value = parseFloat(chip.dataset.value || "0.1");

        // 🔥 ONLY ENGINE STATE (REMOVE ALL DUPLICATES)
        GameEngine.setSelectedChip({
            value: value
        });

        // UI active
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");

        // update default display
        const span = defaultChip.querySelector("span");
        if (span) span.innerText = "$" + value;

        console.log("🪙 CHIP SELECTED:", value);

        // CLOSE FAN
        state.open = false;
        container.classList.remove("fan");
        container.classList.add("closed");
    });
});
}

// ======================================================
// 🛑🛑🛑 END: CHIP SYSTEM 🛑🛑🛑
// ======================================================



// ======================================================
// 🎯🎯🎯 START: BOARD SYSTEM 🎯🎯🎯
// ======================================================
function setupBoardSystem() {

    document.querySelectorAll(".symbol-box").forEach(box => {
        box.addEventListener("click", () => onTableClick(box));
    });
}

function onTableClick(box) {

    if (GameEngine.isSpinning) return;
    if (!GameEngine.getSelectedChip) return;

    const symbol = box.dataset.symbol;
    const amount = GameEngine.getSelectedChip().value;

    const result = GameEngine.placeBet(symbol, amount);

    if (!result.success) return;

    placeChipVisual(box, amount);

    // 🔊 TABLE SOUND
    GameEngine.audioSystem.play("tableSound");

    console.log("💰 BET:", symbol, amount);
}

function placeChipVisual(box, amount) {

    const marker = document.createElement("div");
    marker.className = "bet-marker";
    marker.innerText = "$" + amount;
    box.appendChild(marker);
}
// ======================================================
// 🛑🛑🛑 END: BOARD SYSTEM 🛑🛑🛑
// ======================================================



// ======================================================
// 🎰🎰🎰 START: SPIN SYSTEM 🎰🎰🎰
// ======================================================
function setupSpinButton() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    btn.addEventListener("click", spinGame);
}


// ==========================
// 🚀 SPIN FLOW (FULL CONTROL)
// ==========================

function spinGame() {

    console.log("🔥 SPIN START REQUEST");

    // 🧠 1. already spinning check
    if (GameEngine.isSpinning) {
        console.log("❌ BLOCKED: already spinning");
        return;
    }

    // 💰 2. bet validation
    if (!GameEngine.bets || Object.keys(GameEngine.bets).length === 0) {
        console.log("❌ NO BETS PLACED");
        return;
    }

    // 🎰 3. SET ENGINE STATE
GameEngine.isSpinning = true;

// 🔊 2. SPIN SOUND (HERE)
GameEngine.playSound("spin");

    

    // 🔒 5. LOCK FULL GAME UI
    lockGameUI();


    // 🎡 7. START WHEEL ANIMATION
    spinWheel();
}

// ======================================================
// 🛑🛑🛑 END: SPIN SYSTEM 🛑🛑🛑
// ======================================================
// ======================================================
// 💰 START: PAYOUT ENGINE
// ======================================================

function syncBalanceUI() {
    const el = document.getElementById("balance");
    if (!el) return;

    el.innerText = "$" + GameEngine.balance.toFixed(2);
}


// ======================================================
// 💰 END: PAYOUT ENGINE
// ======================================================

// ======================================================
// 🏁 START: SPIN END HANDLER (CLEAN)
// ======================================================

function onSpinEnd(result) {

    console.log("🏁 SPIN END");

    GameEngine.resolvePayout(result); // ✅ FIXED

    resetWheelState();

    resetBoardUI();

    startNewRound();

    unlockGameUI();

    console.log("✔ READY NEXT ROUND");
}

// ======================================================
// 🏁 END: SPIN END HANDLER
// ======================================================


// ======================================================
// 🔄 START: NEW ROUND RESET (FINAL)
// ======================================================

function startNewRound() {

    console.log("🔄 NEW ROUND STARTING");

    // 🧹 clear all bets
    GameEngine.bets = {};

    // 🪙 reset selected chip
    GameEngine.selectedChip = null;

    // 🏁 reset last result
    GameEngine.lastResult = null;

    // 🎯 reset game state
    GameEngine.state = "READY";
    GameEngine.isSpinning = false;

    // 🧹 clear UI bet markers
    document.querySelectorAll(".bet-marker").forEach(m => m.remove());

    // 🎨 clear winning highlight
    document.querySelectorAll(".symbol-box").forEach(box => {
        box.classList.remove("winner");
    });

    // 📍 reset pointer effect
    if (typeof resetPointer === "function") {
        resetPointer();
    }

    console.log("✔ ROUND RESET COMPLETE");
}

// ======================================================
// 🔄 END: NEW ROUND RESET
// ======================================================



// ======================================================
// 🎡🎡🎡 START: WHEEL ANIMATION 🎡🎡🎡
// ======================================================
function spinWheel() {

    const wheel = document.querySelector(".wheel-img");
    if (!wheel) return;

    const duration = 12000;
    const start = GameEngine.currentRotation || 0;
    const target = start + (8 * 360);

    const t0 = performance.now();

    function animate(t) {

        const p = Math.min((t - t0) / duration, 1);
        const ease = p * (2 - p);

        const angle = start + (target - start) * ease;

        wheel.style.transform = `rotate(${angle}deg)`;

        if (p < 1) {
            requestAnimationFrame(animate);
        } else {
            GameEngine.currentRotation = target;
            handleWheelResult(target);
        }
    }

    requestAnimationFrame(animate);
}
// ======================================================
// 🛑🛑🛑 END: WHEEL SYSTEM 🛑🛑🛑
// ======================================================

// ======================================================
// 🔒🔒🔒 START: UI LOCK SYSTEM 🔒🔒🔒
// ======================================================
function lockGameUI() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    GameEngine.state = "SPINNING";
    GameEngine.isSpinning = true;

    btn.classList.add("locked");

    const text = btn.querySelector(".btn-text");
    const icon = btn.querySelector(".wheel-icon");

    if (text) text.innerText = "LOCKED";
    if (icon) icon.style.animation = "none";

    console.log("🔒 GAME UI LOCKED");
}
function unlockGameUI() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    GameEngine.state = "READY";
    GameEngine.isSpinning = false;

    btn.classList.remove("locked");

    const text = btn.querySelector(".btn-text");
    const icon = btn.querySelector(".wheel-icon");

    if (text) text.innerText = "SPIN";
    if (icon) icon.style.animation = "wheelSpin 1.2s linear infinite";

    console.log("🔓 GAME UI UNLOCKED");
}

// ======================================================
// 🛑🛑🛑 END: UI LOCK SYSTEM 🛑🛑🛑
// ======================================================



// ======================================================
// 🧹🧹🧹 START: RESET SYSTEM 🧹🧹🧹
// ======================================================
function resetBoardUI() {

    GameEngine.bets = {};
    GameEngine.selectedChip = null;

    document.querySelectorAll(".bet-marker").forEach(m => m.remove());

    console.log("🧹 BOARD RESET");
}
// ======================================================
// 🛑🛑🛑 END: RESET SYSTEM 🛑🛑🛑
// ======================================================
