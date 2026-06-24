// ======================================================
// 🧠 START: GAME ENGINE
// ======================================================
// ======================================================
// 🔒 START: PRIVATE GAME STATE
// ======================================================

const state = {

    balance: 1000,

    selectedChip: 0.10,



    bets: {
        heart: 0,
        diamond: 0,
        club: 0,
        spade: 0,
        crown: 0,
        flag: 0
    },



    totalBet: 0,



    wheelRotation: 0,



    currentResult: null,

    winningSlot: null,



    lastWin: 0,

    lastResult: null,



    isSpinning: false,

    isBetLocked: false,



    // =========================
    // 🧠 ROUND CONTROL (NEW)
    // =========================

    currentRoundId: 0,

    lastRoundBets: null,



    // =========================
    // 🎡 WHEEL RESULT DATA (NEW)
    // =========================

    finalIndex: null,

    finalSymbols: [],

    bonusMultiplier: 1,



    // =========================
    // 🧩 UI CONTROL STATE (NEW)
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

    spinButton: null

};

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

    "heart",
    "diamond",
    "club",
    "spade",
    "crown",
    "flag",

    "heart",
    "diamond",
    "club",
    "spade",
    "crown",
    "flag",

    "heart",
    "diamond",
    "club",
    "spade",
    "crown",
    "flag"

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
// 🎡 NEW: FINAL SLOT SETTER (RESULT ENGINE HOOK)
// ======================================================

function setFinalWheelResult(index) {

    console.log("[WHEEL] Final result index:", index);

    state.finalIndex = index;

    state.finalSymbols = getWheelSlots().slice(index, index + 3);

    state.currentResult = state.finalSymbols;

    state.winningSlot = wheelSlots[index];

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
// 🎡 START: INITIAL WHEEL SYSTEM (UPGRADED)
// ======================================================

const wheelSlots = [

    "heart",
    "diamond",
    "club",
    "spade",
    "crown",
    "flag",

    "heart",
    "diamond",
    "club",
    "spade",
    "crown",
    "flag",

    "heart",
    "diamond",
    "club",
    "spade",
    "crown",
    "flag"

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
// 🎡 NEW: FINAL SLOT SETTER (RESULT ENGINE HOOK)
// ======================================================

function setFinalWheelResult(index) {

    console.log("[WHEEL] Final result index:", index);

    state.finalIndex = index;

    state.finalSymbols = getWheelSlots().slice(index, index + 3);

    state.currentResult = state.finalSymbols;

    state.winningSlot = wheelSlots[index];

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

    let totalWin = 0;

    for (let symbol in state.bets) {

        let betAmount = state.bets[symbol];

        if (betAmount <= 0) continue;

        let count = symbolCountMap[symbol] || 0;



        // ❌ RULE: single symbol = loss
        if (count < 2) {

            console.log("[RESULT] LOSS:", symbol);

            continue;

        }



        // 🧮 SYMBOL MULTIPLIER
        let symbolMultiplier = count;



        // 💰 FINAL CALCULATION
        let win =
            (betAmount * symbolMultiplier * bonusMultiplier) + betAmount;



        console.log("[RESULT] WIN:", symbol, win);



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
// 🔄 START: INITIAL NEW ROUND SYSTEM
// ======================================================

function lockBets() {

    state.isBetLocked = true;

}

function unlockBets() {

    state.isBetLocked = false;

}

function startNewRound() {

    state.currentResult = null;

    state.winningSlot = null;

    state.symbolCount = 0;

    state.bonusMultiplier = 1;

    state.lastWin = 0;

    state.isSpinning = false;

    unlockBets();

}

function endRound() {

    state.isSpinning = false;

}

function resetRoundData() {

    state.currentResult = null;

    state.winningSlot = null;

    state.symbolCount = 0;

    state.bonusMultiplier = 1;

}

// ======================================================
// 🔄 END: INITIAL NEW ROUND SYSTEM
// ======================================================
// ======================================================
// 🔄 START: BOARD RESET SYSTEM
// ======================================================

function resetBoard() {

    state.bets = {

        heart: 0,
        diamond: 0,
        club: 0,
        spade: 0,
        crown: 0,
        flag: 0

    };

    state.totalBet = 0;

    state.selectedChip = 0.10;

}

// ======================================================
// 🔄 END: BOARD RESET SYSTEM
// ======================================================


// ======================================================
// 📊 START: GAME DATA SYSTEM
// ======================================================

function getGameState() {

    return state;

}

function getCurrentBalance() {

    return state.balance;

}

function getCurrentBets() {

    return state.bets;

}

function getCurrentTotalBet() {

    return state.totalBet;

}

function getCurrentChip() {

    return state.selectedChip;

}

function getCurrentWheelRotation() {

    return state.wheelRotation;

}

function getCurrentLastWin() {

    return state.lastWin;

}

function getCurrentLastResult() {

    return state.lastResult;

}

function getCurrentSpinStatus() {

    return state.isSpinning;

}

// ======================================================
// 🌍 START: PUBLIC GAME API
// ======================================================

return {

    // AUDIO
    playChipSound,
    playTableSound,
    playSpinSound,
    playSpinButtonSound,

    // BALANCE
    getBalance,
    setBalance,
    addBalance,
    subtractBalance,
    hasEnoughBalance,

    // CHIP
    getSelectedChip,
    selectChip,
    hasSelectedChip,

    // BET
    placeBet,
    getBet,
    getAllBets,
    getTotalBet,
    clearBets,
    hasBets,

    // WHEEL
    getWheelSlots,
    getWheelRotation,
    setWheelRotation,

    // RESULT
    calculateResult,
    getCurrentResult,
    getResult,
    getWinningSlot,
    getSymbolCount,
    getBonusMultiplier,

    // PAYOUT
    getFinalMultiplier,
    calculateWinAmount,
    setLastWin,
    getLastWin,
    payWin,

    // ROUND
    startNewRound,
    endRound,
    resetRoundData,
    lockBets,
    unlockBets,
    resetBoard,

    // DATA
    getGameState,
    getCurrentBalance,
    getCurrentBets,
    getCurrentTotalBet,
    getCurrentChip,
    getCurrentWheelRotation,
    getCurrentLastWin,
    getCurrentLastResult,
    getCurrentSpinStatus

};

// ======================================================
// 🌍 END: PUBLIC GAME API
// ======================================================


// ======================================================
// 🧠 END: GAME ENGINE
// ======================================================
