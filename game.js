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
let wheelAnimationFrame = null;

const wheel = document.getElementById("wheel");

const spinBtn = document.getElementById("spinBtn");

const balanceAmount = document.getElementById("balanceAmount");

const chipsWrapper = document.querySelector(".chips-wrapper");

const chipsContainer = document.querySelector(".chips-container");

const defaultChip = document.querySelector(".default-chip");

const chips = document.querySelectorAll(".chip");

const symbolBoxes = document.querySelectorAll(".symbol-box");

const pointer = document.getElementById("pointer");
// ======================================
// BONUS BUBBLE SYSTEM
// ======================================

let activeBubbleMultiplier = null;

let activeBubbleSymbol = null;

let bubbleAnimationRunning = false;

let bubbleTargetLocked = false;

let currentBubbleElement = null;

const BUBBLE_MULTIPLIERS = [
    2,
    3,
    4,
    5
];

const BUBBLE_SYMBOLS = [
    "heart",
    "diamond",
    "spade",
    "crown",
    "club",
    "flag"
];


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
function playBubbleFlyAudio() {

    console.log("[AUDIO] BUBBLE FLY");

    if (typeof GameEngine !== "undefined") {
        GameEngine.playBubbleFlySound();
    }
}
function playBubbleLandAudio() {

    console.log("[AUDIO] BUBBLE LAND");

    if (typeof GameEngine !== "undefined") {
        GameEngine.playBubbleLandSound();
    }
}
function playBubbleWinAudio() {

    console.log("[AUDIO] BUBBLE WIN");

    if (typeof GameEngine !== "undefined") {
        GameEngine.playBubbleWinSound();
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
// 🎯 START WHEEL ANIMATION FRAME
// ======================================================
function animateWheelSpin(startAngle, endAngle) {

    if (wheelAnimationFrame) {
        cancelAnimationFrame(wheelAnimationFrame);
    }

    const duration = 16000;
    const startTime = performance.now();

    function frame(now) {

        let t = (now - startTime) / duration;
        if (t > 1) t = 1;

        // ⚡ smooth continuous curve (speed  system)
        const eased = 1 - Math.pow(1 - t, 2.2);

        const angle =
            startAngle +
            (endAngle - startAngle) * eased;

        wheel.style.transform = `rotate(${angle}deg)`;

        if (t < 1) {
            wheelAnimationFrame = requestAnimationFrame(frame);
        }
    }

    wheelAnimationFrame = requestAnimationFrame(frame);
}
// END

// ======================================================
// 🎯 END WHEEL ANIMATION FRAME
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

    animateWheelSpin(
    currentRotation,
    finalAngle
);

   spinBtn.classList.add("spinning");

    // 🎈 bubble starts instantly
    startBonusBubbleShow();

    // ⏱️ end spin after 14s
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

// ======================================================
// 🎮 BUBBLE BALL BONUS SECTION
// ======================================================
// ======================================================
// 🎯 SELECT RANDOM TARGET SYMBOL
// ======================================================

function selectBubbleTarget() {

    const symbolBoxes =
        document.querySelectorAll(".symbol-box");

    if (!symbolBoxes.length) {
        console.error("[BUBBLE] No symbol boxes found");
        return;
    }

    const randomIndex =
        Math.floor(Math.random() * symbolBoxes.length);

    const target =
        symbolBoxes[randomIndex];

    activeBubbleSymbol =
        target.dataset.symbol || null;

    console.log("[TARGET SYMBOL]", activeBubbleSymbol);

    return target;
}

// ======================================================
// 🎯 START BUBBLE ROUND
// ======================================================

function startBonusBubbleShow() {

    if (bubbleAnimationRunning) return;

    bubbleAnimationRunning = true;

    activeBubbleMultiplier = null;
    activeBubbleSymbol = null;

    const target = selectBubbleTarget();

    spawnBubbleWave(target);
}

// ======================================================
// 🎯 SPAWN BUBBLE WAVE
// ======================================================

function spawnBubbleWave() {

    const layer = document.getElementById("bonusBubbleLayer");
    if (!layer) return;

    layer.innerHTML = "";

    const colors = [
        "#ff4444",
        "#00ccff",
        "#ffcc00",
        "#00ff66",
        "#cc66ff"
    ];

    const multipliers = [2, 3, 4, 5];

    const bubbleCount = 8;
    const bubbles = [];

    // 🎯 wheel center (adjust if needed)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < bubbleCount; i++) {

        const bubble = document.createElement("div");
        bubble.className = "bonus-bubble";

        const color = colors[Math.floor(Math.random() * colors.length)];
        const text = multipliers[Math.floor(Math.random() * multipliers.length)] + "X";

        bubble.style.background = color;
        bubble.innerHTML = text;

        // 📍 center spawn
        bubble.style.left = centerX + "px";
        bubble.style.top = centerY + "px";

        layer.appendChild(bubble);
        bubbles.push(bubble);

        // 🌱 smooth grow
        requestAnimationFrame(() => {
            bubble.classList.add("bubble-grow");
        });
    }

    // ⏱ after 7–8 sec → next phase
    setTimeout(() => {
        flyWinningBubble(bubbles);
    }, 7500);
}

// ======================================================
// 🎯 FLY WINNING BUBBLE
// ======================================================

function flyWinningBubble(bubbles) {

    const symbolBoxes = document.querySelectorAll(".symbol-box");

    if (!symbolBoxes.length) {
        console.error("[BUBBLE] No symbol boxes found");
        return;
    }

    if (!bubbles || !bubbles.length) {
        console.error("[BUBBLE] No bubbles passed");
        return;
    }

    const targetIndex =
        Math.floor(Math.random() * symbolBoxes.length);

    const target = symbolBoxes[targetIndex];

    const winnerIndex =
        Math.floor(Math.random() * bubbles.length);

    const winner = bubbles[winnerIndex];

    if (!winner || !target) {
        console.error("[BUBBLE] Missing fly target");
        return;
    }

    const rect = target.getBoundingClientRect();

    winner.classList.add("bubble-flying");

    winner.style.left = (rect.left + rect.width / 2) + "px";
    winner.style.top = (rect.top + rect.height / 2) + "px";

    target.classList.add("symbol-hit");

    setTimeout(() => {
        target.classList.remove("symbol-hit");
        winner.classList.add("bubble-landed");
    }, 1200);
}

// ======================================================
// 🎯 RESET SYSTEM (optional use before spin)
// ======================================================

function resetBubbleSystem() {

    bubbleAnimationRunning = false;

    activeBubbleMultiplier = null;
    activeBubbleSymbol = null;
    currentBubbleElement = null;

    const layer = document.getElementById("bonusBubbleLayer");

    if (layer) layer.innerHTML = "";
}
