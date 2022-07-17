// get query paramaters from form
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let numPics = params.numPics; // "some_value"
let difficultyLevel = params.difficulty; // "some_value"

// create board and cards
(function createBoard() {
  let board = document.querySelector(".memory-game");
  // resize board for more pics
  // calculated by numPics/2 * 160
  if (numPics == 10) {
    board.style.width = "800px";
  } else if (numPics == 12) {
    board.style.width = "960px";
  }
  for (let picNum = 1; picNum <= numPics; picNum++) {
    for (let i = 0; i < 2; i++) {
      // create memory card div
      const card = document.createElement("div");
      card.classList.add("memory-card");
      card.classList.add("flip");
      card.classList.add("numPics-" + numPics);

      card.dataset.name = picNum;

      // create front img
      const imgFront = document.createElement("img");
      imgFront.classList.add("front-face");
      imgFront.src = "./img/" + picNum + ".jpeg";

      // create back img
      const imgBack = document.createElement("img");
      imgBack.classList.add("back-face");
      imgBack.src = "./img/space-dandy.jpeg";

      // add images to div
      card.appendChild(imgFront);
      card.appendChild(imgBack);

      // add card to board
      board.appendChild(card);
    }
  }
})();

// get cards
const cards = document.querySelectorAll(".memory-card");
// get timer
let timer = document.querySelector("#time");

// define global variables
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let gameTime = numPics * 15;
let gameTimer;
let gameWon = false;

function startTimer(duration, display) {
  let timer = duration,
    minutes,
    seconds;
  let gameTimer = setInterval(function () {
    // minutes = parseInt(timer / 60, 10);
    // seconds = parseInt(timer % 60, 10);

    // minutes = minutes < 10 ? "0" + minutes : minutes;
    // seconds = seconds < 10 ? "0" + seconds : seconds;

    // display.textContent = minutes + ":" + seconds;
    display.textContent = timer;

    if (--timer < 0) {
      clearInterval(gameTimer);
      endGame();
    }
  }, 1000);
  // return timer handle
  return gameTimer;
}
function flipCard() {
  if (lockBoard) return;
  this.classList.add("flip");

  if (!hasFlippedCard) {
    // first flip
    hasFlippedCard = true;
    firstCard = this;

    return;
  }
  // second flip
  secondCard = this;
  if (secondCard != firstCard) {
    checkMatch();
    setTimeout(() => checkIfWon(), 2000);
  }
}
function checkMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}
function disableCards() {
  //   firstCard.removeEventListener("click", flipCard);
  //   secondCard.removeEventListener("click", flipCard);
  lockBoard = true;
  setTimeout(() => {
    firstCard.style.visibility = "hidden";
    secondCard.style.visibility = "hidden";
    resetBoard();
  }, 1500);
}
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}
function checkIfWon() {
  // check if all cards are disabled
  let numHidden = 0;
  cards.forEach((card) => {
    if (card.style.visibility == "hidden") {
      numHidden++;
    }
  });
  gameWon = numHidden == numPics * 2;
  if (gameWon) endGame();
  return gameWon;
}
function endGame() {
  // remove all pics
  cards.forEach((card) => {
    card.remove();
  });

  let board = document.querySelector(".memory-game");
  board.style.display = "block";
  let content = document.createElement("div");
  content.classList.add("content");
  content.style.alignItems = "center";
  board.appendChild(content);
  if (gameWon) {
    // stop timer
    clearInterval(gameTimer);
    winGame(content);
  } else {
    loseGame(content);
  }

  // add play again button to board
  const playAgain = document.createElement("button");
  playAgain.classList.add("play-button");
  playAgain.style.position = "initial";
  const gameLink = document.createElement("a");
  gameLink.href = "./game-home.html";
  gameLink.textContent = "Play Again";
  playAgain.appendChild(gameLink);
  content.appendChild(playAgain);
}
function winGame(parentDiv) {
  // win game animation
  // create memory card div
  const winDiv = document.createElement("h1");
  winDiv.classList.add("game-over");

  winDiv.textContent = "🎉🎊 You Win!!! 🎊🎉";

  // add div to parentDiv
  parentDiv.appendChild(winDiv);
}
function loseGame(parentDiv) {
  // lose game animation

  // create memory card div
  const loseDiv = document.createElement("h1");
  loseDiv.classList.add("game-over");
  loseDiv.textContent = "You Lose";

  // add div to parentDiv
  parentDiv.appendChild(loseDiv);
}

(function shuffleCards() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 16);
    card.style.order = randomPos;
  });
})();
cards.forEach((card) => card.addEventListener("click", flipCard));

// to start, all cards are visible for certain time limit
// then they are flipped, starting the game
(function startGame() {
  timer.textContent = gameTime;
  setTimeout(() => {
    cards.forEach((card) => card.classList.toggle("flip"));
    // start timer
    gameTimer = startTimer(gameTime, timer);
  }, difficultyLevel * 1000);
})();
