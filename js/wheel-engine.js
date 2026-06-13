
// START: PREMIUM PNG WHEEL ENGINE
const spinSound = document.getElementById("spinSound");

const wheel =
document.getElementById(
    "wheel"
);

const spinBtn =
document.getElementById(
    "spinBtn"
);

let isSpinning = false;

let currentRotation = 0;

// END: ENGINE SETUP
// START: PROFESSIONAL SPIN FUNCTION

function spinWheel(){

    if(isSpinning){
        return;
    }

    isSpinning = true;

    // 🔊 START SOUND
    spinSound.volume = 1;
    spinSound.currentTime = 0;
    spinSound.play();

    const spins = 15;

    const randomAngle =
        Math.floor(Math.random() * 360);

    currentRotation += (spins * 360) + randomAngle;

    wheel.style.transition = "transform 9s ease-out";
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // 🎯 SOUND FADE BEFORE STOP (1.5s আগে fade শুরু)
    setTimeout(() => {
        fadeOutSound(1500);
    }, 7500); // 9s - 1.5s

    // 🛑 END
    setTimeout(() => {

        isSpinning = false;

        console.log("Final Angle:", currentRotation % 360);

    }, 9000);
}

// END: PROFESSIONAL SPIN FUNCTION


// START: BUTTON EVENT

if(spinBtn){

    spinBtn.addEventListener(
        "click",
        spinWheel
    );

}

// END: BUTTON EVENT


// END: PREMIUM PNG WHEEL ENGINE
