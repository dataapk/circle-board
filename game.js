// ======================================================
// 🎮 CLEAN GAME UI V2
// ======================================================

(() => {

    const UI = {
        balance: document.getElementById("balanceAmount"),
        wheel: document.getElementById("wheel"),
        spinBtn: document.getElementById("spinBtn"),
        chipsContainer: document.querySelector(".chips-container"),
        chips: document.querySelectorAll(".chip"),
        table: document.querySelector(".symbol-table"),
        defaultChip: document.querySelector(".default-chip")
    };

    function init() {
        bindChips();
        bindBoard();
        bindSpin();
        setDefaultChip();
    }

    // =========================
    // DEFAULT CHIP FIX
    // =========================
    function setDefaultChip() {
        GameEngine.setSelectedChip({ value: 0.10 });

        const span = UI.defaultChip.querySelector("span");
        if (span) span.innerText = "$0.10";
    }

    // =========================
    // CHIP SYSTEM
    // =========================
    function bindChips() {

        UI.defaultChip.addEventListener("click", () => {
            toggleFan();
        });

        UI.chips.forEach(chip => {

            if (chip.classList.contains("default-chip")) return;

            chip.addEventListener("click", () => {

                const value = Number(chip.dataset.value);

                GameEngine.setSelectedChip({ value });

                UI.chips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");

                UI.defaultChip.querySelector("span").innerText = "$" + value;

                closeFan();
            });
        });
    }

    function toggleFan() {
        UI.chipsContainer.classList.toggle("fan");
    }

    function closeFan() {
        UI.chipsContainer.classList.remove("fan");
    }

    // =========================
    // BOARD
    // =========================
    function bindBoard() {

        UI.table.addEventListener("click", (e) => {

            const box = e.target.closest(".symbol-box");
            if (!box) return;

            const state = GameEngine.getState();
            if (state.isSpinning) return;

            const symbol = box.dataset.symbol;

            const result = GameEngine.placeBet(symbol, state.selectedChip.value);

            if (!result.success) return;

            updateBalance(result.balance);

            const marker = document.createElement("div");
            marker.className = "bet-marker";
            marker.innerText = "$" + state.selectedChip.value;

            box.appendChild(marker);
        });
    }

    // =========================
    // SPIN SYSTEM
    // =========================
    function bindSpin() {

        UI.spinBtn.addEventListener("click", () => {

            const state = GameEngine.getState();

            if (state.isSpinning) return;
            if (Object.keys(state.bets).length === 0) return;

            GameEngine.lock();
            spinWheel();
        });
    }

    function spinWheel() {

        const duration = 8000;
        const start = GameEngine.getState().rotation;
        const target = start + 1440;

        const startTime = performance.now();

        function animate(t) {

            const p = Math.min((t - startTime) / duration, 1);
            const angle = start + (target - start) * (p * (2 - p));

            UI.wheel.style.transform = `rotate(${angle}deg)`;

            if (p < 1) {
                requestAnimationFrame(animate);
            } else {
                GameEngine.setRotation(target);

                const result = getResult(angle);

                const payout = GameEngine.resolvePayout(result);

                updateBalance(payout.balance);

                GameEngine.unlock();
                GameEngine.reset();

                clearBoard();
            }
        }

        requestAnimationFrame(animate);
    }

    function getResult(angle) {

        const segments = [
            "heart","spade","diamond","club",
            "crown","flag","heart","crown",
            "spade","diamond","flag","club"
        ];

        const normalized = (angle % 360 + 360) % 360;
        const index = Math.floor(normalized / (360 / segments.length));

        return segments[index];
    }

    // =========================
    // UI HELPERS
    // =========================
    function updateBalance(balance) {
        UI.balance.innerText = "$" + balance.toFixed(2);
    }

    function clearBoard() {
        document.querySelectorAll(".bet-marker").forEach(el => el.remove());
    }

    init();

})();
