// ======================================================
// 🚀 BOOT / DOM READY (SINGLE ENTRY ONLY)
// ======================================================

(() => {

    let gameInitialized = false;

    document.addEventListener("DOMContentLoaded", () => {

        // 🔐 safety guard (extra protection)
        if (gameInitialized) {
            console.log("⚠ GAME ALREADY INITIALIZED (DOM SKIP)");
            return;
        }

        startGame();

    });

    // ======================================================
    // 🧠 GAME START WRAPPER
    // ======================================================
    function startGame() {

        if (gameInitialized) {
            console.log("⚠ GAME ALREADY INITIALIZED (START SKIP)");
            return;
        }

        gameInitialized = true;

        console.log("🧠 GAME INIT START");

        try {

            // 🔊 AUDIO SYSTEM
            if (window.GameEngine?.audioSystem?.bind) {
                GameEngine.audioSystem.bind();
            }

            // 🎯 CORE MODULES
            if (typeof initChipSystem === "function") initChipSystem();
            if (typeof setupBoardSystem === "function") setupBoardSystem();
            if (typeof setupSpinButton === "function") setupSpinButton();

            console.log("🎮 GAME READY");

        } catch (err) {
            console.error("💥 GAME INIT ERROR:", err);
        }
    }

})();
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

  container.classList.remove("fan");
  container.classList.add("closed");

  // =========================
  // FAN TOGGLE
  // =========================
  defaultChip.addEventListener("click", (e) => {

    e.stopPropagation();

    if (GameEngine.isSpinning?.()) return;

    const isOpen = container.classList.contains("fan");

    if (isOpen) {
      container.classList.remove("fan");
      container.classList.add("closed");
    } else {
      container.classList.add("fan");
      container.classList.remove("closed");
    }

    GameEngine.audioSystem.play("chipSound");
  });

  // =========================
  // CHIP SELECT
  // =========================
  chips.forEach(chip => {

    if (chip.classList.contains("default-chip")) return;

    chip.addEventListener("click", (e) => {

      e.stopPropagation();

      const value = parseFloat(chip.dataset.value || "0.1");

      GameEngine.setSelectedChip({ value });

      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const span = defaultChip.querySelector("span");
      if (span) span.innerText = "$" + value;

      console.log("🪙 CHIP SELECTED:", value);
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

    const state = GameEngine.getState();

    if (state.isSpinning) return;
    if (!state.selectedChip) return;

    const symbol = box.dataset.symbol;
    const amount = state.selectedChip.value;

    const result = GameEngine.placeBet(symbol, amount);

    if (!result.success) return;

    placeChipVisual(box, amount);

    GameEngine.audioSystem.play("tableSound");

    // 🔥 ADD THIS (IMPORTANT)
    updateBalanceUI(result.balance);

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

    const state = GameEngine.getState();

    // 🧠 1. already spinning check
    if (state.isSpinning) {
        console.log("❌ BLOCKED: already spinning");
        return;
    }

    // 💰 2. bet validation
    if (!state.bets || Object.keys(state.bets).length === 0) {
        console.log("❌ NO BETS PLACED");
        return;
    }

    // 🎰 3. SET ENGINE STATE (IMPORTANT)
    GameEngine.lockGame();

    // 🔊 4. SPIN SOUND (SAFE AUDIO SYSTEM)
    GameEngine.audioSystem.play("spinSound");

    // 🔒 5. LOCK FULL GAME UI
    lockGameUI();

    // 🎡 6. START WHEEL ANIMATION
    spinWheel();
}

// ======================================================
// 🛑🛑🛑 END: SPIN SYSTEM 🛑🛑🛑
// ======================================================
//======================================================
// 🎯 WHEEL RESULT CALCULATOR (SEPARATE FROM ANIMATION)
// ======================================================
function getWheelResultFromAngle(angle) {

    const wheelSegments = [
        "heart",
        "spade",
        "diamond",
        "club",
        "crown",
        "flag",
        "heart",
        "crown",
        "spade",
        "diamond",
        "flag",
        "club"
    ];

    const normalizedAngle = (angle % 360 + 360) % 360;

    const segmentSize = 360 / wheelSegments.length;

    const index = Math.floor(normalizedAngle / segmentSize);

    return wheelSegments[index];
}
// ======================================================
// 🛑🛑🛑 ONSPIN STATE FUCTION 🛑🛑🛑
// ======================================================
function onSpinEnd(result) {

    console.log("🧪 PROOF: onSpinEnd TRIGGERED");

    console.trace("📍 CALL STACK TRACE");

    console.log("🏁 SPIN END");

    const payout = GameEngine.resolvePayout(result);

    updateBalanceUI(payout.balance);

    resetWheelState();
    resetBoardUI();

    startNewRound();

    unlockGameUI();

    console.log("✔ READY NEXT ROUND");
}

// ======================================================
// 💰 START: PAYOUT ENGINE
// ======================================================
// ======================================================
// 🔄 START: NEW ROUND RESET (FINAL)
// ======================================================

function startNewRound() {

    console.log("🔄 START NEW ROUND HIT");

    GameEngine.resetGame();

    document.querySelectorAll(".bet-marker").forEach(el => el.remove());

    console.log(
        "BET MARKERS AFTER RESET:",
        document.querySelectorAll(".bet-marker").length
    );

    console.log("STATE AFTER RESET:", GameEngine.getState());

    console.log("✔ ROUND READY");
}
// ======================================================
// 🔄 END: NEW ROUND 
// ======================================================




// ======================================================
// 🎡🎡🎡 START: SPIN WHEEL 🎡🎡🎡
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

            // 🎯 SAVE ROTATION ONLY
            GameEngine.currentRotation = target;
            
            // 🎯 RESULT OUTSIDE LOGIC
            const result = getWheelResultFromAngle(target);

            // 🚨 ENGINE CALL ONLY
            GameEngine.resolvePayout(result);
        }
    }

    requestAnimationFrame(animate);
}

// ======================================================
// 🛑🛑🛑 END: WHEEL SYSTEM 🛑🛑🛑
// ======================================================

// ======================================================
// 🛑 HANDLEWITHRESULTS 🛑
// ======================================================

// ======================================================
// 🛑🛑🛑 END: HANDLEWITHRESULTS SYSTEM 🛑🛑🛑
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
function updateBalanceUI(balance) {
    const el = document.getElementById("balance");

    if (el) {
        el.innerText = "$" + balance.toFixed(2);
    }
}
// ======================================================
// 🛑🛑🛑 END: RESET SYSTEM 🛑🛑🛑
// ======================================================
function resetBoardUI() {

    document
        .querySelectorAll(".bet-marker")
        .forEach(el => el.remove());

    console.log(
        "🧹 BOARD RESET:",
        document.querySelectorAll(".bet-marker").length
    );
}
