// ========================================================
// GAME ENGINE - CENTRAL LOGIC & STATE MANAGEMENT
// ========================================================
const GameEngine = {
    // সেকশন ১: স্টেট ম্যানেজমেন্ট (গেমের ডাটা)
    state: {
        currentBalance: 1000.00,
        currentBet: 0.10,
        isSpinning: false,
        history: [] // সর্বশেষ রেজাল্ট ট্র্যাক করার জন্য
    },

    // সেকশন ২: গেম কনফিগারেশন
    config: {
        payoutTable: { 
            "heart": 10, "diamond": 20, "club": 30, 
            "spade": 40, "crown": 50, "flag": 60 
        }
    },

    // সেকশন ৩: চিপ সিস্টেম লজিক
    chipManager: {
        setSelection: function(value) {
            if (value > 0) {
                GameEngine.state.currentBet = value;
                return true;
            }
            return false;
        }
    },

    // সেকশন ৪: হুইল ক্যালকুলেশন লজিক
    calculateResult: function(rotation) {
        const symbols = Object.keys(this.config.payoutTable);
        const index = Math.floor((rotation % 360) / 60); 
        const result = symbols[index];
        
        // রেজাল্ট হিস্ট্রিতে পুশ করা (বোনাস লজিকের জন্য)
        this.state.history.unshift(result);
        if (this.state.history.length > 3) this.state.history.pop();
        
        return { 
            symbol: result, 
            value: this.config.payoutTable[result] 
        };
    },

    // সেকশন ৫: রেজাল্ট ও বোনাস লজিক
    processPayout: function(symbolValue) {
        let win = this.state.currentBet * symbolValue;
        let bonus = 0;

        // বোনাস লজিক: টানা ৩ বার একই সিম্বল আসলে ১০ ডলার বোনাস
        if (this.state.history.length === 3 && 
            this.state.history[0] === this.state.history[1] && 
            this.state.history[1] === this.state.history[2]) {
            bonus = 10;
        }

        const totalPayout = win + bonus;
        this.state.currentBalance += totalPayout;
        
        return { totalPayout, bonus };
    },

    // সেকশন ৬: ব্যালেন্স আপডেট
    updateBalance: function(amount) {
        this.state.currentBalance += amount;
        return this.state.currentBalance;
    },

    // সেকশন ৭: রিসেট লজিক
    resetSystem: function() {
        this.state.isSpinning = false;
        console.log("[Engine] Round reset complete.");
    },

    // সেকশন ৮: অডিও হ্যান্ডলিং
    audio: {
        playSound: function(name) {
            const sound = document.getElementById(name + 'Sound');
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(e => console.warn("Audio block:", e));
            }
        }
    }
};
