// ======================================================
// 🎮 CLEAN GAME UI V4 (Semi-Circle Fan & Audio Fixed)
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

    const SEGMENTS = [
        "heart", "spade", "diamond", "club",
        "crown", "flag", "heart", "crown",
        "spade", "diamond", "flag", "club"
    ];

    let isAudioAllowed = false; // ব্রাউজার সাউন্ড অ্যাক্টিভেশন ফ্ল্যাগ

    function init() {
        bindChips();
        bindBoard();
        bindSpin();
        bindActions();
        setDefaultChip();
        enableAudioOnFirstInteraction();
    }

    // ====================================
    // 🪙 CHIP SYSTEM (SEMI-CIRCLE SPRING FAN)
    // ====================================
    function setDefaultChip() {
        if (typeof GameEngine !== 'undefined') {
            GameEngine.setSelectedChip({ value: 0.10 });
        }
        // ডিফল্ট চিপ অ্যাক্টিভ থাকবে কিন্তু ফ্যান বন্ধ থাকবে
        UI.defaultChip.classList.add("active");
    }

    function bindChips() {
        // ডিফল্ট চিপে ক্লিক করলে সেমি-সার্কেল স্প্রিং ফ্যান খুলবে/বন্ধ হবে
        UI.defaultChip.addEventListener("click", (e) => {
            e.stopPropagation();
            playSound(UI.chipSound);
            toggleFanMenu();
        });

        // ফ্যানের ভেতরের বাকি চিপগুলোর সিলেকশন লজিক
        UI.chips.forEach((chip) => {
            // ডিফল্ট চিপের মূল ক্লিকের জন্য আলাদা লজিক (উপরে), তাই এখানে স্কিপ
            if (chip.classList.contains("default-chip")) return;

            chip.addEventListener("click", (e) => {
                e.stopPropagation();
                const value = Number(chip.dataset.value);

                if (typeof GameEngine !== 'undefined') {
                    GameEngine.setSelectedChip({ value });
                }

                // ১. ভিজ্যুয়াল আপডেট (ক্লিক করা চিপটি ডিফল্ট চিপের জায়গায় সেট হবে)
                updateDefaultChipVisual(chip);
                playSound(UI.chipSound);
                
                // ২. চিপ সিলেক্ট হওয়ার পর ফ্যান স্বয়ংক্রিয়ভাবে বন্ধ (Minimize) হয়ে যাবে
                closeFanMenu();
            });
        });

        // বোর্ডের বাইরে কোথাও ক্লিক করলে ফ্যান মেনু মিনিমাইজ হয়ে যাবে
        document.addEventListener("click", () => closeFanMenu());
    }

    function toggleFanMenu() {
        // 'open' ক্লাসটি CSS-এ সেমি-সার্কেল স্প্রিং অ্যানিমেশন ট্রিগার করবে
        UI.chipsContainer.classList.toggle("open");
    }

    function closeFanMenu() {
        UI.chipsContainer.classList.remove("open");
    }

    function updateDefaultChipVisual(selectedChip) {
        UI.chips.forEach(c => c.classList.remove("active"));
        selectedChip.classList.add("active");
        
        const value = selectedChip.dataset.value;
        const imgUrl = selectedChip.querySelector("img").src;
        
        // মেইন ডিফল্ট চিপের ডিসপ্লে পরিবর্তন
        UI.defaultChip.querySelector("span").innerText = "$" + value;
        UI.defaultChip.querySelector("img").src = imgUrl;
        UI.defaultChip.dataset.value = value;
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

            // যদি কোনো চিপ আলাদা করে সিলেক্ট করা না থাকে, তবে ডিফল্ট চিপের ভ্যালু দিয়ে বেট হবে
            const currentChipValue = state.selectedChip ? state.selectedChip.value : 0.10;

            const symbol = box.dataset.symbol;
            const result = GameEngine.placeBet(symbol, currentChipValue);

            if (!result.success) return;

            playSound(UI.tableSound);
            updateBalance(result.balance);
            updateBoardUI(result.bets);
        });
    }

    function updateBoardUI(bets) {
        let totalBetCalculated = 0;

        document.querySelectorAll(".symbol-box").forEach(box => {
            const symbol = box.dataset.symbol;
            const betAmount = bets[symbol] || 0;
            const indicator = box.querySelector(".bet-indicator");

            if (betAmount > 0) {
                indicator.innerText = "$" + betAmount.toFixed(2);
                indicator.style.display = "block";
                totalBetCalculated += betAmount;
            } else {
                indicator.innerText = "$0";
                indicator.style.display = "none";
            }
        });

        UI.totalBet.innerText = "$" + totalBetCalculated.toFixed(2);
    }

    // ====================================
    // 🎮 SPIN SYSTEM
    // ====================================
    function bindSpin() {
        UI.spinBtn.addEventListener("click", () => {
            if (typeof GameEngine === 'undefined') return;
            const state = GameEngine.getState();

            if (state.isSpinning) return;
            if (!state.bets || Object.keys(state.bets).length === 0) return;

            closeFanMenu(); // স্পিন শুরু হলে চিপস মেনু খোলা থাকলে বন্ধ করে দেওয়া
            playSound(UI.spinBtnSound);
            GameEngine.lock();
            
            const winningSymbol = GameEngine.generateResult();
            spinWheel(winningSymbol);
        });
    }

    function spinWheel(winningSymbol) {
        playSound(UI.spinSound);

        const duration = 6000; 
        const state = GameEngine.getState();
        const startAngle = state.rotation || 0;

        const targetIndexes = [];
        SEGMENTS.forEach((sym, idx) => {
            if (sym === winningSymbol) targetIndexes.push(idx);
        });
        const finalIndex = targetIndexes[Math.floor(Math.random() * targetIndexes.length)];

        const segmentDegrees = 360 / SEGMENTS.length;
        const targetSymbolAngle = (finalIndex * segmentDegrees) + (segmentDegrees / 2);
        const totalTargetRotation = startAngle + 1800 + (360 - targetSymbolAngle); 

        const startTime = performance.now();

        function animate(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentAngle = startAngle + (totalTargetRotation - startAngle) * easeOut;

            UI.wheel.style.transform = `rotate(${currentAngle}deg)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                GameEngine.setRotation(totalTargetRotation % 360);
                const payout = GameEngine.resolvePayout(winningSymbol);
                updateBalance(payout.balance);

                setTimeout(() => {
                    GameEngine.unlock();
                    GameEngine.reset();
                    clearBoard();
                }, 1500);
            }
        }

        requestAnimationFrame(animate);
    }

    // ====================================
    // 🛠️ ACTIONS, SOUND ENGINE & HELPERS
    // ====================================
    function bindActions() {
        if (UI.clearBetBtn) {
            UI.clearBetBtn.addEventListener("click", () => {
                if (typeof GameEngine === 'undefined') return;
                if (GameEngine.getState().isSpinning) return;

                GameEngine.clearCurrentBets();
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

    // ব্রাউজারের অডিও রেস্ট্রিকশন বাইপাস করার মেকানিজম
    function enableAudioOnFirstInteraction() {
        const activateAudio = () => {
            isAudioAllowed = true;
            // অডিও লোড নিশ্চিত করা
            [UI.chipSound, UI.spinSound, UI.tableSound, UI.spinBtnSound].forEach(audio => {
                if(audio) audio.load();
            });
            // একবার অ্যাক্টিভেট হয়ে গেলে ইভেন্ট রিমুভ করে দেওয়া
            document.removeEventListener("click", activateAudio);
            document.removeEventListener("touchstart", activateAudio);
        };
        document.addEventListener("click", activateAudio);
        document.addEventListener("touchstart", activateAudio);
    }

    function playSound(audioElement) {
        if (!audioElement || !isAudioAllowed) return;
        audioElement.currentTime = 0;
        audioElement.play().catch(err => console.log("Audio playback delayed or blocked: ", err));
    }

    init();
})();
