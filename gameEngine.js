/* =========================================================
   🎮 GAME ENGINE CORE (CLEAN VERSION)
   - NO DUPLICATE FUNCTIONS
   - SINGLE SOURCE OF TRUTH
========================================================= */

const GameEngine = {
    balance: 1000,
    isSpinning: false,
    selectedChip: null,
    bets: {},
    currentRotation: 0,
    lastResult: null
};

/* =========================================================
   🔊 AUDIO SYSTEM (ONLY ONCE - NO DUPLICATE EVER)
========================================================= */

const AudioSystem = {
    enabled: true,
    chip: null,
    spin: null,
    table: null,
    wheel: null
};

/* =========================
   INIT AUDIO
========================= */

function initAudio() {
    AudioSystem.chip = document.getElementById("chipSound");
    AudioSystem.spin = document.getElementById("spinButtonSound");
    AudioSystem.table = document.getElementById("tableSound");
    AudioSystem.wheel = document.getElementById("wheelSound");

    console.log("🔊 AUDIO READY");
}

/* =========================
   SAFE PLAY FUNCTION
========================= */

function playSound(sound) {
    if (!AudioSystem.enabled || !sound) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});
}

/* =========================
   AUDIO HELPERS (ONLY HERE)
========================= */

function playChipSound() {
    playSound(AudioSystem.chip);
}

function playSpinSound() {
    playSound(AudioSystem.spin);
}

function playTableSound() {
    playSound(AudioSystem.table);
}

function startWheelSound() {
    if (!AudioSystem.wheel) return;

    AudioSystem.wheel.loop = true;
    AudioSystem.wheel.currentTime = 0;
    AudioSystem.wheel.play().catch(() => {});
}

function stopWheelSound() {
    if (!AudioSystem.wheel) return;

    AudioSystem.wheel.pause();
    AudioSystem.wheel.currentTime = 0;
    AudioSystem.wheel.loop = false;
}

/* =========================================================
   💰 BALANCE SYSTEM
========================================================= */

function updateBalanceUI() {
    const el = document.getElementById("balanceAmount");
    if (!el) return;

    el.innerText = "$" + GameEngine.balance.toFixed(2);
}

function subtractBalance(amount) {
    if (GameEngine.balance < amount) return false;

    GameEngine.balance -= amount;
    updateBalanceUI();
    return true;
}

/* =========================================================
   🎮 SPIN STATE CONTROL
========================================================= */

function setSpinButtonState(lock) {
    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    GameEngine.isSpinning = lock;

    btn.disabled = lock;
    btn.classList.toggle("locked", lock);
}

/* =========================================================
   🎡 WHEEL CORE ENGINE
========================================================= */

function startWheelRotation() {
    const wheel = document.getElementById("wheel");
    if (!wheel) return;

    const rotation = 1800 + Math.floor(Math.random() * 2000);

    GameEngine.currentRotation += rotation;

    wheel.style.transition = "transform 5s ease-out";
    wheel.style.transform = `rotate(${GameEngine.currentRotation}deg)`;

    wheel.addEventListener("transitionend", endWheel, { once: true });
}

function endWheel() {
    const symbols = ["heart","diamond","club","spade","crown","flag"];

    const index =
        Math.floor((GameEngine.currentRotation % 360) / (360 / symbols.length));

    GameEngine.lastResult = symbols[index];

    GameEngine.isSpinning = false;
    GameEngine.bets = {};

    setSpinButtonState(false);
    stopWheelSound();

    console.log("🎯 RESULT:", GameEngine.lastResult);
}

/* =========================================================
   🎰 SPIN CLICK HANDLER
========================================================= */

function onSpinClick() {
    if (GameEngine.isSpinning) return;
    if (Object.keys(GameEngine.bets).length === 0) return;

    setSpinButtonState(true);

    playSpinSound();
    startWheelSound();
    startWheelRotation();
}

/* =========================================================
   🚀 ENGINE INIT
========================================================= */

function initGameEngine() {
    initAudio();

    updateBalanceUI();
    setSpinButtonState(false);

    console.log("🚀 ENGINE BOOT COMPLETE");
}

document.addEventListener("DOMContentLoaded", initGameEngine);
