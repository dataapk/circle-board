
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

// END: ENGINE SETUP
// START: SPIN FUNCTION

function spinWheel(){

    if(isSpinning){
        return;
    }

    isSpinning = true;

    const extraRotation =

    7200 +

    Math.floor(
        Math.random() * 360
    );

    currentRotation +=
    extraRotation;

    wheel.style.transformOrigin = "center center";

wheel.style.transition =
"transform 10s ease-out";

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

    },10000);

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
