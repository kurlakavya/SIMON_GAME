/* VARIABLES & ELEMENTS */

let order = [];
let playerOrder = [];
let flash = 0;
let turn = 1;
let good = true;
let compTurn = false;5
let intervalId;
let strict = false;
let noise = true;
let on = false;
let win = false;

const turnCounter = document.querySelector("#turn");
const topLeft = document.querySelector("#topleft");
const topRight = document.querySelector("#topright");
const bottomLeft = document.querySelector("#bottomleft");
const bottomRight = document.querySelector("#bottomright");
const strictButton = document.querySelector("#strict");
const onButton = document.querySelector("#on");
const startButton = document.querySelector("#start");

/* EVENT LISTENERS */

strictButton.addEventListener("click", () => {
  strict = strictButton.checked;
});

onButton.addEventListener("click", () => {
  on = onButton.checked;

  if (on) {
    turnCounter.textContent = "-";
  } else {
    turnCounter.textContent = "";
    clearColor();
    clearInterval(intervalId);
  }
});

startButton.addEventListener("click", () => {
  if (on) play();
});

/* GAME LOGIC */

function play() {
  win = false;
  order = [];
  playerOrder = [];
  flash = 0;
  turn = 1;
  good = true;

  turnCounter.textContent = turn;

  for (let i = 0; i < 20; i++) {
    order.push(Math.floor(Math.random() * 4) + 1);
  }

  compTurn = true;
  intervalId = setInterval(gameTurn, 800);
}

function gameTurn() {
  on = false;

  if (flash === turn) {
    clearInterval(intervalId);
    compTurn = false;
    clearColor();
    on = true;
    flash = 0;
  }

  if (compTurn) {
    clearColor();
    setTimeout(() => {
      playSound(order[flash]);
      flash++;
    }, 200);
  }
}

/* SOUND & COLORS */

function playSound(num) {
  if (!noise) return;

  const sounds = {
    1: ["clip1", topLeft, "lightgreen"],
    2: ["clip2", topRight, "tomato"],
    3: ["clip3", bottomLeft, "yellow"],
    4: ["clip4", bottomRight, "lightskyblue"]
  };

  const [clipId, element, color] = sounds[num];
  document.getElementById(clipId).play();
  element.style.backgroundColor = color;
}

function clearColor() {
  topLeft.style.backgroundColor = "darkgreen";
  topRight.style.backgroundColor = "darkred";
  bottomLeft.style.backgroundColor = "goldenrod";
  bottomRight.style.backgroundColor = "darkblue";
}

function flashColor() {
  topLeft.style.backgroundColor = "lightgreen";
  topRight.style.backgroundColor = "tomato";
  bottomLeft.style.backgroundColor = "yellow";
  bottomRight.style.backgroundColor = "lightskyblue";
}

/* PLAYER INPUT */

[topLeft, topRight, bottomLeft, bottomRight].forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (!on) return;

    playerOrder.push(index + 1);
    playSound(index + 1);
    check();

    if (!win) {
      setTimeout(clearColor, 300);
    }
  });
});

/* CHECK LOGIC */

function check() {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1]) {
    good = false;
  }

  if (playerOrder.length === 20 && good) {
    winGame();
    return;
  }

  if (!good) {
    flashColor();
    turnCounter.textContent = "NO!";
    noise = false;

    setTimeout(() => {
      clearColor();
      turnCounter.textContent = turn;
      noise = true;

      if (strict) {
        play();
      } else {
        playerOrder = [];
        good = true;
        compTurn = true;
        intervalId = setInterval(gameTurn, 800);
      }
    }, 800);
    return;
  }

  if (playerOrder.length === turn) {
    turn++;
    playerOrder = [];
    compTurn = true;
    turnCounter.textContent = turn;
    intervalId = setInterval(gameTurn, 800);
  }
}

/* WIN */

function winGame() {
  flashColor();
  turnCounter.textContent = "WIN!";
  on = false;
  win = true;
}
