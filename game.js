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
            
            // 🎯 সেফটি ফিক্স: যদি HTML-এ .bet-indicator না থাকে, তবে কোড নিজে এটি তৈরি করে নেবে
            let indicator = box.querySelector(".bet-indicator");
            if (!indicator) {
                indicator = document.createElement("div");
                indicator.className = "bet-indicator";
                box.appendChild(indicator);
            }

            // প্রতিটি বক্সে রিলেティブ পজিশন দেওয়া যেন ব্যাজটি বাম-ওপরের কোণায় বসে
            box.style.position = "relative"; 

            if (betAmount > 0) {
                indicator.innerText = "$" + betAmount.toFixed(2);
                indicator.style.display = "block";
                totalBetCalculated += betAmount;
            } else {
                indicator.innerText = "$0";
                indicator.style.display = "none";
            }
        });

        // UI.totalBet অবজেক্টটি ডিফাইন করা থাকলে বা আইডি থাকলে টোটাল আপডেট হবে
        if (UI.totalBet) {
            UI.totalBet.innerText = "$" + totalBetCalculated.toFixed(2);
        } else {
            const totalBetEl = document.getElementById("totalBetAmount");
            if (totalBetEl) totalBetEl.innerText = "$" + totalBetCalculated.toFixed(2);
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
            UI.spinBtn.classList.add("btn-locked"); // CSS এর মাধ্যমে রেড ব্যাকগ্রাউন্ড অ্যাক্টিভ হবে
            if (UI.btnText) UI.btnText.innerText = "LOCKED";
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

            // 🔥 ১. ইনস্ট্যান্ট লক: ক্লিক করার সাথে সাথেই বাটন লাল এবং LOCK হবে (০ সেকেন্ডে)
            GameEngine.lock();
            setButtonLockState(true);
            closeFanMenu(); 
            playSound(UI.spinBtnSound);

            // ২. ব্যাকএন্ড ইঞ্জিন থেকে রেজাল্ট ও বোনাস ডাটা রিসিভ করা
            const winningSlot = GameEngine.generateResult(); 
            const bonusData = GameEngine.generateVoltageBonus(winningSlot);

            const duration = 14000; // ঠিক ১৪ সেকেন্ড ঘূর্ণনকাল
            const currentRotation = state.rotation || 0;

            // চাকার ১২টি ঘরের অরিজিনাল সিকোয়েন্স (কাঁটার হিসাব মেলাতে)
            const LOCAL_SEGMENTS = [
                "heart", "spade", "diamond", "club",
                "crown", "flag", "heart", "crown",
                "spade", "diamond", "flag", "club"
            ];

            // ৩. চাকার ১২টি ঘরের নিখুঁত ডিগ্রি ম্যাপিং (৩৬০ / ১২ = ৩০ ডিগ্রি প্রতি ঘর)
            const targetIndexes = [];
            LOCAL_SEGMENTS.forEach((sym, idx) => {
                if (sym === winningSlot.symbol) targetIndexes.push(idx);
            });
            
            const finalIndex = targetIndexes.length > 0 ? targetIndexes[Math.floor(Math.random() * targetIndexes.length)] : 0;
            const segmentDegrees = 360 / LOCAL_SEGMENTS.length; // ৩০ ডিগ্রি

            // 🎯 জ্যামিতিক ফিক্স (কোনো দাগের ওপর থামবে না):
            // প্রতি ঘরের একদম মাঝখানে (Center Zone) কাঁটা লক করার জন্য ঠিক ১৫ ডিগ্রি (৩০ / ২) যোগ করা হয়েছে।
            // এর ফলে চাকা কোনো দাগের ওপর বা মাঝখানে আটকে থাকবে না, ১০০% ঘরের সেন্টারে থামবে।
            const targetSymbolAngle = (finalIndex * segmentDegrees) + (segmentDegrees / 2);
            let correctedAngle = (360 - targetSymbolAngle) % 360;
            
            const extraSpins = 7920; // ১৪ সেকেন্ড মেইনটেইন করার জন্য ২২ বার ফুল রোটেশন
            
            // নতুন টার্গেট রোটেশন (আগের পজিশন থেকে সবসময় শুধু সামনের দিকে বা ডানে প্রগ্রেসিভলি এগোবে)
            const totalTargetRotation = currentRotation + extraSpins + ((correctedAngle - (currentRotation % 360) + 360) % 360);

            // 🎵 ৪. সাউন্ড লুপ অন
            if (UI.spinSound) {
                UI.spinSound.loop = true;
                playSound(UI.spinSound);
            }

            // 💥 ৫. আলাদা ওভারলে লেয়ারে রাউন্ডেড লাইটিং অ্যানিমেশন (ঠিক ১ সেকেন্ড পর)
            // এটি মেইন হুইলের সিএসএস (Transition) বা পজিশনকে বিন্দুমাত্র স্পর্শ করবে না।
            setTimeout(() => {
                const runBonusAnimation = window.triggerVoltageAnimation || (typeof triggerVoltageAnimation === "function" ? triggerVoltageAnimation : null);
                
                if (runBonusAnimation) {
                    runBonusAnimation(bonusData, () => {});
                } else {
                    // সেফটি ফিক্স: চাকার প্যারেন্ট কন্টেইনারে ওভারলে লেয়ার তৈরি (চাকার বাইরে স্বাধীন)
                    let overlayContainer = document.getElementById("wheel-bonus-overlay");
                    if (!overlayContainer) {
                        overlayContainer = document.createElement("div");
                        overlayContainer.id = "wheel-bonus-overlay";
                        UI.wheel.parentElement.appendChild(overlayContainer);
                    }

                    // ওপরের স্থির লেয়ারে চতুর্দিকে রাউন্ডেড রানিং ইলেকট্রিক নিয়ন শক অ্যানিমেশন
                    overlayContainer.innerHTML = `
                        <div class="voltage-glow-ring"></div>
                        <div class="bonus-multiplier-card">
                            <span class="voltage-text">⚡ VOLTAGE BONUS ⚡</span>
                            <span class="mult-value">${bonusData.multiplier || '10X'}</span>
                        </div>
                    `;
                    overlayContainer.style.display = "flex";

                    // চাকা থামার আগে ওপরের অ্যানিমেশন লেয়ারটি সুন্দরভাবে মেল্ট ডাউন (Fade out) হয়ে যাবে
                    setTimeout(() => {
                        overlayContainer.style.animation = "fadeOut 0.6s forwards";
                        setTimeout(() => { overlayContainer.innerHTML = ""; overlayContainer.style.display = "none"; }, 600);
                    }, 4000);
                }
            }, 1000); // ⏱️ চাকা ঘোরার ঠিক ১ সেকেন্ড মাথায় ওপরে লাইট ব্লাস্ট হবে

            // 📈 ৬. নিচের চাকার স্বাধীন আল্ট্রা-স্মুথ ঘূর্ণন (GPU Accelerated)
            UI.wheel.style.transition = "transform 14s cubic-bezier(0.2, 1, 0.2, 1)";
            UI.wheel.style.transform = `rotate(${totalTargetRotation}deg)`;

            // 🛑 ৭. ঠিক ১৪.২ সেকেন্ড পর চাকা পুরোপুরি স্থির হলে রেজাল্ট রিলিজ
            setTimeout(() => {
                if (UI.spinSound) {
                    UI.spinSound.loop = false;
                    UI.spinSound.pause();
                    UI.spinSound.currentTime = 0;
                }

                // বর্তমান ফাইনাল ডিগ্রিটি ইঞ্জিনে সেভ রাখা যাতে পরের রাউন্ডে চাকা ঝাঁকুনি না দেয়
                GameEngine.setRotation(totalTargetRotation);
                
                // রেজাল্ট পে-আউট এবং ব্যালেন্স স্ক্রিনে নিখুঁত আপডেট
                const payout = GameEngine.resolvePayout(winningSlot, bonusData);
                updateBalance(payout.balance);

                // গেম আনলক এবং বাটন রিসেট
                setTimeout(() => {
                    GameEngine.unlock();
                    GameEngine.reset();
                    setButtonLockState(false);
                    clearBoard();
                }, 1500);

            }, 14200); 
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
