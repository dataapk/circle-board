// ======================================================
// 🎮 GAME LOGIC
// ======================================================
if (window.__GAME_INIT__) {
    console.log("⚠ GAME ALREADY INIT - SKIP");
} else {
    window.__GAME_INIT__ = true;

    document.addEventListener("DOMContentLoaded", () => {
        console.log("🚀 GAME READY");
        startGame();
    });
}


// ======================================================
// 🚀 START: GAME INIT SECTION
// ======================================================
let gameInitialized = false;

function initGame() {

    // 🛑 BLOCK DUPLICATE INIT (IMPORTANT FIX)
    if (gameInitialized) {
        console.log("⚠ GAME ALREADY INITIALIZED - SKIP");
        return;
    }

    gameInitialized = true;

    console.log("🧠 INIT GAME START");

    try {

        // =========================
        // 🪙 CHIP SYSTEM
        // =========================
        if (typeof initChipSystem === "function") {
            initChipSystem();
        }

        // =========================
        // 🎯 TABLE / BOARD SYSTEM
        // =========================
        if (typeof setupBoardSystem === "function") {
            setupBoardSystem();
        }

        // =========================
        // 🎰 SPIN BUTTON SYSTEM
        // =========================
        if (typeof setupSpinButton === "function") {
            setupSpinButton();
        }

        // =========================
        // 🔊 AUDIO INIT (SAFE CHECK)
        // =========================
        if (typeof initAudio === "function") {
            initAudio();
        }

        console.log("🎮 GAME READY");

    } catch (err) {
        console.log("💥 GAME INIT ERROR:", err);
    }
}
// ======================================================
// 🚀START / BOOT SECTION (CLEANED)
// ======================================================
function startGame() {
    initGame();
}

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 GAME DOM READY");

    startGame();

    console.log("🔗 SYSTEMS CONNECTED");
});
// ======================================================
// 🔴 LOCK GAME UI)
// ======================================================
   function lockGameUI() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    GameEngine.state = "SPINNING";
    GameEngine.isSpinning = true;

    btn.classList.add("locked");

    const text = btn.querySelector(".btn-text");
    const icon = btn.querySelector(".wheel-icon");

    if (text) text.innerText = "LOCKED";
    if (icon) icon.style.animation = "none";

    console.log("🔒 GAME UI LOCKED");
}
function unlockGameUI() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    GameEngine.state = "READY";
    GameEngine.isSpinning = false;

    btn.classList.remove("locked");

    const text = btn.querySelector(".btn-text");
    const icon = btn.querySelector(".wheel-icon");

    if (text) text.innerText = "SPIN";
    if (icon) icon.style.animation = "wheelSpin 1.2s linear infinite";

    console.log("🔓 GAME UI UNLOCKED");
}

// ======================================================
// 🔴 LOCK UI
// ======================================================




// ======================================================
// 🚀 END: GAME INIT SECTION
// ======================================================
// ======================================================
// 🪙 SIMPLE CHIP TOGGLE SYSTEM (FINAL)
// ======================================================


function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    if (!container || !chips.length) {
        console.log("❌ CHIP SYSTEM INIT FAILED");
        return;
    }

    console.log("🟢 CHIP SYSTEM READY");

    // ======================================================
    // 🔁 TOGGLE MENU (EXPAND / COLLAPSE)
    // ======================================================

    function toggleMenu() {

        const isExpanded = container.classList.contains("expanded");

        if (isExpanded) {
            container.classList.remove("expanded");
            container.classList.add("collapsed");
        } else {
            container.classList.add("expanded");
            container.classList.remove("collapsed");
        }

        console.log("🔁 CHIP MENU:", container.className);
    }

    // ======================================================
    // 🟡 DEFAULT CHIP CLICK → TOGGLE MENU
    // ======================================================

    if (defaultChip) {

        defaultChip.addEventListener("click", (e) => {

            e.stopPropagation();

            if (GameEngine.isSpinning) return;

            toggleMenu();
        });
    }

    // ======================================================
    // 🪙 CHIP SELECTION LOGIC
    // ======================================================

    chips.forEach((chip) => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            if (GameEngine.isSpinning) return;

            // 🔊 SOUND
            if (GameEngine.audio && GameEngine.chipSound) {
                GameEngine.audio.play(GameEngine.chipSound);
            }

            // 🟢 ACTIVE STATE
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            // 💰 STORE VALUE
            GameEngine.selectedChip = {
                value: parseFloat(chip.dataset.value),
                element: chip
            };

            console.log("🪙 CHIP SELECTED:", GameEngine.selectedChip.value);

            // ======================================================
            // 🔽 AUTO COLLAPSE AFTER SELECT
            // ======================================================

            setTimeout(() => {

                container.classList.remove("expanded");
                container.classList.add("collapsed");

            }, 120);
        });
    });
}
// ======================================================
// 🎯 BOARD SYSTEM (FINAL FIX - NO DUPLICATE LISTENER)
// ======================================================
let boardInitialized = false;
function setupBoardSystem() {

    if (boardInitialized) {
        console.log("⚠ BOARD ALREADY INIT");
        return;
    }

    boardInitialized = true;

    console.trace("🎯 BOARD INIT TRACE");
    console.log("🎯 BOARD SYSTEM INIT");

    const boxes =
        document.querySelectorAll(".symbol-box");

    boxes.forEach(box => {

        box.onclick = null;

        box.onclick = () => {
            onTableClick(box);
        };

    });

    console.log("✅ BOARD READY");
}

// 🧠 FIX: INLINE CHECK (NO MISSING FUNCTION)
function onTableClick(box) {

    if (!GameEngine.selectedChip) {
        console.log("❌ Select chip first");
        return;
    }

    // 🔊 TABLE SOUND
    if (GameEngine.tableSound) {

        GameEngine.tableSound.currentTime = 0;

        GameEngine.tableSound.play().catch(err => {
            console.log("TABLE SOUND ERROR:", err);
        });
    }

    const symbol = box.dataset.symbol;
    const amount = GameEngine.selectedChip.value;

    const success = subtractBalance(amount);

    if (!success) {
        console.log("❌ NOT ENOUGH BALANCE");
        return;
    }

    addBet(symbol, amount);
    placeChipVisual(box, amount);

    console.log("💰 BET PLACED:", symbol, amount);
}
// ======================================================
// FIX STEP 3: CHIP VISUAL SYSTEM
// ======================================================
function placeChipVisual(box, amount) {

    const marker = document.createElement("div");

    marker.className = "bet-marker";

    marker.innerText = "$" + amount;

    box.appendChild(marker);

    console.log("🧩 CHIP VISUAL ADDED:", amount);
}

// ======================================================
// 🎯 END: TABLE SECTION (FIXED)
// ======================================================
// ======================================================
// 🧹 CLEAR BET MARKERS
// ======================================================

function clearBoardVisuals() {

    document
        .querySelectorAll(
            ".bet-marker"
        )
        .forEach(
            marker => {

                marker.remove();
            }
        );
}



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

// ==========================
// 🚀 SPIN START
// ==========================

// ======================================================
// 🎯 CHIP SYSTEM
// ======================================================

function initChipSystem() {

    document.querySelectorAll(".chip").forEach(chip => {

        chip.addEventListener("click", (e) => {

            if (GameEngine.isSpinning) return;

            // 🔊 CHIP SOUND (HERE IS PERFECT PLACE)
            GameEngine.audio.play(GameEngine.chipSound);

            document.querySelectorAll(".chip")
                .forEach(c => c.classList.remove("active"));

            chip.classList.add("active");

            GameEngine.selectedChip = {
                value: parseFloat(chip.dataset.value),
                element: chip
            };

            console.log("🪙 CHIP:", GameEngine.selectedChip.value);
        });
    });
}


// ======================================================
// 🎰 TABLE BET SYSTEM
// ======================================================

function setupBoardSystem() {

    document.querySelectorAll(".symbol-box").forEach(box => {
        box.addEventListener("click", () => onTableClick(box));
    });
}

function onTableClick(box) {

    if (GameEngine.isSpinning) return;
    if (!GameEngine.selectedChip) return;

    const symbol = box.dataset.symbol;
    const amount = GameEngine.selectedChip.value;

    if (!subtractBalance(amount)) return;

    // 🔊 TABLE SOUND (ADD HERE)
    GameEngine.audio.play(GameEngine.tableSound);

    addBet(symbol, amount);
    placeChipVisual(box, amount);

    console.log("💰 BET:", symbol, amount);
}

function placeChipVisual(box, amount) {

    const marker = document.createElement("div");
    marker.className = "bet-marker";
    marker.innerText = "$" + amount;
    box.appendChild(marker);
}

// ======================================================
// 🎰 SPIN BUTTON
// ======================================================

function setupSpinButton() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    btn.addEventListener("click", spinGame);
}


// ==========================
// 🚀 SPIN FLOW (FULL CONTROL)
// ==========================

function spinGame() {

    console.log("🔥 SPIN START REQUEST");

    // 🧠 1. already spinning check
    if (GameEngine.isSpinning) {
        console.log("❌ BLOCKED: already spinning");
        return;
    }

    // 💰 2. bet validation
    if (!GameEngine.bets || Object.keys(GameEngine.bets).length === 0) {
        console.log("❌ NO BETS PLACED");
        return;
    }

    // 🎰 3. SET ENGINE STATE
    GameEngine.isSpinning = true;

    // 🔘 4. BUTTON SOUND (spin click)
    GameEngine.audio.play(GameEngine.spinButtonSound);

    // 🔒 5. LOCK FULL GAME UI
    lockGameUI();

    // 🔊 6. SPIN SOUND START
    GameEngine.audio.play(GameEngine.spinSound);

    // 🎡 7. START WHEEL ANIMATION
    spinWheel();
}


// ======================================================
// 🎡 WHEEL
// ======================================================

function spinWheel() {

    const wheel = document.querySelector(".wheel-img");
    if (!wheel) return;

    const duration = 14000;
    const startAngle = GameEngine.currentRotation || 0;
    const targetAngle = startAngle + (10 * 360);

    const startTime = performance.now();

    function animate(time) {

        const progress = Math.min((time - startTime) / duration, 1);
        const ease = progress * progress * (3 - 2 * progress);

        const angle =
            startAngle + (targetAngle - startAngle) * ease;

        wheel.style.transform = `rotate(${angle}deg)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {

            GameEngine.currentRotation = targetAngle;

            handleWheelResult(targetAngle);
        }
    }

    requestAnimationFrame(animate);
}


// ======================================================
// 🎯 RESULT FLOW (MAIN FIX)
// ======================================================

function onSpinEnd(result) {

    console.log("🏁 SPIN END");

    resolvePayout(result);

    resetWheelState();

    resetBoardUI();

    startNewRound();

    unlockGameUI();

    console.log("✔ READY NEXT ROUND");
}


// ======================================================
// 🧹 BOARD RESET (FIXED)
// ======================================================

function resetBoardUI() {

    GameEngine.bets = {};
    GameEngine.selectedChip = null;

    document.querySelectorAll(".bet-marker").forEach(m => m.remove());

    console.log("🧹 BOARD RESET");
}


// ======================================================
// 🧠 ROUND RESET (ENGINE SAFE)
// ======================================================

function startNewRound() {

    GameEngine.bets = {};
    GameEngine.lastResult = null;
    GameEngine.state = "READY";

    console.log("🔄 NEW ROUND READY");
}


// ======================================================
// 🔒 LOCK / UNLOCK BUTTONS
// ======================================================

function lockSpinButton() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    btn.disabled = true;
    btn.textContent = "LOCKED";
}

function unlockSpinButton() {

    const btn = document.getElementById("spinBtn");
    if (!btn) return;

    btn.disabled = false;
    btn.textContent = "SPIN";
}

function lockBets() {

    document.querySelectorAll(".chip").forEach(chip => {
        chip.style.pointerEvents = "none";
        chip.style.opacity = "0.5";
    });
}

function unlockBets() {

    document.querySelectorAll(".chip").forEach(chip => {
        chip.style.pointerEvents = "auto";
        chip.style.opacity = "1";
    });
}

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
