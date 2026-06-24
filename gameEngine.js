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

    isBetLocked: false

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
// 🎯 START: INITIAL BET SYSTEM
// ======================================================

function placeBet(symbol) {

    if (state.isBetLocked) return false;

    if (!hasEnoughBalance(state.selectedChip)) return false;

    state.bets[symbol] += state.selectedChip;

    state.totalBet += state.selectedChip;

    subtractBalance(state.selectedChip);

    return true;

}

function getBet(symbol) {

    return state.bets[symbol] || 0;

}

function getAllBets() {

    return state.bets;

}

function getTotalBet() {

    return state.totalBet;

}

function clearBets() {

    state.bets = {

        heart: 0,
        diamond: 0,
        club: 0,
        spade: 0,
        crown: 0,
        flag: 0

    };

    state.totalBet = 0;

}

function hasBets() {

    return state.totalBet > 0;

}

// ======================================================
// 🎯 END: INITIAL BET SYSTEM
// ======================================================



// ======================================================
// 🎡 START: INITIAL WHEEL SYSTEM
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

function getWheelSlots() {

    return wheelSlots;

}

function getWheelRotation() {

    return state.wheelRotation;

}

function setWheelRotation(angle) {

    state.wheelRotation = angle;

}

// ======================================================
// 🎡 END: INITIAL WHEEL SYSTEM
// ======================================================


// ======================================================
// 🎲 START: INITIAL RESULT SYSTEM
// ======================================================

function calculateResult(slotData) {

    setResult(
        slotData.slot,
        slotData.symbol
    );

    setSymbolCount(
        slotData.symbolCount
    );

    setBonusMultiplier(
        slotData.bonusMultiplier
    );

    return {

        slot: slotData.slot,

        symbol: slotData.symbol,

        symbolCount: slotData.symbolCount,

        bonusMultiplier: slotData.bonusMultiplier

    };

}

function getCurrentResult() {

    return {

        slot: state.winningSlot,

        symbol: state.currentResult,

        symbolCount: getSymbolCount(),

        bonusMultiplier: getBonusMultiplier()

    };

}

// ======================================================
// 🎲 END: INITIAL RESULT SYSTEM
// ======================================================



// ======================================================
// 🏆 START: INITIAL PAYOUT SYSTEM
// ======================================================

function getFinalMultiplier() {

    return getSymbolCount() * getBonusMultiplier();

}

function calculateWinAmount(betAmount) {

    return betAmount * getFinalMultiplier();

}

function setLastWin(amount) {

    state.lastWin = amount;

}

function getLastWin() {

    return state.lastWin;

}

function payWin(amount) {

    state.balance += amount;

    state.lastWin = amount;

}

// ======================================================
// 🏆 END: INITIAL PAYOUT SYSTEM
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
