// ======================================================
// 🎮 GAME.JS
// ======================================================


// ======================================================
// 🚀 START: GAME INIT SECTION
// ======================================================



function initGame() {

    console.log(
        "🧠 INIT GAME START"
    );

    try {

        // 🪙 CHIP SYSTEM

        if (
            typeof initChipSystem ===
            "function"
        ) {

            initChipSystem();
        }

        // 🎯 TABLE SYSTEM

        if (
            typeof setupBoardSystem ===
            "function"
        ) {

            setupBoardSystem();
        }

        // 🎰 SPIN BUTTON

        if (
            typeof setupSpinButton ===
            "function"
        ) {

            setupSpinButton();
        }

        console.log(
            "🎮 GAME READY"
        );

    } catch (err) {

        console.log(
            "💥 GAME INIT ERROR:",
            err
        );
    }
}



function startGame() {

    initGame();
}



function connectSystems() {

    console.log(
        "🔗 SYSTEMS CONNECTED"
    );
}



// AUTO START

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "🚀 GAME DOM READY"
        );

        startGame();

        connectSystems();
    }
);



// ======================================================
// 🚀 END: GAME INIT SECTION
// ======================================================
// ======================================================
// 🔄 START: ROUND CONTROL SECTION
// ======================================================

function startNewRound() {

    GameEngine.bets = {};

    console.log("🔄 NEW ROUND STARTED");
}

// ======================================================
// 🔄 END: ROUND CONTROL SECTION
// ======================================================



// ======================================================
// 🪙 START: CHIP SECTION
// ======================================================

function initChipSystem() {

    const chips =
        document.querySelectorAll(".chip");

    if (!chips.length) {
        console.log("❌ No chips found");
        return;
    }

    chips.forEach((chip) => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            // ACTIVE STATE ONLY
            chips.forEach(c =>
                c.classList.remove("active")
            );

            chip.classList.add("active");

            // STORE VALUE ONLY
            GameEngine.selectedChip = {
                value: parseFloat(
                    chip.getAttribute("data-value")
                ),
                element: chip
            };

            console.log(
                "🪙 CHIP:",
                GameEngine.selectedChip.value
            );

            // SOUND
            if (GameEngine.chipSound) {

                GameEngine.chipSound.currentTime = 0;

                GameEngine.chipSound.play()
                    .catch(() => {});
            }

        });

    });
}

// ======================================================
// END: CHIP SECTION
// ======================================================


// ======================================================
// 🎯 START: TABLE SECTION (FIXED)
// ======================================================

function setupBoardSystem() {

    const boxes =
        document.querySelectorAll(".symbol-box");

    boxes.forEach(box => {

        box.addEventListener("click", () => {
            onTableClick(box);
        });

    });
}


// 🧠 FIX: INLINE CHECK (NO MISSING FUNCTION)
function onTableClick(box) {

    // ❌ no chip selected
    if (!GameEngine.selectedChip) {
        console.log("❌ Select chip first");
        return;
    }

    const symbol =
        box.dataset.symbol;

    const chip =
        GameEngine.selectedChip;

    const amount =
        chip.value;

    const success =
        subtractBalance(amount);

    if (!success) return;

    addBet(symbol, amount);

    placeChipVisual(box, amount);

    console.log("💰 BET:", symbol, amount);
}


// 🎯 VISUAL CHIP
function placeChipVisual(box, amount) {

    const marker = document.createElement("div");

    marker.className = "bet-marker";
    marker.innerText = amount;

    box.appendChild(marker);
}


// 🧹 CLEAR BOARD
function clearBoardVisuals() {

    document.querySelectorAll(".bet-marker")
        .forEach(marker => marker.remove());
}

// ======================================================
// 🎯 END: TABLE SECTION (FIXED)
// ======================================================



// ======================================================
// 🎰 START: SPIN BUTTON SECTION
// ======================================================



function setupSpinButton() {

    const btn =
        document.getElementById(
            "spinBtn"
        );

    if (!btn) {

        console.log(
            "❌ spinBtn not found"
        );

        return;
    }

    btn.addEventListener(
        "click",
        spinGame
    );

    console.log(
        "🎰 SPIN BUTTON READY"
    );
}



function spinGame() {

    console.log(
        "🔥 SPIN START REQUEST"
    );

    if (
        isWheelSpinning()
    ) {

        console.log(
            "❌ Wheel already spinning"
        );

        return;
    }

    if (
        !hasBets()
    ) {

        console.log(
            "❌ Place a bet first"
        );

        return;
    }

    const started =
        startSpin();

    if (!started) {

        return;
    }

    playSpinSound();

    lockSpinButton();

    spinWheel();
}



function lockSpinButton() {

    const btn =
        document.getElementById(
            "spinBtn"
        );

    if (!btn) return;

    btn.disabled = true;
}



function unlockSpinButton() {

    const btn =
        document.getElementById(
            "spinBtn"
        );

    if (!btn) return;

    btn.disabled = false;
}



// ======================================================
// 🎰 END: SPIN BUTTON SECTION
// ======================================================


// ======================================================
// 🎡 START: WHEEL ANIMATION SECTION
// ======================================================



function spinWheel() {

    const wheel =
        document.getElementById(
            "wheel"
        );

    if (!wheel) {

        console.log(
            "❌ Wheel not found"
        );

        stopSpin();

        unlockSpinButton();

        return;
    }

    const spins = 18;

    const randomAngle =
        Math.floor(
            Math.random() * 360
        );

    const totalRotation =
        (spins * 360) +
        randomAngle;

    addWheelRotation(
        totalRotation
    );

    const currentAngle =
        getWheelRotation();

    wheel.style.transition =
        "transform 10s cubic-bezier(0.08, 0.85, 0.18, 1)";

    wheel.style.transform =
        `rotate(${currentAngle}deg)`;

    console.log(
        "🎡 SPIN START:",
        currentAngle
    );

    setTimeout(
        () => {

            const finalAngle =
                currentAngle % 360;

            console.log(
                "🎯 FINAL ANGLE:",
                finalAngle
            );

            handleWheelResult(
                finalAngle
            );

            clearBoardVisuals();

            stopSpin();

            unlockSpinButton();

        },
        10000
    );
}





// ======================================================
// 🎡 END: WHEEL ANIMATION SECTION
// ======================================================


// ======================================================
// 📍 START: POINTER SECTION
// ======================================================



function initPointer() {

    const pointer =
        document.getElementById(
            "pointer"
        );

    if (!pointer) {

        console.log(
            "❌ Pointer not found"
        );

        return;
    }

    console.log(
        "📍 POINTER READY"
    );
}



function pointerTick() {

    const pointer =
        document.getElementById(
            "pointer"
        );

    if (!pointer) {
        return;
    }

    pointer.classList.add(
        "tick"
    );

    setTimeout(
        () => {

            pointer.classList.remove(
                "tick"
            );

        },
        100
    );
}


function resetPointer() {

    const pointer =
        document.getElementById(
            "pointer"
        );

    if (!pointer) {
        return;
    }

    pointer.classList.remove(
        "tick"
    );
}



// ======================================================
// 📍 END: POINTER SECTION
// ======================================================


// ======================================================
// 🏆 START: RESULT DISPLAY SECTION
// ======================================================



function updateResultDisplay(
    result
) {

    const resultElement =
        document.getElementById(
            "resultText"
        );

    if (
        !resultElement
    ) {
        return;
    }

    resultElement.innerText =
        result.toUpperCase();
}



function highlightWinningBox(
    result
) {

    clearWinningHighlight();

    const winningBox =
        document.querySelector(
            `[data-symbol="${result}"]`
        );

    if (
        !winningBox
    ) {
        return;
    }

    winningBox.classList.add(
        "winner"
    );
}



function clearWinningHighlight() {

    document
        .querySelectorAll(
            ".symbol-box"
        )
        .forEach(
            box => {

                box.classList.remove(
                    "winner"
                );
            }
        );
}



function showResult(
    result
) {

    updateResultDisplay(
        result
    );

    highlightWinningBox(
        result
    );

    console.log(
        "🏆 RESULT UI:",
        result
    );
}



// ======================================================
// 🏆 END: RESULT DISPLAY SECTION
// ======================================================



// ======================================================
// 💰 START: BALANCE DISPLAY SECTION (UPDATED)
// ======================================================


// 🧠 SAFE BALANCE FORMATTER
function formatBalance(value) {
    return Math.round(value * 100) / 100;
}


// 💰 MAIN DISPLAY UPDATE
function showBalance() {
    updateBalanceUI();
}


// 🔄 FORCE REFRESH
function refreshBalanceDisplay() {
    updateBalanceUI();
}


// ✨ ANIMATED UPDATE (SAFE)
function animateBalanceUpdate() {

    const balanceElement =
        document.getElementById("balanceAmount");

    if (!balanceElement) return;

    balanceElement.classList.add("balance-update");

    setTimeout(() => {
        balanceElement.classList.remove("balance-update");
    }, 500);
}


// 🔥 MAIN BALANCE CHANGE HANDLER (IMPORTANT)
function onBalanceChanged() {

    // 💡 FIX FLOATING ISSUE HERE
    if (typeof GameEngine.balance === "number") {
        GameEngine.balance =
            formatBalance(GameEngine.balance);
    }

    updateBalanceUI();
    animateBalanceUpdate();

    console.log("💰 BALANCE:", GameEngine.balance);
}


// 💡 OPTIONAL: SAFE DEDUCT FUNCTION (IMPORTANT FOR BUG PREVENTION)
function deductBalance(amount) {

    amount = Number(amount);

    if (isNaN(amount)) return false;

    if (GameEngine.balance < amount) {
        console.log("❌ NOT ENOUGH BALANCE");
        return false;
    }

    GameEngine.balance =
        formatBalance(GameEngine.balance - amount);

    onBalanceChanged();

    return true;
}


// ======================================================
// 💰 END: BALANCE DISPLAY SECTION (UPDATED)
// ======================================================



// ======================================================
// 🎨 START: UI EFFECT SECTION
// ======================================================



function playWinEffect() {

    document.body.classList.add(
        "win-effect"
    );

    setTimeout(
        () => {

            document.body.classList.remove(
                "win-effect"
            );

        },
        1500
    );
}



function playLoseEffect() {

    document.body.classList.add(
        "lose-effect"
    );

    setTimeout(
        () => {

            document.body.classList.remove(
                "lose-effect"
            );

        },
        1000
    );
}



function flashSpinButton() {

    const btn =
        document.getElementById(
            "spinBtn"
        );

    if (!btn) {
        return;
    }

    btn.classList.add(
        "button-flash"
    );

    setTimeout(
        () => {

            btn.classList.remove(
                "button-flash"
            );

        },
        500
    );
}



function flashWinningBox(
    result
) {

    const box =
        document.querySelector(
            `[data-symbol="${result}"]`
        );

    if (!box) {
        return;
    }

    box.classList.add(
        "winner-flash"
    );

    setTimeout(
        () => {

            box.classList.remove(
                "winner-flash"
            );

        },
        2000
    );
}



function pulseResultDisplay() {

    const resultElement =
        document.getElementById(
            "resultText"
        );

    if (!resultElement) {
        return;
    }

    resultElement.classList.add(
        "result-pulse"
    );

    setTimeout(
        () => {

            resultElement.classList.remove(
                "result-pulse"
            );

        },
        1000
    );
}



// ======================================================
// 🎨 END: UI EFFECT SECTION
// ======================================================



// ======================================================
// 📱 START: MOBILE UI SECTION
// ANDROID + CHROME MOBILE TARGET
// ======================================================



function initMobileUI() {

    lockPageScroll();

    preventZoom();

    setupTouchFeedback();

    console.log(
        "📱 MOBILE UI READY"
    );
}



function lockPageScroll() {

    document.body.style.overflow =
        "hidden";

    document.documentElement.style.overflow =
        "hidden";
}



function preventZoom() {

    const viewport =
        document.querySelector(
            'meta[name="viewport"]'
        );

    if (!viewport) {
        return;
    }

    viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    );
}



function setupTouchFeedback() {

    const buttons =
        document.querySelectorAll(
            "button"
        );

    buttons.forEach(
        button => {

            button.addEventListener(
                "touchstart",
                () => {

                    button.classList.add(
                        "touch-active"
                    );
                }
            );

            button.addEventListener(
                "touchend",
                () => {

                    button.classList.remove(
                        "touch-active"
                    );
                }
            );
        }
    );
}



function isMobileDevice() {

    return (
        /Android|iPhone|iPad|iPod/i
        .test(
            navigator.userAgent
        )
    );
}



// ======================================================
// 📱 END: MOBILE UI SECTION
// ======================================================



// ======================================================
// 🧪 START: UI DEBUG SECTION
// ======================================================



function debugSelectedChip() {

    console.log(
        "🪙 SELECTED CHIP:",
        GameEngine.selectedChip
    );
}



function debugBalanceUI() {

    const el =
        document.getElementById(
            "balanceAmount"
        );

    console.log(
        "💰 BALANCE UI:",
        el
    );
}



function debugSpinButton() {

    const btn =
        document.getElementById(
            "spinBtn"
        );

    console.log(
        "🎰 SPIN BUTTON:",
        btn
    );
}



function debugWheelUI() {

    const wheel =
        document.getElementById(
            "wheel"
        );

    console.log(
        "🎡 WHEEL:",
        wheel
    );
}



function debugPointerUI() {

    const pointer =
        document.getElementById(
            "pointer"
        );

    console.log(
        "📍 POINTER:",
        pointer
    );
}



function debugResultUI() {

    const result =
        document.getElementById(
            "resultText"
        );

    console.log(
        "🏆 RESULT UI:",
        result
    );
}



function debugGameUI() {

    console.log(
        "===================="
    );

    debugSelectedChip();

    debugBalanceUI();

    debugSpinButton();

    debugWheelUI();

    debugPointerUI();

    debugResultUI();

    console.log(
        "===================="
    );
}



// ======================================================
// 🧪 END: UI DEBUG SECTION
// ======================================================
