// ========================================================
// SECTION 1: CORE & DOM INITIALIZATION
// ========================================================
// এখানে সব DOM এলিমেন্ট ম্যাপিং এবং গেমের শুরুতে যা যা প্রয়োজন তা থাকবে।
// ========================================================
// SECTION 1: CORE & DOM INITIALIZATION
// ========================================================
const App = {
    // এখানে সমস্ত DOM এলিমেন্ট এবং অডিও রেফারেন্স রাখা হলো
    ui: {
        spinBtn: document.getElementById("spin-button"),
        resetBtn: document.getElementById("reset-button"),
        balanceDisplay: document.getElementById("balance-display"),
        betDisplay: document.getElementById("bet-display"),
        chips: document.querySelectorAll(".chip"), // সব চিপস একসাথে
        boardCells: document.querySelectorAll(".board-cell") // বোর্ডের সেলগুলো
    },
    
    audio: {
        chipSound: document.getElementById("chipSound"),
        spinSound: document.getElementById("spinSound"),
        winSound: document.getElementById("winSound")
    },

    init: function() {
        console.log("%c[System] Initializing Game & Mapping DOM...", "color: blue; font-weight: bold;");
        
        // এখানে কনসোল চেক করা যে DOM এলিমেন্টগুলো ঠিকঠাক পেয়েছে কি না
        console.log("[System] DOM Mapped:", this.ui);
        console.log("[System] Audio Mapped:", this.audio);
        
        // পরবর্তীতে আমরা এখানে অন্য সেকশনগুলো কল করব
        // যেমন: this.initChipSystem();
        // যেমন: this.initWheelSystem();
    }
};

document.addEventListener("DOMContentLoaded", () => App.init());


// ========================================================
// SECTION 2: INITIAL CHIP SYSTEM
// ========================================================
// ========================================================
// SECTION 2: INITIAL CHIP SYSTEM
// ========================================================
App.initChipSystem = function() {
    console.log("%c[Initial Chip System] Initializing...", "color: #ff9800; font-weight: bold;");

    // চিপস এবং ফ্যান সিস্টেমের জন্য একটি কমন হ্যান্ডলার
    const chipElements = document.querySelectorAll(".chip, .fan-item"); 

    chipElements.forEach(item => {
        item.addEventListener("click", (e) => {
            // চিপ বা ফ্যান থেকে ভ্যালু নেওয়া (HTML-এ data-value থাকা আবশ্যক)
            const value = parseFloat(e.target.getAttribute("data-value"));
            
            if (isNaN(value)) return;

            // গ্লোবাল স্টেটে সিলেক্টেড ভ্যালু সেভ করা
            this.selectedChip = value;
            
            // কনসোল ট্র্যাকিং (যাতে বোঝা যায় কী সিলেক্ট হয়েছে)
            console.log(`%c[Initial Chip System] Active Selection: ${value}`, "color: #4caf50; font-weight: bold;");

            // অডিও প্লে করা (যদি অডিও সিস্টেম সক্রিয় থাকে)
            if (this.audio.chipSound) {
                this.audio.chipSound.currentTime = 0;
                this.audio.chipSound.play().catch(err => console.warn("[Audio] Sound blocked by browser"));
            }

            // এখানে UI আপডেট (যেমন চিপটি সিলেক্ট হয়েছে তা হাইলাইট করা)
            chipElements.forEach(el => el.classList.remove("active"));
            e.target.classList.add("active");
        });
    });

    console.log("[Initial Chip System] Ready for user interaction.");
};

// ========================================================
// SECTION 3: INITIAL WHEEL SYSTEM
// ========================================================

// ========================================================
// SECTION 3: INITIAL WHEEL SYSTEM (Update)
// ========================================================
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
