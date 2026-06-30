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
function playBubbleBurstAudio() {

    console.log("[AUDIO] BUBBLE BURST");

    if (typeof GameEngine !== "undefined") {
        GameEngine.playBubbleBurstSound();
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

// ======================================================
// 🎡 START WHEEL SPIN
// ======================================================

function startWheelSpin() {

    console.log("[SPIN] START");

    GameEngine.lockBets();
    GameEngine.startSpin();

    playSpinAudio();

    const finalIndex =
        Math.floor(
            Math.random() * 18
        );

    const anglePerSlot =
        360 / 18;

    const currentRotation = 0;

    const finalAngle =
        2160 +
        (finalIndex * anglePerSlot);

    console.log(
        "[SPIN TARGET]",
        finalIndex
    );

    console.log(
        "[FINAL ANGLE]",
        finalAngle
    );

    spinBtn.classList.add(
        "spinning"
    );

    startBonusBubbleShow();

    animateWheelSpin(
        currentRotation,
        finalAngle,
        finalIndex
    );
}
// ======================================================
// 🎡 END WHEEL SPIN
// ======================================================
// ======================================================
// 🎯 START WHEEL ANIMATION FRAME
// ======================================================

function animateWheelSpin(
    startAngle,
    endAngle,
    finalIndex
) {

    console.log(
        "ANIMATE FUNCTION RUNNING"
    );

    if (wheelAnimationFrame) {
        cancelAnimationFrame(
            wheelAnimationFrame
        );
    }

    const duration = 16000;
    const startTime =
        performance.now();

    function frame(now) {

        let t =
            (now - startTime) /
            duration;

        if (t >= 0.995) {

    console.log(
        "LANDING BLOCK HIT"
    );

    t = 1;

    wheel.style.transform =
        `rotate(${endAngle}deg)`;

    GameEngine.setWheelRotation(
        endAngle
    );

    // 👇 VISUAL ONLY DEBUG
    const landedRotation =
        ((endAngle % 360) + 360) % 360;

    const visualSlot =
    Math.round(
        landedRotation / 20
    ) % 18;

const landedSlot =
    (18 - visualSlot) % 18;

    console.log(
        "[VISUAL ROTATION]",
        landedRotation
    );

    console.log(
        "[VISUAL SLOT]",
        landedSlot
    );
    // 👆 VISUAL ONLY DEBUG

    spinBtn.classList.remove(
        "spinning"
    );

       // wheel landed

    GameEngine.endSpin(
    landedSlot
);

    // 🔓 CALL HERE
    GameEngine.unlockBets();

    unlockBoardUI();

    console.log(
        "[UNLOCK CALLED]"
    );

    spinBtn.classList.remove(
        "spinning"
    );

    return;
}

        const eased =
            1 -
            Math.pow(
                1 - t,
                2.2
            );

        const angle =
            startAngle +
            (
                endAngle -
                startAngle
            ) * eased;

        wheel.style.transform =
            `rotate(${angle}deg)`;

        wheelAnimationFrame =
            requestAnimationFrame(
                frame
            );
    }

    wheelAnimationFrame =
        requestAnimationFrame(
            frame
        );
}

// ======================================================
// 🎯 END WHEEL ANIMATION FRAME
// ======================================================
function updateUI(resultSymbols) { // প্যারামিটার নাম যেটা দিবেন, ভেতরে সেটাই ব্যবহার করবেন
    console.log("[UI] Updating with:", resultSymbols);
    
    symbolBoxes.forEach((box, i) => {
        box.className = "symbol-box"; // আগে ক্লাস ক্লিয়ার করুন
        // এখানে 'symbols' এর বদলে 'resultSymbols' ব্যবহার করুন
        if (resultSymbols && resultSymbols[i]) {
            box.classList.add(resultSymbols[i]);
        }
    });
}

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

    // ENGINE UNLOCK
    GameEngine.unlockBets();

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

    clearBonusBubbleSystem();

    updateBalanceUI();

    updateBetUI();

    updateChipUI();

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
// 🎯 FLY WINNING BUBBLE
// ======================================================

function flyWinningBubble() {

    const bubble =
        document.querySelector(
            '.bonus-bubble[data-survivor="true"]'
        );

    if (!bubble) {
        console.warn("[BUBBLE] Survivor not found");
        return;
    }

    const target =
        document.querySelector(
            '[data-symbol="' +
            activeBubbleSymbol +
            '"]'
        );

    if (!target) {

        console.error(
            "[BUBBLE] Missing Symbol:",
            activeBubbleSymbol
        );

        return;
    }

    const targetRect =
        target.getBoundingClientRect();

    bubble.classList.add(
        "bubble-flying"
    );

    bubble.style.position =
        "fixed";

    bubble.style.left =
        (
            targetRect.left +
            targetRect.width / 2
        ) + "px";

    bubble.style.top =
        (
            targetRect.top +
            targetRect.height / 2
        ) + "px";

    setTimeout(() => {

   playBubbleWinAudio();

bubble.classList.add(
    "bubble-landed"
);

    attachBubbleToSymbol(
        bubble,
        target
        );

    }, 1000);

}
// ======================================
// ATTACH TO SYMBOL
// ======================================
function attachBubbleToSymbol(
    bubble,
    target
) {

    target.style.position =
        "relative";

    bubble.style.position =
        "absolute";

    bubble.style.left =
        "50%";

    bubble.style.top =
        "8px";

    bubble.style.transform =
        "translateX(-50%)";

    bubble.innerHTML =
        activeBubbleMultiplier +
        "X";

    target.appendChild(
        bubble
    );

    target.classList.add(
        "multiplier-hit"
    );

    console.log(
        "[LOCKED]",
        activeBubbleMultiplier + "X",
        activeBubbleSymbol
    );
}
// ==================================================
// START SELECT BUBBLE TARGET
// ==================================================

function selectBubbleTarget() {

    activeBubbleMultiplier =
        BUBBLE_MULTIPLIERS[
            Math.floor(
                Math.random() *
                BUBBLE_MULTIPLIERS.length
            )
        ];

    activeBubbleSymbol =
        BUBBLE_SYMBOLS[
            Math.floor(
                Math.random() *
                BUBBLE_SYMBOLS.length
            )
        ];

    console.log(
        "[BUBBLE]",
        activeBubbleMultiplier + "X",
        activeBubbleSymbol
    );

    console.log(
        "[TARGET SYMBOL]",
        activeBubbleSymbol
    );
}
// ======================================
// START BONUS BUBBLE SHOW
// ======================================

function startBonusBubbleShow() {

    if (bubbleAnimationRunning) return;

    bubbleAnimationRunning = true;

    activeBubbleMultiplier = null;
    activeBubbleSymbol = null;

    bubbleTargetLocked = false;

    selectBubbleTarget();

    spawnBubbleWave();

}
// ======================================================
// 🎯 RESET SYSTEM (optional use before spin)
// ======================================================

// ======================================
// SPAWN BUBBLE WAVE
// ======================================

function spawnBubbleWave() {

    const layer =
        document.getElementById(
            "bonusBubbleLayer"
        );

    if (!layer) return;

    layer.innerHTML = "";

    const bubbleCount = 8;

    const survivorIndex =
        Math.floor(
            Math.random() * bubbleCount
        );

    const colors = [

        "#ff4757",
        "#3742fa",
        "#2ed573",
        "#ffa502",
        "#a55eea",
        "##00d2d3",
        "#FF0000",
        "#FFFF00"
    ];

    for (
        let i = 0;
        i < bubbleCount;
        i++
    ) {

        const bubble =
            document.createElement(
                "div"
            );

        bubble.className =
            "bonus-bubble";

        bubble.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        const angle =
            (Math.PI * 2 / bubbleCount) * i;

        const distance =
            8 + Math.random() * 20;

        const offsetX =
            Math.cos(angle) * distance;

        const offsetY =
            Math.sin(angle) * distance;

        bubble.style.left =
            `calc(50% + ${offsetX}px)`;

        bubble.style.top =
            `calc(50% + ${offsetY}px)`;

        bubble.innerHTML =
            `<span class="bubble-text">
                ${activeBubbleMultiplier}X
            </span>`;

        layer.appendChild(
            bubble
        );

        requestAnimationFrame(() => {

            bubble.classList.add(
                i === survivorIndex
                    ? "bubble-survivor"
                    : "bubble-grow"
            );

        });

        if (
            i === survivorIndex
        ) {

            bubble.dataset.survivor =
                "true";
             playBubbleLandAudio();
      
            bubble.classList.add(
                "bubble-winner"
            );

            currentBubbleElement =
                bubble;

        } else {

            setTimeout(() => {
                playBubbleBurstAudio();

                bubble.classList.add(
                    "bubble-explode"
                );

                setTimeout(() => {

                    bubble.remove();

                }, 500);

            }, 4000);

        }

    }

    setTimeout(() => {

    playBubbleFlyAudio();

    flyWinningBubble();

}, 4500);

    }, 4500);

}
// ======================================
// CLEAR BONUS BUBBLES
// ======================================

function clearBonusBubbleSystem() {

    document
        .querySelectorAll(
            ".bonus-bubble"
        )
        .forEach(el => el.remove());

    currentBubbleElement = null;

    activeBubbleMultiplier = null;

    activeBubbleSymbol = null;

    bubbleAnimationRunning = false;

    bubbleTargetLocked = false;

}
