// gameEngine.js
const GameEngine = {
    state: {
        currentBalance: 1000.00,
        isSpinning: false,
        currentLandedIndex: null
    },

    // অডিও এলিমেন্টগুলোর রেফারেন্স ইঞ্জিনের ভেতরে
    audio: {
        chip: document.getElementById('chipSound'),
        spin: document.getElementById('spinSound'),
        table: document.getElementById('tableSound'),
        spinBtn: document.getElementById('spinButtonSound')
    },

    // অডিও প্লে করার ফাংশন ইঞ্জিনের ভেতরেই
    playSound: function(soundName) {
        if (this.audio[soundName]) {
            this.audio[soundName].currentTime = 0;
            this.audio[soundName].play().catch(e => console.log("Audio Error:", e));
        }
    },

    config: {
        wheelSequence: [
            ['heart', 'heart', 'crown'], ['spade', 'spade', 'diamond'], ['flag', 'flag', 'flag'], 
            ['club', 'club', 'heart'], ['spade', 'crown', 'crown'], ['diamond', 'diamond', 'diamond'],
            ['club', 'flag', 'flag'], ['diamond', 'diamond', 'crown'], ['spade', 'spade', 'spade'], 
            ['diamond', 'diamond', 'flag'], ['heart', 'club', 'club'], ['crown', 'crown', 'crown'],
            ['spade', 'spade', 'diamond'], ['flag', 'flag', 'club'], ['heart', 'heart', 'heart'], 
            ['crown', 'crown', 'spade'], ['diamond', 'diamond', 'flag'], ['club', 'club', 'club']
        ],
        payoutTable: { 'heart': 10, 'diamond': 10, 'club': 10, 'spade': 10, 'crown': 10, 'flag': 10 }
    },

    calculateResult: function(rotation) {
        const index = Math.floor((rotation % 360) / 20);
        this.state.currentLandedIndex = index;
        const group = this.config.wheelSequence[index];
        return group[Math.floor(Math.random() * group.length)];
    }
};
// ========================================================
// INPUT AND AUDIO SECTION STATE END 
// ========================================================

    // ৩. কোর ক্যালকুলেশন ইঞ্জিন
    wheelManager: {
        calculateResult: function(rotation) {
            // ১৮টি ঘরের জন্য প্রতি ঘরের মান ২০ ডিগ্রি (৩৬০ / ১৮)
            const index = Math.floor((rotation % 360) / 20);
            
            // পজিশন আপডেট করা
            GameEngine.state.lastLandedIndex = GameEngine.state.currentLandedIndex;
            GameEngine.state.currentLandedIndex = index;
            
            // ওই ঘর থেকে একটি সিম্বল র্যান্ডমলি বাছাই করা
            const symbolGroup = GameEngine.config.wheelSequence[index];
            const finalSymbol = symbolGroup[Math.floor(Math.random() * symbolGroup.length)];
            
            console.log(`[Engine] Landed on House: ${index}, Result: ${finalSymbol}`);
            return finalSymbol;
        }
    },

    payoutManager: {
        calculateWin: (symbol, bet, multiplier) => (GameEngine.config.payoutTable[symbol] || 0) * bet * multiplier
    }
};

    // চিপ সিস্টেম লজিক
    chipManager: {
        setSelection: function(value) {
            if (GameEngine.config.validChips.includes(parseFloat(value))) {
                GameEngine.state.selectedChip = parseFloat(value);
                console.log(`[Engine] Chip Set: $${value}`);
                return true;
            }
            return false;
        }
    },

    // সিম্বল বা টেবিল লজিক
    symbolManager: {
        setBet: function(symbol) {
            if (GameEngine.config.symbols.includes(symbol)) {
                GameEngine.state.selectedSymbol = symbol;
                console.log(`[Engine] Bet Placed on: ${symbol}`);
                return true;
            }
            return false;
        }
    }
};
// ========================================================
// GAME ENGINE: 18-SLOT WEIGHTED WHEEL SEQUENCE
// ========================================================
GameEngine.wheelManager = {
    // এখানে আপনার হুইলের ১৮টি স্লটের ক্রম অনুযায়ী সিম্বলগুলো বসান
    // উদাহরণ: Heart (৩), Diamond (২), Club (২), Spade (৩), Crown (৪), Flag (৪) = ১৮টি
    wheelSequence: [
        'heart', 'heart', 'heart', 
        'diamond', 'diamond', 
        'club', 'club', 
        'spade', 'spade', 'spade', 
        'crown', 'crown', 'crown', 'crown', 
        'flag', 'flag', 'flag', 'flag'
    ],

    calculateResult: function(totalRotation) {
        // টোটাল স্লট ১৮টি
        const totalSlots = this.wheelSequence.length; 
        const degreePerSlot = 360 / totalSlots; // ২০ ডিগ্রি প্রতি ঘর
        
        const normalizedRotation = totalRotation % 360;
        
        // রেজাল্ট ইনডেক্স বের করা
        const slotIndex = Math.floor(normalizedRotation / degreePerSlot);
        
        // রেজাল্ট সিম্বল
        const landedSymbol = this.wheelSequence[slotIndex];
        
        console.log(`[Engine] Landed on Slot: ${slotIndex}, Symbol: ${landedSymbol}`);
        return landedSymbol;
    }
};
// ========================================================
// GAME ENGINE: RESULT & PAYOUT CALCULATION
// ========================================================
GameEngine.payoutManager = {
    // এখানে আপনার সিম্বল অনুযায়ী মানগুলো সেট করা আছে
    payoutTable: {
        'heart': 10,
        'diamond': 100,
        'club': 20,
        'spade': 50,
        'crown': 200,
        'flag': 500 // আপনার গেমের জ্যাকপট বা বড় ভ্যালু
    },

    calculateWin: function(symbol, betAmount, multiplier) {
        const baseValue = this.payoutTable[symbol] || 0;
        const totalWin = baseValue * betAmount * multiplier;
        
        console.log(`[Engine] Symbol: ${symbol}, Base: ${baseValue}, Multiplier: ${multiplier}x, Payout: ${totalWin}`);
        return totalWin;
    }
};
// ========================================================
// GAME ENGINE: BALANCE & SECURITY HANDLER
// ========================================================
GameEngine.balanceManager = {
    // পেমেন্ট এবং ব্যালেন্সের অখণ্ডতা নিশ্চিত করা
    processBalanceUpdate: function(currentBalance, payout) {
        // এখানে সিকিউরিটি চেক: পেমেন্ট নেগেটিভ হতে পারবে না
        if (payout < 0) {
            console.error("[Security] Invalid payout detected!");
            return currentBalance;
        }

        const newBalance = currentBalance + payout;
        console.log(`%c[Engine] Balance Updated: $${currentBalance} + $${payout} = $${newBalance}`, "color: #009688; font-weight: bold;");
        
        return newBalance;
    }
};
// ========================================================
// GAME ENGINE: FINAL STATE & ROUND MANAGEMENT
// ========================================================
GameEngine.stateManager = {
    // গেমের রিসেট স্টেট নিয়ন্ত্রণ করা
    resetBoardState: function() {
        GameEngine.state.isSpinning = false;
        GameEngine.state.selectedSymbol = null;
        console.log("[Engine] Board state reset. Game ready for next round.");
    },

    // নতুন রাউন্ড শুরুর আগে ভ্যালিডেশন
    prepareNewRound: function() {
        if (GameEngine.state.isSpinning) {
            console.warn("[Engine] Cannot start, game is currently locked!");
            return false;
        }
        console.log("[Engine] New round initiated.");
        return true;
    }
};
