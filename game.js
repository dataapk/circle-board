// ======================================================
// 🎮 CLEAN GAME UI V5 (48px Optimized & No Duplicate Chip)
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

    let isAudioAllowed = false;

    function init() {
        bindChips();
        bindBoard();
        bindSpin();
        bindActions();
        setDefaultChip();
        enableAudioOnFirstInteraction();
    }

    // ====================================
    // 🪙 CHIP SYSTEM (48px OPTIMIZED)
    // ====================================
    function setDefaultChip() {
        if (typeof GameEngine !== 'undefined') {
            GameEngine.setSelectedChip({ value: 0.10 });
        }
        UI.defaultChip.classList.add("active");
    }

    function bindChips() {
        // ডিফল্ট চিপে ক্লিক করলে ফ্যান ওপেন/ক্লোজ হবে
        UI.defaultChip.addEventListener("click", (e) => {
            e.stopPropagation();
            playSound(UI.chipSound);
            toggleFanMenu();
        });

        // ফ্যানের ভেতরের বাকি চিপগুলোর ক্লিক লজিক
        UI.chips.forEach((chip) => {
            chip.addEventListener("click", (e) => {
                e.stopPropagation();
                
                // যদি ইউজার মেইন চিপ খোলা অবস্থায় আবার মেইন চিপেই ক্লিক করে, তবে ফাংশন রিটার্ন করবে
                if (chip === UI.defaultChip && !UI.chipsContainer.classList.contains("open")) return;

                const value = Number(chip.dataset.value);

                if (typeof GameEngine !== 'undefined') {
                    GameEngine.setSelectedChip({ value });
                }

                // মেইন ভিজ্যুয়াল চিপের টেক্সট ও ইমেজ ৪৮ পিক্সেল অনুযায়ী আপডেট
                updateDefaultChipVisual(chip);
                playSound(UI.chipSound);
                closeFanMenu();
            });
        });

        document.addEventListener("click", () => closeFanMenu());
    }

    function toggleFanMenu() {
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

            closeFanMenu(); 
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
    // 🛠️ ACTIONS & AUDIO TUNING
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

    function enableAudioOnFirstInteraction() {
        const activateAudio = () => {
            isAudioAllowed = true;
            [UI.chipSound, UI.spinSound, UI.tableSound, UI.spinBtnSound].forEach(audio => {
                if(audio) audio.load();
            });
            document.removeEventListener("click", activateAudio);
            document.removeEventListener("touchstart", activateAudio);
        };
        document.addEventListener("click", activateAudio);
        document.addEventListener("touchstart", activateAudio);
    }

    function playSound(audioElement) {
        if (!audioElement || !isAudioAllowed) return;
        audioElement.currentTime = 0;
        audioElement.play().catch(err => console.log("Audio play blocked: ", err));
    }

    init();
})();
