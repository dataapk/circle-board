// ======================================================
// 🧠 START: GLOBAL GAME STATE
// ======================================================

window.GameEngine = {

    balance: 1000,
    selectedChip: null,
    bets: {},
    isSpinning: false,
    lastResult: null,
    currentRotation: 0,

    chipSound: null,
    spinButtonSound: null,   // ✅ FIXED
    spinSound: null,
    tickSound: null
};

// ======================================================
// 🧠 END: GLOBAL GAME STATE
// ======================================================

// ======================================================
// 🚀 START: ENGINE BOOT SECTION
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "🚀 ENGINE BOOT START"
        );

        try {

            // ==========================
            // 🔊 AUDIO SYSTEM
            // ==========================
function initAudio() {

    GameEngine.chipSound =
        document.getElementById("chipSound");

    GameEngine.spinSound =
        document.getElementById("spinSound");

    GameEngine.spinButtonSound =
        document.getElementById("spinButtonSound");

    GameEngine.tickSound =
        document.getElementById("tickSound");

    console.log("🔊 AUDIO READY");

    console.log("CHIP:", GameEngine.chipSound);
    console.log("SPIN:", GameEngine.spinSound);
    console.log("BUTTON:", GameEngine.spinButtonSound);
    console.log("TICK:", GameEngine.tickSound);
}
           
            // ==========================
            // 💰 BALANCE SYSTEM
            // ==========================

            if (
                typeof updateBalanceUI ===
                "function"
            ) {

                updateBalanceUI();
            }

            // ==========================
            // 🧠 DEBUG
            // ==========================

            console.log(
                "🎮 ENGINE READY"
            );

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
);

// ======================================================
// 🚀 END: ENGINE BOOT SECTION
// ======================================================



// ======================================================
// 🧠 START: GLOBAL GAME STATE SECTION
// ======================================================

// window.GameEngine

// balance
// selectedChip
// bets
// isSpinning
// currentRotation
// lastResult

// chipSound
// spinSound
// tickSound

// ======================================================
// 🧠 END: GLOBAL GAME STATE SECTION
// ======================================================



// ======================================================
// 🔊 START: AUDIO SYSTEM SECTION
// ======================================================



function initAudio() {

    GameEngine.chipSound =
        document.getElementById(
            "chipSound"
        );

    GameEngine.spinSound =
        document.getElementById(
            "spinSound"
        );

    GameEngine.tickSound =
        document.getElementById(
            "tickSound"
        );

    console.log(
        "🔊 AUDIO READY"
    );
}



function playChipSound() {

    if (
        !GameEngine.chipSound
    ) {
        return;
    }

    GameEngine.chipSound.currentTime = 0;

    GameEngine.chipSound
        .play()
        .catch(() => {});
}



function playSpinSound() {

    if (
        !GameEngine.spinSound
    ) {
        return;
    }

    GameEngine.spinSound.currentTime = 0;

    GameEngine.spinSound
        .play()
        .catch(() => {});
}



function fadeInSound(
    duration = 800
) {

    if (
        !GameEngine.spinSound
    ) {
        return;
    }

    const sound =
        GameEngine.spinSound;

    sound.volume = 0;

    sound.currentTime = 0;

    sound.play()
        .catch(() => {});

    let volume = 0;

    const step =
        1 / (duration / 50);

    const fade =
        setInterval(() => {

            volume += step;

            if (volume >= 1) {

                volume = 1;

                clearInterval(
                    fade
                );
            }

            sound.volume =
                volume;

        }, 50);
}



function fadeOutSound(
    duration = 1500
) {

    if (
        !GameEngine.spinSound
    ) {
        return;
    }

    const sound =
        GameEngine.spinSound;

    let volume =
        sound.volume;

    const step =
        volume /
        (duration / 50);

    const fade =
        setInterval(() => {

            volume -= step;

            if (volume <= 0) {

                volume = 0;

                sound.pause();

                sound.currentTime = 0;

                clearInterval(
                    fade
                );
            }

            sound.volume =
                volume;

        }, 50);
}



function stopAllSounds() {

    const sounds = [

        GameEngine.chipSound,

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
// 🔊 END: AUDIO SYSTEM SECTION
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
// 🎲 START: RESULT SYSTEM SECTION
// ======================================================



function setLastResult(
    result
) {

    GameEngine.lastResult =
        result;
}



function getLastResult() {

    return (
        GameEngine.lastResult
    );
}



function handleWheelResult(
    angle
) {

    const normalized =
        angle % 360;

    const symbols = [

        "heart",

        "diamond",

        "club",

        "spade",

        "crown",

        "flag"
    ];

    const segmentSize =
        360 /
        symbols.length;

    const index =
        Math.floor(
            normalized /
            segmentSize
        );

    const result =
        symbols[index];

    setLastResult(
        result
    );

    console.log(
        "🎯 RESULT:",
        result
    );

    resolvePayout(
        result
    );
}



function isWinningResult(
    result
) {

    return (
        getLastResult() ===
        result
    );
}



// ======================================================
// 🎲 END: RESULT SYSTEM SECTION
// ======================================================


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
function handlePayout(resultSymbol) {

    console.log("🎯 RESULT:", resultSymbol);

    const win = calculateWin(resultSymbol);

    GameEngine.lastResult = resultSymbol;

    console.log("💰 WIN:", win);

    applyWin(win);

    return win;
}


// 🧹 ROUND RESET (IMPORTANT)
function startNewRound() {

    GameEngine.bets = {};

    console.log("🔄 NEW ROUND STARTED");
}


// ======================================================
// 🎰 END: CASINO PAYOUT ENGINE (FIXED)
// ======================================================



// ======================================================
// 🎡 START: WHEEL STATE SECTION (STABLE)
// ======================================================

function startSpin() {

    if (GameEngine.isSpinning) {
        return false;
    }

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

    // 🎡 RESET TRANSITION SAFETY
    const wheel = document.getElementById("wheel");
    if (wheel) {
        wheel.style.transition = "";
    }

    console.log("🛑 SPIN FULLY STOPPED");
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
