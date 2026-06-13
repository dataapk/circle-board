// ===============================
// 🎰 PREMIUM WHEEL ENGINE (FINAL)
// ===============================

let wheel = document.getElementById("wheel");
let spinBtn = document.getElementById("spinBtn");

let spinSound;
let tickSound;

let isSpinning = false;
let currentRotation = 0;
let tickInterval;

// ===============================
// 🎧 INIT AUDIO (SAFE)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    spinSound = document.getElementById("spinSound");
    tickSound = document.getElementById("tickSound");
});

// ===============================
// 🎧 FADE IN SOUND
// ===============================
function fadeInSound(duration = 800) {
    if (!spinSound) return;

    spinSound.volume = 0;
    spinSound.currentTime = 0;
    spinSound.play();

    let volume = 0;
    const step = 1 / (duration / 50);

    const fade = setInterval(() => {
        volume += step;

        if (volume >= 1) {
            volume = 1;
            clearInterval(fade);
        }

        spinSound.volume = volume;
    }, 50);
}

// ===============================
// 🎧 FADE OUT SOUND
// ===============================
function fadeOutSound(duration = 1500) {
    if (!spinSound) return;

    let volume = spinSound.volume;
    const step = volume / (duration / 50);

    const fade = setInterval(() => {
        volume -= step;

        if (volume <= 0) {
            volume = 0;
            spinSound.pause();
            spinSound.currentTime = 0;
            clearInterval(fade);
        }

        spinSound.volume = volume;
    }, 50);
}

// ===============================
// 🎰 MAIN SPIN FUNCTION
// ===============================
function spinWheel() {

    if (isSpinning) return;
    isSpinning = true;

    // 🎧 START SOUND (FADE IN)
    fadeInSound(800);

    // 🎯 OPTIONAL TICK SYSTEM (UNCOMMENT IF NEEDED)
    /*
    tickInterval = setInterval(() => {
        if (tickSound) {
            tickSound.currentTime = 0;
            tickSound.play();
        }
    }, 200);
    */

    const spins = 15;
    const randomAngle = Math.floor(Math.random() * 360);

    currentRotation += (spins * 360) + randomAngle;

    wheel.style.transition = "transform 9s ease-out";
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // 🎧 FADE OUT BEFORE END (1.5s আগে)
    setTimeout(() => {
        fadeOutSound(1500);
    }, 7500);

    // 🛑 END OF SPIN
    setTimeout(() => {

        isSpinning = false;

        // stop tick if used
        if (tickInterval) {
            clearInterval(tickInterval);
        }

        console.log("Final Angle:", currentRotation % 360);

    }, 9000);
}

// ===============================
// 🎯 BUTTON EVENT
// ===============================
spinBtn.addEventListener("click", spinWheel);
