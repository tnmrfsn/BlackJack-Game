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
//As I am pushing in images in start function,
//images[] must be cleared or everytime I call startGame() it will keep growing.
//But if I clear images[] in startGame(), then newCard() will get an emty image array;
//so before clearing images[], it is copied in temp[]
//and in newCard() it is copied back into images

//getting access to DOM elements
let cardResult = document.getElementById("cardResult");
let sumEl = document.getElementById("sum-el");
let cardImages = document.getElementById("cardImages");
let messageEl = document.getElementById("message-el");
let playerName = document.getElementById("playerName");

function randomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  return randomNumber;
}
let cardNew = randomCard();

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

//when newCard is clicked by notAlive player.............
function startgameMessage() {
  message = "Please start the game first!";
  messageEl.textContent = message;
  images = [];
}

//Ending the game.............................
function setInitialValues() {
  images = [];
  calledNewCard = false;
  isAlive = false;
  hasBlackJack = false;
  isStarted = false;
}

//startGame funtion..............................
function startGame() {
  if (isAlive) {
    setInitialValues();
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

  //cpoying images[] in temp[] using spread operator before deleting
  temp = [...images];

  //deleting the images[] so that before every start it is empty
  isStarted = true;
  if (isStarted) images = [];
}

//renderGame function..................................
function renderGame() {
  //displaying cardResult, sum and cardImage in html
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

  //displaying the message in html
  messageEl.textContent = message;
}

//newCard Function.........................................................
function newCard() {
  //checking if it is the first new card of active player
  if (calledNewCard && isAlive && !hasBlackJack) notFirstNewCard();
  else if (!calledNewCard && isAlive && !hasBlackJack) firstNewCard();
  else {
    console.log("newCard being dead");
    setInitialValues();
    startgameMessage();
  }
  //If new card is called first time...........................................
  function firstNewCard() {
    console.log("firstNewCard");
    pushNewCard();
    images = [...temp]; //retrieving the original images[] from startGame()
    pushNewImage();
    calledNewCard = true;
    renderGame();
  }

  //When new card is called multiple times.....................................
  function notFirstNewCard() {
    console.log("notFirstNewCard");
    pushNewCard();
    pushNewImage();
    calledNewCard = true;
    renderGame();
  }
}
