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
    // 📊 SECTION 5: BOARD UI & BADGES UPDATE [FINALIZED]
    // ========================================================
    function updateBoardUI() {
    const gameState = GameEngine.getState();
    const bets = gameState.bets || {}; // নিরাপদ চেক

    // সব বেট এলিমেন্ট আপডেট করুন
    document.querySelectorAll('.bet-item').forEach(element => {
        const symbol = element.getAttribute('data-symbol');
        
        // এখানে Optional Chaining ব্যবহার করা হয়েছে
        const betValue = bets[symbol] || 0; 
        
        if (element.querySelector('.bet-amount')) {
            element.querySelector('.bet-amount').innerText = betValue > 0 ? betValue : "";
        }
        
        // অপাসিটি কন্ট্রোল
        element.style.opacity = betValue > 0 ? 1 : 0.5;
    });
}

            // ২. লজিক: যখনই বেট পড়বে, তখনই এলিমেন্টকে পুনরায় Active করা
            if (betAmount > 0) {
                indicator.innerText = "$" + betAmount.toFixed(2);
                
                // 🔥 এই লাইনগুলো এলিমেন্টকে রিসেট-পরবর্তী অবস্থায় পুনরায় Active করবে
                indicator.style.display = "block"; 
                indicator.style.opacity = "1";     // রিসেট হলেও অপাসিটি ১ হবে
                indicator.style.visibility = "visible"; // রিসেট হলেও ভিজিবিলিটি অন হবে
                
                totalBetCalculated += betAmount;
            } else {
                // ৩. যখন বেট নেই: এলিমেন্ট হাইড রাখা
                indicator.innerText = "$0";
                indicator.style.display = "none";
                indicator.style.opacity = "0"; 
                indicator.style.visibility = "hidden";
            }
        });

        // ৪. টোটাল বেট আপডেট
        const totalBetEl = UI.totalBet || document.getElementById("totalBetAmount");
        if (totalBetEl) {
            totalBetEl.innerText = "$" + totalBetCalculated.toFixed(2);
        }
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
            // ১. লক মোড: রেড ব্যাকগ্রাউন্ড এবং টেক্সট আপডেট
            UI.spinBtn.classList.add("btn-locked");
            if (UI.btnText) UI.btnText.innerText = "LOCKED";
            
            // স্পিন বাটনটি ডিজেবল করা যাতে ইউজার ক্লিক করতে না পারে
            UI.spinBtn.style.pointerEvents = "none"; 
        } else {
            // ২. আনলক মোড: রেড ব্যাকগ্রাউন্ড রিমুভ এবং আবার SPIN টেক্সট
            UI.spinBtn.classList.remove("btn-locked");
            if (UI.btnText) UI.btnText.innerText = "SPIN";
            
            // বাটনটি আবার ক্লিক করার যোগ্য করা
            UI.spinBtn.style.pointerEvents = "auto";
        }
    }
    // ========================================================
    // 🛑 SECTION 6: SPIN BUTTON LOCK/UNLOCK STATE [END]
    // ========================================================


// ========================================================
    // 🎡 SECTION 7: CENTRAL HUB BONUS BLAST ENGINE [START]
    // ========================================================
    let correctedAngle = 0;
    function bindSpin() {
        UI.spinBtn.addEventListener("click", () => {
            if (typeof GameEngine === 'undefined') return;
            const state = GameEngine.getState();

            if (state.isSpinning) return;
            if (!state.bets || Object.keys(state.bets).length === 0) return;

            // ১. লক এবং সাউন্ড
            GameEngine.lock();
            setButtonLockState(true);
            closeFanMenu();
            playSound(UI.spinBtnSound);

            const winningSlot = GameEngine.generateResult();
            const bonusData = GameEngine.generateVoltageBonus(winningSlot);
            const currentRotation = state.rotation || 0;

            // আপডেট লজিক: LOCAL_SEGMENTS এর পরিবর্তে WHEEL_SLOTS থেকে ডাটা নিচ্ছি
            // আপনার ১৮টি স্লট অনুযায়ী প্রতি ঘরের মান ২০ ডিগ্রি (৩৬০ / ১৮ = ২০)
            const segmentDegrees = 20; 
            const targetIndex = winningSlot.index !== undefined ? winningSlot.index : (winningSlot.slot - 1);
            const targetSymbolAngle = targetIndex * segmentDegrees;
            
            // চাকা ঘোরানোর হিসাব
            const extraSpins = 7920;
            const totalTargetRotation = currentRotation + extraSpins + ((targetSymbolAngle - (currentRotation % 360) + 360) % 360);

            if (UI.spinSound) {
                UI.spinSound.loop = true;
                UI.spinSound.currentTime = 0;
                playSound(UI.spinSound);
            }

            // ২. বোনাস ইঞ্জিন (টাইমলাইনড অ্যানিমেশন)
            setTimeout(() => {
                let overlayContainer = document.getElementById("wheel-bonus-overlay");
                if (!overlayContainer) {
                    overlayContainer = document.createElement("div");
                    overlayContainer.id = "wheel-bonus-overlay";
                    UI.wheel.parentElement.appendChild(overlayContainer);
                }

                overlayContainer.innerHTML = `
                    <div class="central-3d-sphere">
                        <div class="sphere-glow"></div>
                        <div class="sphere-core"></div>
                    </div>
                    <div class="bonus-multiplier-ball" id="dynamic-bonus-card">
                        ${bonusData.multiplier || '3X'}
                    </div>
                `;
                overlayContainer.style.display = "block";

                // অষ্টম সেকেন্ডে ল্যান্ডিং
                setTimeout(() => {
                    const bonusBall = document.getElementById("dynamic-bonus-card");
                    if (bonusBall) {
                        bonusBall.classList.add("lock-to-cell");
                        bonusBall.style.transform = `translate(-50%, -50%) rotate(${correctedAngle}deg) translateY(-120px) rotate(-${correctedAngle}deg)`;
                    }
                }, 7000);
            }, 1000);

            // ৩. চাকার ঘূর্ণন
            UI.wheel.style.transition = "transform 14s cubic-bezier(0.15, 0.85, 0.2, 1)";
            UI.wheel.style.transform = `rotate(${totalTargetRotation}deg)`;

            // 🛑 ৭. ঠিক ১৪ সেকেন্ড পর চাকা স্থির হবে, রেজাল্ট রিলিজ হবে এবং বোর্ড রিসেট হবে
            setTimeout(() => {
                // সাউন্ড লুপ অফ
                if (UI.spinSound) {
                    UI.spinSound.loop = false;
                    UI.spinSound.pause();
                    UI.spinSound.currentTime = 0;
                }

               // ১. ইঞ্জিন থেকে রেজাল্ট নিন
                const rawResult = GameEngine.generateResult(); 

                // ২. আমাদের কাছে থাকা মাস্টার লিস্ট (WHEEL_SLOTS) থেকে পুরো ডাটা বের করুন
                // সরাসরি GameEngine থেকে WHEEL_SLOTS কল করছি যাতে ReferenceError না হয়
                // সরাসরি GameEngine থেকে ডাটা রিড করছে
              const fullWinningData = GameEngine.WHEEL_SLOTS.find(s => s.slot === (rawResult.slot || rawResult));

                // ৩. পেমেন্ট ফাংশনে এই পূর্ণাঙ্গ ডাটা পাঠান
                const payout = GameEngine.resolvePayout(fullWinningData, bonusData);
                updateBalance(payout.balance);

                // বোর্ড এবং ইউআই রিসেট
                setTimeout(() => {
                    GameEngine.unlock();
                    GameEngine.reset();
                    setButtonLockState(false);
                    
                    // বোর্ড ক্লিনআপ
                    clearBoard(); 
                    
                    // ওভারলে ক্লিনআপ
                    const overlayContainer = document.getElementById("wheel-bonus-overlay");
                    if (overlayContainer) {
                        overlayContainer.innerHTML = "";
                        overlayContainer.style.display = "none";
                    }
                    console.log("Game fully reset and board cleared.");
                }, 1500);
            }, 14000); 
        }); // bindSpin এর সমাপ্তি
    } // bindSpin এর সমাপ্তি


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
    // 🧮 SECTION 9: BALANCE & BOARD RESETS [UPDATED]
    // ========================================================
    function updateBalance(balance) {
        UI.balance.innerText = "$" + balance.toFixed(2);
    }
    // ========================================================
    // 🧮 SECTION CLEAR BOARED RESET
    // ========================================================

    function clearBoard() {
        // ১. সব ধরনের বেট ইন্ডিকেটর সিলেক্ট করা (আপনার এলিমেন্টের ক্লাস অনুযায়ী)
        const betIndicators = document.querySelectorAll(".bet-indicator");
        
        betIndicators.forEach(el => {
            el.innerText = "$0";
            el.style.display = "none"; // বোর্ড থেকে হাইড করে দেওয়া
            el.style.opacity = "0";    // অতিরিক্ত সুরক্ষা
        });

        // ২. যদি কোনো স্পেশাল বেট বা চিপ এলিমেন্ট থাকে তাও রিসেট করা
        const activeChips = document.querySelectorAll(".placed-chip");
        activeChips.forEach(chip => chip.remove());

        // ৩. টোটাল বেট রিসেট
        if (UI.totalBet) {
            UI.totalBet.innerText = "$0.00";
        }
        
        console.log("Board cleared successfully!");
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
