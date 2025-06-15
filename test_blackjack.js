// --- Mock DOM Elements ---
// Simulating DOM elements for testing purposes
const mockDocument = {
    getElementById: function(id) {
        if (!this.elements) {
            this.elements = {};
        }
        if (!this.elements[id]) {
            this.elements[id] = {
                textContent: '',
                innerHTML: '',
                // Add any other properties or methods your game script might use
            };
        }
        return this.elements[id];
    }
};

global.document = mockDocument; // Make it available globally like in a browser

// Assign to global scope as if they were selected from the DOM
const cardResult = global.document.getElementById("cardResult");
const sumEl = global.document.getElementById("sum-el");
const cardImages = global.document.getElementById("cardImages");
const messageEl = global.document.getElementById("message-el");
const playerName = global.document.getElementById("playerName");


// --- Blackjack Game Code (Copied from index.js) ---
let isAlive = false;
let hasBlackJack = false;
let sum = 0;
let acesAsEleven = 0; // Tracks number of Aces counted as 11
let message = "";
let player = {
  name: "Player",
  chips: 500,
};
let cards = []; // Array to store the numbers of the cards player has
let images = []; // Array to store HTML string for card images to display
let cardNew = randomCard(); // Holds the newest card drawn (will be defined later)

// --- Card Generation & Value Helpers ---
function randomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  return randomNumber;
}

function randomSuit() {
  let randomNumber = Math.floor(Math.random() * 4) + 1;
  return randomNumber;
}

function getCardValue(cardNumber) {
    if (cardNumber === 1) {
        return 11 // Ace
    } else if (cardNumber >= 11 && cardNumber <= 13) {
        return 10 // Jack, Queen, King
    } else {
        return cardNumber
    }
}

// --- Utility / Data Update Functions ---
function pushNewCard() {
  cards.push(cardNew);
}

function pushNewImage() {
  images.push(
    `<img src="card_images/${cardNew}_${randomSuit()}.png" alt="card${cardNew}_${randomSuit()}.png">  `
  );
}

// --- Game State & Initialization ---
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
  if (firstCardValue === 11) {
    acesAsEleven++;
  }
  sum += firstCardValue;

  let secondCardValue = getCardValue(secondCard);
  if (secondCardValue === 11) {
    acesAsEleven++;
  }
  sum += secondCardValue;

  images.push(
    `<img src="card_images/${firstCard}_${randomSuit()}.png" alt="card${firstCard}_${randomSuit()}.png">  `
  );
  images.push(
    `<img src="card_images/${secondCard}_${randomSuit()}.png" alt="card${secondCard}_${randomSuit()}.png">  `
  );

  renderGame();
  console.log("startGame: Game started.");
}

function renderGame() {
  if (cardResult) cardResult.textContent = `Card: ${cards.join(",")}`;
  if (sumEl) sumEl.textContent = `Sum: ${sum}`;
  if (cardImages) cardImages.innerHTML = images.join(" ");
  if (playerName) playerName.textContent = `${player.name} : \$${player.chips}`;

  while (sum > 21 && acesAsEleven > 0) {
    sum -= 10;
    acesAsEleven--;
    console.log(`renderGame: Adjusted Ace from 11 to 1. New sum: ${sum}, Aces as eleven: ${acesAsEleven}`);
  }
  if (sumEl) sumEl.textContent = `Sum: ${sum}`; // Update sum display after potential adjustment

  if (sum <= 20) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
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
  // console.log(`renderGame: Message set to: "${message}"`);
}

// --- Core Game Flow ---
function newCard() {
  console.log("newCard: Attempting to draw a new card...");
  if (isAlive && !hasBlackJack) {
    cardNew = randomCard();
    console.log(`newCard: Drawn card: ${cardNew}`);
    let cardValue = getCardValue(cardNew);
    if (cardValue === 11) {
      acesAsEleven++;
    }
    sum += cardValue;

    pushNewCard();
    pushNewImage();

    renderGame();
    console.log("newCard: New card processed.");
  } else {
    console.log("newCard: Cannot draw new card. isAlive:", isAlive, "hasBlackJack:", hasBlackJack);
    if (!isAlive) {
        message = "Game Over. Start a new game.";
        if (messageEl) messageEl.textContent = message;
    }
  }
}

// --- Test Execution ---
console.log("--- Starting Blackjack Game Test ---");

console.log("\n--- 1. Initial Game Start ---");
startGame();
console.log("State after initial startGame():");
console.log(`Cards: [${cards.join(",")}], Sum: ${sum}, Aces as 11: ${acesAsEleven}, isAlive: ${isAlive}, hasBlackJack: ${hasBlackJack}`);
console.log(`Images array length: ${images.length}`);
console.log(`Message: "${message}" (Actual messageEl.textContent: "${messageEl.textContent}")`);
if (cards.length === 2 && images.length === 2) {
    console.log("Initial game start: Correct number of cards and images.");
} else {
    console.error("Initial game start: Incorrect number of cards or images.");
}

console.log("\n--- 2. Drawing New Cards ---");
console.log("Drawing first new card...");
newCard();
console.log("State after first newCard():");
console.log(`Cards: [${cards.join(",")}], Sum: ${sum}, Aces as 11: ${acesAsEleven}, isAlive: ${isAlive}, hasBlackJack: ${hasBlackJack}`);
console.log(`Images array length: ${images.length}`);
console.log(`Message: "${message}" (Actual messageEl.textContent: "${messageEl.textContent}")`);
if (cards.length === 3 && images.length === 3) {
    console.log("First new card: Correct number of cards and images.");
} else {
    console.error("First new card: Incorrect number of cards or images.");
}

console.log("\nDrawing second new card...");
newCard();
console.log("State after second newCard():");
console.log(`Cards: [${cards.join(",")}], Sum: ${sum}, Aces as 11: ${acesAsEleven}, isAlive: ${isAlive}, hasBlackJack: ${hasBlackJack}`);
console.log(`Images array length: ${images.length}`);
console.log(`Message: "${message}" (Actual messageEl.textContent: "${messageEl.textContent}")`);
if (cards.length === 4 && images.length === 4) {
    console.log("Second new card: Correct number of cards and images.");
} else {
    console.error("Second new card: Incorrect number of cards or images.");
}


console.log("\n--- 3. Ace Handling Test Scenario (Descriptive) ---");
console.log("Ace Handling: If a player has an Ace (value 11) and a 5 (sum 16), then draws a 10 (sum 26),");
console.log("the Ace's value should change from 11 to 1, making the sum 16.");
console.log("The logic 'while (sum > 21 && acesAsEleven > 0)' in renderGame() is responsible for this.");
console.log("This was confirmed to be present in previous refactoring.");

console.log("\n--- 4. Blackjack Scenario (Descriptive) ---");
console.log("Blackjack: If sum is 21 (e.g., Ace and King), message should be 'You've got Blackjack!',");
console.log("hasBlackJack should be true, and isAlive should be false.");
console.log("This is handled in renderGame().");

console.log("\n--- 5. Bust Scenario (Descriptive) ---");
console.log("Bust: If sum exceeds 21 and cannot be reduced by Ace adjustment,");
console.log("message should be 'You're out of the game!', and isAlive should be false.");
console.log("This is handled in renderGame().");

console.log("\n--- 6. Game Over and Restart ---");
console.log("Calling gameOver()...");
gameOver();
console.log("State after gameOver():");
console.log(`Cards: [${cards.join(",")}], Sum: ${sum}, Aces as 11: ${acesAsEleven}, isAlive: ${isAlive}, hasBlackJack: ${hasBlackJack}`);
console.log(`Images array length: ${images.length}`);
if (cards.length === 0 && images.length === 0 && sum === 0 && !isAlive && !hasBlackJack && acesAsEleven === 0) {
    console.log("gameOver(): State correctly reset.");
} else {
    console.error("gameOver(): State not correctly reset.");
}

console.log("\nRestarting game (calling startGame() again)...");
startGame();
console.log("State after restarting startGame():");
console.log(`Cards: [${cards.join(",")}], Sum: ${sum}, Aces as 11: ${acesAsEleven}, isAlive: ${isAlive}, hasBlackJack: ${hasBlackJack}`);
console.log(`Images array length: ${images.length}`);
console.log(`Message: "${message}" (Actual messageEl.textContent: "${messageEl.textContent}")`);
if (cards.length === 2 && images.length === 2) {
    console.log("Game restart: Correct number of cards and images for new game.");
} else {
    console.error("Game restart: Incorrect number of cards or images for new game.");
}

console.log("\n--- Test Execution Finished ---");

// Re-assign cardNew at the end, as it's used at the top of the script block
// This is a bit of a hack due to the script structure.
cardNew = randomCard();
