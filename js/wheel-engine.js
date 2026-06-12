// START: PREMIUM WHEEL ENGINE

const canvas =
document.getElementById(
    "wheelCanvas"
);

if(canvas){

const ctx =
canvas.getContext("2d");

const totalSegments = 18;

const centerX =
canvas.width / 2;

const centerY =
canvas.height / 2;

const radius = 320;

// START: PREMIUM COLOR SYSTEM

const segmentColors = [

"#FF4D4D",

"#4D79FF",

"#33CC66",

"#FF9933",

"#CC66FF",

"#00CCCC",

"#FFD700",

"#FF66B2"

];

// END: PREMIUM COLOR SYSTEM

function drawWheel(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

const angle =
(Math.PI * 2) /
totalSegments;

for(
let i=0;
i<totalSegments;
i++
){

ctx.beginPath();

ctx.moveTo(
centerX,
centerY
);

ctx.arc(
centerX,
centerY,
radius,
angle * i,
angle * (i + 1)
);

ctx.closePath();

// START: SEGMENT INSET SHADOW

const gradient =
ctx.createLinearGradient(

centerX,
centerY - radius,

centerX,
centerY + radius

);

gradient.addColorStop(
0,
"#ffffff55"
);

gradient.addColorStop(
0.25,
segmentColors[
i %
segmentColors.length
]
);

gradient.addColorStop(
0.75,
segmentColors[
i %
segmentColors.length
]
);

gradient.addColorStop(
1,
"#00000055"
);

ctx.fillStyle =
gradient;

ctx.fill();

// END: SEGMENT INSET SHADOW
    // START: INNER SHADOW EDGE

ctx.save();

ctx.strokeStyle =
"rgba(0,0,0,0.25)";

ctx.lineWidth = 8;

ctx.stroke();

ctx.restore();

// END: INNER SHADOW EDGE

// END: DOUBLE GOLD RING

}

// END: FOR LOOP

}

// END: DRAW WHEEL FUNCTION

drawWheel();

}

// END: PREMIUM WHEEL ENGINE
