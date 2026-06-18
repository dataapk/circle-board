// ======================================================
// 🚀 GAME INIT CONTROL
// ======================================================
if (window.__GAME_INIT__) {
    console.log("⚠ GAME ALREADY INIT - SKIP");
} else {
    window.__GAME_INIT__ = true;

    document.addEventListener("DOMContentLoaded", () => {
        console.log("🚀 GAME READY");
        startGame();
    });
}

let gameInitialized = false;

// ======================================================
// 🚀 START GAME
// ======================================================
function startGame() {
    initGame();
}

function initGame() {

    if (gameInitialized) return;
    gameInitialized = true;

    console.log("🧠 INIT GAME START");

    try {

        if (typeof initAudio === "function") initAudio();
        if (typeof setupBoardSystem === "function") setupBoardSystem();
        if (typeof setupSpinButton === "function") setupSpinButton();
        if (typeof initChipSystem === "function") initChipSystem();

        console.log("🎮 GAME READY");

    } catch (err) {
        console.log("💥 INIT ERROR:", err);
    }
}

// ======================================================
// 🪙 CHIP SYSTEM (FIXED + STABLE)
// ======================================================
function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    if (!container || !defaultChip) return;

    let expanded = false;

    function openMenu() {
        container.classList.add("expanded");
        container.classList.remove("collapsed");
        expanded = true;
    }

    function closeMenu() {
        container.classList.remove("expanded");
        container.classList.add("collapsed");
        expanded = false;
    }

    // DEFAULT CHIP TOGGLE
    defaultChip.addEventListener("click", (e) => {
        e.stopPropagation();

        expanded ? closeMenu() : openMenu();

        console.log("CHIP STATE:", container.className);
    });

    // CHIP SELECT
   chips.forEach(chip => {

    chip.addEventListener("click", (e) => {
        e.stopPropagation();

        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");

        // set selected chip
        GameEngine.selectedChip = {
            value: parseFloat(chip.dataset.value),
            element: chip
        };

        console.log("SELECTED CHIP:", GameEngine.selectedChip.value);

        // =========================
        // 🔥 UPDATE DEFAULT CHIP UI
        // =========================
        if (defaultChip) {
            const span = defaultChip.querySelector("span");
            if (span) {
                span.innerText = "$" + GameEngine.selectedChip.value;
            }
        }

        // =========================
        // 🔥 AUTO COLLAPSE AFTER SELECT
        // =========================
        container.classList.remove("expanded");
        container.classList.add("collapsed");
        expanded = false;

    });
});
    // =========================
    // OUTSIDE CLICK (SAFE GUARD ONLY)
    // =========================
    document.addEventListener("click", (e) => {

        if (!e.target.closest(".chips-container")) {
            closeMenu();
        }
    });
// ======================================================
// 🎯 BOARD SYSTEM (SAFE)
// ======================================================
function setupBoardSystem() {

    document.querySelectorAll(".symbol-box").forEach(box => {
        box.addEventListener("click", () => onTableClick(box));
    });
}

// ======================================================
// 🎰 TABLE CLICK
// ======================================================
function onTableClick(box) {

    if (!GameEngine.selectedChip) return;
    if (GameEngine.isSpinning) return;

    const symbol = box.dataset.symbol;
    const amount = GameEngine.selectedChip.value;

    if (!subtractBalance(amount)) return;

    GameEngine.audio.play(GameEngine.tableSound);

    addBet(symbol, amount);
    placeChipVisual(box, amount);

    console.log("BET:", symbol, amount);
}

// ======================================================
// 🧩 CHIP VISUAL
// ======================================================
function placeChipVisual(box, amount) {

    const marker = document.createElement("div");
    marker.className = "bet-marker";
    marker.innerText = "$" + amount;
    box.appendChild(marker);
}

// ======================================================
// 🎰 SPIN BUTTON
// ======================================================
function setupSpinButton() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    btn.addEventListener("click", spinGame);
}

// ======================================================
// 🚀 SPIN
// ======================================================
function spinGame() {

    if (GameEngine.isSpinning) return;
    if (!GameEngine.bets || Object.keys(GameEngine.bets).length === 0) return;

    GameEngine.isSpinning = true;

    GameEngine.audio.play(GameEngine.spinButtonSound);
    GameEngine.audio.play(GameEngine.spinSound);

    lockGameUI();
    lockBets();

    spinWheel();
}
// ======================================================
// 🎡 WHEEL
// ======================================================

function spinWheel() {

    const wheel = document.querySelector(".wheel-img");
    if (!wheel) return;

    const duration = 14000;
    const startAngle = GameEngine.currentRotation || 0;
    const targetAngle = startAngle + (10 * 360);

    const startTime = performance.now();

    function animate(time) {

        const progress = Math.min((time - startTime) / duration, 1);
        const ease = progress * progress * (3 - 2 * progress);

        const angle =
            startAngle + (targetAngle - startAngle) * ease;

        wheel.style.transform = `rotate(${angle}deg)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {

            GameEngine.currentRotation = targetAngle;

            handleWheelResult(targetAngle);
        }
    }

    requestAnimationFrame(animate);
}


// ======================================================
// 🔒 UI LOCK
// ======================================================
function lockGameUI() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    GameEngine.state = "SPINNING";
    GameEngine.isSpinning = true;

    btn.classList.add("locked");
}

// ======================================================
// 🔓 UI UNLOCK
// ======================================================
function unlockGameUI() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    GameEngine.state = "READY";
    GameEngine.isSpinning = false;

    btn.classList.remove("locked");
}
// ======================================================
// 🔒 UI LOCK BETS
// ======================================================
  // 🔒 LOCK BET SYSTEM (chips + board click disable)
function lockBets() {

    console.log("🔒 BETS LOCKED");

    // disable chip click
    document.querySelectorAll(".chip").forEach(chip => {
        chip.style.pointerEvents = "none";
        chip.style.opacity = "0.5";
    });

    // optional: disable board click
    document.querySelectorAll(".symbol-box").forEach(box => {
        box.style.pointerEvents = "none";
    });

    // update engine state (optional but useful)
    GameEngine.betsLocked = true;
}


// 🔓 UNLOCK BET SYSTEM
function unlockBets() {

    console.log("🔓 BETS UNLOCKED");

    document.querySelectorAll(".chip").forEach(chip => {
        chip.style.pointerEvents = "auto";
        chip.style.opacity = "1";
    });

    document.querySelectorAll(".symbol-box").forEach(box => {
        box.style.pointerEvents = "auto";
    });

    GameEngine.betsLocked = false;
}
// ======================================================
// 🔒 UI LOCK
// ======================================================

// ======================================================
// 🧹 RESET
// ======================================================
function resetBoardUI() {

    GameEngine.bets = {};
    GameEngine.selectedChip = null;

    document.querySelectorAll(".bet-marker").forEach(m => m.remove());
}
