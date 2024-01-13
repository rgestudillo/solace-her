

// Your original logic, updated for new class and name attributes
let coin = document.querySelector(".coin");
let flipBtn = document.querySelector("#flip-button");
let winner;
let girlSelection;


flipBtn.addEventListener("click", () => {
    let i = Math.floor(Math.random() * 2);
    coin.style.animation = "none";
    document.querySelector("#winner").textContent = " ";
    girlSelection = document.querySelector('input[name="girl"]:checked');
    if (girlSelection == null) {
        document.querySelector("#winner").textContent = `Please select Heads or Tails`;
    } else {
        if (i) {
            setTimeout(function () {
                coin.style.animation = "spin-heads 3s forwards";
            }, 100);
            if (girlSelection.value == 'Heads') {
                winner = "You Win!";
            } else {
                winner = "You Lose";
            }
        } else {
            setTimeout(function () {
                coin.style.animation = "spin-tails 3s forwards";
            }, 100);
            if (girlSelection.value == 'Tails') {
                winner = "You Win!";
            } else {
                winner = "You Lose";
            }
        }

        // if(boySelection.value == 'Heads'){
        //     setTimeout(function () {
        //         coin.style.animation = "spin-heads 3s forwards";
        //     }, 100);
        //     winner = document.querySelector(".boy label").textContent;
        // }else{
        //     setTimeout(function () {
        //         coin.style.animation = "spin-tails 3s forwards";
        //     }, 100);
        //     winner = document.querySelector(".boy label").textContent;
        // }

        setTimeout(updateStats, 3000);
        disableButton();
    }
});

function updateStats() {
    document.querySelector("#winner").textContent = `${winner}`;
    if (winner === "You Win!") {
        winnerElement.style.color = "green";
    } else {
        winnerElement.style.color = "red";
    }
}

function disableButton() {
    flipBtn.disabled = true;
    setTimeout(function () {
        flipBtn.disabled = false;
    }, 3000);
}

