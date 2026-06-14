
// ======================================================
// 🪙 CHIP SYSTEM (FINAL CLEAN VERSION)
// ======================================================
// ⚠️ IMPORTANT:
// - এই ফাইলটা শুধু CHIP UI + SOUND + SELECTION handle করে
// - BET ENGINE আলাদা থাকবে
// - কোনো duplicate variable অন্য ফাইলে রাখবে না
// ======================================================


// ===============================
// 🧠 GLOBAL STATE (ONLY ONCE USE)
// ===============================

let chipSound = null;
let spinSound = null;

let selectedChip = {
    value: null,
    element: null
};


// ===============================
// 🚀 INIT SYSTEM
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    chipSound = document.getElementById("chipSound");
    spinSound = document.getElementById("spinSound");

    // 🎧 SAFE AUDIO SETUP
    if (spinSound) {
        spinSound.volume = 0.7;
    }

    if (!chipSound) {
        console.log("⚠️ chipSound not found in HTML");
    }

    if (!spinSound) {
        console.log("⚠️ spinSound not found in HTML");
    }

    initChipSystem();

    console.log("🎰 CHIP SYSTEM READY");
});


// ===============================
// 🪙 CHIP SYSTEM CORE
// ===============================

function initChipSystem() {

    const container = document.querySelector(".chips-container");
    const chips = document.querySelectorAll(".chip");
    const defaultChip = document.querySelector(".default-chip");

    // ❌ SAFETY CHECK
    if (!container || !defaultChip) {
        console.log("❌ CHIP SYSTEM DOM MISSING");
        return;
    }


    // ===============================
    // 🎯 DEFAULT CHIP TOGGLE
    // ===============================

    defaultChip.addEventListener("click", (e) => {
        e.stopPropagation();

        container.classList.toggle("expanded");
        container.classList.toggle("collapsed");
    });


    // ===============================
    // 🪙 CHIP SELECT SYSTEM
    // ===============================

    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {
            e.stopPropagation();

            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");


            // ===============================
            // 🧠 STORE SELECTED CHIP
            // ===============================

            selectedChip = {
                value: chip.getAttribute("data-value"),
                element: chip
            };


            // ===============================
            // 🔁 SWAP UI (DEFAULT CHIP UPDATE)
            // ===============================

            swapDefaultChip(defaultChip, chip);


            // ===============================
            // 🔊 SOUND PLAY
            // ===============================

            playChipSound();


            // ===============================
            // 📦 AUTO CLOSE MENU
            // ===============================

            if (!chip.classList.contains("default-chip")) {
                closeChipPanel(container);
            }

        });

    });


    // ===============================
    // 🌐 OUTSIDE CLICK CLOSE
    // ===============================

    document.addEventListener("click", () => {
        closeChipPanel(container);
    });
}


// ===============================
// 🔁 CHIP SWAP FUNCTION
// ===============================

function swapDefaultChip(defaultChip, chip) {

    const defaultImg = defaultChip.querySelector("img");
    const defaultText = defaultChip.querySelector("span");

    const selectedImg = chip.querySelector("img");
    const selectedText = chip.querySelector("span");

    if (!defaultImg || !selectedImg) return;


    // 🖼 IMAGE SWAP
    let tempImg = defaultImg.src;
    defaultImg.src = selectedImg.src;
    selectedImg.src = tempImg;


    // 📝 TEXT SWAP
    let tempText = defaultText.textContent;
    defaultText.textContent = selectedText.textContent;
    selectedText.textContent = tempText;


    // 💰 VALUE SWAP
    let tempValue = defaultChip.getAttribute("data-value");

    defaultChip.setAttribute(
        "data-value",
        chip.getAttribute("data-value")
    );

    chip.setAttribute("data-value", tempValue);
}


// ===============================
// 🔊 CHIP SOUND (SAFE)
// ===============================

function playChipSound() {

    if (!chipSound) return;

    chipSound.currentTime = 0;

    chipSound.play().catch((err) => {
        console.log("⚠️ Audio blocked:", err);
    });
}


// ===============================
// 📦 CLOSE PANEL
// ===============================

function closeChipPanel(container) {

    if (!container) return;

    container.classList.remove("expanded");
    container.classList.add("collapsed");
}
