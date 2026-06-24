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

// ======================================================
// 📦 END: DOM CACHE
// ======================================================



// ======================================================
// 🔊 START: INITIAL AUDIO EVENTS
// ======================================================

function playChipAudio() {

    console.log("[AUDIO] CHIP");

    GameEngine.playChipSound();

}

function playTableAudio() {

    console.log("[AUDIO] TABLE");

    GameEngine.playTableSound();

}

function playSpinButtonAudio() {

    console.log("[AUDIO] SPIN BUTTON");

    GameEngine.playSpinButtonSound();

}

function playSpinAudio() {

    console.log("[AUDIO] SPIN");

    GameEngine.playSpinSound();

}

// ======================================================
// 🔊 END: INITIAL AUDIO EVENTS
// ======================================================


// ======================================================
// 🪙 START: INITIAL CHIP EVENTS
// ======================================================

function initializeChipSystem() {

    console.log("[CHIP] INITIALIZED");



    defaultChip.addEventListener("click", () => {

        console.log("[CHIP] FAN TOGGLE");

        chipsContainer.classList.toggle("closed");

        playChipAudio();

    });



    chips.forEach(chip => {

        chip.addEventListener("click", () => {

            const chipValue = Number(
                chip.dataset.value
            );

            console.log(
                "[CHIP] SELECTED:",
                chipValue
            );



            GameEngine.selectChip(
                chipValue
            );



            playChipAudio();



            swapDefaultChip(
                chip
            );



            chipsContainer.classList.add(
                "closed"
            );

        });

    });

}



// ======================================================
// 🪙 START: SWAP DEFAULT CHIP
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
// 🪙 END: CHIPSECTION
// ======================================================


// ======================================================
// 🎯 START: INITIAL BET EVENTS
// ======================================================

function initializeBetSystem() {

    console.log("[BET] INITIALIZED");



    symbolBoxes.forEach(symbolBox => {

        symbolBox.addEventListener("click", () => {

            const symbol =
                symbolBox.dataset.symbol;



            console.log(
                "[BET] CLICK:",
                symbol
            );



            const success =
                GameEngine.placeBet(
                    symbol
                );



            if (!success) {

                console.log(
                    "[BET] FAILED"
                );

                return;

            }



            console.log(
                "[BET] PLACED:",
                symbol
            );



            playTableAudio();



            updateBalanceUI();



            updateBetUI();

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

        console.log("[SPIN] BUTTON CLICK");



        playSpinButtonAudio();



        startWheelSpin();

    });

}



function startWheelSpin() {

    console.log("[SPIN] START");



    GameEngine.lockBets();



    playSpinAudio();



    // Wheel Animation
    // Result Calculation
    // Payout Calculation
    // Board Reset
    // New Round

}

// ======================================================
// 🎡 END: INITIAL WHEEL EVENTS
// ======================================================


// ======================================================
// 💰 START: INITIAL UI UPDATE SYSTEM
// ======================================================

function updateBalanceUI() {

    const balance =
        GameEngine.getCurrentBalance();

    balanceAmount.textContent =
        `$${balance.toFixed(2)}`;

    console.log(
        "[UI] BALANCE UPDATED:",
        balance
    );

}



function updateBetUI() {

    const bets =
        GameEngine.getCurrentBets();

    console.log(
        "[UI] BET UPDATED:",
        bets
    );

}



function updateChipUI() {

    const selectedChip =
        GameEngine.getCurrentChip();

    console.log(
        "[UI] CHIP UPDATED:",
        selectedChip
    );

}



function lockBoardUI() {

    spinBtn.disabled = true;



    chips.forEach(chip => {

        chip.style.pointerEvents = "none";

    });



    symbolBoxes.forEach(box => {

        box.style.pointerEvents = "none";

    });



    console.log(
        "[UI] BOARD LOCKED"
    );

}



function unlockBoardUI() {

    spinBtn.disabled = false;



    chips.forEach(chip => {

        chip.style.pointerEvents = "auto";

    });



    symbolBoxes.forEach(box => {

        box.style.pointerEvents = "auto";

    });



    console.log(
        "[UI] BOARD UNLOCKED"
    );

}



function resetBoardUI() {



    chipsContainer.classList.add(
        "closed"
    );



    chips.forEach(chip => {

        chip.classList.remove(
            "active"
        );

    });



    symbolBoxes.forEach(box => {

        box.classList.remove(
            "active"
        );

        box.classList.remove(
            "winner"
        );

    });



    console.log(
        "[UI] BOARD RESET"
    );

}



function refreshGameUI() {

    updateBalanceUI();

    updateBetUI();

    updateChipUI();

    console.log(
        "[UI] REFRESH COMPLETE"
    );

}

// ======================================================
// 💰 END: INITIAL UI UPDATE SYSTEM
// ======================================================


// ======================================================
// 🚀 START: START GAME UI
// ======================================================

function startGameUI() {

    console.log(
        "[GAME UI] STARTING"
    );



    initializeChipSystem();

    initializeBetSystem();

    initializeWheelSystem();



    refreshGameUI();



    console.log(
        "[GAME UI] READY"
    );

}

// ======================================================
// 🚀 END: START GAME UI
// ======================================================



// ======================================================
// 🎮 END: GAME UI
// ======================================================
