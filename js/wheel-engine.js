
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
    5400 +
  Math.floor(Math.random() * 360);

    currentRotation =
    currentRotation + extraRotation;

    wheel.style.transition =
     "transform 8s ease-out";

    wheel.style.transform =
    `rotate(${currentRotation}deg)`;

    setTimeout(()=>{

        isSpinning = false;

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
