/* =========================
   START: ENGINE SAFETY LAYER
========================= */

window.__ENGINE_LOCK__ = true;

function safeGetEngine() {
    return window.GameEngine;
}

function resetEngineState() {

    const engine = safeGetEngine();

    engine.isSpinning = false;
    engine.lastResult = null;
    engine.currentRotation = 0;

    console.log("🔒 ENGINE STATE SAFE RESET");
}

/* =========================
   END: ENGINE SAFETY LAYER
========================= */
/* =========================
   START: GAME BOOT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 GAME READY");

    initChipSystem();
    initTableSystem();
    initAudio();

    console.log("✔ SYSTEM INITIALIZED");
});

/* =========================
   END: GAME BOOT
========================= */
/* =========================
   START: CHIP SYSTEM
========================= */

function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    let expanded = false;

    function openMenu() {
        if (GameEngine.isSpinning) return;

        container.classList.add("expanded");
        container.classList.remove("collapsed");
        expanded = true;
    }

    function closeMenu() {
        container.classList.remove("expanded");
        container.classList.add("collapsed");
        expanded = false;
    }

    defaultChip.addEventListener("click", (e) => {
        e.stopPropagation();
        expanded ? closeMenu() : openMenu();
    });

    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            GameEngine.selectedChip = {
                value: parseFloat(chip.dataset.value),
                element: chip
            };

            const span = defaultChip.querySelector("span");
            if (span) {
                span.innerText = "$" + GameEngine.selectedChip.value;
            }

            playSound(GameEngine.chipSound);
            closeMenu();
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".chips-container")) {
            closeMenu();
        }
    });
}

/* =========================
   END: CHIP SYSTEM
========================= */
/* =========================
   START: UI STATE CONTROLLER
========================= */

function setChipState(state) {

    const container = document.querySelector(".chips-container");

    if (!container) return;

    container.classList.remove("expanded", "collapsed");
    container.classList.add(state);

    // force reflow (smooth animation fix)
    container.offsetHeight;

    console.log("🎯 CHIP STATE:", state);
}

/* =========================
   END: UI STATE CONTROLLER
========================= */
/* =========================
   START: TABLE BET SYSTEM
========================= */

function initTableSystem() {

    const boxes = document.querySelectorAll(".symbol-box");

    boxes.forEach(box => {

        box.addEventListener("click", () => {

            if (GameEngine.isSpinning) return;
            if (!GameEngine.selectedChip) return;

            const symbol = box.dataset.symbol;
            const amount = GameEngine.selectedChip.value;

            if (!subtractBalance(amount)) return;

            playSound(GameEngine.tableSound);

            if (!GameEngine.bets[symbol]) {
                GameEngine.bets[symbol] = 0;
            }

            GameEngine.bets[symbol] += amount;

            const marker = document.createElement("div");
            marker.className = "bet-marker";
            marker.innerText = "$" + amount;

            box.appendChild(marker);

            console.log("BET:", symbol, amount);
        });
    });
}

/* =========================
   END: TABLE BET SYSTEM
========================= */
/* =========================
   START: SPIN SYSTEM
========================= */

function startSpin() {

    if (GameEngine.isSpinning) return false;

    if (Object.keys(GameEngine.bets).length === 0) {
        console.log("❌ NO BETS");
        return false;
    }

    GameEngine.isSpinning = true;

    playSound(GameEngine.spinSound);

    console.log("🎰 SPIN STARTED");

    return true;
}

/* =========================
   END: SPIN SYSTEM
========================= */
/* =========================
   START: SPIN STABILITY FIX
========================= */

function safeStartSpin() {

    if (GameEngine.isSpinning) return false;

    if (!GameEngine.bets || Object.keys(GameEngine.bets).length === 0) {
        console.log("❌ NO BETS");
        return false;
    }

    lockGame();

    console.log("🎰 SPIN SAFE START");

    return true;
}

/* =========================
   END: SPIN STABILITY FIX
========================= */

/* =========================
   START: RESULT SYSTEM
========================= */

function handleWheelResult(angle) {

    const symbols = ["heart","diamond","club","spade","crown","flag"];

    const index = Math.floor((angle % 360) / (360 / symbols.length));

    const result = symbols[index];

    GameEngine.lastResult = result;

    console.log("🎯 RESULT:", result);

    onSpinEnd(result);
}

/* =========================
   END: RESULT SYSTEM
========================= */
/* =========================
   START: END FLOW
========================= */

function onSpinEnd(result) {

    console.log("🏁 SPIN END");

    resolvePayout(result);

    resetWheelState();
    startNewRound();

    console.log("✔ READY NEXT ROUND");
}

/* =========================
   END: END FLOW
========================= */
/* =========================
   START: GAME FLOW CONTROLLER
========================= */

function lockGame() {
    GameEngine.isSpinning = true;
}

function unlockGame() {
    GameEngine.isSpinning = false;
}

function processRound(result) {

    console.log("🏁 ROUND PROCESS START");

    resolvePayout(result);

    resetEngineState();
    startNewRound();

    unlockGame();

    console.log("✔ ROUND COMPLETE");
}

/* =========================
   END: GAME FLOW CONTROLLER
========================= */
/* =========================
   START: RESET SYSTEM
========================= */

function resetWheelState() {

    GameEngine.isSpinning = false;
    GameEngine.lastResult = null;
    GameEngine.currentRotation = 0;
}

function startNewRound() {

    GameEngine.bets = {};
    GameEngine.isSpinning = false;
}

/* =========================
   END: RESET SYSTEM
====================================================== */
/* =========================
   START: 🔊 FULL AUDIO SYSTEM (PRO FINAL VERSION)
==================================================== */
/* =========================
   START: AUDIO SYSTEM
========================= */
 /* =========================
   🔊 AUDIO ENGINE CORE
   ========================= */

/* =========================
   🔊 AUDIO ENGINE CORE (UPDATED)
========================= */

const AudioSystem = {

    enabled: true,

    chip: null,
    spin: null,
    wheel: null,
    table: null,   // 🔥 TABLE ADDED
    win: null,
    lose: null,
    bg: null
};
/* =========================
   🎧 INIT AUDIO SYSTEM
   ========================= */

function initAudio() {

    AudioSystem.chip  = document.getElementById("chipSound");
    AudioSystem.spin  = document.getElementById("spinSound");
    AudioSystem.wheel = document.getElementById("wheelSound");
    AudioSystem.table = document.getElementById("tableSound"); // 🔥 ADDED
    AudioSystem.win   = document.getElementById("winSound");
    AudioSystem.lose  = document.getElementById("loseSound");
    AudioSystem.bg    = document.getElementById("bgMusic");

    console.log("🔊 AUDIO SYSTEM READY");
}
/* =========================
   🔊 MASTER PLAY SYSTEM
========================= */

function playSound(sound, options = {}) {

    if (!AudioSystem.enabled) return;
    if (!sound) return;

    try {

        if (options.reset !== false) {
            sound.currentTime = 0;
        }

        if (options.loop) {
            sound.loop = true;
        }

        sound.volume = options.volume ?? 1;

        sound.play().catch(() => {});

    } catch (e) {
        console.log("AUDIO ERROR:", e);
    }
}
/* =========================
   🛑 STOP SYSTEM
========================= */

function stopSound(sound) {

    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
    sound.loop = false;
}
function playChipSound() {
    playSound(AudioSystem.chip);
}
function playSpinClickSound() {
    playSound(AudioSystem.spin);
}
function startWheelSound() {
    playSound(AudioSystem.wheel, {
        loop: true,
        volume: 1
    });
}

function stopWheelSound() {
    stopSound(AudioSystem.wheel);
}
function playWinSound() {
    playSound(AudioSystem.win);
}

function playLoseSound() {
    playSound(AudioSystem.lose);
}
function startBackgroundMusic() {
    playSound(AudioSystem.bg, {
        loop: true,
        volume: 0.4
    });
}
/* =========================
   🌐 BACKEND CONTROL READY
========================= */

function setAudioEnabled(state) {
    AudioSystem.enabled = state;
    console.log("🔊 AUDIO STATE:", state);
}

/* =========================
   END:🔊 FULL AUDIO SYSTEM (PRO FINAL VERSION)
========================= */
/* =========================
   🟢 STEP 1 — CHIP CLICK SYSTEM
   (START)
========================= */

function onChipClick(chip) {

    // 🔒 BLOCK: prevent during spin
    if (GameEngine.isSpinning) return;

    // =========================
    // 🎯 CHIP SELECT LOGIC
    // =========================

    GameEngine.selectedChip = {
        value: parseFloat(chip.dataset.value),
        element: chip
    };

    // =========================
    // 🔊 SOUND
    // =========================

    playChipSound(); // chip.mp3

    // =========================
    // 🎮 UI STATE
    // =========================

    document.querySelectorAll(".chip")
        .forEach(c => c.classList.remove("active"));

    chip.classList.add("active");

    // =========================
    // 🧠 DEBUG
    // =========================

    console.log(
        "🎯 SELECTED CHIP:",
        GameEngine.selectedChip.value
    );
}

/* =========================
   🟢 STEP 1 END
========================= */
/* =========================
   🟡 STEP 2 — TABLE BET SYSTEM
   (START)
========================= */

function placeBetOnTable(betKey) {

    // 🔒 BLOCK: prevent during spin
    if (GameEngine.isSpinning) return;

    // =========================
    // 🧠 REQUIRE CHECK
    // =========================

    if (!GameEngine.selectedChip) {
        console.log("❌ NO CHIP SELECTED");
        return;
    }

    const amount = GameEngine.selectedChip.value;

    // =========================
    // 💰 BALANCE CHECK + DEDUCT
    // =========================

    if (GameEngine.balance < amount) {
        console.log("❌ NOT ENOUGH BALANCE");
        return;
    }

    GameEngine.balance -= amount;

    // =========================
    // 🎯 STORE BET
    // =========================

    if (!GameEngine.bets[betKey]) {
        GameEngine.bets[betKey] = 0;
    }

    GameEngine.bets[betKey] += amount;

    // =========================
    // 🔊 SOUNDS
    // =========================

    playChipSound();   // chip drop feel
    playTableSound();  // table.mp3

    // =========================
    // 🎮 UI UPDATE
    // =========================

    updateBalanceUI();

    // =========================
    // 🧠 DEBUG
    // =========================

    console.log("💸 BET PLACED:", betKey, amount);
    console.log("💰 BALANCE:", GameEngine.balance);
}

/* =========================
   🟡 STEP 2 END
========================= */
/* =========================
   🔴 STEP 3 — SPIN SYSTEM
   (START)
========================= */

function onSpinClick() {

    // 🔒 BLOCK: already spinning
    if (GameEngine.isSpinning) return;

    // =========================
    // 🎯 REQUIREMENT CHECK
    // =========================

    if (!GameEngine.bets || Object.keys(GameEngine.bets).length === 0) {
        console.log("❌ NO BETS PLACED");
        return;
    }

    // =========================
    // 🔒 LOCK GAME STATE
    // =========================

    GameEngine.isSpinning = true;

    // =========================
    // 🔊 SOUND — SPIN CLICK
    // =========================

    playSpinClickSound(); // spin.mp3

    // =========================
    // 🔒 LOCK UI / TABLE
    // =========================

    lockBoard(); 
    setSpinButtonState(true);

    // =========================
    // 🎡 START WHEEL SOUND
    // =========================

    startWheelSound(); // wheel.mp3 loop

    // =========================
    // 🎡 START WHEEL LOGIC (ANIMATION HOOK)
    // =========================

    console.log("🎰 WHEEL STARTED");

    startWheelRotation(); // ← animation function (UI side)
}

/* =========================
   🔴 STEP 3 END
========================= */
/* =========================
   🟣 STEP 4 — WHEEL STOP SYSTEM
   (START)
========================= */

function onWheelStop(finalAngle) {

    // =========================
    // 🎡 CALCULATE RESULT
    // =========================

    const symbols = [
        "heart",
        "diamond",
        "club",
        "spade",
        "crown",
        "flag"
    ];

    const segmentSize = 360 / symbols.length;

    const index = Math.floor((finalAngle % 360) / segmentSize);

    const result = symbols[index];

    GameEngine.lastResult = result;

    console.log("🏁 RESULT:", result);

    // =========================
    // 🔊 STOP WHEEL SOUND
    // =========================

    stopWheelSound(); // wheel.mp3 stop

    // =========================
    // 💰 PAYOUT SYSTEM CALL
    // =========================

    resolvePayout(result);

    // =========================
    // 🔓 UNLOCK GAME STATE
    // =========================

    GameEngine.isSpinning = false;

    unlockBoard();
    setSpinButtonState(false);

    // =========================
    // 🧹 START NEW ROUND
    // =========================

    startNewRound();

    console.log("✔ ROUND COMPLETED");
}

/* =========================
   🟣 STEP 4 END
========================= */
/* =========================
   🟢 STEP 5 — PAYOUT ENGINE
   (START)
========================= */

const PAYOUT_TABLE = {
    spade: 2,
    heart: 2,
    diamond: 2,
    club: 2,
    crown: 3,
    flag: 3
};

// =========================
// 💰 CALCULATE WIN
// =========================

function calculateWin(resultSymbol) {

    let totalWin = 0;

    for (const betKey in GameEngine.bets) {

        const betAmount = GameEngine.bets[betKey];

        if (betKey === resultSymbol) {

            const multiplier = PAYOUT_TABLE[betKey] || 0;

            totalWin += betAmount * multiplier;
        }
    }

    return Math.round(totalWin * 100) / 100;
}

// =========================
// 💰 APPLY WIN / LOSS
// =========================

function applyPayout(resultSymbol) {

    const winAmount = calculateWin(resultSymbol);

    if (winAmount > 0) {

        GameEngine.balance += winAmount;

        playWinSound(); // win.mp3

        console.log("🏆 WIN:", winAmount);

    } else {

        playLoseSound(); // lose.mp3

        console.log("❌ LOSS");
    }

    updateBalanceUI();

    return winAmount;
}

// =========================
// 🔄 RESET ROUND DATA
// =========================

function startNewRound() {

    GameEngine.bets = {};
    GameEngine.selectedChip = null;

    console.log("🔄 NEW ROUND READY");
}

// =========================
// 🎯 MAIN PAYOUT FLOW
// =========================

function resolvePayout(resultSymbol) {

    const win = applyPayout(resultSymbol);

    return win;
}

/* =========================
   🟢 STEP 5 END
========================= */
/* =========================
   🔒 STEP 6 — TABLE LOCK SYSTEM
   (START)
========================= */

const GameLock = {

    tableLocked: false,
    chipLocked: false,
    spinLocked: false
};

// =========================
// 🔒 LOCK ALL INPUT
// =========================

function lockBoard() {

    GameLock.tableLocked = true;
    GameLock.chipLocked = true;

    document.querySelectorAll(".chip").forEach(c => {
        c.style.pointerEvents = "none";
        c.style.opacity = "0.6";
    });

    console.log("🔒 BOARD LOCKED");
}

// =========================
// 🔓 UNLOCK ALL INPUT
// =========================

function unlockBoard() {

    GameLock.tableLocked = false;
    GameLock.chipLocked = false;

    document.querySelectorAll(".chip").forEach(c => {
        c.style.pointerEvents = "auto";
        c.style.opacity = "1";
    });

    console.log("🔓 BOARD UNLOCKED");
}

// =========================
// 🎰 SPIN LOCK CHECK
// =========================

function canSpin() {

    return (
        !GameEngine.isSpinning &&
        Object.keys(GameEngine.bets).length > 0
    );
}

// =========================
// 🧠 SAFE CLICK GUARD
// =========================

function safeClickGuard(callback) {

    if (GameEngine.isSpinning) {
        console.log("⛔ GAME LOCKED");
        return;
    }

    if (typeof callback === "function") {
        callback();
    }
}

/* =========================
   🔒 STEP 6 END
========================= */
/* =========================
   🎡 STEP 7 — REAL SPIN ENGINE
   (START)
========================= */

// =========================
// 🎯 SPIN CONFIG
// =========================

const SpinEngine = {

    duration: 5000, // total spin time
    minRotation: 1800,
    maxRotation: 3600,
    easing: true
};

// =========================
// 🎰 START SPIN ANIMATION
// =========================

function startWheelRotation() {

    const wheel = document.getElementById("wheel");
    if (!wheel) return;

    const randomRotation =
        SpinEngine.minRotation +
        Math.floor(Math.random() * (SpinEngine.maxRotation));

    const finalRotation =
        GameEngine.currentRotation + randomRotation;

    GameEngine.currentRotation = finalRotation;

    wheel.style.transition =
        `transform ${SpinEngine.duration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;

    wheel.style.transform =
        `rotate(${finalRotation}deg)`;

    console.log("🎡 SPINNING...");
}

// =========================
// 🛑 END SPIN EVENT
// =========================

function endWheelRotation() {

    const normalized =
        GameEngine.currentRotation % 360;

    stopWheelSound();

    // 🎯 trigger result
    onWheelStop(GameEngine.currentRotation);

    console.log("🏁 WHEEL STOPPED AT:", normalized);
}

// =========================
// 🎯 AUTO DETECT END
// =========================

function attachWheelListener() {

    const wheel = document.getElementById("wheel");

    if (!wheel) return;

    wheel.addEventListener("transitionend", () => {

        endWheelRotation();
    });
}

/* =========================
   🎡 STEP 7 END
========================= */
/* =========================
   🧠 STEP 8 — CONTROL LAYER
   (START)
========================= */

// =========================
// 🔒 GLOBAL SAFETY CHECK
// =========================

function canInteract() {

    if (GameEngine.isSpinning) return false;

    return true;
}

// =========================
// 🎯 CHIP CLICK SAFE WRAPPER
// =========================

function safeChipClick(chip) {

    if (!canInteract()) {
        console.log("⛔ LOCKED");
        return;
    }

    onChipClick(chip);
}

// =========================
// 🎯 TABLE CLICK SAFE WRAPPER
// =========================

function safeTableClick(betKey) {

    if (!canInteract()) {
        console.log("⛔ LOCKED");
        return;
    }

    placeBetOnTable(betKey);
}

// =========================
// 🎰 SPIN SAFE WRAPPER
// =========================

function safeSpinClick() {

    if (!canSpin()) {
        console.log("⛔ CANNOT SPIN");
        return;
    }

    onSpinClick();
}

// =========================
// 🧹 EMERGENCY RESET (BUG FIX)
// =========================

function emergencyReset() {

    GameEngine.isSpinning = false;
    GameEngine.bets = {};
    GameEngine.selectedChip = null;

    unlockBoard();
    setSpinButtonState(false);

    stopWheelSound();

    console.log("🚨 EMERGENCY RESET DONE");
}

// =========================
// 🧠 STATE DEBUG CHECKER
// =========================

function debugGameState() {

    console.log("========== GAME STATE ==========");

    console.log("SPINNING:", GameEngine.isSpinning);
    console.log("BALANCE:", GameEngine.balance);
    console.log("BET:", GameEngine.bets);
    console.log("CHIP:", GameEngine.selectedChip);

    console.log("================================");
}

/* =========================
   🧠 STEP 8 END
========================= */
/* =========================
   🧩 STEP 9 — BACKEND HOOK LAYER
   (START — OFF MODE READY)
========================= */

// =========================
// 🌐 BACKEND CONFIG (DISABLED)
// =========================

const Backend = {

    enabled: false, // 🔴 future use only

    socket: null,
    userId: null,

    endpoints: {

        bet: "/api/bet",
        spin: "/api/spin",
        result: "/api/result"
    }
};

// =========================
// 📡 SAFE EMIT FUNCTION
// =========================

function emitToServer(event, data) {

    if (!Backend.enabled) {
        console.log("📴 BACKEND OFF:", event);
        return;
    }

    if (Backend.socket) {
        Backend.socket.emit(event, data);
    }
}

// =========================
// 🎯 BET SYNC HOOK
// =========================

function syncBetToServer() {

    emitToServer("PLACE_BET", {
        balance: GameEngine.balance,
        bets: GameEngine.bets
    });
}

// =========================
// 🎰 SPIN SYNC HOOK
// =========================

function syncSpinToServer() {

    emitToServer("SPIN_START", {
        bets: GameEngine.bets
    });
}

// =========================
// 🏁 RESULT SYNC HOOK
// =========================

function syncResultToServer(result) {

    emitToServer("SPIN_RESULT", {
        result: result,
        balance: GameEngine.balance
    });
}

// =========================
// 🌐🔌 FUTURE INIT SOCKET (PLACEHOLDER)
// =========================

function initSocket() {

    if (!Backend.enabled) return;

    console.log("🌐 SOCKET INIT READY (FUTURE)");
}

/* =========================
   🧩 STEP 9 END
========================= */
/* =========================
   🏗️ STEP 10 — FINAL ARCHITECTURE WRAP
   (START — PRO STRUCTURE CLEANUP)
========================= */

// ======================================================
// 🎯 MASTER FLOW CONTROLLER (ONE ENTRY POINT)
// ======================================================

function GameFlow(action, payload) {

    switch (action) {

        case "CHIP_CLICK":
            safeChipClick(payload);
            break;

        case "TABLE_CLICK":
            safeTableClick(payload);
            break;

        case "SPIN_CLICK":
            safeSpinClick();
            break;

        case "WHEEL_END":
            onWheelStop(payload);
            break;

        default:
            console.log("⚠ UNKNOWN ACTION:", action);
    }
}

// ======================================================
// 🎮 GLOBAL GAME INIT (SAFE START)
// ======================================================

function initGame() {

    console.log("🚀 GAME INIT START");

    loadGame();
    updateBalanceUI();

    attachWheelListener();

    setSpinButtonState(false);

    console.log("✔ GAME READY");
}

// ======================================================
// 🧹 FULL SYSTEM RESET (EMERGENCY + NEW GAME)
// ======================================================

function fullReset() {

    GameEngine.balance = 1000;
    GameEngine.bets = {};
    GameEngine.selectedChip = null;
    GameEngine.isSpinning = false;
    GameEngine.lastResult = null;

    unlockBoard();
    updateBalanceUI();
    setSpinButtonState(false);

    stopWheelSound();

    console.log("♻️ FULL RESET COMPLETE");
}

// ======================================================
// 🔥 GLOBAL SAFETY LAYER (FINAL GUARD)
// ======================================================

window.addEventListener("error", (e) => {

    console.log("💥 SYSTEM ERROR CAUGHT:", e.message);

    emergencyReset();
});

/* =========================
   🏗️ STEP 10 END
========================= */

/* ============================================
   🎰 START TABLE LOCK SYSTEM START (FINAL PRO LEVEL)
============================================== */

/* =========================
   🎰 GAME LOCK STATE (UPDATED)
========================= */

const GameLock = {

    betLocked: false,
    chipLocked: false,
    uiLocked: false,
    spinLocked: false,

    tableLocked: false   // 🔥 TABLE LOCK ADDED

};
/* =========================
   START: TABLE LOCK CONTROLLER
========================= */

function lockTable() {

    GameLock.tableLocked = true;

    console.log("🔒 TABLE LOCKED");
}

function unlockTable() {

    GameLock.tableLocked = false;

    console.log("🔓 TABLE UNLOCKED");
}

/* =========================
   END: TABLE LOCK CONTROLLER
========================= */
/* =========================
   START: FULL BOARD LOCK
========================= */

function lockBoard() {

    GameLock.betLocked = true;
    GameLock.chipLocked = true;
    GameLock.uiLocked = true;
    GameLock.spinLocked = true;
    GameLock.tableLocked = true; // 🔥 INCLUDED

    GameEngine.isSpinning = true;

    console.log("🔒 FULL BOARD LOCKED");
}

function unlockBoard() {

    GameLock.betLocked = false;
    GameLock.chipLocked = false;
    GameLock.uiLocked = false;
    GameLock.spinLocked = false;
    GameLock.tableLocked = false; // 🔥 INCLUDED

    GameEngine.isSpinning = false;

    console.log("🔓 FULL BOARD UNLOCKED");
}

/* =========================
   END: FULL BOARD LOCK
========================= */
/* ============================================
   🎰 TABLE LOCK SYSTEM END (FINAL PRO LEVEL)
============================================== */











