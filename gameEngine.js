// ======================================================
// 🧠 CLEAN GAME ENGINE V2
// ======================================================

window.GameEngine = (function () {

    const state = {
        balance: 1000,
        bets: {},
        isSpinning: false,
        lastResult: null,
        rotation: 0,
        selectedChip: { value: 0.10 } // ✅ DEFAULT CHIP FIX
    };

    const PAYOUT_TABLE = {
        heart: 2,
        diamond: 2,
        club: 2,
        spade: 2,
        crown: 3,
        flag: 3
    };

    // =========================
    // STATE
    // =========================
    function getState() {
        return {
            balance: state.balance,
            bets: { ...state.bets },
            isSpinning: state.isSpinning,
            selectedChip: state.selectedChip,
            rotation: state.rotation
        };
    }

    function getBalance() {
        return state.balance;
    }

    // =========================
    // CHIP
    // =========================
    function setSelectedChip(chip) {
        state.selectedChip = chip;
    }

    function getChip() {
        return state.selectedChip || { value: 0.10 };
    }

    // =========================
    // BET SYSTEM
    // =========================
    function placeBet(type, amount) {

        if (state.isSpinning) return { success: false };

        amount = Number(amount);
        if (!type || amount <= 0) return { success: false };

        const chip = getChip();

        if (state.balance < chip.value) {
            return { success: false, reason: "no_balance" };
        }

        state.balance -= chip.value;

        state.bets[type] = (state.bets[type] || 0) + chip.value;

        return {
            success: true,
            balance: state.balance,
            bets: { ...state.bets }
        };
    }

    // =========================
    // SPIN CONTROL
    // =========================
    function lock() {
        state.isSpinning = true;
    }

    function unlock() {
        state.isSpinning = false;
    }

    function setRotation(r) {
        state.rotation = r;
    }

    // =========================
    // WIN CALCULATION
    // =========================
    function calculateWin(result) {
        let win = 0;

        for (let bet in state.bets) {
            if (bet === result) {
                win += state.bets[bet] * (PAYOUT_TABLE[bet] || 0);
            }
        }

        return win;
    }

    function resolvePayout(result) {

        state.lastResult = result;

        const win = calculateWin(result);

        if (win > 0) {
            state.balance += win;
        }

        state.bets = {};

        return {
            result,
            win,
            balance: state.balance
        };
    }

    function reset() {
        state.bets = {};
        state.isSpinning = false;
        state.lastResult = null;
        state.rotation = 0;
        state.selectedChip = { value: 0.10 };
    }

    // =========================
    // API
    // =========================
    return {
        getState,
        getBalance,
        setSelectedChip,
        getChip,
        placeBet,
        lock,
        unlock,
        setRotation,
        calculateWin,
        resolvePayout,
        reset
    };

})();
