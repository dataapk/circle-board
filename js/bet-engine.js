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

            if (selectedChip) {

                const chipValue =
                parseFloat(selectedChip);

                if (!bets[selectedSymbol]) {

                    bets[selectedSymbol] = {
                        total: 0,
                        chips: []
                    };

                }

                bets[selectedSymbol].total += chipValue;

                betHistory.push({
                    symbol: selectedSymbol,
                    amount: chipValue
                });

                bets[selectedSymbol].chips.push(selectedChip);

                let marker =
                box.querySelector(".bet-marker");

                if (!marker) {

                    marker =
                    document.createElement("div");

                    marker.className =
                    "bet-marker";

                    box.appendChild(marker);
                }

                marker.innerHTML = `
<div class="bet-total">
    $${bets[selectedSymbol].total.toFixed(2)}
</div>

<div class="chip-stack"></div>
`;

                const chipStack =
                marker.querySelector(".chip-stack");

                chipStack.innerHTML = "";

                const visibleChips =
                bets[selectedSymbol].chips.slice(-4);

                visibleChips.forEach((chipValue, index) => {

                    const chipImg =
                    document.createElement("img");

                    chipImg.src =
                    chipMap[chipValue];

                    chipImg.className =
                    "stack-chip";

                    chipImg.style.zIndex =
                    index + 1;

                    chipImg.style.bottom =
                    `${index * 8}px`;

                    chipStack.appendChild(chipImg);

                });

            }

            // END: PROFESSIONAL BET STORAGE

            console.log(
                "Selected Symbol:",
                selectedSymbol
            );

        }
    );

}); // ✅ FIXED: THIS WAS MISSING BEFORE

// END: PREMIUM TABLE SYMBOL ENGINE
