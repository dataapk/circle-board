
// ===============================
// 🎰 WHEEL ENGINE (CLEAN CORE)
// ===============================
// ⚠️ IMPORTANT:
// - শুধু wheel spin logic থাকবে
// - audio / global state অন্য ফাইলে থাকবে
// - duplicate variable এখানে থাকবে না
// ===============================


// ===============================
// 🎯 DOM ELEMENTS
// ===============================

let wheel;
let spinBtn;


// ===============================
// 🎮 STATE
// ===============================

let isSpinning = false;
let currentRotation = 0;


// ===============================
// 🚀 INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    wheel = document.getElementById("wheel");
    spinBtn = document.getElementById("spinBtn");

    if (!wheel || !spinBtn) {
        console.log("❌ Wheel or Spin button missing");
        return;
    }

    spinBtn.addEventListener("click", spinWheel);

    console.log("🎰 Wheel Engine Ready");
});


// ===============================
// 🎰 MAIN SPIN FUNCTION (CORE)
// ===============================

function spinWheel() {

    if (isSpinning) return;
    isSpinning = true;


    // ===============================
    // 🎯 RANDOM SPIN LOGIC
    // ===============================

    const spins = 10 + Math.floor(Math.random() * 10); // 10–20 spins
    const randomAngle = Math.floor(Math.random() * 360);

    currentRotation += (spins * 360) + randomAngle;


    // ===============================
    // 🎨 ANIMATION
    // ===============================

    wheel.style.transition = "transform 9s ease-out";
    wheel.style.transform = `rotate(${currentRotation}deg)`;


    // ===============================
    // 🛑 END SPIN
    // ===============================

    setTimeout(() => {

        isSpinning = false;

        const finalAngle = currentRotation % 360;

        console.log("🎯 FINAL ANGLE:", finalAngle);

        // 👉 এখানে পরে bet-engine connect হবে
        // resolveResult(finalAngle);

    }, 9000);
}
