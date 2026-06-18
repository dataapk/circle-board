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
});

/* =========================
   CHIP SYSTEM
========================= */

function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    let expanded = false;

    function toggleMenu() {

        if (GameEngine.isSpinning) return;

        expanded = !expanded;

        container.classList.toggle("expanded", expanded);
        container.classList.toggle("collapsed", !expanded);
    }

    defaultChip.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            if (GameEngine.isSpinning) return;

            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            GameEngine.selectedChip = {
                value: parseFloat(chip.dataset.value),
                element: chip
            };

            const span = defaultChip.querySelector("span");
            if (span) span.innerText = "$" + GameEngine.selectedChip.value;

            playChipSound();

            container.classList.remove("expanded");
            container.classList.add("collapsed");
            expanded = false;
        });
    });

    document.addEventListener("click", () => {
        container.classList.remove("expanded");
        container.classList.add("collapsed");
        expanded = false;
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

function playSound(sound) {
    if (!AudioSystem.enabled || !sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function playChipSound() {
    playSound(AudioSystem.chip);
}

function playTableSound() {
    playSound(AudioSystem.table);
}

function playSpinClickSound() {
    playSound(AudioSystem.spin);
}

function startWheelSound() {
    playSound(AudioSystem.wheel);
    AudioSystem.wheel.loop = true;
}

function stopWheelSound() {
    AudioSystem.wheel.pause();
    AudioSystem.wheel.currentTime = 0;
    AudioSystem.wheel.loop = false;
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

    if (GameEngine.isSpinning) return;
    if (!GameEngine.bets || Object.keys(GameEngine.bets).length === 0) return;

    GameEngine.isSpinning = true;

    playSpinClickSound();

    lockBoard();
    startWheelSound();

    startWheelRotation();
}

/* =========================
   WHEEL ENGINE
========================= */

function startWheelRotation() {

    const wheel = document.getElementById("wheel");
    if (!wheel) return;

    const rotation =
        SpinEngine.minRotation +
        Math.floor(Math.random() * SpinEngine.maxRotation);

    GameEngine.currentRotation += rotation;

    wheel.style.transition = "transform 5s cubic-bezier(0.17,0.67,0.12,0.99)";
    wheel.style.transform = `rotate(${GameEngine.currentRotation}deg)`;

    wheel.addEventListener("transitionend", endWheelRotation, { once: true });
}

function endWheelRotation() {

    stopWheelSound();

    const symbols = ["heart","diamond","club","spade","crown","flag"];

    const index = Math.floor((GameEngine.currentRotation % 360) / (360 / symbols.length));

    const result = symbols[index];

    GameEngine.lastResult = result;

    resolvePayout(result);

    unlockBoard();

    startNewRound();
}

/* =========================
   PAYOUT ENGINE
========================= */

const PAYOUT_TABLE = {
    spade: 2,
    heart: 2,
    diamond: 2,
    club: 2,
    crown: 3,
    flag: 3
};

function calculateWin(result) {

    let win = 0;

    for (const key in GameEngine.bets) {

        if (key === result) {
            win += GameEngine.bets[key] * (PAYOUT_TABLE[key] || 0);
        }
    }

    return win;
}

function resolvePayout(result) {

    const win = calculateWin(result);

    if (win > 0) {
        GameEngine.balance += win;
        playSound(AudioSystem.win);
    } else {
        playSound(AudioSystem.lose);
    }

    updateBalanceUI();
}

/* =========================
   ROUND RESET (ONLY ONE)
========================= */

function startNewRound() {

    GameEngine.bets = {};
    GameEngine.selectedChip = null;
}

/* =========================
   SAFE RESET
========================= */

function emergencyReset() {

    GameEngine.isSpinning = false;
    GameEngine.bets = {};
    GameEngine.selectedChip = null;

    unlockBoard();
}
