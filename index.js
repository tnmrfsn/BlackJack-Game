let isAlive = false;
let hasBlackJack = false;
// let isStarted = false; // Removed
// let calledNewCard = false; // Removed
let sum = 0;
let acesAsEleven = 0; // Tracks number of Aces counted as 11
let message = "";
let player = {
  name: "Player",
  chips: 500,
};
let cards = []; // Array to store the numbers of the cards player has
let images = []; // Array to store HTML string for card images to display
// let currentCardImages = []; // Removed (formerly temp)
let cardNew = randomCard(); // Holds the newest card drawn

// --- DOM Element Access ---
const cardResult = document.getElementById("cardResult");
const sumEl = document.getElementById("sum-el");
const cardImages = document.getElementById("cardImages");
const messageEl = document.getElementById("message-el");
const playerName = document.getElementById("playerName");

// --- Card Generation & Value Helpers ---
function randomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  return randomNumber;
}

function randomSuit() {
  let randomNumber = Math.floor(Math.random() * 4) + 1;
  return randomNumber;
}

// Helper function to get card value
function getCardValue(cardNumber) {
  if (cardNumber === 1) {
    return 11; // Ace
  } else if (cardNumber >= 11 && cardNumber <= 13) {
    return 10; // Jack, Queen, King
  } else {
    return cardNumber;
  }
}

function getCardDisplayName(cardNumber) {
  if (cardNumber === 1) {
    return "Ace";
  } else if (cardNumber === 11) {
    return "Jack";
  } else if (cardNumber === 12) {
    return "Queen";
  } else if (cardNumber === 13) {
    return "King";
  } else {
    return String(cardNumber); // For cards 2-10
  }
}

// --- Utility / Data Update Functions ---
function pushNewCard() {
  // sum += cardNew; // Sum is now calculated in newCard flow using getCardValue
  cards.push(cardNew);
}

function pushNewImage() {
  images.push(
    `<img src="card_images/${cardNew}_${randomSuit()}.png" alt="card${cardNew}_${randomSuit()}.png">  `
  );
}

// --- Game State & Initialization ---
//Called when newCard is clicked by a dead player or before game starts
function startgameMessage() {
  message = "Please start the game first!";
  messageEl.textContent = message;
  images = [];
}

//Resets game variables for a new game or when game ends
function gameOver() {
  images = []; // Clear displayed card images
  cards = []; // Clear player's cards
  // calledNewCard = false; // Removed
  isAlive = false;
  hasBlackJack = false;
  // isStarted = false; // Removed
  sum = 0; // Explicitly reset sum, though it's recalculated in startGame
  acesAsEleven = 0; // Explicitly reset aces, though it's recalculated in startGame
}

//startGame function: Initializes a new game
function startGame() {
  if (isAlive) {
    // If a game is already in progress and player is alive (e.g. clicked start game mid-game)
    // If a game is already in progress and player is alive (e.g. clicked start game mid-game),
    // gameOver() will reset relevant states including sum, acesAsEleven, cards, images.
    gameOver();
    console.log("startGame being alive called gameOver()");
  }
  // For a fresh game or after gameOver() has run:
  console.log("startGame");

  isAlive = true; // Player is now active for the new game
  hasBlackJack = false; // Reset blackjack status

  // Initialize game variables for the new hand
  cards = [];
  images = [];
  sum = 0;
  acesAsEleven = 0;

  let firstCard = randomCard();
  let secondCard = randomCard();

  // Add cards to hand
  cards.push(firstCard);
  cards.push(secondCard);

  // Process first card
  let firstCardValue = getCardValue(firstCard);
  if (firstCardValue === 11) {
    acesAsEleven++;
  }
  sum += firstCardValue;

  // Process second card
  let secondCardValue = getCardValue(secondCard);
  if (secondCardValue === 11) {
    acesAsEleven++;
  }
  sum += secondCardValue;

  // Add images for the cards
  images.push(
    `<img src="card_images/${firstCard}_${randomSuit()}.png" alt="card${firstCard}_${randomSuit()}.png">  `
  );
  images.push(
    `<img src="card_images/${secondCard}_${randomSuit()}.png" alt="card${secondCard}_${randomSuit()}.png">  `
  );

  renderGame();
  // Note: currentCardImages and isStarted logic removed.
  // images array now persists with the hand's cards.
}

//renderGame function..................................
function renderGame() {
  //display in html
  cardResult.textContent = `Card: ${cards
    .map((card) => getCardDisplayName(card))
    .join(", ")}`;
  sumEl.textContent = `Sum: ${sum}`;
  cardImages.innerHTML = images.join(" ");
  playerName.textContent = `${player.name} : \$${player.chips}`;

  // Ace adjustment logic: If sum is over 21 and player has Aces counted as 11,
  // change their value to 1 until sum is 21 or less, or no more such Aces.
  while (sum > 21 && acesAsEleven > 0) {
    sum -= 10; // Change an Ace's value from 11 to 1
    acesAsEleven--; // Decrement the count of Aces valued at 11
    console.log(
      "Adjusted Ace from 11 to 1. New sum:",
      sum,
      "Aces as eleven:",
      acesAsEleven
    );
  }
  // Update sum display after potential Ace adjustment
  sumEl.textContent = `Sum: ${sum}`;

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

// --- Core Game Flow ---
//newCard Function: Draws a new card for the player
function newCard() {
  // Player can only draw a new card if they are alive and don't have Blackjack
  if (isAlive && !hasBlackJack) {
    cardNew = randomCard(); // Draw a new card
    let cardValue = getCardValue(cardNew);
    if (cardValue === 11) {
      acesAsEleven++;
    }
    sum += cardValue;

    pushNewCard(); // Adds cardNew to cards array
    pushNewImage(); // Adds new image to images array

    renderGame();
  } else {
    console.log("newCard being dead or blackjack");
    gameOver();
    startgameMessage();
    //prevent drawing new cards if game is over
    if (!isAlive) {
      startgameMessage();
      messageEl.textContent = message;
    }
  }
}

// The individual firstNewCard and notFirstNewCard functions are merged into newCard above.
// If they were more complex, keeping them separate might be better.
