// ======================================================
// 🎮 CLEAN GAME UI V3 (PRO iGaming Standard)
// ======================================================

(() => {
    const UI = {
        balance: document.getElementById("balanceAmount"),
        totalBet: document.getElementById("totalBetAmount"),
        wheel: document.getElementById("wheel"),
        spinBtn: document.getElementById("spinBtn"),
        clearBetBtn: document.getElementById("clearBetBtn"),
        chipsContainer: document.querySelector(".chips-container"),
        chips: document.querySelectorAll(".chip"),
        table: document.querySelector(".symbol-table"),
        defaultChip: document.querySelector(".default-chip"),
        
        // Sounds
        chipSound: document.getElementById("chipSound"),
        spinSound: document.getElementById("spinSound"),
        tableSound: document.getElementById("tableSound"),
        spinBtnSound: document.getElementById("spinButtonSound")
    };

    // চাকার ১২টি সেগমেন্ট (ঘড়ির কাটার বিপরীত দিকে বা আপনার হুইল ইমেজের সিকোয়েন্স অনুযায়ী সাজানো)
    const SEGMENTS = [
        "heart", "spade", "diamond", "club",
        "crown", "flag", "heart", "crown",
        "spade", "diamond", "flag", "club"
    ];

    function init() {
        bindChips();
        bindBoard();
        bindSpin();
        bindActions();
        setDefaultChip();
    }

    // ====================================
    // 🪙 CHIP SYSTEM & INITIALIZATION
    // ====================================
    function setDefaultChip() {
        // গেম ইঞ্জিন লোড হতে সময় লাগলে যেন ক্র্যাশ না করে, তাই সেফটি চেক
        if (typeof GameEngine !== 'undefined') {
            GameEngine.setSelectedChip({ value: 0.10 });
        }
        setActiveChipVisual(UI.defaultChip);
    }

    function bindChips() {
        // ডিফল্ট চিপে ক্লিক করলে চিপসের তালিকা খুলবে/বন্ধ হবে
        UI.defaultChip.addEventListener("click", (e) => {
            e.stopPropagation();
            playSound(UI.chipSound);
            toggleChipsMenu();
        });

        // বাকি চিপ সিলেকশন
        UI.chips.forEach(chip => {
            chip.addEventListener("click", (e) => {
                e.stopPropagation();
                const value = Number(chip.dataset.value);

                if (typeof GameEngine !== 'undefined') {
                    GameEngine.setSelectedChip({ value });
                }

                setActiveChipVisual(chip);
                playSound(UI.chipSound);
                closeChipsMenu();
            });
        });

        // স্ক্রিনের অন্য কোথাও ক্লিক করলে চিপস মেনু বন্ধ হবে
        document.addEventListener("click", () => closeChipsMenu());
    }

    function setActiveChipVisual(activeChip) {
        UI.chips.forEach(c => c.classList.remove("active"));
        activeChip.classList.add("active");
        
        // ডিফল্ট ভিজ্যুয়াল চিপের টেক্সট ও ইমেজ আপডেট
        const value = activeChip.dataset.value;
        const imgUrl = activeChip.querySelector("img").src;
        
        UI.defaultChip.querySelector("span").innerText = "$" + value;
        UI.defaultChip.querySelector("img").src = imgUrl;
        UI.defaultChip.dataset.value = value;
    }

    function toggleChipsMenu() {
        UI.chipsContainer.classList.toggle("closed");
    }

    function closeChipsMenu() {
        UI.chipsContainer.classList.add("closed");
    }

    // ====================================
    // 🎯 BOARD & BETTING SYSTEM
    // ====================================
    function bindBoard() {
        UI.table.addEventListener("click", (e) => {
            const box = e.target.closest(".symbol-box");
            if (!box) return;

            if (typeof GameEngine === 'undefined') return;
            const state = GameEngine.getState();
            if (state.isSpinning) return;

            const symbol = box.dataset.symbol;
            const currentChipValue = state.selectedChip.value;

            // গেম ইঞ্জিনে বেট প্লেস করা
            const result = GameEngine.placeBet(symbol, currentChipValue);

            if (!result.success) return;

            // সাউন্ড এবং UI আপডেট
            playSound(UI.tableSound);
            updateBalance(result.balance);
            updateBoardUI(state.bets);
        });
    }

    function updateBoardUI(bets) {
        let totalBetCalculated = 0;

        // প্রতিটি সিম্বলের ইন্ডিকেটর আপডেট করা
        document.querySelectorAll(".symbol-box").forEach(box => {
            const symbol = box.dataset.symbol;
            const betAmount = bets[symbol] || 0;
            const indicator = box.querySelector(".bet-indicator");

            if (betAmount > 0) {
                indicator.innerText = "$" + betAmount.toFixed(2);
                indicator.style.display = "block"; // ভিজিবল করা
                totalBetCalculated += betAmount;
            } else {
                indicator.innerText = "$0";
                indicator.style.display = "none";
            }
        });

        // টোটাল বেট ডিসপ্লে আপডেট
        UI.totalBet.innerText = "$" + totalBetCalculated.toFixed(2);
    }

    // ====================================
    // 🎮 SPIN SYSTEM (PRO ALGORITHM)
    // ====================================
    function bindSpin() {
        UI.spinBtn.addEventListener("click", () => {
            if (typeof GameEngine === 'undefined') return;
            const state = GameEngine.getState();

            if (state.isSpinning) return;
            if (!state.bets || Object.keys(state.bets).length === 0) return;

            playSound(UI.spinBtnSound);
            GameEngine.lock(); // গেম লক করা (যেন স্পিন অবস্থায় বেট না ধরা যায়)
            
            // ১. ইঞ্জিন থেকে আগে রেজাল্ট জেনারেট করা (Fair Play Standard)
            // (ধরে নিচ্ছি GameEngine.generateResult() বা অনুরুপ ফাংশন আপনার engine-এ আছে, না থাকলে random নেওয়া হয়েছে)
            const winningSymbol = typeof GameEngine.generateResult === 'function' 
                ? GameEngine.generateResult() 
                : SEGMENTS[Math.floor(Math.random() * SEGMENTS.length)];

            spinWheel(winningSymbol);
        });
    }

    function spinWheel(winningSymbol) {
        playSound(UI.spinSound);

        const duration = 6000; // স্পিন টাইম ৮ সেকেন্ড থেকে কমিয়ে প্রফেশনাল ৬ সেকেন্ড করা হয়েছে
        const state = GameEngine.getState();
        const startAngle = state.rotation || 0;

        // চাকাতে উইনিং সিম্বলটির ইনডেক্স খুঁজে বের করা
        const targetIndexes = [];
        SEGMENTS.forEach((sym, idx) => {
            if (sym === winningSymbol) targetIndexes.push(idx);
        });
        // মাল্টিপল অপশন থাকলে যেকোনো একটি র্যান্ডম ইনডেক্স বেছে নেওয়া
        const finalIndex = targetIndexes[Math.floor(Math.random() * targetIndexes.length)];

        // প্রতিটি সেগমেন্টের ডিগ্রি সাইজ (৩৬০ / ১২ = ৩০ ডিগ্রি)
        const segmentDegrees = 360 / SEGMENTS.length;
        
        // চাকাটিকে নিখুঁত সেন্টারে থামাতে অফসেট ক্যালকুলেশন
        const targetSymbolAngle = (finalIndex * segmentDegrees) + (segmentDegrees / 2);
        
        // ৫ বার পূর্ণ ঘূর্ণন (5 * 360 = 1800) + টার্গেট এঙ্গেল
        const totalTargetRotation = startAngle + 1800 + (360 - targetSymbolAngle); 

        const startTime = performance.now();

        function animate(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            
            // ক্যাসিনো স্ট্যান্ডার্ড Ease-Out cubic অ্যানিমেশন লজিক
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentAngle = startAngle + (totalTargetRotation - startAngle) * easeOut;

            UI.wheel.style.transform = `rotate(${currentAngle}deg)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // অ্যানিমেশন শেষ
                GameEngine.setRotation(totalTargetRotation % 360);

                // রেজাল্ট ইঞ্জিনকে পাঠিয়ে পে-আউট হিসাব করা
                const payout = GameEngine.resolvePayout(winningSymbol);

                // ব্যালেন্স ও উইন স্ক্রিন আপডেট
                updateBalance(payout.balance);

                setTimeout(() => {
                    GameEngine.unlock();
                    GameEngine.reset();
                    clearBoard();
                }, 1500); // উইন দেখার জন্য ১.৫ সেকেন্ড হোল্ড
            }
        }

        requestAnimationFrame(animate);
    }

    // ====================================
    // 🛠️ ACTIONS & HELPERS
    // ====================================
    function bindActions() {
        if (UI.clearBetBtn) {
            UI.clearBetBtn.addEventListener("click", () => {
                if (typeof GameEngine === 'undefined') return;
                if (GameEngine.getState().isSpinning) return;

                GameEngine.clearCurrentBets(); // ইঞ্জিনের বেট ক্লিয়ার করার ফাংশন
                updateBalance(GameEngine.getState().balance);
                clearBoard();
            });
        }
    }

    function updateBalance(balance) {
        UI.balance.innerText = "$" + balance.toFixed(2);
    }

    function clearBoard() {
        document.querySelectorAll(".bet-indicator").forEach(el => {
            el.innerText = "$0";
            el.style.display = "none";
        });
        if (UI.totalBet) UI.totalBet.innerText = "$0.00";
    }

    function playSound(audioElement) {
        if (!audioElement) return;
        audioElement.currentTime = 0;
        audioElement.play().catch(err => console.log("Audio play blocked by browser"));
    }

    // গেম স্টার্ট
    init();
})();
