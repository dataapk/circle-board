
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

    const spins = 15;

    const randomAngle =
    Math.floor(Math.random() * 360);

    currentRotation +=
    (spins * 360) + randomAngle;

    wheel.style.transition =
    "transform 9s ease-out";

    wheel.style.transform =
    `rotate(${currentRotation}deg)`;

    setTimeout(() => {

        isSpinning = false;

        console.log(
            "Final Angle:",
            currentRotation % 360
        );

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
