// ===============================
// 🪙 GLOBAL STATE
// ===============================

let chipSound = null;
let spinSound = null;
let selectedChip = {
    value: null,
    element: null
};

// ===============================
// 🚀 INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    chipSound = document.getElementById("chipSound");
    spinSound = document.getElementById("spinSound");

    if (spinSound) {
        spinSound.volume = 0.7;
    }

    initChipSystem();

    console.log("🎰 Chip System Ready");
});
// ======================================================
// 🪙 CHIP SYSTEM (IMPORTANT INSTRUCTIONS)
// ======================================================
// 👉 এই ফাইলটা CHIP UI + SELECTION control করে
// 👉 এখানে BET ENGINE নাই (শুধু chip select + UI)
// 👉 selectedChip পরে bet-engine.js এ use হবে
// ======================================================



// ===============================
// 🪙 GLOBAL STATE
// ===============================

let chipSound = null;
let spinSound = null;

// 👉 selectedChip এখন object আকারে রাখা হচ্ছে
// আগে string ছিল — এখন future bet system এর জন্য upgraded
let selectedChip = {
    value: null,
    element: null
};



// ===============================
// 🚀 INIT (PAGE LOAD)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    chipSound = document.getElementById("chipSound");
    spinSound = document.getElementById("spinSound");

    if (spinSound) {
        spinSound.volume = 0.7;
    }

    initChipSystem();

    console.log("🎰 Chip System Ready");
});



// ===============================
// 🪙 CHIP SYSTEM MAIN LOGIC
// ===============================

function initChipSystem() {

    // 👉 chips container (HTML থেকে নিতে হবে)
    const container = document.querySelector(".chips-container");

    // 👉 সব chips select করা হচ্ছে
    const chips = document.querySelectorAll(".chip");

    // 👉 default chip (main chip UI button)
    const defaultChip = document.querySelector(".default-chip");



    // ❗ IMPORTANT:
    // যদি এগুলো HTML এ না থাকে, system কাজ করবে না
    if (!container || !defaultChip) return;



    // ===============================
    // 🎯 DEFAULT CHIP CLICK (OPEN / CLOSE MENU)
    // ===============================

    defaultChip.addEventListener("click", (e) => {

        e.stopPropagation();

        // 👉 এখানে menu open/close হচ্ছে
        container.classList.toggle("expanded");
        container.classList.toggle("collapsed");

    });



    // ===============================
    // 🪙 INDIVIDUAL CHIP CLICK
    // ===============================

    chips.forEach(chip => {

        chip.addEventListener("click", (e) => {

            e.stopPropagation();

            // 👉 সব chip থেকে active remove
            chips.forEach(c => c.classList.remove("active"));

            // 👉 clicked chip active করা
            chip.classList.add("active");



            // ==================================================
            // 🧠 IMPORTANT: SELECTED CHIP UPDATE
            // ==================================================
            // 👉 এখানে তুমি chip select করছো
            // 👉 এই value পরে bet-engine.js এ যাবে
            // ==================================================

            selectedChip = {
                value: chip.getAttribute("data-value"),
                element: chip
            };



            // ==================================================
            // 🔁 DEFAULT CHIP UI UPDATE (SWAP SYSTEM)
            // ==================================================
            // 👉 এখানে selected chip UI তে দেখানো হচ্ছে
            // 👉 default chip + selected chip swap হচ্ছে
            // ==================================================

            syncDefaultChip(defaultChip, chip);



            // ===============================
            // 🔊 CHIP SOUND PLAY
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
    // 🌐 OUTSIDE CLICK → CLOSE MENU
    // ===============================

    document.addEventListener("click", () => {
        closeChipPanel(container);
    });
}



// ===============================
// 🔁 DEFAULT CHIP UI SWAP FUNCTION
// ===============================
// 👉 এখানে default chip icon/text swap হয়

function syncDefaultChip(defaultChip, chip) {

    const defaultImg = defaultChip.querySelector("img");
    const defaultText = defaultChip.querySelector("span");

    const selectedImg = chip.querySelector("img");
    const selectedText = chip.querySelector("span");



    // ===============================
    // 🖼 IMAGE SWAP
    // ===============================

    let tempImg = defaultImg.src;
    defaultImg.src = selectedImg.src;
    selectedImg.src = tempImg;



    // ===============================
    // 📝 TEXT SWAP
    // ===============================

    let tempText = defaultText.textContent;
    defaultText.textContent = selectedText.textContent;
    selectedText.textContent = tempText;



    // ===============================
    // 💰 VALUE SWAP (DATA ATTRIBUTE)
    // ===============================

    let tempValue = defaultChip.getAttribute("data-value");

    defaultChip.setAttribute(
        "data-value",
        chip.getAttribute("data-value")
    );

    chip.setAttribute("data-value", tempValue);
}



// ===============================
// 🔊 CHIP SOUND FUNCTION
// ===============================

function playChipSound() {
    if (!chipSound) return;

    chipSound.currentTime = 0;
    chipSound.play().catch(() => {});
}



// ===============================
// 📦 CLOSE CHIP PANEL
// ===============================

function closeChipPanel(container) {

    container.classList.remove("expanded");
    container.classList.add("collapsed");
}
