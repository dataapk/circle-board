// ======================================================
// 🧠 START: iGAMING PRO GAME ENGINE (LOGIC ONLY)
// ======================================================

window.GameEngine = (function () {

    // ==================================================
    // 🔐 PRIVATE STATE (NO OUTSIDE DIRECT ACCESS)
    // ==================================================
    const state = {
        balance: 1000,
        bets: {},
        isSpinning: false,
        lastResult: null,
        rotation: 0
    };

    // ==================================================
    // 💰 PAYOUT TABLE (SERVER STYLE SAFE CONFIG)
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
    // 🧾 GET FULL STATE (READ ONLY)
    // ==================================================
    function getState() {
        return {
            balance: state.balance,
            bets: { ...state.bets },
            isSpinning: state.isSpinning,
            lastResult: state.lastResult,
            rotation: state.rotation
        };
    }

    // ==================================================
    // 💰 GET BALANCE
    // ==================================================
    function getBalance() {
        return state.balance;
    }

    // ==================================================
    // 🎯 PLACE BET (PURE LOGIC)
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

        return {
            success: true,
            balance: state.balance,
            bets: { ...state.bets }
        };
    }

    // ==================================================
    // 🔒 LOCK GAME
    // ==================================================
    function lockGame() {
        state.isSpinning = true;
    }

    // ==================================================
    // 🔓 UNLOCK GAME
    // ==================================================
    function unlockGame() {
        state.isSpinning = false;
    }

    // ==================================================
    // 🎡 SET ROTATION
    // ==================================================
    function setRotation(angle) {
        state.rotation = angle % 360;
    }

    function getRotation() {
        return state.rotation;
    }

    // ==================================================
    // 🎯 CALCULATE RESULT WIN
    // ==================================================
    function calculateWin(result) {

        let win = 0;

        for (let bet in state.bets) {

            if (bet === result) {
                win += state.bets[bet] * (PAYOUT_TABLE[bet] || 0);
            }
        }

        return Math.round(win * 100) / 100;
    }

    // ==================================================
    // 💸 RESOLVE PAYOUT (CORE ENGINE LOGIC)
    // ==================================================
    function resolvePayout(result) {

        state.lastResult = result;

        const win = calculateWin(result);

        if (win > 0) {
            state.balance += win;
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
    // 🔄 RESET ROUND (SAFE STATE RESET)
    // ==================================================
    function resetRound() {
        state.bets = {};
        state.lastResult = null;
        state.isSpinning = false;
    }

    // ==================================================
    // 📦 PUBLIC API (ONLY THESE EXPOSED)
    // ==================================================
    return {
        getState,
        getBalance,
        placeBet,
        lockGame,
        unlockGame,
        setRotation,
        getRotation,
        calculateWin,
        resolvePayout,
        resetRound
    };

})();

// ======================================================
// 🧠 END: iGAMING PRO GAME ENGINE
// ======================================================
