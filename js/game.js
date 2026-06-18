/* ======================================================
   🎰 CLEAN FINAL GAME ENGINE (PRODUCTION BASE)
====================================================== */

/* =========================
   CORE ENGINE STATE
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
   AUDIO SYSTEM (SINGLE INSTANCE)
========================= */

const AudioSystem = {
    enabled: true,
    chip: null,
    spin: null,
    wheel: null,
    table: null,
    win: null,
    lose: null
};

function initAudio() {
    AudioSystem.chip = document.getElementById("chipSound");
    AudioSystem.spin = document.getElementById("spinSound");
    AudioSystem.wheel = document.getElementById("wheelSound");
    AudioSystem.table = document.getElementById("tableSound");
    AudioSystem.win = document.getElementById("winSound");
    AudioSystem.lose = document.getElementById("loseSound");
}

/* =========================
   AUDIO HELPERS
========================= */

function playSound(sound) {
    if (!AudioSystem.enabled || !sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function playChipSound() { playSound(AudioSystem.chip); }
function playTableSound() { playSound(AudioSystem.table); }
function playSpinSound() { playSound(AudioSystem.spin); }
function playWinSound() { playSound(AudioSystem.win); }
function playLoseSound() { playSound(AudioSystem.lose); }

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

/* =========================
   UI HELPERS
========================= */

function updateBalanceUI() {
    const el = document.getElementById("balanceAmount");
    if (!el) return;
    el.innerText = "$" + GameEngine.balance.toFixed(2);
}

function setSpinButtonState(locked) {
    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    btn.disabled = locked;
    btn.innerText = locked ? "LOCKED" : "SPIN";
}

/* =========================
   BALANCE SYSTEM
========================= */

function subtractBalance(amount) {
    if (GameEngine.balance < amount) return false;

    GameEngine.balance -= amount;
    updateBalanceUI();
    return true;
}

/* =========================
   CHIP SYSTEM
========================= */

function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    let expanded = false;

    function closeMenu() {
        expanded = false;
        container.classList.remove("expanded");
        container.classList.add("collapsed");
    }

    defaultChip.addEventListener("click", (e) => {
        e.stopPropagation();

        if (GameEngine.isSpinning) return;

        expanded = !expanded;
        container.classList.toggle("expanded", expanded);
        container.classList.toggle("collapsed", !expanded);
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

            defaultChip.querySelector("span").innerText =
                "$" + GameEngine.selectedChip.value;

            playChipSound();
            closeMenu();
        });
    });

    document.addEventListener("click", closeMenu);
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

            GameEngine.bets[symbol] =
                (GameEngine.bets[symbol] || 0) + amount;

            const marker = document.createElement("div");
            marker.className = "bet-marker";
            marker.innerText = "$" + amount;

            box.appendChild(marker);

            playTableSound();

            console.log("BET:", GameEngine.bets);
        });
    });
}

/* =========================
   SPIN SYSTEM
========================= */

function onSpinClick() {

    if (GameEngine.isSpinning) return;
    if (Object.keys(GameEngine.bets).length === 0) return;

    GameEngine.isSpinning = true;

    playSpinSound();
    setSpinButtonState(true);

    lockBoard();

    startWheelSound();
    startWheelRotation();
}

/* =========================
   WHEEL ENGINE
========================= */

const SpinEngine = {
    minRotation: 1800,
    maxRotation: 3600,
    duration: 5000
};

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

    wheel.addEventListener("transitionend", endWheelRotation, { once: true });
}

function endWheelRotation() {

    stopWheelSound();

    const symbols = ["heart","diamond","club","spade","crown","flag"];

    const index =
        Math.floor((GameEngine.currentRotation % 360) / (360 / symbols.length));

    const result = symbols[index];

    GameEngine.lastResult = result;

    resolvePayout(result);

    unlockBoard();

    startNewRound();

    setSpinButtonState(false);
}

/* =========================
   PAYOUT ENGINE
========================= */

const PAYOUT = {
    heart: 2,
    diamond: 2,
    club: 2,
    spade: 2,
    crown: 3,
    flag: 3
};

function calculateWin(result) {

    let win = 0;

    for (let key in GameEngine.bets) {
        if (key === result) {
            win += GameEngine.bets[key] * (PAYOUT[key] || 0);
        }
    }

    return win;
}

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
   ROUND RESET
========================= */

function startNewRound() {
    GameEngine.bets = {};
    GameEngine.selectedChip = null;
}

/* =========================
   BOARD LOCK SYSTEM
========================= */

function lockBoard() {
    GameEngine.isSpinning = true;

    document.querySelectorAll(".chip").forEach(c => {
        c.style.pointerEvents = "none";
        c.style.opacity = "0.5";
    });
}

function unlockBoard() {
    GameEngine.isSpinning = false;

    document.querySelectorAll(".chip").forEach(c => {
        c.style.pointerEvents = "auto";
        c.style.opacity = "1";
    });
}

/* =========================
   INIT GAME
========================= */

function initGame() {

    initAudio();
    initChipSystem();
    initTableSystem();

    updateBalanceUI();
    setSpinButtonState(false);

    console.log("🚀 GAME READY");
}

document.addEventListener("DOMContentLoaded", initGame);
