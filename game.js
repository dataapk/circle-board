// ======================================================
// 🟢🟢🟢 START: GAME GLOBAL GUARD 🟢🟢🟢
// ======================================================
if (window.__GAME_INIT__) {
    console.log("⚠ GAME ALREADY INIT - SKIP");
} else {
    window.__GAME_INIT__ = true;
}
// ======================================================
// 🔴🔴🔴 END: GAME GLOBAL GUARD 🔴🔴🔴
// ======================================================



// ======================================================
// 🚀🚀🚀 START: BOOT / DOM READY SYSTEM 🚀🚀🚀
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 GAME DOM READY");

    startGame();

    console.log("🔗 SYSTEMS CONNECTED");
});
// ======================================================
// 🛑🛑🛑 END: BOOT SYSTEM 🛑🛑🛑
// ======================================================



// ======================================================
// 🧠🧠🧠 START: GAME INIT CORE 🧠🧠🧠
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

        initAudio();
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
    } else {
      container.classList.remove("fan");
      container.classList.add("closed");
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

      // SELECT
      state.selectedValue = value;

      window.GameEngine = window.GameEngine || {};
      window.GameEngine.selectedChip = { value };

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

    const boxes = document.querySelectorAll(".symbol-box");

    boxes.forEach(box => {
        box.onclick = () => onTableClick(box);
    });
}

function onTableClick(box) {

    if (!GameEngine.selectedChip) return;
    if (GameEngine.isSpinning) return;

    const symbol = box.dataset.symbol;
    const amount = GameEngine.selectedChip.value;

    if (!subtractBalance(amount)) return;

    addBet(symbol, amount);
    placeChipVisual(box, amount);

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

function spinGame() {

    console.log("🔥 SPIN START REQUEST");

    if (GameEngine.isSpinning) return;

    if (!GameEngine.bets || Object.keys(GameEngine.bets).length === 0) {
        console.log("❌ NO BETS");
        return;
    }

    GameEngine.isSpinning = true;

    lockGameUI();

    spinWheel();
}
// ======================================================
// 🛑🛑🛑 END: SPIN SYSTEM 🛑🛑🛑
// ======================================================
// ======================================================
// 💰 START: PAYOUT ENGINE (MISSING FIX)
// ======================================================

function resolvePayout(result) {

    console.log("💰 PAYOUT START:", result);

    if (!GameEngine.bets) return;

    let totalWin = 0;

    for (const symbol in GameEngine.bets) {

        if (symbol === result) {
            totalWin += GameEngine.bets[symbol] * 2; // simple multiplier
        }
    }

    GameEngine.balance += totalWin;

    onBalanceChanged();

    showResult(result);

    playWinEffect();

    onSpinEnd(result);
}

// ======================================================
// 💰 END: PAYOUT ENGINE
// ======================================================

// ======================================================
// 🏁 START: SPIN END HANDLER (CLEAN)
// ======================================================

function onSpinEnd(result) {

    console.log("🏁 SPIN END");

    // 🔓 unlock UI first
    unlockGameUI();

    // 🔄 single source reset
    startNewRound();

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
// 🏁🏁🏁 START: RESULT FLOW 🏁🏁🏁
// ======================================================
function onSpinEnd(result) {

    resolvePayout(result);

    resetBoardUI();
    resetWheelState();

    GameEngine.isSpinning = false;

    unlockGameUI();

    console.log("✔ READY NEXT ROUND");
}
// ======================================================
// 🛑🛑🛑 END: RESULT FLOW 🛑🛑🛑
// ======================================================



// ======================================================
// 🔒🔒🔒 START: UI LOCK SYSTEM 🔒🔒🔒
// ======================================================
function lockGameUI() {
    GameEngine.isSpinning = true;
}

function unlockGameUI() {
    GameEngine.isSpinning = false;
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

    document.querySelectorAll(".bet-marker")
        .forEach(m => m.remove());
}
// ======================================================
// 🛑🛑🛑 END: RESET SYSTEM 🛑🛑🛑
// ======================================================
