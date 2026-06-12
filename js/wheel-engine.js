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

// START: 3D SEGMENT GRADIENT

const gradient =
ctx.createRadialGradient(

centerX,
centerY,
60,

centerX,
centerY,
radius

);

gradient.addColorStop(
0,
"#ffffff"
);

gradient.addColorStop(
0.15,
segmentColors[
i %
segmentColors.length
]
);

gradient.addColorStop(
1,
"#111111"
);

ctx.fillStyle =
gradient;

ctx.fill();

// END: 3D SEGMENT GRADIENT

ctx.fill();

ctx.lineWidth = 3;

ctx.strokeStyle =
"#ffffff";

ctx.stroke();

}

// START: OUTER GOLD RING

ctx.beginPath();

ctx.arc(
centerX,
centerY,
radius + 10,
0,
Math.PI * 2
);

ctx.lineWidth = 12;

ctx.strokeStyle =
"#FFD700";

ctx.stroke();

// END: OUTER GOLD RING

}

// START: DRAW WHEEL

drawWheel();

// END: DRAW WHEEL

}

// END: PREMIUM WHEEL ENGINE
