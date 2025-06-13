let isAlive = false;
let hasBlackJack = false;
let isStarted = false;
let calledNewCard = false;
let sum = 0;
let message = "";

let cards = [];
let images = [];
let temp1 = [];
let temp2 = []; //As I am pushing in images in start function,
//images[] must be cleared or everytime I call startGame() it will keep growing.
//But if I clear images[] in startGame(), then newCard() will get an emty array
//so before clearing images[], it is copied in temp1[]
//and in newCard() it is copied back into images

//getting access to DOM elements
let cardResult = document.getElementById("cardResult");
let sumEl = document.getElementById("sum-el");
let cardImages = document.getElementById("cardImages");
let messageEl = document.getElementById("message-el");

//function for generating random number from 1 to 13 for card numbers.........................

function randomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  return randomNumber;
}
let cardNew = randomCard();

//function for generating random numbers 1 to 4 for suit for image names.........................
function randomSuit() {
  let randomNumber = Math.floor(Math.random() * 4) + 1;
  return randomNumber;
}

function pushNewCard() {
  sum += cardNew;
  cards.push(cardNew); //pushing third card in cards
}

function pushNewImage() {
  //pushing new card image in images
  images.push(
    `<img src="card_images/${cardNew}_${randomSuit()}.png" alt="card${cardNew}_${randomSuit()}.png">  `
  );
}

//displaying message when newCard is clicked by notAlive player.............
function startgameMessage() {
  message = "Please start the game first!";
  messageEl.textContent = message;
  images = [];
}

//Ending the game by deleting images[] and setting calledNewCard false.......
function endingGame() {
  images = [];
  calledNewCard = false;
}

//startGame funtion..............................
function startGame() {
  if (isAlive) endingGame();

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
  isAlive = true;
}

//renderGame function..................................
function renderGame() {
  //displaying cardResult, sum and cardImage in html
  cardResult.textContent = `Card: ${cards.join(",")}`;
  sumEl.textContent = `Sum: ${sum}`;
  cardImages.innerHTML = images.join(" ");

  //checking the sum and udating message
  if (sum <= 20) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
    message = "You've got Blackjack!";
    hasBlackJack = true;
    isAlive = false;
  } else {
    message = "You're out of the game!";
    isAlive = false;
  }

  //displaying the message in html
  messageEl.textContent = message;
}

//newCard Function.........................................................
function newCard() {
  //checking if it is the first new card of active player
  if (calledNewCard && isAlive) notFirstNewCard();
  else firstNewCard();

  //If new card is called first time...........................................
  function firstNewCard() {
    if (isAlive === true && hasBlackJack === false) {
      pushNewCard();
      images = [...temp]; //retrieving the original images[] from startGame()
      pushNewImage();
      temp2 = [...images]; //saving the images in temp2[] for multiple new card

      calledNewCard = true; //tracking if it is the first new card.
      renderGame();

      if (isAlive === false) endingGame();
    }
    //If player tried new card without starting new game
    else if (isAlive === false) startgameMessage();
  }

  //When new card is called multiple times.....................................
  function notFirstNewCard() {
    if (isAlive === true && hasBlackJack === false) {
      pushNewCard();
      pushNewImage();
      temp2 = [...images];
      calledNewCard = true;
      renderGame();
      if (isAlive === false) endingGame();
    } else if (isAlive === false) startgameMessage();
  }
}
