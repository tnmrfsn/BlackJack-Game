// --- Mock DOM Elements ---
const mockDocument = {
    getElementById: function(id) {
        if (!this.elements) {
            this.elements = {};
        }
        if (!this.elements[id]) {
            this.elements[id] = { textContent: '', innerHTML: '' };
        }
        return this.elements[id];
    }
};
global.document = mockDocument;

const cardResult = global.document.getElementById("cardResult");
const sumEl = global.document.getElementById("sum-el");
const cardImages = global.document.getElementById("cardImages");
const messageEl = global.document.getElementById("message-el");
const playerName = global.document.getElementById("playerName");

// --- Blackjack Game Code (Copied from latest index.js) ---
let isAlive = false;
let hasBlackJack = false;
let sum = 0;
let acesAsEleven = 0;
let message = "";
let player = { name: "Player", chips: 500 };
let cards = [];
let images = [];
let cardNew = 0; // Will be assigned by randomCard() before use

function randomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  return randomNumber;
}

function randomSuit() {
  let randomNumber = Math.floor(Math.random() * 4) + 1;
  return randomNumber;
}

function getCardValue(cardNumber) {
    if (cardNumber === 1) return 11;
    if (cardNumber >= 11 && cardNumber <= 13) return 10;
    return cardNumber;
}

function getCardDisplayName(cardNumber) {
  if (cardNumber === 1) return "Ace";
  if (cardNumber === 11) return "Jack";
  if (cardNumber === 12) return "Queen";
  if (cardNumber === 13) return "King";
  return String(cardNumber);
}

function pushNewCard() {
  cards.push(cardNew);
}

function pushNewImage() {
  images.push(
    `<img src="card_images/${cardNew}_${randomSuit()}.png" alt="card${cardNew}_${randomSuit()}.png">  `
  );
}

function startgameMessage() {
  message = "Please start the game first!";
  if (messageEl) messageEl.textContent = message;
  images = [];
}

function gameOver() {
  images = [];
  cards = [];
  isAlive = false;
  hasBlackJack = false;
  sum = 0;
  acesAsEleven = 0;
  console.log("gameOver() called: Game state reset.");
}

function startGame() {
  if (isAlive) {
    gameOver();
    console.log("startGame: Previous game was live, gameOver() called.");
  }
  console.log("startGame: Initializing new game...");
  isAlive = true;
  hasBlackJack = false;
  cards = [];
  images = [];
  sum = 0;
  acesAsEleven = 0;

  let firstCard = randomCard();
  let secondCard = randomCard();
  cards.push(firstCard);
  cards.push(secondCard);

  let firstCardValue = getCardValue(firstCard);
  if (firstCardValue === 11) acesAsEleven++;
  sum += firstCardValue;

  let secondCardValue = getCardValue(secondCard);
  if (secondCardValue === 11) acesAsEleven++;
  sum += secondCardValue;

  // Assign to global cardNew for pushNewImage to use, though it's a bit off here
  // This is a quirk of how pushNewImage was structured using global cardNew
  // For initial cards, we directly push them.
  images.push(`<img src="card_images/${firstCard}_${randomSuit()}.png" alt="card${firstCard}_${randomSuit()}.png">  `);
  images.push(`<img src="card_images/${secondCard}_${randomSuit()}.png" alt="card${secondCard}_${randomSuit()}.png">  `);

  renderGame();
  console.log("startGame: Game started.");
}

function renderGame() {
  // This is the line we are primarily testing for display
  let cardsDisplayString = `Card: ${cards.map(card => getCardDisplayName(card)).join(", ")}`;
  if (cardResult) cardResult.textContent = cardsDisplayString;
  console.log(`renderGame: cardResult.textContent set to: "${cardsDisplayString}"`);


  if (sumEl) sumEl.textContent = `Sum: ${sum}`;
  if (cardImages) cardImages.innerHTML = images.join(" ");
  if (playerName) playerName.textContent = `${player.name} : \$${player.chips}`;

  while (sum > 21 && acesAsEleven > 0) {
    sum -= 10;
    acesAsEleven--;
    console.log(`renderGame: Adjusted Ace. Sum: ${sum}, Aces: ${acesAsEleven}`);
  }
  if (sumEl) sumEl.textContent = `Sum: ${sum}`;

  if (sum <= 20) message = "Do you want to draw a new card?";
  else if (sum === 21) {
    message = "You've got Blackjack!";
    hasBlackJack = true;
    isAlive = false;
    console.log("renderGame: Blackjack detected!");
  } else {
    message = "You're out of the game!";
    isAlive = false;
    console.log("renderGame: Bust detected!");
  }
  if (messageEl) messageEl.textContent = message;
}

function newCard() {
  console.log("newCard: Attempting to draw...");
  if (isAlive && !hasBlackJack) {
    cardNew = randomCard(); // Assign to global for pushNewCard/Image
    console.log(`newCard: Drawn card (numeric): ${cardNew}`);
    let cardValue = getCardValue(cardNew);
    if (cardValue === 11) acesAsEleven++;
    sum += cardValue;
    pushNewCard();
    pushNewImage();
    renderGame();
    console.log("newCard: Processed.");
  } else {
    console.log("newCard: Cannot draw. Alive:", isAlive, "Blackjack:", hasBlackJack);
    if (!isAlive) {
        message = "Game Over. Start a new game.";
        if (messageEl) messageEl.textContent = message;
    }
  }
}
// Assign initial value to cardNew, game functions will overwrite it.
cardNew = randomCard();

// --- Test Execution ---
console.log("--- Starting Blackjack Display Test ---");

function logGameState(context) {
    console.log(`\n--- ${context} ---`);
    console.log(`Numeric cards array: [${cards.join(",")}]`);
    // Replicate the display string generation for verification
    const expectedDisplayString = `Card: ${cards.map(card => getCardDisplayName(card)).join(", ")}`;
    console.log(`Expected cardResult.textContent: "${expectedDisplayString}"`);
    console.log(`Actual cardResult.textContent via mock: "${cardResult.textContent}"`);
    console.log(`Sum: ${sum}, Aces as 11: ${acesAsEleven}`);
    if (images.length > 0) {
        console.log(`Sample image path: ${images[0]}`);
    } else {
        console.log("Images array is empty.");
    }
    console.log(`Current message: "${message}"`);
    console.log(`isAlive: ${isAlive}, hasBlackJack: ${hasBlackJack}`);
}

// 1. Test Initial Game Start
startGame();
logGameState("After initial startGame()");

// 2. Test Drawing First New Card
newCard();
logGameState("After first newCard()");

// 3. Test Drawing Second New Card
newCard();
logGameState("After second newCard()");

// 4. Test gameOver to ensure state clears (images, cards)
gameOver();
logGameState("After gameOver()");


console.log("\n--- Display Test Execution Finished ---");
