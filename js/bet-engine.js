// ===============================
// 🪙 GLOBAL STATE (iGaming CORE)
// ===============================

let chipSound = null;
let selectedChip = null;

// ===============================
// 🚀 SAFE INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    chipSound = document.getElementById("chipSound");
    spinSound = document.getElementById("spinSound");

    if (chipSound) {

    console.log("Chip Clicked");
    console.log(chipSound);

    chipSound.currentTime = 0;
    chipSound.play().catch(() => {});

    }
    if (spinSound) {
        spinSound.volume = 0.7;
    }

    initChipSystem();

    console.log("🎰 Chip System Ready");

});

// ===============================
// 🪙 CHIP SYSTEM
// ===============================
function initChipSystem() {

    const container =
    document.querySelector(".chips-container");

    const chips =
    document.querySelectorAll(".chip");

    const defaultChip =
    document.querySelector(".default-chip");

    if (!container) return;

    // DEFAULT CHIP OPEN/CLOSE

    defaultChip.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            container.classList.toggle(
                "expanded"
            );

            container.classList.toggle(
                "collapsed"
            );

        }
    );

    // CHIP SELECT

    chips.forEach(chip => {

        chip.addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                chips.forEach(c =>
                    c.classList.remove(
                        "active"
                    )
                );

                chip.classList.add(
                    "active"
                );

                selectedChip =
                chip.getAttribute(
                    "data-value"
                );

                if (chipSound) {

                    chipSound.currentTime = 0;

                    chipSound.play()
                    .catch(() => {});
                }

                // AUTO CLOSE

                if (
                    !chip.classList.contains(
                        "default-chip"
                    )
                ){

                    container.classList.remove(
                        "expanded"
                    );

                    container.classList.add(
                        "collapsed"
                    );
                }

            }
        );

    });

    // OUTSIDE CLICK CLOSE

    document.addEventListener(
        "click",
        () => {

            container.classList.remove(
                "expanded"
            );

            container.classList.add(
                "collapsed"
            );

        }
    );

}
