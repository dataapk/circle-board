/* =========================
   ENGINE SAFETY LAYER
========================= */

function safeGetEngine() {
    return window.GameEngine;
}

function resetEngineState() {

    const engine = safeGetEngine();
    if (!engine) return;

    engine.isSpinning = false;
    engine.lastResult = null;
    engine.currentRotation = 0;

    console.log("🔒 ENGINE RESET DONE");
}

/* =========================
   GAME BOOT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 GAME READY");

    initChipSystem();
    initTableSystem();
    initAudio();

    initGame(); // 🔥 ADD THIS

    console.log("✔ SYSTEM INITIALIZED");
});

/* =========================
   initGame SYSTEM
========================= */
let gameInitialized = false;

function initGame() {

    if (gameInitialized) return; // 🔥 PREVENT DOUBLE INIT
    gameInitialized = true;

    console.log("🚀 GAME INIT START");

    attachWheelListener();   // wheel event
    updateBalanceUI();       // UI sync
    setSpinButtonState(false);

    console.log("✔ GAME READY");
}

/* =========================
   CHIP SYSTEM (PRO CLEAN)
========================= */

function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    let expanded = false;

    // =========================
    // TOGGLE MENU
    // =========================
    function toggleMenu() {

        if (GameEngine.isSpinning) return;

        expanded = !expanded;

        container.classList.toggle("expanded", expanded);
        container.classList.toggle("collapsed", !expanded);
    }

    // =========================
    // OPEN / CLOSE HELPERS
    // =========================
    function closeMenu() {
        expanded = false;
        container.classList.remove("expanded");
        container.classList.add("collapsed");
    }

    function openMenu() {
        if (GameEngine.isSpinning) return;

        expanded = true;
        container.classList.add("expanded");
        container.classList.remove("collapsed");
    }

    // =========================
    // DEFAULT CHIP CLICK
    // =========================
    defaultChip.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // =========================
    // CHIP SELECTION
    // =========================
    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            if (GameEngine.isSpinning) return;

            // 🎯 active state
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            // 💰 set selected chip
            const value = parseFloat(chip.dataset.value);

            GameEngine.selectedChip = {
                value,
                element: chip
            };

            // 🔁 update default chip display (THIS IS YOUR MAIN FIX)
            const span = defaultChip.querySelector("span");
            if (span) {
                span.innerText = "$" + value;
            }

            // 🔊 sound
            playChipSound();

            // 📦 collapse after selection
            closeMenu();

            console.log("🎯 CHIP SELECTED:", value);
        });
    });

    // =========================
    // OUTSIDE CLICK CLOSE
    // =========================
    document.addEventListener("click", (e) => {

        if (!e.target.closest(".chips-container")) {
            closeMenu();
        }
    });
}

/* =========================
   TABLE SYSTEM
========================= */

function initTableSystem() {

    document.querySelectorAll(".symbol-box").forEach(box => {

        box.addEventListener("click", () => {

            if (GameEngine.isSpinning) return;
            if (!GameEngine.selectedChip) return;

            const symbol = box.dataset.symbol;
            const amount = GameEngine.selectedChip.value;

            if (!subtractBalance(amount)) return;

            GameEngine.bets[symbol] = (GameEngine.bets[symbol] || 0) + amount;

            const marker = document.createElement("div");
            marker.className = "bet-marker";
            marker.innerText = "$" + amount;

            box.appendChild(marker);

            playTableSound();

            updateBalanceUI();
        });
    });
}

/* =========================
   AUDIO SYSTEM (UNCHANGED CORE)
========================= */

const AudioSystem = {
    enabled: true,
    chip: null,
    spin: null,
    wheel: null,
    table: null,
    win: null,
    lose: null,
    bg: null
};

function initAudio() {

    AudioSystem.chip = document.getElementById("chipSound");
    AudioSystem.spin = document.getElementById("spinSound");
    AudioSystem.wheel = document.getElementById("wheelSound");
    AudioSystem.table = document.getElementById("tableSound");
    AudioSystem.win = document.getElementById("winSound");
    AudioSystem.lose = document.getElementById("loseSound");
    AudioSystem.bg = document.getElementById("bgMusic");
}

/* =========================
   AUDIO CORE (SINGLE CONTROL)
========================= */

const AudioSystem = {
    enabled: true,

    chip: null,
    spin: null,
    wheel: null,
    table: null,
    win: null,
    lose: null,
    bg: null
};

/* =========================
   INIT AUDIO
========================= */

function initAudio() {

    AudioSystem.chip  = document.getElementById("chipSound");
    AudioSystem.spin  = document.getElementById("spinSound");
    AudioSystem.wheel = document.getElementById("wheelSound");
    AudioSystem.table = document.getElementById("tableSound");
    AudioSystem.win   = document.getElementById("winSound");
    AudioSystem.lose  = document.getElementById("loseSound");
    AudioSystem.bg    = document.getElementById("bgMusic");
}

/* =========================
   SAFE PLAY (MASTER)
========================= */

function playSound(sound, options = {}) {

    if (!AudioSystem.enabled || !sound) return;

    try {
        sound.currentTime = options.reset === false ? sound.currentTime : 0;

        sound.loop = !!options.loop;

        sound.volume = options.volume ?? 1;

        sound.play().catch(() => {});
    } catch (e) {
        console.log("AUDIO ERROR:", e);
    }
}

/* =========================
   SHORTCUT SOUNDS
========================= */

function playChipSound() {
    playSound(AudioSystem.chip);
}

function playTableSound() {
    playSound(AudioSystem.table);
}

function playSpinClickSound() {
    playSound(AudioSystem.spin);
}

function playWinSound() {
    playSound(AudioSystem.win);
}

function playLoseSound() {
    playSound(AudioSystem.lose);
}

/* =========================
   WHEEL SOUND CONTROL (FIXED)
========================= */

function startWheelSound() {

    const sound = AudioSystem.wheel;
    if (!sound) return;

    sound.currentTime = 0;
    sound.loop = true;

    sound.play().catch(() => {});
}

function stopWheelSound() {

    const sound = AudioSystem.wheel;
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
    sound.loop = false;
}

/* =========================
   GLOBAL AUDIO CONTROL
========================= */

function setAudioEnabled(state) {
    AudioSystem.enabled = state;
}

/* =========================
   LOCK SYSTEM (ONLY ONE VERSION)
========================= */

const GameLock = {
    locked: false
};

function lockBoard() {

    GameLock.locked = true;
    GameEngine.isSpinning = true;

    document.querySelectorAll(".chip").forEach(c => {
        c.style.pointerEvents = "none";
        c.style.opacity = "0.6";
    });
}

function unlockBoard() {

    GameLock.locked = false;
    GameEngine.isSpinning = false;

    document.querySelectorAll(".chip").forEach(c => {
        c.style.pointerEvents = "auto";
        c.style.opacity = "1";
    });
}

/* =========================
   SPIN SYSTEM
========================= */

const SpinEngine = {
    duration: 5000,
    minRotation: 1800,
    maxRotation: 3600
};

function onSpinClick() {

    // 🔒 BLOCK IF SPINNING
    if (GameEngine.isSpinning) return;

    // ❌ NO BETS CHECK
    if (!GameEngine.bets || Object.keys(GameEngine.bets).length === 0) return;

    // =========================
    // 🔒 LOCK GAME STATE
    // =========================
    GameEngine.isSpinning = true;

    lockBoard();

    playSpinClickSound();
    startWheelSound();

    // =========================
    // 🎡 START WHEEL
    // =========================
    startWheelRotation();
}

/* =========================
   🎡 WHEEL ENGINE (FINAL CLEAN)
========================= */

function startWheelRotation() {

    const wheel = document.getElementById("wheel");
    if (!wheel) return;

    const rotation =
        SpinEngine.minRotation +
        Math.floor(Math.random() * SpinEngine.maxRotation);

    GameEngine.currentRotation += rotation;

    wheel.style.transition =
        `transform ${SpinEngine.duration}ms cubic-bezier(0.17,0.67,0.12,0.99)`;

    wheel.style.transform =
        `rotate(${GameEngine.currentRotation}deg)`;

    // 🎯 AUTO END HOOK
    wheel.addEventListener("transitionend", endWheelRotation, { once: true });
}

/* =========================
   🛑 END WHEEL
========================= */

function endWheelRotation() {

    stopWheelSound();

    const symbols = ["heart","diamond","club","spade","crown","flag"];

    const index =
        Math.floor((GameEngine.currentRotation % 360) / (360 / symbols.length));

    const result = symbols[index];

    GameEngine.lastResult = result;

    // =========================
    // 💰 SETTLEMENT
    // =========================
    resolvePayout(result);

    // =========================
    // 🔄 RESET ROUND
    // =========================
    startNewRound();

    // =========================
    // 🔓 UNLOCK GAME
    // =========================
    unlockBoard();

    GameEngine.isSpinning = false;

    console.log("✔ ROUND COMPLETE:", result);
}


/* =========================
   💰 PAYOUT TABLE
========================= */

const PAYOUT_TABLE = {
    spade: 2,
    heart: 2,
    diamond: 2,
    club: 2,
    crown: 3,
    flag: 3
};


/* =========================
   💰 CALCULATE WIN
========================= */

function calculateWin(result) {

    let win = 0;

    for (const key in GameEngine.bets) {

        if (key === result) {
            win += GameEngine.bets[key] * (PAYOUT_TABLE[key] || 0);
        }
    }

    return win;
}


/* =========================
   🏆 RESOLVE PAYOUT
========================= */

function resolvePayout(result) {

    const win = calculateWin(result);

    if (win > 0) {
        GameEngine.balance += win;
        playWinSound();
    } else {
        playLoseSound();
    }

    updateBalanceUI();
}

/* =========================
   🔄 ROUND RESET (CLEAN)
========================= */

function startNewRound() {

    GameEngine.bets = {};
    GameEngine.selectedChip = null;

    console.log("🔄 NEW ROUND READY");
}


/* =========================
   🚨 EMERGENCY RESET (SAFE)
========================= */

function emergencyReset() {

    GameEngine.isSpinning = false;
    GameEngine.bets = {};
    GameEngine.selectedChip = null;
    GameEngine.lastResult = null;

    unlockBoard();
    stopWheelSound();
}
