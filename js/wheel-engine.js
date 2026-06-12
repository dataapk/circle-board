// START: PREMIUM PNG WHEEL ENGINE

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

// START: SPIN FUNCTION

function spinWheel(){

    if(isSpinning){
        return;
    }

    isSpinning = true;

    const extraRotation =

        3600 +

        Math.floor(
            Math.random() * 360
        );

    currentRotation +=
    extraRotation;

    wheel.style.transformOrigin = "center center";

wheel.style.transition =
"transform 6s cubic-bezier(0.17,0.67,0.12,0.99)";

wheel.style.transform =
`rotate(${currentRotation}deg)`;

    setTimeout(()=>{

        isSpinning = false;

        const finalAngle =

        currentRotation % 360;

        console.log(
            "Final Angle:",
            finalAngle
        );

    },6000);

}

// END: SPIN FUNCTION


// START: BUTTON EVENT

if(spinBtn){

    spinBtn.addEventListener(
        "click",
        spinWheel
    );

}

// END: BUTTON EVENT


// END: PREMIUM PNG WHEEL ENGINE
