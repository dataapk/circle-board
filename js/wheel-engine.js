const canvas =
document.getElementById("wheelCanvas");

const ctx =
canvas.getContext("2d");

const totalSegments = 18;

const centerX =
canvas.width / 2;

const centerY =
canvas.height / 2;

const radius = 350;

function drawWheel(){

    const angle =
    (Math.PI * 2) / totalSegments;

    for(let i=0;i<totalSegments;i++){
// =========================
    // 3. Center Inner Circle
    // =========================
        ctx.beginPath();

ctx.arc(
 centerX,
 centerY,
 90,
 0,
 Math.PI*2
);

ctx.fillStyle="#FFD700";

ctx.fill();

ctx.lineWidth = 6;

ctx.strokeStyle="#FFF";

ctx.stroke();

// =========================
    // 4. Center Inner Circle
    // =========================

ctx.beginPath();

ctx.arc(
 centerX,
 centerY,
 55,
 0,
 Math.PI*2
);

ctx.fillStyle="#111";

ctx.fill();
// =========================
    // 1. Outer Golden Ring
    // =========================
ctx.beginPath();

ctx.arc(
    centerX,
    centerY,
    radius + 15,
    0,
    Math.PI * 2
);

ctx.lineWidth = 20;

ctx.strokeStyle = "#FFD700";

ctx.stroke();
// =========================
    // 2. Second Ring
    // =========================
ctx.beginPath();

ctx.arc(
    centerX,
    centerY,
    radius - 5,
    0,
    Math.PI * 2
);

ctx.lineWidth = 8;

ctx.strokeStyle = "#B8860B";

ctx.stroke();


