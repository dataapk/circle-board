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

        ctx.beginPath();

        ctx.moveTo(centerX,centerY);

        ctx.arc(
            centerX,
            centerY,
            radius,
            angle*i,
            angle*(i+1)
        );

        ctx.closePath();

        ctx.fillStyle =
        i % 2 === 0
        ? "#D4AF37"
        : "#444";

        ctx.fill();

        ctx.lineWidth = 4;

        ctx.strokeStyle =
        "#fff";

        ctx.stroke();

    }

    // Center Circle

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        80,
        0,
        Math.PI*2
    );

    ctx.fillStyle =
    "#111";

    ctx.fill();

}

drawWheel();
