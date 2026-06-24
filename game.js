// game.js
const App = {
    engine: GameEngine,
    currentBet: 0.10,

    init: function() {
        document.getElementById('spinBtn').addEventListener('click', () => this.handleSpin());
        
        document.querySelectorAll('.chip').forEach(c => {
            c.addEventListener('click', (e) => {
                this.currentBet = parseFloat(e.currentTarget.dataset.value);
                this.engine.playSound('chip'); // ইঞ্জিন থেকে অডিও কল
            });
        });
    },

    handleSpin: function() {
        if (this.engine.state.isSpinning) return;

        this.engine.state.isSpinning = true;
        document.getElementById('spinBtn').disabled = true;

        // ইঞ্জিন থেকে অডিও কল
        this.engine.playSound('spinBtn');
        this.engine.playSound('spin');

        const rotation = Math.floor(Math.random() * 360) + 1800;
        const wheel = document.getElementById('wheel');
        wheel.style.transition = "transform 4s ease-out";
        wheel.style.transform = `rotate(${rotation}deg)`;

        setTimeout(() => {
            const result = this.engine.calculateResult(rotation);
            const win = this.engine.config.payoutTable[result] * this.currentBet;
            
            this.engine.state.currentBalance += win;
            document.getElementById('balanceAmount').innerText = `$${this.engine.state.currentBalance.toFixed(2)}`;
            
            this.engine.state.isSpinning = false;
            document.getElementById('spinBtn').disabled = false;
            
            // রেজাল্ট আসার পর সাউন্ড
            this.engine.playSound('table');
        }, 4000);
    }
};

document.addEventListener("DOMContentLoaded", () => App.init());


// ========================================================
// SECTION 2: INITIAL CHIP SYSTEM (Updated & Engine Integrated)
// ========================================================
App.initChipSystem = function() {
    console.log("%c[Initial Chip System] Initializing...", "color: #ff9800; font-weight: bold;");

    // HTML-এ থাকা .chip এলিমেন্টগুলো সিলেক্ট করা
    const chipElements = document.querySelectorAll(".chip"); 

    chipElements.forEach(item => {
        item.addEventListener("click", (e) => {
            // ক্লিক করা এলিমেন্ট বা তার প্যারেন্ট থেকে ডেটা-ভ্যালু নেওয়া
            const chipElement = e.target.closest('.chip');
            if (!chipElement) return;

            const value = parseFloat(chipElement.getAttribute("data-value"));
            
            // ইঞ্জিন লজিক দিয়ে ভ্যালিডেশন করা
            if (isNaN(value)) return;

            // ১. গেম ইঞ্জিনে সিলেকশন পাঠানো ও সেভ করা
            if (App.engine.chipManager.setSelection(value)) {
                
                // ২. অডিও প্লে করা
                if (this.audio.chipSound) {
                    this.audio.chipSound.currentTime = 0;
                    this.audio.chipSound.play().catch(err => console.warn("[Audio] Sound blocked"));
                }

                // ৩. UI আপডেট (Active Class যোগ করা)
                chipElements.forEach(el => el.classList.remove("active"));
                chipElement.classList.add("active");

                console.log(`%c[Initial Chip System] Successfully Selected: $${value}`, "color: #4caf50; font-weight: bold;");
            }
        });
    });

    console.log("[Initial Chip System] Ready for user interaction.");
};

// ========================================================
// SECTION 3: INITIAL WHEEL SYSTEM (Updated)
// ========================================================
App.spinWheelStart = function() {
    console.log("%c[Initial Wheel System] Spin started for 14 seconds...", "color: #00bcd4; font-weight: bold;");

    // ১. গেমের সব এলিমেন্ট লক করা (চিপস, টেবিল, বাটন সব)
    this.toggleGameLock(true);

    // ২. হুইল এলিমেন্ট সিলেক্ট করুন
    const wheel = document.getElementById("wheel-element");

    // ৩. স্মুথ অ্যানিমেশন সেটআপ
    wheel.style.transition = "transform 14s cubic-bezier(0.42, 0, 0.58, 1)";
    
    // ৪. রেন্ডম রোটেশন ক্যালকুলেশন
    const extraRotations = 5; 
    const randomDegrees = Math.floor(Math.random() * 360);
    const totalRotation = (extraRotations * 360) + randomDegrees;

    // ৫. হুইল ঘোরানো
    wheel.style.transform = `rotate(${totalRotation}deg)`;

    // ৬. ১৪ সেকেন্ড পর পরবর্তী সেকশন কল করা
    setTimeout(() => {
        console.log("[Initial Wheel System] 14 seconds completed. Spin finished.");
        
        // এখানে রেজাল্ট সেকশন কল হবে
        // App.initResultSection(); 
    }, 14000); 
};

// গেম লক করার লজিক (যা চিপস ও টেবিল ডিজেবল করবে)
App.toggleGameLock = function(isLocked) {
    this.isSpinning = isLocked;
    
    // বাটন লক
    this.ui.spinBtn.style.pointerEvents = isLocked ? "none" : "auto";
    this.ui.spinBtn.style.opacity = isLocked ? "0.5" : "1";

    // চিপস এবং বোর্ড লক (CSS ক্লাস বা সরাসরি স্টাইল)
    const boardElements = document.querySelectorAll(".chip, .board-cell");
    boardElements.forEach(el => {
        el.style.pointerEvents = isLocked ? "none" : "auto";
        el.style.opacity = isLocked ? "0.5" : "1";
    });

    console.log(`%c[Lock System] Game Locked Status: ${isLocked}`, isLocked ? "color: red;" : "color: green;");
};

// ========================================================
// SECTION 4: RESULT SECTION
// ========================================================
// ========================================================
// SECTION 4: RESULT SECTION
// ========================================================
App.initResultSection = function(landedSymbol, bonusMultiplier) {
    console.log(`%c[Result Section] Calculating... Landed: ${landedSymbol}, Bonus: ${bonusMultiplier}x`, "color: #e91e63; font-weight: bold;");

    // ১. রেজাল্ট ডিটেকশন (বোর্ডের কোন সিম্বলে ল্যান্ড করল)
    const winAmount = this.calculateBaseWin(landedSymbol);
    
    // ২. বোনাস ক্যালকুলেশন (অটোমেটিক কাউন্ট)
    const totalPayout = winAmount * bonusMultiplier;

    console.log(`[Result Section] Base Win: ${winAmount}, Total Payout: ${totalPayout}`);

    // ৩. পরবর্তী ধাপে ডাটা পাঠানো (ব্যালেন্স আপডেট সিস্টেমের জন্য)
    this.processPayout(totalPayout);
};

App.calculateBaseWin = function(symbol) {
    // এখানে আপনার গেমের সিম্বল ভ্যালু ম্যাপ থাকবে
    const payoutTable = {
        "cherry": 10,
        "lemon": 20,
        "diamond": 100,
        "jackpot": 500
    };
    return payoutTable[symbol] || 0;
};

App.processPayout = function(amount) {
    console.log(`[Result Section] Finalizing Payout: $${amount}`);
    // এখানে আমরা ব্যালেন্স আপডেট সেকশন কল করব
    // App.initBalanceUpdate(amount);
};


// ========================================================
// SECTION 5: BALANCE UPDATE SYSTEM
// ========================================================
// ========================================================
// SECTION 5: BALANCE UPDATE SYSTEM
// ========================================================
App.initBalanceUpdate = function(finalPayout) {
    console.log(`%c[Balance Update System] Processing Payout: $${finalPayout}`, "color: #ff5722; font-weight: bold;");

    // ১. গ্লোবাল ব্যালেন্স আপডেট
    // আপনার গেমের বর্তমান ব্যালেন্সের সাথে এই পেমেন্টটি যোগ হবে
    this.currentBalance += finalPayout;

    // ২. UI আপডেট করা (স্ক্রিনে ব্যালেন্স দেখানো)
    if (this.ui.balanceDisplay) {
        this.ui.balanceDisplay.innerText = `$${this.currentBalance.toFixed(2)}`;
    }

    console.log(`[Balance Update System] New Global Balance: $${this.currentBalance.toFixed(2)}`);

    // ৩. পরবর্তী ধাপে যাওয়া (বোর্ড রিসেট)
    this.initBoardReset();
};

/**
 * এই ফাংশনটি রেজাল্ট সেকশন থেকে কল হবে এবং বেট ইঞ্জিনের সাথে সমন্বয় করবে
 * লজিক: (বেট অ্যামাউন্ট * সিম্বল ভ্যালু * মাল্টিপ্লায়ার)
 */
App.calculateFinalResult = function(betAmount, symbolValue, multiplier) {
    console.log(`[Result Calculation] Base: ${betAmount} x Symbol: ${symbolValue} x Multiplier: ${multiplier}x`);
    
    // চূড়ান্ত রেজাল্ট হিসাব
    const totalPayout = betAmount * symbolValue * multiplier;
    
    // ব্যালেন্স আপডেটে পাঠানো
    this.initBalanceUpdate(totalPayout);
};


// ========================================================
// SECTION 6: BOARD RESET SYSTEM
// ========================================================
// ========================================================
// SECTION 6: BOARD RESET SYSTEM
// ========================================================
App.initBoardReset = function() {
    console.log("%c[Board Reset System] Cleaning up board...", "color: #ff9800;");

    // ১. বোর্ডের সমস্ত বেট বা সিম্বল ক্লিয়ার করা
    // এখানে আপনার বোর্ডের প্রতিটি সেল বা এলিমেন্ট ক্লিয়ার হবে
    this.ui.boardCells.forEach(cell => {
        cell.innerText = ""; // অথবা আপনার প্রয়োজনীয় ক্লিয়ারিং লজিক
        cell.classList.remove("active");
    });

    // ২. চিপস বা সিলেকশন রিসেট করা (যদি প্রয়োজন হয়)
    this.selectedChip = 0;
    
    // ৩. বোর্ড আনলক করা (সিস্টেম রেডি করা)
    // এখানে আমরা সরাসরি গেম লকটি তুলে দিচ্ছি
    this.toggleGameLock(false); 
    
    console.log("%c[Board Reset System] Board Cleared & System Unlocked. New Round Ready!", "color: green; font-weight: bold;");
};


// ========================================================
// SECTION 7: NEW  ROUND START
// ========================================================

App.startNewRound = function() {
    console.log("%c[System] Setting up New Round...", "color: #2196f3; font-weight: bold;");

    // ১. গেমের স্টেট রিসেট (যদি কোনো ভেরিয়েবল রিসেট করার প্রয়োজন হয়)
    this.isSpinning = false;
    
    // ২. UI তে কোনো বিশেষ মেসেজ বা এনিমেশন দেখানো
    if (this.ui.spinBtn) {
        this.ui.spinBtn.classList.remove("disabled");
        this.ui.spinBtn.innerText = "SPIN"; // বাটন টেক্সট সেট করা
    }

    // ৩. সিস্টেম এখন প্লেয়ারের ইনপুটের জন্য অপেক্ষা করবে
    console.log("%c[System] Waiting for next user input...", "color: #9c27b0;");
};
