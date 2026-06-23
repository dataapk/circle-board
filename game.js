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
    function updateBoardUI(bets) {
        let totalBetCalculated = 0;

        document.querySelectorAll(".symbol-box").forEach(box => {
            const symbol = box.dataset.symbol;
            const betAmount = bets[symbol] || 0;
            
            // ১. সেফটি ফিক্স: এলিমেন্ট না থাকলে তৈরি করা
            let indicator = box.querySelector(".bet-indicator");
            if (!indicator) {
                indicator = document.createElement("div");
                indicator.className = "bet-indicator";
                box.appendChild(indicator);
            }

            box.style.position = "relative"; 

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
// 🎡 SECTION 7: CENTRAL HUB BONUS BLAST ENGINE [UPDATED]
// ========================================================
// ========================================================
// 🎡 SECTION 7: CENTRAL HUB BONUS BLAST ENGINE [FULLY INTEGRATED]
// ========================================================
function bindSpin() {
    UI.spinBtn.addEventListener("click", () => {
        if (typeof GameEngine === 'undefined') return;
        const state = GameEngine.getState();
        if (state.isSpinning) return;
        
        // ১. ইঞ্জিন থেকে ডেটা নেওয়া
        const winningSlotData = GameEngine.generateResult(); // {slot: 3, symbol: "flag", count: 3}
        const bonusData = GameEngine.generateVoltageBonus(winningSlotData); // {multiplier: "10X"}
        
        const currentRotation = getCurrentRotation(UI.wheel);
        const targetAngle = (winningSlotData.slot - 1) * 20; // প্রতি স্লট ২০ ডিগ্রি
        const extraSpins = 1080;
        const finalRotation = currentRotation + extraSpins + (targetAngle - (currentRotation % 360));

        // ২. বোনাস ইঞ্জিন ওভারলে (সেই 3D স্ফিয়ার এবং মাল্টিপ্লায়ার)
        showBonusOverlay(bonusData.multiplier);

        // ৩. চাকা ঘোরানো
        UI.wheel.style.transition = "transform 14s cubic-bezier(0.42, 0, 0.58, 1)";
        UI.wheel.style.transform = `rotate(${finalRotation}deg)`;

        // ৪. ১৪ সেকেন্ড পর রেজাল্ট ও বোনাস ল্যান্ডিং
        setTimeout(() => {
            // মাল্টিপ্লায়ার কার্ডটি নির্দিষ্ট স্লটে ল্যান্ড করানো
            const bonusBall = document.getElementById("dynamic-bonus-card");
            if (bonusBall) {
                bonusBall.classList.add("lock-to-cell");
                bonusBall.style.transform = `translate(-50%, -50%) rotate(${targetAngle}deg) translateY(-120px) rotate(-${targetAngle}deg)`;
            }

            // পে-আউট ও রিসেট
            const payout = GameEngine.resolvePayout(winningSlotData, bonusData);
            updateBalance(payout.balance);
            
            setTimeout(() => {
                GameEngine.unlock();
                document.getElementById("wheel-bonus-overlay").style.display = "none";
            }, 1500);
        }, 14000);
    });
}

// বোনাস ওভারলে দেখানোর ফাংশন
function showBonusOverlay(multiplier) {
    let overlay = document.getElementById("wheel-bonus-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "wheel-bonus-overlay";
        UI.wheel.parentElement.appendChild(overlay);
    }
    overlay.innerHTML = `
        <div class="central-3d-sphere"><div class="sphere-glow"></div><div class="sphere-core"></div></div>
        <div class="bonus-multiplier-ball" id="dynamic-bonus-card">${multiplier}</div>
    `;
    overlay.style.display = "block";
}
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
