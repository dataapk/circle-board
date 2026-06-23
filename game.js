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

            // 🔥 ১. ইনস্ট্যান্ট লক: ক্লিক করার সাথে সাথেই বাটন লাল এবং LOCK হবে
            GameEngine.lock();
            setButtonLockState(true);
            closeFanMenu(); 
            playSound(UI.spinBtnSound);

            // ২. ব্যাকএন্ড ইঞ্জিন থেকে রেজাল্ট ও ভোল্টেজ বোনাস ডাটা জেনারেট
            const winningSlot = GameEngine.generateResult(); 
            const bonusData = GameEngine.generateVoltageBonus(winningSlot);

            const duration = 14000; // পুরো ১৪ সেকেন্ড ঘূর্ণন
            
            // 🎯 ফিক্স ১: আগের স্পিনের বর্তমান রোটেশন অ্যাঙ্গেল নিখুঁতভাবে রিকভার করা
            const currentRotation = state.rotation || 0;

            // ৩. চাকার ১২টি ঘরের নিখুঁত ডিগ্রি ম্যাপিং (৩৬০ / ১২ = ৩০ ডিগ্রি প্রতি ঘর)
            const targetIndexes = [];
            SEGMENTS.forEach((sym, idx) => {
                if (sym === winningSlot.symbol) targetIndexes.push(idx);
            });
            const finalIndex = targetIndexes[Math.floor(Math.random() * targetIndexes.length)];

            const segmentDegrees = 360 / SEGMENTS.length; // ৩০ ডিগ্রি
            
            // চাকার ভেতরের চিহ্নের কেন্দ্রবিন্দু (Center) বের করা
            const targetSymbolAngle = (finalIndex * segmentDegrees) + (segmentDegrees / 2);
            
            // 🎯 ফিক্স ২: চাকা সবসময় ঘড়ির কাঁটার দিকেই (Right) ঘুরবে, কোনো ব্যাক-টার্ন বা ঝাঁকুনি দেবে না
            // ১৪ সেকেন্ডের জন্য চাকাটি ২২ বার ফুল চক্কর (৭৯২০ ডিগ্রি) দেবে
            const extraSpins = 7920; 
            const currentBaseRotation = currentRotation - (currentRotation % 360);
            const totalTargetRotation = currentBaseRotation + extraSpins + (360 - targetSymbolAngle);

            // 🎵 ৪. সাউন্ড লুপ অন: চাকা ঘোরার সময় সাউন্ড একটানা লুপে বাজবে
            if (UI.spinSound) {
                UI.spinSound.loop = true;
                playSound(UI.spinSound);
            }

            // 💥 ৫. বোনাস অ্যানিমেশন ট্রিগার: চাকা ঘোরার ঠিক ২ সেকেন্ডের মাথায় বোনাস বক্স লাফালাফি শুরু করবে
            setTimeout(() => {
                if (typeof triggerVoltageAnimation === "function") {
                    triggerVoltageAnimation(bonusData, () => {
                        console.log("Voltage bonus locked!");
                    });
                } else {
                    console.error("triggerVoltageAnimation missing! check gameEngine.js");
                }
            }, 2000);

            // 📈 ৬. পিওর গাণিতিক ১৪ সেকেন্ড কাস্টম স্মুথ অ্যানিমেশন (Quintic Ease-Out)
            const startTime = performance.now();
            UI.wheel.style.transition = "none"; // ব্রাউজার ট্রানজিশন অফ রেখে জেএস দিয়ে কন্ট্রোল

            function animate(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                
                // 🎯 ফিক্স ৩: মাখনের মতো স্মুথ স্টপ কার্ভ (Ease-Out) - শেষ ৫ সেকেন্ডে চাকা একদম রিয়েলস্টিক নিয়মে থামবে
                const easeOut = 1 - Math.pow(1 - progress, 5);
                const currentAngle = currentRotation + (totalTargetRotation - currentRotation) * easeOut;

                UI.wheel.style.transform = `rotate(${currentAngle}deg)`;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // 🛑 চাকা পুরোপুরি স্থির হওয়ার পর (ঠিক ১৪ সেকেন্ড পর) রেজাল্ট প্রসেস
                    if (UI.spinSound) {
                        UI.spinSound.loop = false;
                        UI.spinSound.pause();
                        UI.spinSound.currentTime = 0;
                    }

                    // 🎯 ফিক্স ৪: বর্তমান ডিগ্রিটি ইঞ্জিনে সেভ রাখা যাতে পরের স্পিন এখান থেকেই শুরু হয়
                    GameEngine.setRotation(totalTargetRotation);
                    
                    const payout = GameEngine.resolvePayout(winningSlot, bonusData);
                    
                    // ব্যালেন্স আপডেট
                    updateBalance(payout.balance);

                    // গেম আনলক এবং বাটন রিসেট
                    setTimeout(() => {
                        GameEngine.unlock();
                        GameEngine.reset();
                        setButtonLockState(false);
                        clearBoard();
                    }, 1500);
                }
            }

            requestAnimationFrame(animate);
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
