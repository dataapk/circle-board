// ===============================
// 🪙 BET ENGINE (PRO iGaming)
// ===============================

let chipSound;
let selectedChip = null;

// ===============================
// 🎧 INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    chipSound = document.getElementById("chipSound");

    initChips();

});

// ===============================
// 🪙 CHIP INIT SYSTEM
// ===============================
function initChips() {

    const chips = document.querySelectorAll(".chip");

    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            // 🔊 SOUND
            if (chipSound) {
                chipSound.currentTime = 0;
                chipSound.play();
            }

            // 🎯 ACTIVE STATE
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            selectedChip = chip.getAttribute("data-value");

        });

    });

}

// ===============================
// 🪙 CHIP FAN TOGGLE (OPTIONAL UI EFFECT)
// ===============================
document.addEventListener("click", () => {

    const container = document.querySelector(".chips-container");

    if (!container) return;

    container.classList.toggle("expanded");

});
