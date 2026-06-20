// ======================================================
// 🧠 START: iGAMING PRO GAME ENGINE (CLEAN FIXED VERSION)
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
    // 🔊 AUDIO SYSTEM
    // ==================================================
    const audioSystem = (function () {

        const sounds = {
            chipSound: null,
            tableSound: null,
            spinButtonSound: null,
            spinSound: null,
            tickSound: null,
            winSound: null,
            loseSound: null
        };

        const cooldown = {};
        const COOLDOWN_TIME = 80;

        function bind() {
            sounds.chipSound = document.getElementById("chipSound");
            sounds.tableSound = document.getElementById("tableSound");
            sounds.spinButtonSound = document.getElementById("spinButtonSound");
            sounds.spinSound = document.getElementById("spinSound");
            sounds.tickSound = document.getElementById("tickSound");
            sounds.winSound = document.getElementById("winSound");
            sounds.loseSound = document.getElementById("loseSound");
        }

        function play(type) {
            const now = Date.now();

            if (cooldown[type] && now - cooldown[type] < COOLDOWN_TIME) return;
            cooldown[type] = now;

            const sound = sounds[type];
            if (!(sound instanceof HTMLAudioElement)) return;

            try {
                sound.currentTime = 0;
                const p = sound.play();
                if (p && p.catch) p.catch(() => {});
            } catch (e) {}
        }

        function stopAll() {
            Object.values(sounds).forEach(s => {
                if (s) {
                    s.pause();
                    s.currentTime = 0;
                }
            });
        }

        return { bind, play, stopAll };

    })();

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
    // 🪙 CHIP SYSTEM
    // ==================================================
    function setSelectedChip(chip) {
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
        return state.selectedChip != null;
    }

    function resetChip() {
        state.selectedChip = null;
    }

    // ==================================================
    // 🎯 PLACE BET
    // ==================================================
    function placeBet(type, amount) {

        amount = Number(amount);

        if (!type || isNaN(amount) || amount <= 0) {
            return { success: false, reason: "invalid_bet" };
        }

        if (state.isSpinning) {
            return { success: false, reason: "game_locked" };
        }

        if (state.balance < amount) {
            return { success: false, reason: "insufficient_balance" };
        }

        state.balance -= amount;
        state.bets[type] = (state.bets[type] || 0) + amount;

        audioSystem.play("chipSound");

        console.log("💰 BET PLACED:", { type, amount, balance: state.balance });

        return {
            success: true,
            balance: state.balance,
            bets: { ...state.bets }
        };
    }

    // ==================================================
    // 🔒 LOCK / UNLOCK
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
    function setRotation(a) {
        state.rotation = a;
    }

    function getRotation() {
        return state.rotation;
    }

    // ==================================================
    // 🎯 WIN LOGIC
    // ==================================================
    function calculateWin(result) {

    const payoutTable = {
        heart: 2,
        diamond: 2,
        club: 2,
        spade: 2,
        crown: 3,
        flag: 3
    };

    let win = 0;

    const bets = state.bets || {};

    for (let bet in bets) {

        const amount = bets[bet];

        if (bet === result) {
            const multiplier = payoutTable[bet] || 0;
            win += amount * multiplier;
        }
    }

    return Math.round(win * 100) / 100;
}
    
    // ==================================================
    // 🎯 RESOLVE PAYOUT
    // ==================================================
function resolvePayout(result) {

    // 🧠 validate result
    if (!result) {
        console.error("❌ Invalid result");
        return;
    }

    state.lastResult = result;

    // 💰 calculate win
    const win = calculateWin(result) || 0;

    // 🛡️ safe balance update
    if (win > 0) {
        state.balance += win;
        audioSystem.play("winSound");
    } else {
        audioSystem.play("loseSound");
    }

    // 🧹 reset bets
    state.bets = {};

    // 🔓 unlock game
    unlockGame();

    // 🎯 IMPORTANT: UI SYNC (missing part)
    if (typeof updateBalanceUI === "function") {
        updateBalanceUI(state.balance);
    }

    console.log("🎯 PAYOUT RESULT:", {
        result,
        win,
        balance: state.balance
    });

    return {
        result,
        win,
        balance: state.balance
    };
}

    // ==================================================
    // 🔄 RESET
    // ==================================================
    function resetRound() {
        state.bets = {};
        state.lastResult = null;
        state.selectedChip = null;
        state.isSpinning = false;

        audioSystem.stopAll();
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

        getBets: () => state.bets,
        isSpinning: () => state.isSpinning,
        setSpinning: (v) => state.isSpinning = v,
        setBalance: (v) => state.balance = v
    };

})();

// ======================================================
// 🧠 END GAME ENGINE
// ======================================================
