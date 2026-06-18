document.addEventListener("DOMContentLoaded", () => {

    console.log("🚀 GAME READY");

    initChipSystem();
    initTableSystem();
    initAudio();

    loadGame?.();

    console.log("✔ SYSTEM INITIALIZED");
});
//CHIP SYSTEM (EXPAND + SELECT)
function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    let expanded = false;

    function openMenu() {
        if (GameEngine.isSpinning) return;

        container.classList.add("expanded");
        container.classList.remove("collapsed");
        expanded = true;
    }

    function closeMenu() {
        container.classList.remove("expanded");
        container.classList.add("collapsed");
        expanded = false;
    }

    // toggle
    defaultChip.addEventListener("click", (e) => {
        e.stopPropagation();
        expanded ? closeMenu() : openMenu();
    });

    // chip select
    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            GameEngine.selectedChip = {
                value: parseFloat(chip.dataset.value),
                element: chip
            };

            const span = defaultChip.querySelector("span");
            if (span) {
                span.innerText = "$" + GameEngine.selectedChip.value;
            }

            GameEngine.audio.play(GameEngine.chipSound);

            closeMenu();
        });
    });

    // outside click
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".chips-container")) {
            closeMenu();
        }
    });
}
// TableSystem
function initTableSystem() {

    const boxes = document.querySelectorAll(".symbol-box");

    boxes.forEach(box => {

        box.addEventListener("click", () => {

            if (GameEngine.isSpinning) return;
            if (!GameEngine.selectedChip) return;

            const symbol = box.dataset.symbol;
            const amount = GameEngine.selectedChip.value;

            if (!subtractBalance(amount)) return;

            GameEngine.audio.play(GameEngine.tableSound);

            if (!GameEngine.bets[symbol]) {
                GameEngine.bets[symbol] = 0;
            }

            GameEngine.bets[symbol] += amount;

            const marker = document.createElement("div");
            marker.className = "bet-marker";
            marker.innerText = "$" + amount;

            box.appendChild(marker);

            console.log("BET:", symbol, amount);
        });
    });
}
// 🎰 SPIN CONTROL
function startSpin() {

    if (GameEngine.isSpinning) return false;

    if (Object.keys(GameEngine.bets).length === 0) {
        console.log("❌ NO BETS");
        return false;
    }

    GameEngine.isSpinning = true;

    GameEngine.audio.play(GameEngine.spinSound);

    console.log("🎰 SPIN STARTED");

    return true;
}
// 🎯 RESULT FLOW
function handleWheelResult(angle) {

    const symbols = ["heart","diamond","club","spade","crown","flag"];

    const index = Math.floor((angle % 360) / (360 / symbols.length));

    const result = symbols[index];

    GameEngine.lastResult = result;

    console.log("🎯 RESULT:", result);

    onSpinEnd(result);
}
// 🏁 END FLOW
function onSpinEnd(result) {

    console.log("🏁 SPIN END");

    resolvePayout(result);

    resetWheelState();
    startNewRound();

    unlockBets?.();
    unlockGameUI?.();

    console.log("✔ READY NEXT ROUND");
}
// 🔄 RESET SYSTEM
function resetWheelState() {

    GameEngine.isSpinning = false;
    GameEngine.lastResult = null;
    GameEngine.currentRotation = 0;

    if (GameEngine.spinSound) {
        GameEngine.spinSound.pause();
        GameEngine.spinSound.currentTime = 0;
    }
}

function startNewRound() {

    GameEngine.bets = {};
    GameEngine.isSpinning = false;

    console.log("🔄 NEW ROUND ACTIVE");
}







