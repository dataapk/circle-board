
// ======================================================
// 🧠 START: GAME ENGINE
// ======================================================
const GameEngine = (() => {
// ======================================================
// 🔒 START: PRIVATE GAME STATE
// ======================================================

const state = {

    // 💰 BALANCE SYSTEM
    balance: 1000,
    selectedChip: 0.10,

    // 🎲 BET SYSTEM
    bets: {
        heart: 0,
        diamond: 0,
        club: 0,
        spade: 0,
        crown: 0,
        flag: 0
    },

    totalBet: 0,

    // 🎡 WHEEL SYSTEM
    wheelRotation: 0,
    currentIndex: null,
    finalIndex: null,
    finalSymbols: [],

    // 🧠 RESULT SYSTEM
    symbolCountMap: {},

    // 💰 WIN SYSTEM
    lastWin: 0,
    lastResult: null,

    // 🎁 BONUS SYSTEM
    bonusMultiplier: 1,
    bonusTargetSymbol: null,

    // 🔒 GAME CONTROL
    isSpinning: false,
    isBetLocked: false,

    // =========================
    // 🧠 ROUND CONTROL
    // =========================
    currentRoundId: 0,
    lastRoundBets: null,

    // =========================
    // 🧩 UI CONTROL STATE
    // =========================
    ui: {

        chipPanelOpen: false,
        controlsLocked: false,
        lastAction: null

    }

};
    
// ======================================================
// 🔒 END: PRIVATE GAME STATE
// ======================================================
// ======================================================
// 🔊 START: INITIAL AUDIO SYSTEM
// ======================================================

const audio = {

    chip: null,
    table: null,
    spin: null,
    spinButton: null,

    // 🎯 ADD BUBBLE SOUNDS
    bubbleFly: null,
    bubbleLand: null,
    bubbleWin: null
};
    
   audio.chip = new Audio("assets/chip.mp3");
 audio.table = new Audio("assets/table.mp3");
  audio.spin = new Audio("assets/spin.mp3");
  audio.spinButton = new Audio("assets/spinbutton.mp3");
    // 🎯 BUBBLE SOUNDS
audio.bubbleFly = new Audio("assets/bubblebox.mp3");
audio.bubbleLand = new Audio("assets/bubble.mp3");
audio.bubbleWin = new Audio("assets/bubblewin.mp3");

function playChipSound() {

    if (!audio.chip) return;

    audio.chip.currentTime = 0;
    audio.chip.play();

}

function playTableSound() {

    if (!audio.table) return;

    audio.table.currentTime = 0;
    audio.table.play();

}

function playSpinSound() {

    if (!audio.spin) return;

    audio.spin.currentTime = 0;
    audio.spin.play();

}

function playSpinButtonSound() {

    if (!audio.spinButton) return;

    audio.spinButton.currentTime = 0;
    audio.spinButton.play();

}
    function playBubbleFlySound() {

    if (!audio.bubbleFly) return;

    audio.bubbleFly.currentTime = 0;
    audio.bubbleFly.volume = 0.6;
    audio.bubbleFly.play();
}
    function playBubbleLandSound() {

    if (!audio.bubbleLand) return;

    audio.bubbleLand.currentTime = 0;
    audio.bubbleLand.volume = 0.7;
    audio.bubbleLand.play();
}
    function playBubbleWinSound() {

    if (!audio.bubbleWin) return;

    audio.bubbleWin.currentTime = 0;
    audio.bubbleWin.volume = 0.9;
    audio.bubbleWin.play();
}
    

// ======================================================
// 🔊 END: INITIAL AUDIO SYSTEM
// ======================================================



// ======================================================
// 💰 START: INITIAL BALANCE SYSTEM
// ======================================================

function getBalance() {

    return state.balance;

}

function setBalance(amount) {

    state.balance = amount;

}

function addBalance(amount) {

    state.balance += amount;

}

function subtractBalance(amount) {

    state.balance -= amount;

}

function hasEnoughBalance(amount) {

    return state.balance >= amount;

}

// ======================================================
// 💰 END: INITIAL BALANCE SYSTEM
// ======================================================



// ======================================================
// 🪙 START: INITIAL CHIP SYSTEM
// ======================================================

function getSelectedChip() {

    return state.selectedChip;

}

function selectChip(value) {

    state.selectedChip = Number(value);

}

function hasSelectedChip() {

    return state.selectedChip > 0;

}

// ======================================================
// 🪙 END: INITIAL CHIP SYSTEM
// ======================================================



// ======================================================
// 🎯 START: INITIAL BET SYSTEM (UPGRADED)
// ======================================================

function placeBet(symbol) {

    console.log("[BET] placeBet called:", symbol);

    if (state.isBetLocked) {
        console.log("[BET] BLOCKED: Bet Locked");
        return false;
    }

    if (!hasEnoughBalance(state.selectedChip)) {
        console.log("[BET] BLOCKED: Not enough balance");
        return false;
    }
    
    // =========================
    // 💰 APPLY BET
    // =========================

    state.bets[symbol] += state.selectedChip;

    state.totalBet += state.selectedChip;

    subtractBalance(state.selectedChip);

    console.log("[BET] PLACED:", symbol, state.selectedChip);

    // =========================
    // 🧩 UI HOOK (SAFE)
    // =========================

    if (typeof refreshGameUI === "function") {
        refreshGameUI();
    }

    return true;
}
// ======================================================
// 🎯 START STARTGAME 
// ======================================================
function startSpin() {

    state.isSpinning = true;

    console.log("[ENGINE] SPIN STARTED");

}
 // ======================================================
// 🎯 END STARTGAME 
// ======================================================
  
// ======================================================
// 🎯 GET BET SYSTEM
// ======================================================

function getBet(symbol) {

    return state.bets[symbol] || 0;

}

function getAllBets() {

    return state.bets;

}

function getTotalBet() {

    return state.totalBet;

}


// ======================================================
// 🧹 CLEAR BET SYSTEM (ROUND RESET READY)
// ======================================================

function clearBets() {

    console.log("[BET] Clearing all bets");

    state.bets = {
        heart: 0,
        diamond: 0,
        club: 0,
        spade: 0,
        crown: 0,
        flag: 0
    };

    state.totalBet = 0;

    // =========================
    // 🧩 UI HOOK
    // =========================

    if (typeof refreshGameUI === "function") {
        refreshGameUI();
    }

}


// ======================================================
// 🔁 HAS BET CHECK
// ======================================================

function hasBets() {

    return state.totalBet > 0;

}


// ======================================================
// ⚡ REBET SYSTEM (NEW - IMPORTANT)
// ======================================================

function rebetLastRound() {

    console.log("[BET] Rebet called");

    if (state.isBetLocked) return false;

    if (!state.lastRoundBets) {
        console.log("[BET] No last round bets found");
        return false;
    }

    clearBets();

    let totalRequired = 0;

    for (let symbol in state.lastRoundBets) {

        let amount = state.lastRoundBets[symbol];

        if (amount > 0) {

            state.bets[symbol] = amount;

            totalRequired += amount;

        }

    }

    if (!hasEnoughBalance(totalRequired)) {
        console.log("[BET] Rebet failed: Not enough balance");
        return false;
    }

    state.totalBet = totalRequired;

    subtractBalance(totalRequired);

    refreshGameUI();

    console.log("[BET] Rebet success");

    return true;

}


// ======================================================
// 💾 SAVE ROUND BETS (NEW)
// ======================================================

function saveLastRoundBets() {

    state.lastRoundBets = JSON.parse(JSON.stringify(state.bets));

    console.log("[BET] Last round bets saved:", state.lastRoundBets);

}

// ======================================================
// 🎯 END: INITIAL BET SYSTEM (UPGRADED)
// ======================================================
// ======================================================
// 🎡 START: INITIAL WHEEL SYSTEM (UPGRADED)
// ======================================================

const wheelSlots = [
    ["heart","heart","crown"],
    ["spade","spaded","diamond"],
    ["flag","flag","flag"],
    ["club","club","heart"],
    ["spade","crown","crown"],
    ["diamond","diamond","diamond"],
    ["club","flag","flag"],
    ["heart","heart","crown"],
    ["spade","spade","spade"],
    ["diamond","diamond","flag"],
    ["heart","club","club"],
    ["crown","crown","crown"],
    ["spade","spade","diamond"],
    ["flag","flag","club"],
    ["heart","heart","heart"],
    ["crown","crown","spade"],
    ["diamond","diamond","flag"],
    ["club","club","club"]
];


// ======================================================
// 🎯 GET WHEEL DATA
// ======================================================

function getWheelSlots() {

    return wheelSlots;

}


// ======================================================
// 🎡 ROTATION CONTROL
// ======================================================

function getWheelRotation() {

    return state.wheelRotation;

}

function setWheelRotation(angle) {

    state.wheelRotation = angle;

    console.log("[WHEEL] Rotation set:", angle);

}


// ======================================================
// 🎯 NEW: RESULT INDEX RESOLVER (IMPORTANT)
// ======================================================

function getSlotByIndex(index) {

    if (index < 0 || index >= wheelSlots.length) {
        console.log("[WHEEL] Invalid index:", index);
        return null;
    }

    return wheelSlots[index];

}
      // ======================================================
// 🎯 START END SPIN
// ======================================================
   // ======================================================
// 🎯 START: END SPIN (গেম ইঞ্জিন শুধু রেজাল্ট প্রসেস করবে)
// ======================================================
function endSpin(finalIndex) {

    console.log("[ENGINE] SPIN END");

    if (
        finalIndex === null ||
        finalIndex === undefined
    ) {
        finalIndex =
            Math.floor(
                Math.random() * 18
            );

        console.warn(
            "[FIX] Generated missing finalIndex:",
            finalIndex
        );
    }

    console.log(
        "[VISUAL SLOT RECEIVED]",
        finalIndex
    );

    state.isSpinning = true;
    state.isBetLocked = true;

    setFinalWheelResult(
        finalIndex
    );

    try {

        runResultEngine(
            finalIndex
        );

    } catch (err) {

        console.error(
            "[ENGINE ERROR]",
            err
        );

    }

    state.isBetLocked = false;
    state.isSpinning = false;

    console.log(
        "[TEST] BEFORE ENGINE UNLOCK"
    );

    GameEngine.unlockBets();

    console.log(
        "[TEST] AFTER ENGINE UNLOCK"
    );

    console.log(
        "[ENGINE] BETS UNLOCKED"
    );

}
// ======================================================
// 🎯  END SPIN
// ======================================================



// ======================================================
// 🎡 NEW: FINAL SLOT SETTER (RESULT ENGINE HOOK)
// ======================================================

function setFinalWheelResult(finalIndex) {

    state.finalIndex = finalIndex;

    state.finalSymbols =
        wheelSlots[finalIndex];

    console.log(
        "FINAL INDEX:",
        finalIndex
    );

    console.log(
        "FINAL SYMBOL:",
        state.finalSymbols
    );
}


// ======================================================
// 🧠 NEW: SYMBOL EXTRACTOR (SAFE HELP)
// ======================================================

function getSymbolsAt(index) {

    return wheelSlots[index] || null;

}


// ======================================================
// 🎡 END: INITIAL WHEEL SYSTEM (UPGRADED)
// ======================================================




// ======================================================
// 🎡 START: RESULT PAYOUT ENGINE CORE
// ======================================================


// =========================
// 🧠 MAIN RESULT TRIGGER
// =========================

function runResultEngine(finalIndex) {

    console.log("[RESULT] Engine started with index:", finalIndex);

    if (state.isSpinning === false) {
        console.log("[RESULT] BLOCKED: Not spinning");
        return;
    }

    // lock betting
    state.isBetLocked = true;



    // =========================
    // 🎯 GET WHEEL RESULT
    // =========================

    setFinalWheelResult(finalIndex);

    const resultSymbols = state.finalSymbols;

    console.log("[RESULT] Symbols:", resultSymbols);



    // =========================
    // 🧠 COUNT SYMBOLS
    // =========================

    const symbolCountMap = {};

    resultSymbols.forEach(symbol => {

        symbolCountMap[symbol] =
            (symbolCountMap[symbol] || 0) + 1;

    });

    console.log("[RESULT] Count Map:", symbolCountMap);



    // =========================
    // 🎲 BONUS MULTIPLIER (2X - 5X)
    // =========================

    const bonusPool = [2, 3, 4, 5];

    const bonusMultiplier =
        bonusPool[Math.floor(Math.random() * bonusPool.length)];

    state.bonusMultiplier = bonusMultiplier;

    console.log("[RESULT] Bonus Multiplier:", bonusMultiplier);



    // =========================
    // 💰 CALCULATE PAYOUT
    // =========================

// =========================
// 💰 CALCULATE PAYOUT
// =========================
    console.log(
    "[BONUS STATE]",
    activeBubbleSymbol,
    activeBubbleMultiplier
);

let totalWin = 0;

for (let symbol in state.bets) {

    let betAmount =
        state.bets[symbol];

    if (betAmount <= 0)
        continue;

    let count =
        symbolCountMap[symbol] || 0;

    // ❌ RULE: single symbol = loss
    if (count < 2) {

        console.log(
            "[RESULT] LOSS:",
            symbol
        );

        continue;

    }

    // =========================
    // 🎁 BONUS OVERRIDE SYSTEM
    // =========================
let finalMultiplier =
    count;

console.log(
    "[BONUS CHECK]",
    symbol,
    activeBubbleSymbol,
    activeBubbleMultiplier
);

if (

    activeBubbleSymbol &&
    activeBubbleMultiplier &&
    symbol === activeBubbleSymbol

) {

    finalMultiplier =
        activeBubbleMultiplier;

    console.log(
        "[BONUS HIT]",
        symbol,
        activeBubbleMultiplier + "X"
    );

}

    // =========================
    // 💰 FINAL CALCULATION
    // =========================

    let win =

        (
            betAmount *
            finalMultiplier
        )

        + betAmount;

    console.log(
        "[RESULT] WIN:",
        symbol,
        win
    );

    totalWin += win;

}



    // =========================
    // 💳 BALANCE UPDATE
    // =========================

    state.balance += totalWin;

    state.lastWin = totalWin;

    state.lastResult = resultSymbols;



    console.log("[RESULT] TOTAL WIN:", totalWin);
    console.log("[RESULT] NEW BALANCE:", state.balance);



    // =========================
    // 🔄 ROUND RESET
    // =========================

    saveLastRoundBets();
    clearBets();



    state.isBetLocked = false;
    state.isSpinning = false;



    // =========================
    // 🧩 UI UPDATE HOOK
    // =========================

    if (typeof refreshGameUI === "function") {
        refreshGameUI();
    }

    console.log("[RESULT] Engine finished");

}


// ======================================================
// 🎡 END: RESULT ENGINE CORE
// ======================================================


// ======================================================
// 🔄 START: INITIAL NEW ROUND SYSTEM (UPGRADED)
// ======================================================


// =========================
// 🔒 ROUND LOCK CONTROL
// =========================

function lockRound() {

    state.isBetLocked = true;
    state.ui.controlsLocked = true;

    console.log("[ROUND] LOCKED");

}

function unlockRound() {

    state.isBetLocked = false;
    state.ui.controlsLocked = false;

    console.log("[ROUND] UNLOCKED");

}


// =========================
// 🔄 ROUND RESET CORE
// =========================

function resetRoundData() {

    console.log("[ROUND] Resetting round data");

    state.currentResult = null;
    state.winningSlot = null;

    state.symbolCount = 0;
    state.bonusMultiplier = 1;

    state.lastWin = 0;

    state.finalIndex = null;
    state.finalSymbols = [];

    state.totalBet = 0;

}


// =========================
// 🚀 START NEW ROUND (MAIN ENTRY)
// =========================

function startNewRound() {

    console.log("[ROUND] Starting new round");

    resetRoundData();

    unlockRound();

    state.isSpinning = false;

    // UI refresh hook
    if (typeof refreshGameUI === "function") {
        refreshGameUI();
    }

}


// =========================
// 🛑 END ROUND (AFTER RESULT)
// =========================

function endRound() {

    console.log("[ROUND] Ending round");

    lockRound();

    state.isSpinning = false;

}


// =========================
// 🔁 SAFE RESET (FULL CLEAN)
// =========================

function hardResetRound() {

    console.log("[ROUND] Hard reset");

    resetRoundData();

    unlockRound();

    clearBets();

    if (typeof refreshGameUI === "function") {
        refreshGameUI();
    }

}


// ======================================================
// 🔄 END: INITIAL NEW ROUND SYSTEM (UPGRADED)
// ======================================================
// ======================================================
// 🔄 START: BOARD RESET SYSTEM (UPGRADED)
// ======================================================

function resetBoard() {

    console.log("[BOARD] Reset started");



    // =========================
    // 🎯 CLEAR ALL BETS
    // =========================

    state.bets = {

        heart: 0,
        diamond: 0,
        club: 0,
        spade: 0,
        crown: 0,
        flag: 0

    };



    // =========================
    // 💰 RESET BET VALUES
    // =========================

    state.totalBet = 0;



    // =========================
    // 🪙 RESET CHIP (DEFAULT)
    // =========================

    state.selectedChip = 0.10;



    // =========================
    // 🧠 UI STATE RESET (NEW)
    // =========================

    state.ui.lastAction = "board_reset";



    // =========================
    // 🧩 UI UPDATE HOOK
    // =========================

    if (typeof refreshGameUI === "function") {
        refreshGameUI();
    }



    console.log("[BOARD] Reset complete");

}


// ======================================================
// 🔄 END: BOARD RESET SYSTEM (UPGRADED)
// ======================================================
    // ======================================
// BONUS BUBBLE SYSTEM
// ======================================

let activeBubbleMultiplier = null;
let activeBubbleSymbol = null;

const BUBBLE_MULTIPLIERS = [2,3,4,5];

const BUBBLE_SYMBOLS = [
    "heart",
    "diamond",
    "spade",
    "crown",
    "club",
    "flag"
];

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
}

function startBonusBubbleShow() {

    selectBubbleTarget();

    // next
    spawnBubbleWave();
}


// ======================================================
// 📊 START: GAME DATA SYSTEM (UPGRADED)
// ======================================================


// =========================
// 🧠 FULL STATE ACCESS
// =========================

function getGameState() {

    return state;

}



// =========================
// 💰 BALANCE
// =========================

function getCurrentBalance() {

    return state.balance;

}



// =========================
// 🎯 BET DATA
// =========================

function getCurrentBets() {

    return state.bets;

}

function getCurrentTotalBet() {

    return state.totalBet;

}



// =========================
// 🪙 CHIP DATA
// =========================

function getCurrentChip() {

    return state.selectedChip;

}



// =========================
// 🎡 WHEEL DATA
// =========================

function getCurrentWheelRotation() {

    return state.wheelRotation;

}



// =========================
// 🧠 RESULT DATA (NEW IMPORTANT)
// =========================

function getCurrentLastWin() {

    return state.lastWin;

}

function getCurrentLastResult() {

    return state.lastResult;

}

function getCurrentSpinStatus() {

    return state.isSpinning;

}



// =========================
// 🎯 NEW: ENGINE DEBUG HELPERS
// =========================

function getFinalIndex() {

    return state.finalIndex ?? null;

}

function getFinalSymbols() {

    return state.finalSymbols ?? [];

}

function isBetLocked() {

    return state.isBetLocked;

}

function isRoundActive() {

    return !state.isBetLocked && !state.isSpinning;

}
    // ========================================================
    // 🌐 SECTION 9: PUBLIC APPLICATION PROGRAMMING INTERFACE [START]
    // ========================================================
    return {
        
        getBalance,
        getCurrentBalance,
        getSelectedChip,
        selectChip,
        placeBet,
        startSpin,
        endSpin,
        getCurrentChip,
        getCurrentSpinStatus,
        hasBets,
        getBet,
        getAllBets,
        getTotalBet,
        clearBets,
        startNewRound,
       endRound,
        resetRoundData,
        activeBubbleMultiplier,
        activeBubbleSymbol,

        getCurrentBalance,
        getCurrentBets,
        getWheelRotation,
        setWheelRotation,
        getWheelSlots,
        getWheelRotation,
       setWheelRotation,
       getWheelSlots,
        getFinalIndex,
        getGameState,
        playChipSound,
       playTableSound,
       playSpinSound,
       playSpinButtonSound,
        playBubbleFlySound,
        playBubbleLandSound,
        playBubbleWinSound,
        isBetLocked,
       lockBets: lockRound,
       unlockBets: unlockRound,
       getCurrentTotalBet,
       getCurrentLastWin,
       getCurrentLastResult,
        
        resetBoard 
        
                    // এখন এটি ঘর অবজেক্ট রিটার্ন করে
               // নতুন ভোল্টেজ বোনাস মেকার
           };
    // ========================================================
    // 🌐 SECTION 9: PUBLIC APPLICATION PROGRAMMING INTERFACE [END]
    // ========================================================

})();
