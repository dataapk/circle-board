// ======================================================
// TOP GUARD SECTION (VERY IMPORTANT)
// ======================================================
if (window.__ENGINE_INIT__) {
    console.log("⚠ ENGINE ALREADY INIT - SKIP");
} else {
    window.__ENGINE_INIT__ = true;
}


// ======================================================
// TOP GUARD SECTION (VERY IMPORTANT)
// ======================================================

// ======================================================
// 2️⃣ GAME ENGINE CORE
// ======================================================

window.GameEngine = {

    // =========================
    // 💰 PLAYER STATE
    // =========================
    balance: 1000,
    selectedChip: null,
    bets: {},

    // =========================
    // 🎰 GAME STATE
    // =========================
    isSpinning: false,
    lastResult: null,
    currentRotation: 0,
    spinDirection: 1,

    // =========================
    // 🔊 AUDIO REFERENCES
    // =========================
    chipSound: null,
    tableSound: null,
    spinButtonSound: null,
    spinSound: null,
    winSound: null,
    loseSound: null,

    // =========================
    // 🎧 AUDIO CONTROLLER
    // =========================
    audio: {

        play(sound) {
            if (!sound) return;

            sound.currentTime = 0;
            sound.play().catch(() => {});
        },

        stop(sound) {
            if (!sound) return;

            sound.pause();
            sound.currentTime = 0;
        }
    },

    // =========================
    // 🔥 OPTIONAL FADE SYSTEM
    // =========================
    fadeOutSpinSound() {

        const sound = this.spinSound;
        if (!sound) return;

        let volume = sound.volume;

        const fade = setInterval(() => {

            volume -= 0.05;

            if (volume <= 0) {

                sound.volume = 0;
                sound.pause();
                sound.currentTime = 0;

                sound.volume = 1;

                clearInterval(fade);

            } else {
                sound.volume = volume;
            }

        }, 100);
    }
};


// ======================================================
// 🚀 ENGINE BOOT (SAFE LOAD)
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 ENGINE BOOT START");

    initAudio();

    if (typeof loadGame === "function") {
        loadGame();
    }

    console.log("🔗 SYSTEM READY");
});


// ======================================================
// 🔊 AUDIO INIT (MUST BE OUTSIDE TRY BLOCK)
// ======================================================

function initAudio() {

    GameEngine.chipSound = document.getElementById("chipSound");
    GameEngine.tableSound = document.getElementById("tableSound");
    GameEngine.spinButtonSound = document.getElementById("spinButtonSound");
    GameEngine.spinSound = document.getElementById("spinSound");
    GameEngine.winSound = document.getElementById("winSound");
    GameEngine.loseSound = document.getElementById("loseSound");

    console.log("🔊 AUDIO READY");
    audioInitialized = true;
}


// ======================================================
// 🎡 AUDIO FADE OUT (OPTIONAL SAFE FEATURE)
// ======================================================

GameEngine.fadeOutSpinSound = function () {

    const sound = this.spinSound;
    if (!sound) return;

    let volume = sound.volume;

    const fade = setInterval(() => {

        volume -= 0.05;

        if (volume <= 0) {

            sound.volume = 0;
            sound.pause();
            sound.currentTime = 0;

            sound.volume = 1;

            clearInterval(fade);

        } else {
            sound.volume = volume;
        }

    }, 100);
};
            
           function engineDebug() {

    // ==========================
    // 💰 BALANCE SYSTEM
    // ==========================

    if (typeof updateBalanceUI === "function") {
        updateBalanceUI();
    }

    // ==========================
    // 🧠 DEBUG
    // ==========================

    try {

        console.log("🎮 ENGINE READY");

        console.log(
            "💰 BALANCE:",
            GameEngine.balance
        );

    } catch (err) {

        console.log(
            "💥 ENGINE ERROR:",
            err
        );
    }
}
// ======================================================
// 🚀 END: ENGINE BOOT SECTION
// ======================================================
// ======================================================
// 🔊 START: BUTTON LOCK UNLOCK SECTION
// ======================================================
function lockGameUI() {

    console.log("🔴 LOCK TRIGGERED");

    GameEngine.isSpinning = true;

    lockSpinButton();   // 🔥 UI
    lockBets();         // 🔥 logic

}
function unlockGameUI() {

    console.log("🟢 UNLOCK TRIGGERED");

    GameEngine.isSpinning = false;

    unlockSpinButton(); // 🔥 UI
    unlockBets();       // 🔥 logic

}
function lockSpinButton() {

    const btn = document.getElementById("spinBtn");

    if (!btn) return;

    btn.classList.add("locked");

    btn.querySelector(".btn-text").innerText = "LOCKED";

    btn.querySelector(".btn-icon").src = "assets/lock.png";

    console.log("🔴 BUTTON LOCKED");
}
function unlockSpinButton() {

    const btn = document.getElementById("spinBtn");

    if (!btn) return;

    btn.classList.remove("locked");

    btn.querySelector(".btn-text").innerText = "SPIN";

    btn.querySelector(".btn-icon").src = "assets/wheel.png";

    console.log("🟢 BUTTON UNLOCKED");
}
// ======================================================
// 🔊 START: BUTTON LOCK UNLOCK SECTION END
// ======================================================



// ======================================================
// 🔊 START: AUDIO SYSTEM SECTION
// ======================================================

function initAudio() {

    GameEngine.chipSound =
        document.getElementById("chipSound");

    GameEngine.tableSound =
        document.getElementById("tableSound");

    GameEngine.spinSound =
        document.getElementById("spinSound");

    GameEngine.spinButtonSound =
        document.getElementById("spinButtonSound");

    GameEngine.tickSound =
        document.getElementById("tickSound");

    console.log("🔊 AUDIO READY");

    console.log("CHIP:",
        GameEngine.chipSound);

    console.log("TABLE:",
        GameEngine.tableSound);

    console.log("SPIN:",
        GameEngine.spinSound);

    console.log("BUTTON:",
        GameEngine.spinButtonSound);

    console.log("TICK:",
        GameEngine.tickSound);
}



function playChipSound() {

    if (!GameEngine.chipSound) {
        return;
    }

    GameEngine.chipSound.currentTime =
        0;

    GameEngine.chipSound
        .play()
        .catch(() => {});
}



function playSpinButtonSound() {

    if (!GameEngine.spinButtonSound) {
        return;
    }

    GameEngine.spinButtonSound.currentTime =
        0;

    GameEngine.spinButtonSound
        .play()
        .catch(() => {});
}



function playSpinSound() {

    if (!GameEngine.spinSound) return;

    // ❌ prevent auto duplicate trigger
    if (GameEngine.isSoundPlaying) return;

    GameEngine.isSoundPlaying = true;

    GameEngine.spinSound.currentTime = 0;
    GameEngine.spinSound.volume = 1;
    GameEngine.spinSound.loop = true;

    GameEngine.spinSound.play().catch(() => {
        GameEngine.isSoundPlaying = false;
    });
}



function stopSpinSound() {

    if (!GameEngine.spinSound) {
        return;
    }

    GameEngine.spinSound.pause();

    GameEngine.spinSound.currentTime =
        0;
}
function playTableSound() {

    if (!GameEngine.tableSound) {
        return;
    }

    GameEngine.tableSound.currentTime = 0;

    GameEngine.tableSound
        .play()
        .catch(() => {});
}

function stopAllSounds() {

    const sounds = [

        GameEngine.chipSound,

        GameEngine.spinButtonSound,

        GameEngine.spinSound,

        GameEngine.tickSound
    ];

    sounds.forEach(
        sound => {

            if (!sound) {
                return;
            }

            sound.pause();

            sound.currentTime = 0;
        }
    );
}

// ======================================================
// 🔊 resetBets SYSTEM SECTION
// ======================================================
 function resetBetsUI() {

    const chips =
        document.querySelectorAll(".chip");

    chips.forEach(chip => {

        chip.remove();
    });

    console.log("🧹 BOARD RESET");
}

// ======================================================
// 🔊 resetBets END
// ======================================================



// ======================================================
// 💰 START: BALANCE SYSTEM SECTION (UPDATED)
// ======================================================


// 🧠 SAFE FORMAT HELPER
function formatBalance(value) {
    return Math.round(value * 100) / 100;
}


// 💰 UI UPDATE
function updateBalanceUI() {

    const balanceElement =
        document.getElementById("balanceAmount");

    if (!balanceElement) return;

    balanceElement.innerText =
        "$" + formatBalance(GameEngine.balance).toFixed(2);
}


// ➕ ADD BALANCE (SAFE)
function addBalance(amount) {

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) return;

    GameEngine.balance =
        formatBalance(GameEngine.balance + amount);

    updateBalanceUI();

    console.log("💰 BALANCE ADDED:", amount);
    console.log("💰 NEW BALANCE:", GameEngine.balance);
}


// ➖ SUBTRACT BALANCE (SAFE)
function subtractBalance(amount) {

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        return false;
    }

    if (GameEngine.balance < amount) {
        console.log("❌ Not enough balance");
        return false;
    }

    GameEngine.balance =
        formatBalance(GameEngine.balance - amount);

    updateBalanceUI();

    console.log("💸 BALANCE DEDUCTED:", amount);

    return true;
}


// 🔄 RESET BALANCE
function resetBalance() {

    GameEngine.balance = 1000;

    updateBalanceUI();

    console.log("🔄 BALANCE RESET");
}


// ======================================================
// 💰 END: BALANCE SYSTEM SECTION (UPDATED)
// ======================================================


// ======================================================
// 🎯 START: BET STORAGE SECTION
// ======================================================



function createBet(
    betKey
) {

    if (
        !GameEngine.bets[
            betKey
        ]
    ) {

        GameEngine.bets[
            betKey
        ] = 0;
    }
}



function addBet(
    betKey,
    amount
) {

    amount =
        Number(amount);

    if (
        isNaN(amount) ||
        amount <= 0
    ) {
        return false;
    }

    createBet(
        betKey
    );

    GameEngine.bets[
        betKey
    ] += amount;

    return true;
}



function removeBet(
    betKey
) {

    if (
        !GameEngine.bets[
            betKey
        ]
    ) {
        return;
    }

    delete GameEngine.bets[
        betKey
    ];
}



function clearBets() {

    GameEngine.bets = {};
}



function getBetAmount(
    betKey
) {

    return (
        GameEngine.bets[
            betKey
        ] || 0
    );
}



function getTotalBet() {

    let total = 0;

    for (
        let key
        in
        GameEngine.bets
    ) {

        total +=
            Number(
                GameEngine.bets[
                    key
                ]
            );
    }

    return total;
}



function hasBets() {

    return (
        Object.keys(
            GameEngine.bets
        ).length > 0
    );
}



// ======================================================
// 🎯 END: BET STORAGE SECTION
// ======================================================



// ======================================================
// 🎲 RESULT SYSTEM (CLEAN FINAL VERSION)
// ======================================================

function setLastResult(result) {
    GameEngine.lastResult = result;
}

function getLastResult() {
    return GameEngine.lastResult;
}


// 🎯 MAIN RESULT HANDLER
function handleWheelResult(angle) {

    const normalized = angle % 360;

    const symbols = [
        "heart",
        "diamond",
        "club",
        "spade",
        "crown",
        "flag"
    ];

    const segmentSize = 360 / symbols.length;

    const index = Math.floor(normalized / segmentSize);

    const result = symbols[index];

    setLastResult(result);

    console.log("🎯 RESULT:", result);

    // 👉 IMPORTANT: ONLY CALL FLOW CONTROLLER HERE
    onSpinEnd(result);
}


// ======================================================
// 🎰 START: CASINO PAYOUT ENGINE (FIXED)
// ======================================================


// 🧠 PAYOUT TABLE (IMPORTANT CORE)
const PAYOUT_TABLE = {
    spade: 2,
    heart: 2,
    diamond: 2,
    club: 2,
    crown: 3,
    flag: 3
};


// 🎯 GET WIN RESULT
function calculateWin(resultSymbol) {

    const bets = GameEngine.bets || {};

    let win = 0;

    // 🔥 loop all bets (casino correct logic)
    for (const symbol in bets) {

        const amount = bets[symbol];

        if (symbol === resultSymbol) {

            const multiplier =
                PAYOUT_TABLE[symbol] || 0;

            win += amount * multiplier;
        }
    }

    // 💡 safe rounding
    win = Math.round(win * 100) / 100;

    return win;
}


// 💰 APPLY WIN TO BALANCE
function applyWin(winAmount) {

    winAmount = Number(winAmount);

    if (isNaN(winAmount) || winAmount <= 0) return 0;

    GameEngine.balance =
        Math.round((GameEngine.balance + winAmount) * 100) / 100;

    updateBalanceUI();

    console.log("💰 WIN APPLIED:", winAmount);

    return winAmount;
}


// 🎯 MAIN RESULT HANDLER (CALL THIS AFTER SPIN)
// 🎯 MAIN RESULT HANDLER (LOGIC ONLY)
function handlePayout(resultSymbol) {

    const win = calculateWin(resultSymbol);

    GameEngine.lastResult = resultSymbol;

    applyWin(win);

    return win;
}
// 🎯 FLOW CONTROLLER (NO LOGIC, ONLY SEQUENCE)
function resolvePayout(result) {

    const winAmount = handlePayout(result);

    return winAmount;
}


// 🧹 ROUND RESET (IMPORTANT)
// 🧹 ROUND RESET
function startNewRound() {

    GameEngine.bets = {};
    GameEngine.isSpinning = false;

    console.log("🔄 NEW ROUND STARTED");

    return;
}
// 🧹 ROUND RESET END


// ======================================================
// 🎰 END: CASINO PAYOUT ENGINE (FIXED)
// ======================================================



// ======================================================
// 🎡 WHEEL STATE SECTION (ENGINE ONLY)
// ======================================================

function startSpin() {

    if (GameEngine.isSpinning) return false;

    GameEngine.isSpinning = true;

    console.log("🎰 SPIN LOCKED");

    return true;
}


// 🛑 FULL SAFE STOP (IMPORTANT)
function stopSpin() {

    GameEngine.isSpinning = false;

    // 🔊 STOP SOUND SAFELY
    if (GameEngine.spinSound) {
        GameEngine.spinSound.pause();
        GameEngine.spinSound.currentTime = 0;
        GameEngine.spinSound.loop = false;
    }

    if (GameEngine.tickSound) {
        GameEngine.tickSound.pause();
        GameEngine.tickSound.currentTime = 0;
    }

    const wheel = document.getElementById("wheel");
    if (wheel) wheel.style.transition = "";

    console.log("🛑 SPIN STOPPED");
}


function isWheelSpinning() {
    return GameEngine.isSpinning;
}


// 🎯 SET ROTATION
function setWheelRotation(angle) {

    angle = Number(angle);

    if (isNaN(angle)) return;

    GameEngine.currentRotation = angle;
}


// 🎯 GET ROTATION
function getWheelRotation() {
    return GameEngine.currentRotation;
}


// 🎯 ADD ROTATION
function addWheelRotation(angle) {

    angle = Number(angle);

    if (isNaN(angle)) return;

    GameEngine.currentRotation += angle;
}


// 🧹 FULL RESET (SAFE FOR NEW ROUND)
function resetWheelState() {

    GameEngine.isSpinning = false;
    GameEngine.currentRotation = 0;
    GameEngine.lastResult = null;

    // 🔊 safety stop audio
    if (GameEngine.spinSound) {
        GameEngine.spinSound.pause();
        GameEngine.spinSound.currentTime = 0;
    }

    console.log("🔄 WHEEL RESET COMPLETE");
}
function startNewRound() {

    GameEngine.bets = {};
    GameEngine.isSpinning = false;
    GameEngine.lastResult = null;

    console.log("🔄 NEW ROUND ACTIVE");
}

// ======================================================
// 🎡 END: WHEEL STATE SECTION
// ======================================================



// ======================================================
// 💾 START: SAVE / LOAD SECTION
// ======================================================



function saveGame() {

    const saveData = {

        balance:
            GameEngine.balance,

        bets:
            GameEngine.bets,

        lastResult:
            GameEngine.lastResult
    };

    localStorage.setItem(
        "iGamingSave",
        JSON.stringify(
            saveData
        )
    );

    console.log(
        "💾 GAME SAVED"
    );
}



function loadGame() {

    const saveData =
        localStorage.getItem(
            "iGamingSave"
        );

    if (
        !saveData
    ) {

        return;
    }

    try {

        const data =
            JSON.parse(
                saveData
            );

        GameEngine.balance =
            data.balance ??
            1000;

        GameEngine.bets =
            data.bets ??
            {};

        GameEngine.lastResult =
            data.lastResult ??
            null;

        console.log(
            "📂 GAME LOADED"
        );

    } catch (err) {

        console.log(
            "💥 LOAD ERROR:",
            err
        );
    }
}



function resetGame() {

    GameEngine.balance =
        1000;

    GameEngine.bets =
        {};

    GameEngine.lastResult =
        null;

    GameEngine.isSpinning =
        false;

    GameEngine.currentRotation =
        0;

    updateBalanceUI();

    localStorage.removeItem(
        "iGamingSave"
    );

    console.log(
        "♻️ GAME RESET"
    );
}



// ======================================================
// 💾 END: SAVE / LOAD SECTION
// ======================================================



// ======================================================
// 🧪 START: DEBUG SECTION
// ======================================================



function debugBalance() {

    console.log(
        "💰 BALANCE:",
        GameEngine.balance
    );
}



function debugBets() {

    console.log(
        "🎯 BETS:",
        GameEngine.bets
    );
}



function debugState() {

    console.log(
        "🧠 GAME STATE:",
        GameEngine
    );
}



function debugResult() {

    console.log(
        "🏆 LAST RESULT:",
        GameEngine.lastResult
    );
}



function debugWheel() {

    console.log(
        "🎡 ROTATION:",
        GameEngine.currentRotation
    );

    console.log(
        "🎡 SPINNING:",
        GameEngine.isSpinning
    );
}



function debugAudio() {

    console.log(
        "🔊 CHIP SOUND:",
        GameEngine.chipSound
    );

    console.log(
        "🔊 SPIN SOUND:",
        GameEngine.spinSound
    );

    console.log(
        "🔊 TICK SOUND:",
        GameEngine.tickSound
    );
}



function debugAll() {

    console.log(
        "===================="
    );

    debugBalance();

    debugBets();

    debugResult();

    debugWheel();

    debugAudio();

    console.log(
        "===================="
    );
}



// ======================================================
// 🧪 END: DEBUG SECTION
// ======================================================
