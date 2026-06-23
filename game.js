// ======================================================
// 🎮 CLEAN GAME UI V5 (Instant Lock, 14s Motion & Bonus Engine)
// ======================================================

(() => {
    // ========================================================
    // 📂 SECTION 1: DOM ELEMENT SELECTION [START]
    // ========================================================
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
        btnText: document.getElementById("spinBtn").querySelector(".btn-text"), // বাটন টেক্সটের জন্য
        
        // Sounds
        chipSound: document.getElementById("chipSound"),
        spinSound: document.getElementById("spinSound"),
        tableSound: document.getElementById("tableSound"),
        spinBtnSound: document.getElementById("spinButtonSound")
    };

    let isAudioAllowed = false; // ব্রাউজার সাউন্ড অ্যাক্টিভেশন ফ্ল্যাগ
    // ========================================================
    // 📂 SECTION 1: DOM ELEMENT SELECTION [END]
    // ========================================================


    // ========================================================
    // ⚙️ SECTION 2: INITIALIZATION [START]
    // ========================================================
    function init() {
        bindChips();
        bindBoard();
        bindSpin();
        bindActions();
        setDefaultChip();
        enableAudioOnFirstInteraction();
    }
    // ========================================================
    // ⚙️ SECTION 2: INITIALIZATION [END]
    // ========================================================


    // ========================================================
    // 🪙 SECTION 3: CHIP SYSTEM (SEMI-CIRCLE SPRING FAN) [START]
    // ========================================================
    function setDefaultChip() {
        if (typeof GameEngine !== 'undefined') {
            GameEngine.setSelectedChip({ value: 0.10 });
        }
        UI.defaultChip.classList.add("active");
    }

    function bindChips() {
        UI.defaultChip.addEventListener("click", (e) => {
            e.stopPropagation();
            playSound(UI.chipSound);
            toggleFanMenu();
        });

        UI.chips.forEach((chip) => {
            if (chip.classList.contains("default-chip")) return;

            chip.addEventListener("click", (e) => {
                e.stopPropagation();
                
                swapChipsData(chip);
                const newValue = Number(UI.defaultChip.dataset.value);

                if (typeof GameEngine !== 'undefined') {
                    GameEngine.setSelectedChip({ value: newValue });
                }

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

    function swapChipsData(selectedChip) {
        const oldDefaultValue = UI.defaultChip.dataset.value;
        const oldDefaultImg = UI.defaultChip.querySelector("img").src;
        const oldDefaultText = UI.defaultChip.querySelector("span").innerText;

        const clickedValue = selectedChip.dataset.value;
        const clickedImg = selectedChip.querySelector("img").src;
        const clickedText = selectedChip.querySelector("span") ? selectedChip.querySelector("span").innerText : "$" + clickedValue;

        UI.defaultChip.dataset.value = clickedValue;
        UI.defaultChip.querySelector("img").src = clickedImg;
        UI.defaultChip.querySelector("span").innerText = clickedText;

        selectedChip.dataset.value = oldDefaultValue;
        selectedChip.querySelector("img").src = oldDefaultImg;
        if (selectedChip.querySelector("span")) {
            selectedChip.querySelector("span").innerText = oldDefaultText;
        }

        UI.chips.forEach(c => c.classList.remove("active"));
        UI.defaultChip.classList.add("active");
    }
    // ========================================================
    // 🪙 SECTION 3: CHIP SYSTEM (SEMI-CIRCLE SPRING FAN) [END]
    // ========================================================


    // ========================================================
    // 🎯 SECTION 4: BOARD & BETTING SYSTEM [START]
    // ========================================================
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
    // ========================================================
    // 🎯 SECTION 4: BOARD & BETTING SYSTEM [END]
    // ========================================================


    // ========================================================
    // 📊 SECTION 5: BOARD UI & BADGES UPDATE [START]
    // ========================================================
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
    // ========================================================
    // 📊 SECTION 5: BOARD UI & BADGES UPDATE [END]
    // ========================================================


    // ========================================================
    // 🛑 SECTION 6: SPIN BUTTON LOCK/UNLOCK STATE [START]
    // ========================================================
    // আপনার চাহিদা অনুযায়ী ইনস্ট্যান্ট বাটন লাল করা এবং LOCK টেক্সট বসানোর ফাংশন
    function setButtonLockState(isLocked) {
        if (isLocked) {
            UI.spinBtn.classList.add("btn-locked"); // CSS এর মাধ্যমে রেড ব্যাকগ্রাউন্ড অ্যাক্টিভ হবে
            if (UI.btnText) UI.btnText.innerText = "LOCK";
        } else {
            UI.spinBtn.classList.remove("btn-locked");
            if (UI.btnText) UI.btnText.innerText = "SPIN";
        }
    }
    // ========================================================
    // 🛑 SECTION 6: SPIN BUTTON LOCK/UNLOCK STATE [END]
    // ========================================================


    // ========================================================
    // 🎡 SECTION 7: CORE SPIN & 14-SECOND MOTION ENGINE [START]
    // ========================================================
    function bindSpin() {
        UI.spinBtn.addEventListener("click", () => {
            if (typeof GameEngine === 'undefined') return;
            const state = GameEngine.getState();

            if (state.isSpinning) return;
            if (!state.bets || Object.keys(state.bets).length === 0) return;

            // 🔥 ১. ইনস্ট্যান্ট লক: ক্লিক করার সাথে সাথেই (০ সেকেন্ডে) বাটন লাল এবং LOCK হবে
            GameEngine.lock();
            setButtonLockState(true);
            closeFanMenu(); 
            playSound(UI.spinBtnSound);

            // ২. ব্যাকএন্ড ইঞ্জিন থেকে ১৮ ঘরের র্যান্ডম স্লট এবং বোনাস জেনারেট করা
            const winningSlot = GameEngine.generateResult(); // এটি এখন অবজেক্ট {slot, symbol, count}
            const bonusData = GameEngine.generateVoltageBonus(winningSlot);

            // ৩. চাকার নিখুঁত ডিগ্রি ম্যাপিং (১৮টি ঘর, প্রতি ঘর ২০ ডিগ্রি)
            const targetDegrees = (18 - winningSlot.slot + 1) * 20;
            const startAngle = state.rotation || 0;
            
            // ১৪ সেকেন্ড ঘোরার জন্য চাকাটিকে ২২ বার ফুল রোটেশন (৭৯২০ ডিগ্রি) ট্রাভেল করানো হবে
            const extraSpins = 7920; 
            const totalTargetRotation = startAngle + extraSpins + targetDegrees - (startAngle % 360);

            // 🎵 ৪. সাউন্ড লুপ অন: চাকা ঘোরার সময় সাউন্ড একটানা লুপে বাজবে
            if (UI.spinSound) {
                UI.spinSound.loop = true;
                playSound(UI.spinSound);
            }

            // 📈 ৫. কাস্টম ১৪ সেকেন্ডের মোশন (শুরুতে স্লো, মাঝে রকেট স্পিড, শেষ ৫ সেকেন্ডে ধীরে থামা)
            UI.wheel.style.transition = "transform 14s cubic-bezier(0.42, 0, 0.15, 1)";
            UI.wheel.style.transform = `rotate(${totalTargetRotation}deg)`;

            // চাকা ঘোরার ২ সেকেন্ডের মাথায় স্ক্রিনে ভোল্টেজ বোনাস অ্যানিমেশন পপ-আপ লাফানো শুরু করবে
            setTimeout(() => {
                if (typeof triggerVoltageAnimation === "function") {
                    triggerVoltageAnimation(bonusData, () => {
                        // চাকা থামার অনেক আগেই বোনাসটি নির্দিষ্ট ঘরে লক হয়ে থাকবে
                    });
                }
            }, 2000);

            // 🛑 ৬. ঠিক ১৪.২ সেকেন্ড পর চাকা স্থির হলে রেজাল্ট ও পে-আউট ডিক্লেয়ার করা
            setTimeout(() => {
                // চাকা থেমে গেছে, তাই সাউন্ডের লুপ বন্ধ এবং অডিও স্টপ
                if (UI.spinSound) {
                    UI.spinSound.loop = false;
                    UI.spinSound.pause();
                    UI.spinSound.currentTime = 0;
                }

                // ইঞ্জিনে ফাইনাল পে-আউট হ্যান্ডেল করা
                GameEngine.setRotation(totalTargetRotation % 360);
                const payout = GameEngine.resolvePayout(winningSlot, bonusData);
                
                // ইউআই স্ক্রিনে ডাটা রিফ্রেশ
                updateBalance(payout.balance);

                // রেজাল্ট দেখানোর পর গেম আনলক এবং বাটন রিসেট করা
                setTimeout(() => {
                    GameEngine.unlock();
                    GameEngine.reset();
                    setButtonLockState(false);
                    clearBoard();
                }, 1500);

            }, 14200); // ১৪ সেকেন্ড স্পিন + ০.২ সেকেন্ড সেটেলমেন্ট টাইম
        });
    }
    // ========================================================
    // 🎡 SECTION 7: CORE SPIN & 14-SECOND MOTION ENGINE [END]
    // ========================================================


    // ========================================================
    // 🛠️ SECTION 8: ACTION HANDLERS [START]
    // ========================================================
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
    // ========================================================
    // 🛠️ SECTION 8: ACTION HANDLERS [END]
    // ========================================================


    // ========================================================
    // 🧮 SECTION 9: BALANCE & BOARD RESETS [START]
    // ========================================================
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
    // ========================================================
    // 🧮 SECTION 9: BALANCE & BOARD RESETS [END]
    // ========================================================


    // ========================================================
    // 🔊 SECTION 10: AUDIO ENHANCEMENTS & UTILS [START]
    // ========================================================
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
        audioElement.play().catch(err => console.log("Audio playback delayed: ", err));
    }
    // ========================================================
    // 🔊 SECTION 10: AUDIO ENHANCEMENTS & UTILS [END]
    // ========================================================

    init();
})();
