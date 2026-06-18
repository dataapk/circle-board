// ======================================================
// 🧠 GAME ENGINE (STATE ONLY - NO UI)
// ======================================================

window.GameEngine = {

    // 💰 PLAYER STATE
    balance: 1000,
    selectedChip: null,
    bets: {},

    // 🎰 GAME STATE
    isSpinning: false,
    lastResult: null,

    // 🎡 WHEEL STATE
    currentRotation: 0,
    spinDirection: 1,

    // 🔊 AUDIO REFERENCES
    chipSound: null,
    tableSound: null,
    spinSound: null,
    winSound: null,
    loseSound: null,
    spinButtonSound: null
};
