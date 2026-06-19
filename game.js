/* =========================
   🔊 CORE PLAY FUNCTION
========================= */

function playSound(s) {
    if (!AudioSystem.enabled || !s) return;
    s.currentTime = 0;
    s.play().catch(() => {});
}

/* =========================
   🎵 SOUND HELPERS
========================= */

const playChipSound = () => playSound(AudioSystem.chip);

const playSpinButtonSound = () => playSound(AudioSystem.spinButton);

const playTableSound = () => playSound(AudioSystem.table);

const startWheelSound = () => playSound(AudioSystem.wheel);

function stopWheelSound() {
    if (!AudioSystem.wheel) return;
    AudioSystem.wheel.pause();
    AudioSystem.wheel.currentTime = 0;
}


/* =========================================================
   🎯 UI SYSTEM
========================================================= */

function updateBalanceUI() {
    document.getElementById("balanceAmount").innerText =
        "$" + GameEngine.balance.toFixed(2);
}

function setSpinButtonState(lock) {
    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    btn.disabled = lock;
    btn.classList.toggle("locked", lock);
}


/* =========================================================
   💰 BALANCE SYSTEM
========================================================= */

function subtractBalance(amount) {
    if (GameEngine.balance < amount) return false;

    GameEngine.balance -= amount;
    updateBalanceUI();
    return true;
}


/* =========================================================
   🪙 CHIP SYSTEM
========================================================= */

function initChipSystem() {
    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    let open = false;

    defaultChip.addEventListener("click", () => {
        if (GameEngine.isSpinning) return;

        open = !open;
        container.classList.toggle("expanded", open);
        container.classList.toggle("collapsed", !open);
    });

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            if (GameEngine.isSpinning) return;

            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            GameEngine.selectedChip = {
                value: parseFloat(chip.dataset.value)
            };

            defaultChip.querySelector("span").innerText =
                "$" + GameEngine.selectedChip.value;

            playChipSound();

            container.classList.add("collapsed");
            container.classList.remove("expanded");
            open = false;
        });
    });
}


/* =========================================================
   🎯 TABLE SYSTEM (BETTING)
========================================================= */

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


/* =========================================================
   🎮 SPIN SYSTEM
========================================================= */

function onSpinClick() {
    if (GameEngine.isSpinning) return;
    if (Object.keys(GameEngine.bets).length === 0) return;

    GameEngine.isSpinning = true;

    setSpinButtonState(true);
    playSpinSound();

    startWheelRotation();
}


/* =========================================================
   🎡 WHEEL ENGINE
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

    const result = symbols[index];

    GameEngine.lastResult = result;

    resolvePayout(result);

    GameEngine.isSpinning = false;
    GameEngine.bets = {};

    setSpinButtonState(false);

    console.log("RESULT:", result);
}


/* =========================================================
   💸 PAYOUT SYSTEM
========================================================= */

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

    GameEngine.balance += win;
    updateBalanceUI();
}


/* =========================================================
   🚀 INIT GAME (FINAL ENTRY POINT)
========================================================= */

function initGame() {

    console.log("🚀 GAME INIT START");

    initAudio();
    initChipSystem();
    initTableSystem();

    updateBalanceUI();
    setSpinButtonState(false);

    document.getElementById("spinBtn")
        .addEventListener("click", onSpinClick);

    console.log("✔ GAME READY");
}


/* =========================================================
   🧷 DOM READY BOOT
========================================================= */

document.addEventListener("DOMContentLoaded", initGame);
