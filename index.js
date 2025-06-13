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

//function for generating random numbers 1 to 3 for suit for image names.........................
function randomSuit() {
  let randomNumber = Math.floor(Math.random() * 3) + 1;
  return randomNumber;
}
let suit1 = randomSuit();
let suit2 = randomSuit();
let suit3 = randomSuit();

//function for generating random number from 1 to 13 for card numbers.........................

function randomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  return randomNumber;
}

//startGame funtion..............................
function startGame() {
  console.log("startGame");
  isAlive = true;

  let firstCard = randomCard();
  let secondCard = randomCard();
  images.push(
    `<img src="card_images/${firstCard}_${suit1}.png" alt="card${firstCard}_${suit1}.png">  `
  );
  images.push(
    `<img src="card_images/${secondCard}_${suit2}.png" alt="card${secondCard}_${suit2}.png">  `
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
  console.log("renderGame");
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
  if (calledNewCard && isAlive) {
    console.log("newcard=false");
    images = [...temp2];
    call2();
  } else {
    console.log("newcard=true");
    call1();
  }

  function call1() {
    console.log("call1");
    if (isAlive === true && hasBlackJack === false) {
      console.log("call1 if");
      let newCard = randomCard();
      sum += newCard;

      //pushing third card in cards
      cards.push(newCard);

      //retrieving the original images[] before it got deleted in startGame
      images = [...temp];
      //pushing new card image in images
      images.push(
        `<img src="card_images/${newCard}_${suit3}.png" alt="card${newCard}_${suit3}.png">  `
      );
      temp2 = [...images];
      calledNewCard = true;
      //render the game again
      renderGame();
      if (isAlive) {
        calledNewCard = true;
        console.log("call1 if ----> if , callledNewcard=true");
      } else {
        console.log("call1 if ----> else, calledNewcard=false");
        calledNewCard = false;
        images = [];
      }
    } else if (isAlive === false) {
      console.log("call1 else if");
      message = "Please start the game first!";
      messageEl.textContent = message;
      if (isAlive === false) {
        console.log("call1 else if ----> if");
        images = [];
      }
    }
  }
  function call2() {
    console.log("call2");
    if (isAlive === true && hasBlackJack === false) {
      console.log("call2 if");
      let newCard = randomCard();
      sum += newCard;

      //pushing third card in cards
      cards.push(newCard);
      //pushing new card image in images
      images.push(
        `<img src="card_images/${newCard}_${suit3}.png" alt="card${newCard}_${suit3}.png">  `
      );
      temp2 = [...images];
      //render the game again
      renderGame();
      if (isAlive === false) {
        console.log("call2 if----> if, calledNewCard=false");
        images = [];
        calledNewCard = false;
      }
    } else if (isAlive === false) {
      console.log("call2 else if");
      message = "Please start the game first!";
      messageEl.textContent = message;

      if (isAlive === false) {
        console.log("call1 else if ----> if");
        images = [];
      }
    }
  }
}
