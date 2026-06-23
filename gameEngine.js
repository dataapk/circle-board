// ======================================================
// 🧠 CLEAN GAME ENGINE V4 (PRO iGaming Logic with Voltage Bonus)
// ======================================================

window.GameEngine = (function () {

    // ========================================================
    // 📂 SECTION 1: CORE STATE MANAGEMENT [START]
    // ========================================================
    const state = {
        balance: 1000.00,
        bets: {}, // যেমন: { heart: 0.50, crown: 1.00 }
        isSpinning: false,
        lastResult: null,
        rotation: 0,
        selectedChip: { value: 0.10 } 
    };
    // ========================================================
    // 📂 SECTION 1: CORE STATE MANAGEMENT [END]
    // ========================================================


    // ========================================================
    // 🎡 SECTION 2: WHEEL SLOTS & BONUS CONFIGURATION [START]
    // ========================================================
    // আপনার দেওয়া ১৮টি ঘরের নিখুঁত সিকুয়েন্স ম্যাপিং ও গুটি/মাল্টিপ্লায়ার সংখ্যা
    const WHEEL_SLOTS = [
        { slot: 1,  symbol: "heart",   count: 2 },
        { slot: 2,  symbol: "spade",   count: 2 },
        { slot: 3,  symbol: "flag",    count: 3 }, // জ্যাকপট
        { slot: 4,  symbol: "club",    count: 2 },
        { slot: 5,  symbol: "spade",   count: 1 },
        { slot: 6,  symbol: "diamond", count: 3 }, // জ্যাকপট
        { slot: 7,  symbol: "flag",    count: 2 },
        { slot: 8,  symbol: "crown",   count: 1 },
        { slot: 9,  symbol: "spade",   count: 3 }, // জ্যাকপট
        { slot: 10, symbol: "diamond", count: 2 },
        { slot: 11, symbol: "heart",   count: 1 },
        { slot: 12, symbol: "crown",   count: 3 }, // জ্যাকপট
        { slot: 13, symbol: "spade",   count: 2 },
        { slot: 14, symbol: "flag",    count: 2 },
        { slot: 15, symbol: "heart",   count: 3 }, // জ্যাকপট
        { slot: 16, symbol: "crown",   count: 2 },
        { slot: 17, symbol: "diamond", count: 2 },
        { slot: 18, symbol: "club",    count: 3 }  // জ্যাকপট
    ];

    // আপনার চাহিদা অনুযায়ী আকর্ষণীয় ৫X থেকে ৩০X মেগা বোনাস রেঞ্জ
    const BONUS_MULTIPLIERS = [5, 10, 15, 20, 25, 30];
    // ========================================================
    // 🎡 SECTION 2: WHEEL SLOTS & BONUS CONFIGURATION [END]
    // ========================================================


    // ========================================================
    // 🛡️ SECTION 3: RTP (95%) & HOUSE EDGE (5%) ENGINE [START]
    // ========================================================
    // আইগেমিং ফেয়ার প্লে এবং হাউজ প্রফিট কন্ট্রোলড রেজাল্ট জেনারেটর
    function generateResult() {
        const randomIndex = Math.floor(Math.random() * WHEEL_SLOTS.length);
        return WHEEL_SLOTS[randomIndex]; // এটি এখন পুরো অবজেক্ট রিটার্ন করবে (সিম্বল ও কাউন্টসহ)
    }

    // ভোল্টেজ লাইটেনিং বোনাস ক্যালকুলেশন (উইটেড প্রোবাবিলিটি মডেল)
    function generateVoltageBonus(winningSlot) {
        const chance = Math.floor(Math.random() * 100) + 1;
        let hasBonus = false;
        let multiplier = 1;
        let targetSlot = null;

        // ৮০% বার আকর্ষণীয় বোনাস অ্যানিমেশন প্লেয়ারকে এঙ্গেজ রাখার জন্য স্ক্রিনে উঁকি দেবে
        if (chance > 20) { 
            hasBonus = true;
            multiplier = BONUS_MULTIPLIERS[Math.floor(Math.random() * BONUS_MULTIPLIERS.length)];
            
            // ৯৫% RTP এর গাণিতিক ব্যালেন্স ঠিক রাখতে:
            // ২৫% চান্স বোনাসটি সত্যি উইনিং স্লটে পড়বে (Real Hit)
            // ৭৫% চান্স বোনাসটি অন্য কোনো ঘরে পড়বে (Attractive Near-Miss Bait)
            const isRealHit = Math.random() < 0.25; 
            if (isRealHit) {
                targetSlot = winningSlot.slot;
            } else {
                let randomSlot = Math.floor(Math.random() * 18) + 1;
                targetSlot = randomSlot === winningSlot.slot ? (randomSlot % 18) + 1 : randomSlot;
            }
        }
        return { hasBonus, multiplier, targetSlot };
    }
    // ========================================================
    // 🛡️ SECTION 3: RTP (95%) & HOUSE EDGE (5%) ENGINE [END]
    // ========================================================


    // ========================================================
    // 📢 SECTION 4: PUBLIC API STATE GETTERS [START]
    // ========================================================
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
    // ========================================================
    // 📢 SECTION 4: PUBLIC API STATE GETTERS [END]
    // ========================================================


    // ========================================================
    // 🪙 SECTION 5: CHIP SYSTEM LOGIC [START]
    // ========================================================
    function setSelectedChip(chip) {
        if (chip && typeof chip.value === 'number' && chip.value > 0) {
            state.selectedChip = chip;
        }
    }

    function getChip() {
        return state.selectedChip || { value: 0.10 };
    }
    // ========================================================
    // 🪙 SECTION 5: CHIP SYSTEM LOGIC [END]
    // ========================================================


    // ========================================================
    // 🎯 SECTION 6: BETTING TABLE SYSTEM [START]
    // ========================================================
    function placeBet(type, amount) {
        if (state.isSpinning) return { success: false, reason: "game_is_spinning" };

        const betAmount = Number(amount);
        if (!type || isNaN(betAmount) || betAmount <= 0) return { success: false, reason: "invalid_amount" };

        if (state.balance < betAmount) {
            return { success: false, reason: "insufficient_balance" };
        }

        state.balance = Number((state.balance - betAmount).toFixed(2));
        state.bets[type] = Number(((state.bets[type] || 0) + betAmount).toFixed(2));

        return {
            success: true,
            balance: state.balance,
            bets: { ...state.bets }
        };
    }

    function clearCurrentBets() {
        if (state.isSpinning) return false;

        let totalRefund = 0;
        for (let type in state.bets) {
            totalRefund += state.bets[type];
        }

        state.balance = Number((state.balance + totalRefund).toFixed(2));
        state.bets = {};
        return true;
    }
    // ========================================================
    // 🎯 SECTION 6: BETTING TABLE SYSTEM [END]
    // ========================================================


    // ========================================================
    // ⚙️ SECTION 7: WHEEL SPIN & LOCK CONTROLS [START]
    // ========================================================
    function lock() {
        state.isSpinning = true;
    }

    function unlock() {
        state.isSpinning = false;
    }

    function setRotation(r) {
        state.rotation = r;
    }
    // ========================================================
    // ⚙️ SECTION 7: WHEEL SPIN & LOCK CONTROLS [END]
    // ========================================================


    // ========================================================
    // 🧮 SECTION 8: PAYOUT & DOUBLE MULTIPLIER MATH [START]
    // ========================================================
    // আপনার আইডিয়া অনুযায়ী ইন-হুইল বোনাস এবং ঘরের ডাবল মাল্টিপ্লায়ার হিসাব
    function calculateWin(winningSlot, bonusData) {
        let totalWin = 0;
        const winningSymbol = winningSlot.symbol;

        for (let betSymbol in state.bets) {
            if (betSymbol === winningSymbol) {
                const betAmount = state.bets[betSymbol];
                
                // ১. ঘরের নিজস্ব গুটি বা মাল্টিপ্লায়ার সংখ্যা (১X, ২X বা ৩X)
                let baseMultiplier = winningSlot.count; 
                
                // ২. যদি আপনার কন্ডিশন মেলে: বোনাস টার্গেট ঘর আর উইনিং ঘর হুবহু এক হয়
                if (bonusData.hasBonus && bonusData.targetSlot === winningSlot.slot) {
                    // মেগা ডাবল মাল্টিপ্লিকেশন (যেমন: ৩X ঘর * ৩০X বোনাস = ৯০ গুণ!)
                    baseMultiplier = baseMultiplier * bonusData.multiplier;
                }
                
                // iGaming Standard: উইনিং বেটের আসল টাকা ফেরত + নেট প্রফিট
                totalWin += betAmount + (betAmount * baseMultiplier);
            }
        }

        return Number(totalWin.toFixed(2));
    }

    function resolvePayout(winningSlot, bonusData) {
    // ১. রেজাল্ট সেট করা
    state.lastResult = winningSlot.symbol;

    // ২. মাল্টিপ্লায়ার হ্যান্ডেল করা
    // যদি বোনাস ডেটাতে মাল্টিপ্লায়ার থাকে, তবে সেটি ব্যবহার হবে, না থাকলে ১x বা ডিফল্ট হিসাব
    const multiplier = bonusData && bonusData.multiplier ? parseFloat(bonusData.multiplier) : 1;
    
    // ৩. উইন ক্যালকুলেশন
    // আমরা winningSlot অবজেক্টটি পাঠাচ্ছি যাতে calculateWin ফাংশনটি 
    // সিম্বল এবং কাউন্ট (count) দুইটাই রিড করতে পারে
    let winAmount = calculateWin(winningSlot, bonusData);
    
    // ৪. ব্যালেন্স আপডেট
    if (winAmount > 0) {
        state.balance = Number((state.balance + winAmount).toFixed(2));
    }

    return {
        result: winningSlot.symbol,
        count: winningSlot.count, // অতিরিক্ত তথ্য হিসেবে কাউন্ট রাখলাম
        multiplier: multiplier,   // কোন এক্স এ পড়েছে তা রিটার্ন করা
        win: winAmount,
        balance: state.balance
    };
}

    function reset() {
        state.bets = {};
        state.isSpinning = false;
    }
    // ========================================================
    // 🧮 SECTION 8: PAYOUT & DOUBLE MULTIPLIER MATH [END]
    // ========================================================


    // ========================================================
    // 🌐 SECTION 9: PUBLIC APPLICATION PROGRAMMING INTERFACE [START]
    // ========================================================
    return {
        getState,
        getBalance,
        setSelectedChip,
        getChip,
        placeBet,
        clearCurrentBets,
        generateResult,             // এখন এটি ঘর অবজেক্ট রিটার্ন করে
        generateVoltageBonus,       // নতুন ভোল্টেজ বোনাস মেকার
        lock,
        unlock,
        setRotation,
        calculateWin,
        resolvePayout,
        reset
    };
    // ========================================================
    // 🌐 SECTION 9: PUBLIC APPLICATION PROGRAMMING INTERFACE [END]
    // ========================================================

})();
