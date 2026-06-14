// ===============================
// 🪙 GLOBAL STATE (iGaming CORE)
// ===============================

let chipSound = null;
let selectedChip = null;
// ===============================
// 🎯 BET STORAGE
// ===============================

const bets = {};

const betHistory = [];
const chipMap = {

    "0.10":
    "assets/chip_0.10c.png",

    "0.20":
    "assets/chip_20c.png",

    "0.50":
    "assets/chip_50c.png",

    "1":
    "assets/chip_1.png",

    "2":
    "assets/chip_2.png",

    "5":
    "assets/chip_5.png"
};

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
// START: PREMIUM TABLE SYMBOL ENGINE

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
    
// START: PROFESSIONAL BET STORAGE

if(selectedChip){

    const chipValue =
    parseFloat(
        selectedChip
    );

    if(
        !bets[selectedSymbol]
    ){

        bets[selectedSymbol] = {

            total: 0,

            chips: []

        };
    }

    bets[
        selectedSymbol
    ].total += chipValue;

    betHistory.push({

        symbol:
        selectedSymbol,

        amount:
        chipValue

    });

    bets[
        selectedSymbol
    ].chips.push(
        selectedChip
    );

    let marker =
    box.querySelector(
        ".bet-marker"
    );

    if(!marker){

        marker =
        document.createElement(
            "div"
        );

        marker.className =
        "bet-marker";

        box.appendChild(
            marker
        );
    }

    marker.innerHTML =

`
<div class="bet-total">

    $
    ${
        bets[
            selectedSymbol
        ].total.toFixed(2)
    }

</div>

<div class="chip-stack">

</div>
`;
    const chipStack =

marker.querySelector(
    ".chip-stack"
);

chipStack.innerHTML = "";
    const visibleChips =

bets[
    selectedSymbol
]
.chips
.slice(-4);
    visibleChips.forEach(

    (
        chipValue,
        index
    ) => {

        const chipImg =

        document.createElement(
            "img"
        );

        chipImg.src =
        chipMap[
            chipValue
        ];

        chipImg.className =
        "stack-chip";

        chipImg.style.zIndex =
        index + 1;

        chipImg.style.bottom =
        `${index * 8}px`;

        chipStack.appendChild(
            chipImg
        );

    }

);

// END: PROFESSIONAL BET STORAGE

            console.log(
                "Selected Symbol:",
                selectedSymbol
            );

        }
    );


// END: PREMIUM SYMBOL ENGINE
