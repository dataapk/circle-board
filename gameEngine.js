// ======================================================
// 🧠 START: iGAMING PRO GAME ENGINE
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
    // 🔊 AUDIO REGISTRY
    // ==================================================
    const audio = {
        chipSound: null,
        tableSound: null,
        spinButtonSound: null,
        spinSound: null,
        tickSound: null,
        winSound: null,
        loseSound: null
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
    // 🪙 CHIP STATE
    // ==================================================
    function setSelectedChip(chip) {
        state.selectedChip = chip;
    }

    function getSelectedChip() {
        return state.selectedChip;
    }

    // ==================================================
    // 🎯 PLACE BET
    // ==================================================
    function placeBet(type, amount) {

        amount = Number(amount);

        if (!type || isNaN(amount) || amount <= 0) {
            return {
                success: false,
                reason: "invalid_bet"
            };
        }

        if (state.isSpinning) {
            return {
                success: false,
                reason: "game_locked"
            };
        }

        if (state.balance < amount) {
            return {
                success: false,
                reason: "insufficient_balance"
            };
        }

        state.balance -= amount;

        state.bets[type] =
            (state.bets[type] || 0) + amount;

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

                win +=
                    state.bets[bet] *
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

        const win =
            calculateWin(result);

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
    // 🔄 ROUND RESET
    // ==================================================
    function resetRound() {

        state.bets = {};
        state.lastResult = null;
        state.selectedChip = null;
        state.isSpinning = false;
    }

    // ==================================================
    // 🔊 AUDIO REGISTER
    // ==================================================
    function registerAudio(sounds) {

        audio.chipSound =
            sounds.chipSound || null;

        audio.tableSound =
            sounds.tableSound || null;

        audio.spinButtonSound =
            sounds.spinButtonSound || null;

        audio.spinSound =
            sounds.spinSound || null;

        audio.tickSound =
            sounds.tickSound || null;

        audio.winSound =
            sounds.winSound || null;

        audio.loseSound =
            sounds.loseSound || null;
    }

    // ==================================================
    // 🔊 PLAY SOUND
    // ==================================================
    function playSound(type) {

        const map = {

            chip:
                audio.chipSound,

            table:
                audio.tableSound,

            spinButton:
                audio.spinButtonSound,

            spin:
                audio.spinSound,

            tick:
                audio.tickSound,

            win:
                audio.winSound,

            lose:
                audio.loseSound
        };

        const sound = map[type];

        if (!sound) return;

        try {

            sound.currentTime = 0;
            sound.play();

        } catch (err) {

            console.log(
                "🔇 SOUND ERROR:",
                type
            );
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

        placeBet,

        lockGame,
        unlockGame,

        setRotation,
        getRotation,

        calculateWin,
        resolvePayout,

        resetRound,

        registerAudio,
        playSound
    };

})();

// ======================================================
// 🧠 END: iGAMING PRO GAME ENGINE
// ======================================================
