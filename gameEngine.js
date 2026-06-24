// ========================================================
// 🧠 CLEAN GAME ENGINE V4.1 (PRO iGaming Logic - Full Refreshed)
// ========================================================

window.GameEngine = (function () {
    // 📂 SECTION 1: CORE STATE
    const state = {
        balance: 1000.00,
        bets: {},
        isSpinning: false,
        lastResult: null,
        rotation: 0,
        selectedChip: { value: 0.10 }
    };

    // 🎡 SECTION 2: WHEEL SLOTS & BONUS CONFIG
    const WHEEL_SLOTS = [
        { slot: 1,  symbol: "heart",   count: 2 },
        { slot: 2,  symbol: "spade",   count: 2 },
        { slot: 3,  symbol: "flag",    count: 3 },
        { slot: 4,  symbol: "club",    count: 2 },
        { slot: 5,  symbol: "spade",   count: 1 },
        { slot: 6,  symbol: "diamond", count: 3 },
        { slot: 7,  symbol: "flag",    count: 2 },
        { slot: 8,  symbol: "crown",   count: 1 },
        { slot: 9,  symbol: "spade",   count: 3 },
        { slot: 10, symbol: "diamond", count: 2 },
        { slot: 11, symbol: "heart",   count: 1 },
        { slot: 12, symbol: "crown",   count: 3 },
        { slot: 13, symbol: "spade",   count: 2 },
        { slot: 14, symbol: "flag",    count: 2 },
        { slot: 15, symbol: "heart",   count: 3 },
        { slot: 16, symbol: "crown",   count: 2 },
        { slot: 17, symbol: "diamond", count: 2 },
        { slot: 18, symbol: "club",    count: 3 }
    ];

    const BONUS_MULTIPLIERS = [5, 10, 15, 20, 25, 30];

    // 🛡️ SECTION 3: CORE LOGIC
    function generateResult() {
        return WHEEL_SLOTS[Math.floor(Math.random() * WHEEL_SLOTS.length)];
    }

    function generateVoltageBonus(winningSlot) {
        const chance = Math.floor(Math.random() * 100) + 1;
        let result = { hasBonus: false, multiplier: 1, targetSlot: null };

        if (chance > 20) { // ৮০% ক্ষেত্রে বোনাস ট্রিগার
            result.hasBonus = true;
            result.multiplier = BONUS_MULTIPLIERS[Math.floor(Math.random() * BONUS_MULTIPLIERS.length)];
            
            // ২৫% চান্স বোনাস রিয়েল হিটে পড়বে
            if (Math.random() < 0.25) {
                result.targetSlot = winningSlot.slot;
            } else {
                let randomSlot = Math.floor(Math.random() * 18) + 1;
                result.targetSlot = randomSlot === winningSlot.slot ? (randomSlot % 18) + 1 : randomSlot;
            }
        }
        return result;
    }

    // 🧮 SECTION 8: PAYOUT CALCULATION
    function calculateWin(winningSlot, bonusData) {
        let totalWin = 0;
        const winningSymbol = winningSlot.symbol;

        if (state.bets[winningSymbol]) {
            let baseMultiplier = winningSlot.count;
            
            // মাল্টিপ্লায়ার কারেকশন: যদি বোনাস ম্যাচ করে
            if (bonusData.hasBonus && bonusData.targetSlot === winningSlot.slot) {
                baseMultiplier *= bonusData.multiplier;
            }
            
            totalWin = state.bets[winningSymbol] + (state.bets[winningSymbol] * baseMultiplier);
        }
        return Number(totalWin.toFixed(2));
    }

    function resolvePayout(winningSlot, bonusData) {
        state.lastResult = winningSlot.symbol;
        let winAmount = calculateWin(winningSlot, bonusData);
        
        if (winAmount > 0) {
            state.balance = Number((state.balance + winAmount).toFixed(2));
        }

        return {
            symbol: winningSlot.symbol,
            multiplier: bonusData.hasBonus ? bonusData.multiplier : 1,
            win: winAmount,
            balance: state.balance
        };
    }

    // ⚙️ SECTION 9: PUBLIC API
    return {
        getState: () => ({ ...state, bets: { ...state.bets } }),
        getBalance: () => state.balance,
        placeBet: (type, amount) => {
            if (state.isSpinning || state.balance < amount) return { success: false };
            state.balance -= amount;
            state.bets[type] = (state.bets[type] || 0) + amount;
            return { success: true, balance: state.balance };
        },
        clearCurrentBets: () => {
            if (state.isSpinning) return;
            let refund = Object.values(state.bets).reduce((a, b) => a + b, 0);
            state.balance += refund;
            state.bets = {};
        },
        generateResult,
        generateVoltageBonus,
        lock: () => state.isSpinning = true,
        unlock: () => state.isSpinning = false,
        resolvePayout,
        reset: () => { state.bets = {}; state.isSpinning = false; }
    };
})();
