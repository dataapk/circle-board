// ======================================================
// 🧠 CLEAN GAME ENGINE V3 (PRO iGaming Logic)
// ======================================================

window.GameEngine = (function () {

    const state = {
        balance: 1000.00,
        bets: {}, // যেমন: { heart: 0.50, crown: 1.00 }
        isSpinning: false,
        lastResult: null,
        rotation: 0,
        selectedChip: { value: 0.10 } 
    };

    // ক্যাসিনো স্ট্যান্ডার্ড মাল্টিপ্লায়ার টেবিল (1-to-X odds)
    const PAYOUT_TABLE = {
        heart: 2,
        diamond: 2,
        club: 2,
        spade: 2,
        crown: 3,
        flag: 3
    };

    // চাকার ১২টি সেগমেন্ট (যা game.js এর সাথে হুবহু মিলানো)
    const SEGMENTS = [
        "heart", "spade", "diamond", "club",
        "crown", "flag", "heart", "crown",
        "spade", "diamond", "flag", "club"
    ];

    // =========================
    // STATE MANAGEMENT
    // =========================
    function getState() {
        return {
            balance: state.balance,
            bets: { ...state.bets },
            isSpinning: state.isSpinning,
            selectedChip: { ...state.selectedChip },
            rotation: state.rotation,
            lastResult: state.lastResult
        };
    }

    function getBalance() {
        return state.balance;
    }

    // =========================
    // CHIP SYSTEM
    // =========================
    function setSelectedChip(chip) {
        if (chip && typeof chip.value === 'number' && chip.value > 0) {
            state.selectedChip = chip;
        }
    }

    function getChip() {
        return state.selectedChip || { value: 0.10 };
    }

    // =========================
    // BET SYSTEM
    // =========================
    function placeBet(type, amount) {
        if (state.isSpinning) return { success: false, reason: "game_is_spinning" };

        const betAmount = Number(amount);
        if (!type || isNaN(betAmount) || betAmount <= 0) return { success: false, reason: "invalid_amount" };

        // ব্যালেন্স চেক
        if (state.balance < betAmount) {
            return { success: false, reason: "insufficient_balance" };
        }

        // ব্যালেন্স কাটা এবং বেট টেবিলে যোগ করা
        state.balance = Number((state.balance - betAmount).toFixed(2));
        state.bets[type] = Number(((state.bets[type] || 0) + betAmount).toFixed(2));

        return {
            success: true,
            balance: state.balance,
            bets: { ...state.bets }
        };
    }

    // ইউজার স্পিন করার আগে বেট বাতিল করতে চাইলে
    function clearCurrentBets() {
        if (state.isSpinning) return false;

        // সমস্ত বেটের টাকা ব্যাকগ্রাউন্ডে ব্যালেন্সে ফেরত দেওয়া
        let totalRefund = 0;
        for (let type in state.bets) {
            totalRefund += state.bets[type];
        }

        state.balance = Number((state.balance + totalRefund).toFixed(2));
        state.bets = {};
        return true;
    }

    // =========================
    // SPIN CONTROL & RNG
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

    // RNG (Random Number Generator) - iGaming ফেয়ার প্লে স্ট্যান্ডার্ড রেজাল্ট জেনারেটর
    function generateResult() {
        const randomIndex = Math.floor(Math.random() * SEGMENTS.length);
        return SEGMENTS[randomIndex];
    }

    // =========================
    // WIN & PAYOUT CALCULATION
    // =========================
    function calculateWin(winningSymbol) {
        let totalWin = 0;

        for (let betSymbol in state.bets) {
            if (betSymbol === winningSymbol) {
                const betAmount = state.bets[betSymbol];
                const multiplier = PAYOUT_TABLE[betSymbol] || 0;
                
                // iGaming Standard: উইনিং বেটের আসল টাকা + প্রফিট (যেমন: $1 বেটে 2x গুণ হলে মোট $3 ব্যাক আসবে)
                totalWin += betAmount + (betAmount * multiplier);
            }
        }

        return Number(totalWin.toFixed(2));
    }

    function resolvePayout(winningSymbol) {
        state.lastResult = winningSymbol;

        const winAmount = calculateWin(winningSymbol);

        if (winAmount > 0) {
            state.balance = Number((state.balance + winAmount).toFixed(2));
        }

        return {
            result: winningSymbol,
            win: winAmount,
            balance: state.balance
        };
    }

    // স্পিন শেষে শুধুমাত্র বোর্ড ডেটা রিসেট করার জন্য (চিপ সিলেকশন নষ্ট হবে না)
    function reset() {
        state.bets = {};
        state.isSpinning = false;
        // রোটেশন এবং সিলেক্টেড চিপ রেখে দেওয়া হলো পরবর্তী রাউন্ডের জন্য
    }

    // =========================
    // PUBLIC API
    // =========================
    return {
        getState,
        getBalance,
        setSelectedChip,
        getChip,
        placeBet,
        clearCurrentBets,
        generateResult,
        lock,
        unlock,
        setRotation,
        calculateWin,
        resolvePayout,
        reset
    };

})();
