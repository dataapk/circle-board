 // ===============================
// 🪙 GLOBAL STATE (iGaming CORE)
// ===============================

const GameState = {
    chipSound: null,
    spinSound: null,
    selectedChip: null,
    selectedSymbol: null,
    bets: {},
    betHistory: []
};
// ===============================
// 🚀 SAFE GAME INIT
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

    console.log(
    "Selected Chip:",
    selectedChip
);
// START: PREMIUM SYMBOL ENGINE

const symbolBoxes =
document.querySelectorAll(
    ".symbol-box"
);

const tableSound =
new Audio(
    "assets/table.mp3"
);

tableSound.volume = 0.35;

let selectedSymbol = null;

symbolBoxes.forEach(box => {

    box.addEventListener(
        "click",
        () => {

            tableSound.currentTime = 0;

            tableSound.play();

            symbolBoxes.forEach(item => {
                item.classList.remove(
                    "active"
                );
            });

            box.classList.add(
                "active"
            );

            selectedSymbol =
            box.dataset.symbol;

            console.log(
                "Selected Symbol:",
                selectedSymbol
            );

        }
    );

});

// END: PREMIUM SYMBOL ENGINE
// START: BET MARKER

if(selectedChip){

    const oldMarker =
    box.querySelector(
        ".bet-marker"
    );

    if(oldMarker){

        oldMarker.remove();
    }

    const marker =
    document.createElement(
        "div"
    );

    marker.className =
    "bet-marker";

    marker.textContent =
    selectedChip;

    box.appendChild(
        marker
    );
}

// END: BET MARKER

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
            console.log("DEFAULT CHIP CLICK");

            container.classList.toggle(
                "expanded"
            );

            container.classList.toggle(
                "collapsed"
            );

        }
    );

    // CHIP BEHAVIUR

chips.forEach(chip => {

    chip.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            chips.forEach(c =>
                c.classList.remove("active")
            );

            chip.classList.add("active");

            selectedChip =
            chip.getAttribute("data-value");

            // UPDATE MAIN CHIP
if (
    !chip.classList.contains(
        "default-chip"
    )
) {

    const defaultImg =
    defaultChip.querySelector("img");

    const defaultText =
    defaultChip.querySelector("span");

    const selectedImg =
    chip.querySelector("img");

    const selectedText =
    chip.querySelector("span");

    // SWAP IMAGE
    const tempImg =
    defaultImg.src;

    defaultImg.src =
    selectedImg.src;

    selectedImg.src =
    tempImg;

    // SWAP TEXT
    const tempText =
    defaultText.textContent;

    defaultText.textContent =
    selectedText.textContent;

    selectedText.textContent =
    tempText;

    // SWAP VALUE
    const tempValue =
    defaultChip.getAttribute(
        "data-value"
    );

    defaultChip.setAttribute(
        "data-value",
        chip.getAttribute(
            "data-value"
        )
    );

    chip.setAttribute(
        "data-value",
        tempValue
    );
}

            // SOUND
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
            ) {

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
