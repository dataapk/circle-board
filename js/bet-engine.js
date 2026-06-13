// ===============================
// 🪙 GLOBAL STATE (iGaming CORE)
// ===============================

let chipSound = null;
let selectedChip = null;

// ===============================
// 🚀 SAFE INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    chipSound = document.getElementById("chipSound");
    spinSound = document.getElementById("spinSound");

    if (chipSound) {

    console.log("Chip Clicked");
    console.log(chipSound);

    chipSound.currentTime = 0;
    chipSound.play().catch(() => {});

    }
    if (spinSound) {
        spinSound.volume = 0.7;
    }

    initChipSystem();

    console.log("🎰 Chip System Ready");

});

// ===============================
// 🪙 CHIP SYSTEM
// ===============================
function initChipSystem() {

    const chips = document.querySelectorAll(".chip");

    chips.forEach(chip => {

        chip.addEventListener("click", () => {

            // ACTIVE GLOW
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");

            // STORE VALUE
            selectedChip = chip.getAttribute("data-value");

            // SOUND
            if (chipSound) {

                chipSound.currentTime = 0;

                chipSound.play().catch(() => {});

            }

            console.log(
                "Selected Chip:",
                selectedChip
            );

        });

    });

}
