const canvas = document.getElementById("wheelCanvas");

if (canvas) {

    const ctx = canvas.getContext("2d");

    const totalSegments = 18;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const radius = 320;

    function drawWheel() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        const angle =
        (Math.PI * 2) / totalSegments;

        for (let i = 0; i < totalSegments; i++) {

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

            ctx.fillStyle =
            i % 2 === 0
            ? "#D4AF37"
            : "#333";

            ctx.fill();

            ctx.lineWidth = 3;

            ctx.strokeStyle = "#fff";

            ctx.stroke();
        }

        // Outer Gold Ring

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius + 10,
            0,
            Math.PI * 2
        );

        ctx.lineWidth = 12;

        ctx.strokeStyle = "#FFD700";

        ctx.stroke();
        // START: OUTER SHADOW RING
        ctx.beginPath();

ctx.arc(
    centerX,
    centerY,
    radius + 22,
    0,
    Math.PI * 2
);

ctx.lineWidth = 14;

ctx.strokeStyle = "#6b4f00";

ctx.stroke();
        

        // Center Hub

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            70,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#111";

        ctx.fill();
    }

    drawWheel();
}
