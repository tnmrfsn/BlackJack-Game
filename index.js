let isAlive = false;
let hasBlackJack = false;
let isStarted = false;
let calledNewCard = false;
let sum = 0;
let message = "";
let player = {
  name: "Player",
  chips: 500,
};
let cards = [];
let images = [];
let temp = [];
function randomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  return randomNumber;
}
let cardNew = randomCard();

//access to DOM elements
let cardResult = document.getElementById("cardResult");
let sumEl = document.getElementById("sum-el");
let cardImages = document.getElementById("cardImages");
let messageEl = document.getElementById("message-el");
let playerName = document.getElementById("playerName");

function randomSuit() {
  let randomNumber = Math.floor(Math.random() * 4) + 1;
  return randomNumber;
}

function pushNewCard() {
  sum += cardNew;
  cards.push(cardNew);
}

function pushNewImage() {
  images.push(
    `<img src="card_images/${cardNew}_${randomSuit()}.png" alt="card${cardNew}_${randomSuit()}.png">  `
  );
}

//newCard is clicked by dead player.............
function startgameMessage() {
  message = "Please start the game first!";
  messageEl.textContent = message;
  images = [];
}

//Ending the game.............................
function gameOver() {
  images = [];
  calledNewCard = false;
  isAlive = false;
  hasBlackJack = false;
  isStarted = false;
}

//startGame funtion..............................
function startGame() {
  if (isAlive) {
    gameOver();
    console.log("startGame being alive"); //if player starts game after previous game new card but still alive.
  }
  console.log("startGame");
  isAlive = true;

  let firstCard = randomCard();
  let secondCard = randomCard();
  images.push(
    `<img src="card_images/${firstCard}_${randomSuit()}.png" alt="card${firstCard}_${randomSuit()}.png">  `
  );
  images.push(
    `<img src="card_images/${secondCard}_${randomSuit()}.png" alt="card${secondCard}_${randomSuit()}.png">  `
  );

  cards = [firstCard, secondCard];
  sum = firstCard + secondCard;

  renderGame();

  //cpoying images[] in temp[] before deleting
  temp = [...images];

  //deleting the images[] so that before every start it is empty
  isStarted = true;
  if (isStarted) images = [];
}

//renderGame function..................................
function renderGame() {
  //display in html
  cardResult.textContent = `Card: ${cards.join(",")}`;
  sumEl.textContent = `Sum: ${sum}`;
  cardImages.innerHTML = images.join(" ");
  playerName.textContent = `${player.name} : \$${player.chips}`;

  //checking the sum and udating message
  if (sum <= 20) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
    message = "You've got Blackjack!";
    hasBlackJack = true;
    isAlive = false;
    console.log("BlackJack!!!");
  } else {
    message = "You're out of the game!";
    isAlive = false;
    console.log("dead!!!");
  }

  //display message in html
  messageEl.textContent = message;
}

//newCard Function.........................................................
function newCard() {
  //is it the first new card of active player?
  if (calledNewCard && isAlive && !hasBlackJack) notFirstNewCard();
  else if (!calledNewCard && isAlive && !hasBlackJack) firstNewCard();
  else {
    console.log("newCard being dead");
    gameOver();
    startgameMessage();
  }

  //new card is called first time...........................................
  function firstNewCard() {
    console.log("firstNewCard");
    pushNewCard();
    images = [...temp]; //retrieving the original images[] from startGame()
    pushNewImage();
    calledNewCard = true;
    renderGame();
  }

  //new card is called multiple times.....................................
  function notFirstNewCard() {
    console.log("notFirstNewCard");
    pushNewCard();
    pushNewImage();
    calledNewCard = true;
    renderGame();
  }
}
