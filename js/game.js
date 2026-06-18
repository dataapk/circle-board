/* =========================================================
   🎰 CLEAN iGAMING WHEEL GAME (NO CRASH VERSION)
   ========================================================= */

/* =========================
   START: GAME ENGINE STATE
========================= */

window.GameEngine = {
    balance: 1000,
    selectedChip: null,
    bets: {},
    isSpinning: false,
    lastResult: null,
    currentRotation: 0
};

/* =========================
   START: AUDIO SYSTEM
========================= */

const AudioSystem = {
    enabled: true,
    chip: null,
    spin: null,
    table: null,
    wheel: null
};

function initAudio() {
    AudioSystem.chip = document.getElementById("chipSound");
    AudioSystem.spin = document.getElementById("spinSound");
    AudioSystem.table = document.getElementById("tableSound");
    AudioSystem.wheel = document.getElementById("spinSound");
}

function playSound(s) {
    if (!AudioSystem.enabled || !s) return;
    s.currentTime = 0;
    s.play().catch(() => {});
}

function playChipSound() { playSound(AudioSystem.chip); }
function playSpinSound() { playSound(AudioSystem.spin); }
function playTableSound() { playSound(AudioSystem.table); }

/* =========================
   START: UI SYSTEM
========================= */

function updateBalanceUI() {
    const el = document.getElementById("balanceAmount");
    if (!el) return;
    el.innerText = "$" + GameEngine.balance.toFixed(2);
}

function setSpinButtonState(lock) {
    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    btn.disabled = lock;
    btn.style.opacity = lock ? "0.5" : "1";
}

function lockBoard() {
    GameEngine.isSpinning = true;
    setSpinButtonState(true);
}

function unlockBoard() {
    GameEngine.isSpinning = false;
    setSpinButtonState(false);
}

/* =========================
   START: CHIP SYSTEM
========================= */

function initChipSystem() {

    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");
    const container = document.querySelector(".chips-container");

    let open = false;

    if (!defaultChip) return;

    defaultChip.addEventListener("click", () => {
        if (GameEngine.isSpinning) return;

        open = !open;
        container.classList.toggle("expanded", open);
        container.classList.toggle("collapsed", !open);
    });

    chips.forEach(chip => {
        chip.addEventListener("click", () => {

            if (GameEngine.isSpinning) return;

            GameEngine.selectedChip = {
                value: parseFloat(chip.dataset.value)
            };

            defaultChip.querySelector("span").innerText =
                "$" + GameEngine.selectedChip.value;

            playChipSound();

            container.classList.remove("expanded");
            container.classList.add("collapsed");

            open = false;
        });
    });
}

/* =========================
   START: TABLE SYSTEM
========================= */

function initTableSystem() {

    document.querySelectorAll(".symbol-box").forEach(box => {

        box.addEventListener("click", () => {

            if (GameEngine.isSpinning) return;
            if (!GameEngine.selectedChip) return;

            const symbol = box.dataset.symbol;
            const amount = GameEngine.selectedChip.value;

            if (GameEngine.balance < amount) return;

            GameEngine.balance -= amount;
            updateBalanceUI();

            GameEngine.bets[symbol] =
                (GameEngine.bets[symbol] || 0) + amount;

            const marker = document.createElement("div");
            marker.className = "bet-marker";
            marker.innerText = "$" + amount;

            box.appendChild(marker);

            playTableSound();
        });
    });
}

/* =========================
   START: SPIN SYSTEM
========================= */

function onSpinClick() {

    if (GameEngine.isSpinning) return;
    if (Object.keys(GameEngine.bets).length === 0) return;

    lockBoard();
    playSpinSound();
    startWheelRotation();
}

/* =========================
   START: WHEEL ENGINE
========================= */

const SpinEngine = {
    minRotation: 1800,
    maxRotation: 3600
};

function startWheelRotation() {

    const wheel = document.getElementById("wheel");
    if (!wheel) return;

    const rotation =
        SpinEngine.minRotation +
        Math.floor(Math.random() * (SpinEngine.maxRotation - SpinEngine.minRotation));

    GameEngine.currentRotation += rotation;

    wheel.style.transition = "transform 5s ease-out";
    wheel.style.transform = `rotate(${GameEngine.currentRotation}deg)`;

    wheel.addEventListener("transitionend", endWheelRotation, { once: true });
}

function endWheelRotation() {

    const symbols = ["heart","diamond","club","spade","crown","flag"];

    const index =
        Math.floor((GameEngine.currentRotation % 360) / (360 / symbols.length));

    const result = symbols[index];

    GameEngine.lastResult = result;

    resolvePayout(result);

    GameEngine.bets = {};

    unlockBoard();

    updateBalanceUI();
}

/* =========================
   START: PAYOUT SYSTEM
========================= */

const PAYOUT = {
    heart: 2,
    diamond: 2,
    club: 2,
    spade: 2,
    crown: 3,
    flag: 3
};

function resolvePayout(result) {

    let win = 0;

    for (let k in GameEngine.bets) {
        if (k === result) {
            win += GameEngine.bets[k] * (PAYOUT[k] || 0);
        }
    }

    if (win > 0) {
        GameEngine.balance += win;
    }

    updateBalanceUI();
}

/* =========================
   START: INIT GAME
========================= */

function initGame() {

    initAudio();
    initChipSystem();
    initTableSystem();

    updateBalanceUI();
    setSpinButtonState(false);

    const btn = document.getElementById("spinBtn");
    if (btn) btn.addEventListener("click", onSpinClick);

    console.log("🚀 CLEAN GAME READY");
}

/* =========================
   BOOT
========================= */

document.addEventListener("DOMContentLoaded", initGame);
