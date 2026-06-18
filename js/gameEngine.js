/* ======================================================
   🧠 GAMEENGINE.JS (STATE ONLY - NO UI / NO EVENTS)
   ====================================================== */

/* =========================
   START: GAME ENGINE CORE
========================= */

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

    // 🔊 AUDIO REFERENCES ONLY
    chipSound: null,
    tableSound: null,
    spinSound: null,
    winSound: null,
    loseSound: null,
    spinButtonSound: null
};

/* =========================
   END: GAME ENGINE CORE
========================= */
