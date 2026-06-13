const chipSound = document.getElementById("chipSound");

document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {

        if (chipSound) {
            chipSound.currentTime = 0;
            chipSound.play();
        }

    });
});
