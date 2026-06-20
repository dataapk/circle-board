// ======================================================
// 🧠 START: iGAMING PRO GAME ENGINE (STM AUDIO SYNC)
// ======================================================

window.GameEngine = (function () {

    // ==================================================
    // 🔐 PRIVATE STATE
    // ==================================================
    const state = {
        balance: 1000,
        bets: {},
        isSpinning: false,
        lastResult: null,
        rotation: 0,
        selectedChip: null
    };

    // ==================================================
// 🔊 PRO iGAMING AUDIO SYSTEM (CASINO LEVEL)
// ==================================================

const audioSystem = (function () {

    // ==================================================
    // 🔐 PRIVATE SOUND REGISTRY (STM DOM BIND)
    // ==================================================
    const sounds = {
        chipSound: null,
        tableSound: null,
        spinButtonSound: null,
        spinSound: null,
        tickSound: null,
        winSound: null,
        loseSound: null
    };

    // ==================================================
    // ⛔ ANTI-SPAM CONTROL (CASINO SAFE)
    // ==================================================
    const cooldown = {};
    const COOLDOWN_TIME = 80; // ms

    // ==================================================
    // 🔗 BIND STM AUDIO ELEMENTS
    // ==================================================
    function bind() {

        sounds.chipSound =
            document.getElementById("chipSound");

        sounds.tableSound =
            document.getElementById("tableSound");

        sounds.spinButtonSound =
            document.getElementById("spinButtonSound");

        sounds.spinSound =
            document.getElementById("spinSound");

        sounds.tickSound =
            document.getElementById("tickSound");

        sounds.winSound =
            document.getElementById("winSound");

        sounds.loseSound =
            document.getElementById("loseSound");
    }

    // ==================================================
    // 🔊 SAFE PLAY (NO CRASH + NO DOUBLE SPAM)
    // ==================================================
    function play(type) {

    const now = Date.now();

    if (cooldown[type] && now - cooldown[type] < COOLDOWN_TIME) {
        return;
    }

    cooldown[type] = now;

    const sound = sounds[type];

    if (!(sound instanceof HTMLAudioElement)) return;

    try {
        sound.currentTime = 0;

        const playPromise = sound.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
        }

    } catch (err) {
        // silent fail
    }
}
    // ==================================================
    // 🔧 OPTIONAL: STOP ALL SOUNDS
    // ==================================================
    function stopAll() {

        for (let key in sounds) {

            const s = sounds[key];

            if (s) {
                s.pause();
                s.currentTime = 0;
            }
        }
    }

      // ==================================================
// 🔊 PRO iGAMING AUDIO SYSTEM END
// ==================================================

    // ==================================================
    // 📦 PUBLIC API
    // ==================================================
    return {

    bind,
    play,
    stopAll,

    getState,
    getBalance,

    setSelectedChip,
    getSelectedChip

};
    // ==================================================
    // 💰 PAYOUT TABLE
    // ==================================================
    const PAYOUT_TABLE = {
        heart: 2,
        diamond: 2,
        club: 2,
        spade: 2,
        crown: 3,
        flag: 3
    };

    // ==================================================
    // 📊 STATE ACCESS
    // ==================================================
    function getState() {
        return {
            balance: state.balance,
            bets: { ...state.bets },
            isSpinning: state.isSpinning,
            lastResult: state.lastResult,
            rotation: state.rotation,
            selectedChip: state.selectedChip
        };
    }

    function getBalance() {
        return state.balance;
    }

 // ==================================================
// 🪙 CHIP SYSTEM (LOGIC ONLY - GAMEENGINE)
// ==================================================

setSelectedChip(chip) {
    console.log("🟢 CHIP SET CALLED:", chip);
    console.trace("📍 CHIP SET TRACE");

    state.selectedChip = chip;
}

function getSelectedChip() {
    return state.selectedChip;
}

function getChipValue() {
    return state.selectedChip?.value ?? null;
}

function hasSelectedChip() {
    return state.selectedChip !== null && state.selectedChip !== undefined;
}

function resetChip() {
    state.selectedChip = null;
}
    // ==================================================
    // 🎯 PLACE BET
    // ==================================================
    function placeBet(type, amount) {

    amount = Number(amount);

    // =========================
    // 1️⃣ VALIDATION
    // =========================
    if (!type || isNaN(amount) || amount <= 0) {
        return { success: false, reason: "invalid_bet" };
    }

    if (state.isSpinning) {
        return { success: false, reason: "game_locked" };
    }

    if (state.balance < amount) {
        return { success: false, reason: "insufficient_balance" };
    }

    // =========================
    // 2️⃣ BALANCE UPDATE
    // =========================
    state.balance -= amount;

    // =========================
    // 3️⃣ BET STORE (MAIN ENGINE STATE)
    // =========================
    state.bets[type] =
        (state.bets[type] || 0) + amount;

    // =========================
    // 4️⃣ AUDIO (SAFE CALL)
    // =========================
    GameEngine.audioSystem?.play("chipSound");

    // =========================
    // 5️⃣ DEBUG LOG (OPTIONAL)
    // =========================
    console.log("💰 BET PLACED:", {
        type,
        amount,
        balance: state.balance,
        bets: state.bets
    });

    // =========================
    // 6️⃣ RETURN RESULT
    // =========================
    return {
        success: true,
        balance: state.balance,
        bets: { ...state.bets }
    };
}
    // ==================================================
    // 🔒 GAME LOCK
    // ==================================================
    function lockGame() {
        state.isSpinning = true;
    }

    function unlockGame() {
        state.isSpinning = false;
    }

    // ==================================================
    // 🎡 ROTATION
    // ==================================================
    function setRotation(angle) {
        state.rotation = angle;
    }

    function getRotation() {
        return state.rotation;
    }

    // ==================================================
    // 🎯 WIN CALCULATION
    // ==================================================
    function calculateWin(result) {

        let win = 0;

        for (let bet in state.bets) {

            if (bet === result) {
                win += state.bets[bet] *
                    (PAYOUT_TABLE[bet] || 0);
            }
        }

        return Math.round(win * 100) / 100;
    }

    // ==================================================
    // 💸 PAYOUT
    // ==================================================
    function resolvePayout(result) {

    state.lastResult = result;

    const win = calculateWin(result);

    if (win > 0) {

        state.balance += win;

        GameEngine.audioSystem.play("winSound");

    } else {

        GameEngine.audioSystem.play("loseSound");
    }

    state.bets = {};
    unlockGame();

    return {
        result,
        win,
        balance: state.balance
    };
}

    // ==================================================
    // 🔄 ROUND RESET
    // ==================================================
   function resetRound() {

    state.bets = {};
    state.lastResult = null;
    state.selectedChip = null;
    state.isSpinning = false;

    // 🔊 optional: stop all sounds cleanly
    if (audioSystem && audioSystem.stopAll) {
        audioSystem.stopAll();
    }
}
    
    // ==================================================
// 📦 PUBLIC API
// ==================================================
return {

    getState,
    getBalance,

    setSelectedChip,
    getSelectedChip,
    getChipValue,
    hasSelectedChip,
    resetChip,

    placeBet,

    lockGame,
    unlockGame,

    setRotation,
    getRotation,

    calculateWin,
    resolvePayout,

    resetRound,

    audioSystem,

    // ⭐ IMPORTANT BRIDGE
    getBets: () => state.bets,
    isSpinning: () => state.isSpinning,
    setSpinning: (v) => state.isSpinning = v,

    setBalance: (v) => state.balance = v
};

})();
