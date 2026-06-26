// ======================================================
// 🎮 START: GAME UI
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("[GAME UI] DOM READY");

    startGameUI();

});


// ======================================================
// 📦 START: DOM CACHE
// ======================================================

const wheel = document.getElementById("wheel");

const spinBtn = document.getElementById("spinBtn");

const balanceAmount = document.getElementById("balanceAmount");

const chipsWrapper = document.querySelector(".chips-wrapper");

const chipsContainer = document.querySelector(".chips-container");

const defaultChip = document.querySelector(".default-chip");

const chips = document.querySelectorAll(".chip");

const symbolBoxes = document.querySelectorAll(".symbol-box");

const pointer = document.getElementById("pointer");
const bonusBallLayer =
    document.querySelector(".bonus-ball-layer");

const bonusBall =
    document.querySelector(".bonus-ball");

const bonusMultiplier =
        document.querySelector(".bonus-ball-multiplier");


// ======================================================
// 📦 END: DOM CACHE
// ======================================================



// ======================================================
// 🔊 START: INITIAL AUDIO EVENTS
// ======================================================

function playChipAudio() {

    console.log("[AUDIO] CHIP");

    if (typeof GameEngine !== "undefined") {
        GameEngine.playChipSound();
    }

}


function playTableAudio() {

    console.log("[AUDIO] TABLE");

    if (typeof GameEngine !== "undefined") {
        GameEngine.playTableSound();
    }

}


function playSpinButtonAudio() {

    console.log("[AUDIO] SPIN BUTTON");

    if (typeof GameEngine !== "undefined") {
        GameEngine.playSpinButtonSound();
    }

}


function playSpinAudio() {

    console.log("[AUDIO] SPIN");

    if (typeof GameEngine !== "undefined") {
        GameEngine.playSpinSound();
    }

}

// ======================================================
// 🔊 END: INITIAL AUDIO EVENTS
// =======================================================

//======================================================
// BONUS MULTPLY SECTION START
// =======================================================

//======================================================
// BONUS MULTPLY SECTION END
// =======================================================


// ======================================================
// 🪙 START: INITIAL CHIP SYSTEM
// ======================================================

function initializeChipSystem() {

    console.log("[CHIP] INITIALIZED");



    // =========================
    // 🎯 TOGGLE CHIP PANEL (CSS CONTROL ONLY)
    // =========================

    defaultChip.addEventListener("click", () => {

        console.log("[CHIP] PANEL TOGGLE");

        chipsContainer.classList.toggle("closed");

        playChipAudio();

    });



    // =========================
    // 🪙 CHIP SELECTION
    // =========================

    chips.forEach(chip => {

        chip.addEventListener("click", () => {

            const chipValue =
                Number(chip.dataset.value);



            console.log("[CHIP] SELECTED:", chipValue);



            // =========================
            // 🎯 ENGINE SYNC
            // =========================

            GameEngine.selectChip(chipValue);



            playChipAudio();



            // =========================
            // 🔄 SWAP UI STATE
            // =========================

            swapDefaultChip(chip);



            chipsContainer.classList.add("closed");

        });

    });

}



// ======================================================
// 🪙 DEFAULT CHIP FALLBACK LOGIC
// ======================================================

function getActiveChipValue() {

    // যদি কেউ select না করে → default chip use হবে

    const value =
        Number(defaultChip.dataset.value);

    return value || 0.10; // safety fallback

}



// ======================================================
// 🪙 SWAP DEFAULT CHIP UI
// ======================================================

function swapDefaultChip(selectedChip) {

    const defaultImage =
        defaultChip.querySelector("img");

    const defaultText =
        defaultChip.querySelector("span");



    const selectedImage =
        selectedChip.querySelector("img");

    const selectedText =
        selectedChip.querySelector("span");



    const tempImage =
        defaultImage.src;

    const tempText =
        defaultText.textContent;

    const tempValue =
        defaultChip.dataset.value;



    defaultImage.src =
        selectedImage.src;

    defaultText.textContent =
        selectedText.textContent;

    defaultChip.dataset.value =
        selectedChip.dataset.value;



    selectedImage.src =
        tempImage;

    selectedText.textContent =
        tempText;

    selectedChip.dataset.value =
        tempValue;

}



// ======================================================
// 🪙 END: INITIAL CHIP SYSTEM
// ======================================================

// ======================================================
// 🎯 START: INITIAL BET EVENTS
// ======================================================

function initializeBetSystem() {

    console.log("[BET] INITIALIZED");



    symbolBoxes.forEach(symbolBox => {

        symbolBox.addEventListener("click", () => {



            // =========================
            // 🚫 UI LOCK CHECK
            // =========================

            if (GameEngine.isBetLocked()) {
             console.log("[BET] UI LOCKED");
            return;
           }



            const symbol =
                symbolBox.dataset.symbol;



            console.log("[BET] CLICK:", symbol);



            // =========================
            // 🎯 PLACE BET (ENGINE)
            // =========================

            const success =
                GameEngine.placeBet(symbol);



            if (!success) {

                console.log("[BET] FAILED");

                return;

            }



            console.log("[BET] PLACED:", symbol);



            // =========================
            // 🔊 AUDIO
            // =========================

            playTableAudio();



            // =========================
            // 💰 UI UPDATE
            // =========================

            updateBalanceUI();

            updateBetUI();

            updateChipUI();

        });

    });

}

// ======================================================
// 🎯 END: INITIAL BET EVENTS
// ======================================================


// ======================================================
// 🎡 START: INITIAL WHEEL EVENTS
// ======================================================

function initializeWheelSystem() {

    console.log("[SPIN] INITIALIZED");



    spinBtn.addEventListener("click", () => {



        // =========================
        // 🚫 SAFETY CHECKS
        // =========================

              if (
    GameEngine.isBetLocked() ||
    GameEngine.getCurrentSpinStatus()
) {
    console.log("[SPIN] BLOCKED");
    return;
}

if (!GameEngine.hasBets()) {
    console.log("[SPIN] NO BETS");
    return;
}

console.log("[SPIN] BUTTON CLICK");



        playSpinButtonAudio();



        startWheelSpin();

    });

}



// ======================================================
// 🎡 SPIN FLOW CONTROLLER
// ======================================================

function startWheelSpin() {

    console.log("[SPIN] START");

    GameEngine.lockBets();
    GameEngine.startSpin();

    playSpinAudio();

    const finalIndex = Math.floor(Math.random() * 18);

const anglePerSlot = 360 / 18;

const currentRotation =
    GameEngine.getWheelRotation();

const finalAngle =
    currentRotation +
    2160 +
    (finalIndex * anglePerSlot);

GameEngine.setWheelRotation(finalAngle);

    wheel.style.transition = "none";

wheel.offsetWidth;

wheel.style.transition =
    "transform 14s cubic-bezier(0.22, 0.61, 0.36, 1)";
    wheel.style.transform = `rotate(${finalAngle}deg)`;

    spinBtn.classList.add("spinning");

    setTimeout(() => {

        GameEngine.endSpin(finalIndex);

        spinBtn.classList.remove("spinning");

    }, 14000);
}
// ======================================================
// 🎡 END: INITIAL WHEEL EVENTS
// ======================================================


// ======================================================
// 💰 START: INITIAL UI UPDATE SYSTEM
// ======================================================


// =========================
// 💰 BALANCE UI
// =========================

function updateBalanceUI() {

    const balance =
        GameEngine.getCurrentBalance();

    balanceAmount.textContent =
        `$${balance.toFixed(2)}`;

    console.log("[UI] BALANCE UPDATED:", balance);

}


// =========================
// 🎯 BET UI (VISUAL ONLY)
// =========================

function updateBetUI() {

    const bets = GameEngine.getCurrentBets();

    document.querySelectorAll(".symbol-box")
        .forEach(box => {

            const symbol =
                box.dataset.symbol;

            const amount =
                bets[symbol] || 0;

            const amountEl =
                box.querySelector(".bet-amount");

            if (!amountEl) return;

            amountEl.textContent =
    amount > 0
        ? parseFloat(amount.toFixed(2))
        : "";

        });

    console.log("[UI] BET UPDATED:", bets);

}

// =========================
// 🪙 CHIP UI
// =========================

function updateChipUI() {

    const selectedChip =
        GameEngine.getCurrentChip();

    console.log("[UI] CHIP UPDATED:", selectedChip);

}


// ======================================================
// 🔒 BOARD UI LOCK (VISUAL ONLY)
// ======================================================

function lockBoardUI() {

    if (spinBtn) spinBtn.disabled = true;



    chips.forEach(chip => {

        chip.style.pointerEvents = "none";

    });



    symbolBoxes.forEach(box => {

        box.style.pointerEvents = "none";

    });



    console.log("[UI] BOARD LOCKED");

}


// ======================================================
// 🔓 BOARD UI UNLOCK (VISUAL ONLY)
// ======================================================

function unlockBoardUI() {

    if (spinBtn) spinBtn.disabled = false;



    chips.forEach(chip => {

        chip.style.pointerEvents = "auto";

    });



    symbolBoxes.forEach(box => {

        box.style.pointerEvents = "auto";

    });



    console.log("[UI] BOARD UNLOCKED");

}


// ======================================================
// 🔄 BOARD VISUAL RESET
// ======================================================

function resetBoardUI() {

    chipsContainer?.classList.add("closed");



    chips.forEach(chip => {

        chip.classList.remove("active");

    });



    symbolBoxes.forEach(box => {

        box.classList.remove("active");
        box.classList.remove("winner");

    });



    console.log("[UI] BOARD RESET");

}


// ======================================================
// 🔁 FULL UI REFRESH
// ======================================================
   function refreshGameUI() {

    updateBalanceUI();

    updateBetUI();

    updateChipUI();

    // updateResultUI();

    console.log("[UI] REFRESH COMPLETE");

}

// ======================================================
// 💰 END: INITIAL UI UPDATE SYSTEM
// ======================================================


// ======================================================
// 🚀 START: START GAME UI
// ======================================================

function startGameUI() {

    console.log("[GAME UI] STARTING");



    // =========================
    // 🧠 ENGINE SAFETY CHECK
    // =========================

    if (typeof GameEngine === "undefined") {

        console.error("[GAME UI] GameEngine NOT FOUND");

        return;

    }



    // =========================
    // 🎮 INITIALIZE SYSTEMS
    // =========================

    initializeChipSystem();

    initializeBetSystem();

    initializeWheelSystem();
    testBonus();



    // =========================
    // 🔄 INITIAL UI SYNC
    // =========================

    refreshGameUI();



    // =========================
    // 🧠 READY STATE
    // =========================

    console.log("[GAME UI] READY");



    // =========================
    // 🚀 FUTURE HOOK
    // =========================

    if (typeof onGameUIReady === "function") {

        onGameUIReady();

    }

}

// ======================================================
// 🚀 END: START GAME UI
// ======================================================
function testBonus() {

    const bonusMultiplier =
        document.querySelector(".bonus-ball-multiplier");

    if (!bonusMultiplier) {

        console.log("BONUS MULTIPLIER NOT FOUND");

        return;

    }

    bonusMultiplier.textContent = "10X";

    bonusMultiplier.style.display = "block";

}
// ======================================================
// 🎮 END: GAME UI
// ======================================================
