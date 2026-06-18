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
   START: ADVANCED AUDIO CONTROL
========================= */

let audioLock = false;

function playSafeSound(sound) {

    if (!sound || audioLock) return;

    audioLock = true;

    sound.currentTime = 0;
    sound.play().catch(() => {});

    setTimeout(() => {
        audioLock = false;
    }, 100);
}

/* =========================
   END: ADVANCED AUDIO CONTROL
========================= */
/* ============================================
   🎰 TABLE LOCK SYSTEM START (FINAL PRO LEVEL)
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











