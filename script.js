function createTimerCard() {
    const timerCard = document.createElement("div");
    timerCard.className = "timer-card"

    const innerContainer = document.createElement("div");
    innerContainer.className = "card-inner-container";

    const cardTitlte = document.createElement("div");
    cardTitlte.className = "card-title";
    cardTitlte.innerText = "Time left";

    const timerValueContainer = document.createElement("div");
    timerValueContainer.className = "timer-value-container";
    const hoursContainer = document.createElement("div");
    hoursContainer.className = "hours";

    const separator = document.createElement("div"); separator.innerText = ":"; separator.className = "separator";

    const minsContainer = document.createElement("div");
    minsContainer.className = "minutes";

    const secContainer = document.createElement("div");
    secContainer.className = "seconds";
    timerValueContainer.append(hoursContainer, separator, minsContainer, separator.cloneNode(true), secContainer);

    const cardButton = document.createElement("button");
    cardButton.innerText = "Stop";

    innerContainer.append(cardTitlte, timerValueContainer, cardButton);

    timerCard.appendChild(innerContainer);

    return timerCard.cloneNode(true);

}

const form = document.querySelector(".set-timer-container >.timer-card >.card-inner-container");

const currentTimersSection = document.querySelector(".current-timers-section");

const cardsArray = [];
let timeCardID = 1;


form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (form.hours.value === '' && form.minutes.value === '' && form.seconds.value === '') {
        alert("Please select a value more than 0");
        return;
    }

    const newCard = createTimerCard();
    const valueContainer = newCard.querySelector(".timer-value-container");

    newCard.id = `time-card-${timeCardID}`;

    cardsArray[timeCardID] = {
        h: form.hours.value === '' ? 0 : Number(form.hours.value),
        hours: valueContainer.querySelector(".hours"),

        m: form.minutes.value === '' ? 0 : Number(form.minutes.value),
        minutes: valueContainer.querySelector(".minutes"),

        s: form.seconds.value === '' ? 0 : Number(form.seconds.value),
        seconds: valueContainer.querySelector(".seconds")
    }
    const milliSecTime = (cardsArray[timeCardID].h * 3600 + cardsArray[timeCardID].m * 60 + cardsArray[timeCardID].s) * 1000;

    const cardObj = cardsArray[timeCardID];
    cardObj.hours.innerText = cardObj.h / 10 >= 1 ? (cardObj.h) : ("0" + cardObj.h);
    cardObj.minutes.innerText = cardObj.m / 10 >= 1 ? cardObj.m : `0${cardObj.m}`;
    cardObj.seconds.innerText = cardObj.s / 10 >= 1 ? cardObj.s : ("0" + cardObj.s);

    cardsArray[timeCardID].cardNode = newCard;

    let tempId = timeCardID;

    currentTimersSection.appendChild(newCard);
    hidePlaceHolder();

    const intervalId = setInterval(() => {
        countdown(cardsArray[tempId]);
    }, 1000);
    cardsArray[timeCardID].intervalId = intervalId;


    const cardButton = newCard.querySelector(".card-inner-container >button");

    cardButton.setAttribute("data-forCard", `${timeCardID}`)

    cardButton.addEventListener("click", buttonFunctionality);

    timeCardID++;

});

function countdown(cardObj) {
    cardObj.s--;

    if ((cardObj.s === -1 || cardObj.s === 0) && cardObj.m === 0 && cardObj.h === 0) {
        cardObj.seconds.innerText = 0;
        countdownStopped(cardObj.cardNode);
        clearInterval(cardObj.intervalId);
    }

    if (cardObj.s == -1) {
        cardObj.s = 59;
        cardObj.m--;

        if (cardObj.m == -1) {
            cardObj.m = 59;

            cardObj.h--;

            if (cardObj.h == -1) {
                cardObj.h = 0;
                console.error("stop countdown");
                clearInterval(cardObj.intervalId);
                countdownStopped(cardObj.cardNode);
            }
            cardObj.hours.innerText = cardObj.h / 10 >= 1 ? (cardObj.h) : ("0" + cardObj.h);
        }
        cardObj.minutes.innerText = cardObj.m / 10 >= 1 ? cardObj.m : `0${cardObj.m}`;

    }
    cardObj.seconds.innerText = cardObj.s / 10 >= 1 ? cardObj.s : ("0" + cardObj.s);
}

function buttonFunctionality(event) {

    const cardNode = event.target.parentElement.parentElement;
    const cardNodeIndex = cardNode.id.slice(cardNode.id.lastIndexOf('-') + 1);

    console.log(cardsArray[cardNodeIndex]);

    if (event.target.innerText === "Stop") {
        clearInterval(cardsArray[cardNodeIndex].intervalId);
        event.target.innerText = "Delete";
    }
    else if (event.target.innerText === "Delete") {

        cardNode.remove();

        delete cardsArray[cardNodeIndex];
    }


    if (currentTimersSection.childElementCount === 2) {
        currentTimersSection.querySelector(".current-timers-placeholder").classList.toggle("hide");
    }
}

const timeUpBell = document.createElement("audio");
timeUpBell.src = "./time-up-ding.mp3"
timeUpBell.preload;

function countdownStopped(cardNode) {
    timeUpBell.play();

    // console.log("timer up for:", cardNode);
    cardNode.classList.add("timer-up");


    const innerContainer = cardNode.querySelector(".card-inner-container");
    innerContainer.querySelector(".card-title").style.visibility = "hidden";

    const timerValueContainer = innerContainer.querySelector(".timer-value-container");
    timerValueContainer.remove();

    const timeUpBanner = document.createElement("div");
    timeUpBanner.innerText = "Time Is Up !"
    timeUpBanner.className = "time-up-banner";

    const button = cardNode.querySelector("button");
    button.innerText = 'Delete';

    console.info('button text: ', button);

    innerContainer.insertBefore(timeUpBanner, button);

    timeUpBell.load;

}

function hidePlaceHolder() {
    if (!currentTimersSection.querySelector(".current-timers-placeholder").classList.contains("hide")) {
        currentTimersSection.querySelector(".current-timers-placeholder").classList.add("hide");
    }
}