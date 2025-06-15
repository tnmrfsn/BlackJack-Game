# Simple Blackjack Game

This is a web-based Blackjack game where the player plays against themselves, aiming to get a hand total as close to 21 as possible without exceeding it.

## Objective
The primary goal in this version of Blackjack is to reach a card sum of 21, or to get as close as possible without going over 21 (busting).

## Card Values
-   **Number Cards (2-9):** Face value. (Card '10' also counts as 10).
-   **Face Cards (Jack, Queen, King):** Each counts as 10. (Represented by numbers 11, 12, 13 in card images, but valued at 10 in game).
-   **Ace:** Counts as 11 initially. If your total sum exceeds 21, an Ace's value will automatically change to 1 to prevent a bust if possible. (Represented by number 1 in card images).

## Gameplay
1.  **Start Game:** Click the "START GAME" button. You will be dealt two cards. Your initial sum will be displayed.
2.  **Player's Turn:**
    *   If your sum is less than 21, the message "Do you want to draw a new card?" will appear.
    *   You can click "NEW CARD" to receive an additional card (Hit).
    *   The game automatically checks for Blackjack (sum of 21) or a Bust (sum > 21) after each card is drawn.
3.  **Game Outcomes:**
    *   **Blackjack:** If your sum is exactly 21, you get Blackjack!
    *   **Bust:** If your sum exceeds 21 and cannot be reduced by changing an Ace's value, you're out of the game.
    *   **Drawing New Cards:** You can continue to draw new cards as long as your sum is less than 21 and you haven't busted.

## Features
-   Visual display of cards.
-   Tracks a player's chip balance (currently illustrative, starts at $500).
-   Responsive UI for basic gameplay.

## How to Run
1.  Clone this repository.
2.  Open the `index.html` file in your web browser.
