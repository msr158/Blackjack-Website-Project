
// Define cards and their values
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

// Create a deck of cards
let deck = [];

// Initialize hands for player and dealer
let playerHand = [];
let dealerHand = [];

// Function to start the game
function startGame() {
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('double-down-button').disabled = false;
    document.getElementById('decrease-bet-button').disabled = false;
    document.getElementById('increase-bet-button').disabled = false;

    gameOver = false;
    // Reset the result text
    document.getElementById('result').innerText = '';

    // Create a new deck of cards
    deck = createDeck();

    // Shuffle the deck
    shuffleDeck(deck);

    // Deal initial cards to player and dealer
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];

    // Calculate and update player value
    playerValue = calculateHandValue(playerHand);
    

    // Display player value
    document.getElementById('player-value').innerText = "Player Value: " + playerValue;

    // Display initial hands
    displayHands(true);

    // Reset hasDoubledDown for the new game
    hasDoubledDown = false;

    // Check for blackjack at the start
    if (!checkBlackjack()) {
        // Game ends, stop further game logic here
        return;
    }
    
}

function endGame() {
    // Set gameOver to true
    gameOver = true;

    // Disable game buttons
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('double-down-button').disabled = true;
    document.getElementById('decrease-bet-button').disabled = true;
    document.getElementById('increase-bet-button').disabled = true;
}

// Function to calculate the value of a hand
function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    for(let i = 0; i < hand.length; i++) {
        let cardObject = hand[i];
        let card = cardObject.card;

        // Check if card rank and suit are separated by a space
        if (card.includes(' ')) {
            card = card.split(' ')[0]; // Extract the card rank from the card string
        }

        if(card === 'Ace') {
            aces += 1;
            value += 11;
        } else if(card === 'King' || card === 'Queen' || card === 'Jack') {
            value += 10;
        } else {
            value += parseInt(card, 10); // Convert card value to number
        }
    }

    // Handle aces (they can be 1 or 11)
    while(value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }

    return value;
}

// Function to draw a card from the deck
function drawCard() {
    let drawnCard = deck.pop();
    
    let [rank, , suit] = drawnCard.split(' ');
    let imagePath = `static/cards/${rank}-${suit}.png`;

    return {
        card: drawnCard,
        imagePath: imagePath
    };
}

// Function to shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to create a deck of cards
function createDeck() {
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push(`${rank} of ${suit}`);
        }
    }
    return deck;
}


// Function to display hands
function displayHands(isGameStart) {
    // Display player's hand
    let playerHandElement = document.getElementById('player-hand');
    playerHandElement.innerHTML = '';
    for (let card of playerHand) {
        let cardElement = document.createElement('img');
        cardElement.src = card.imagePath;
        playerHandElement.appendChild(cardElement);
    }

    // Display dealer's hand with the first card hidden if the game has not started
    let dealerHandElement = document.getElementById('dealer-hand');
    dealerHandElement.innerHTML = '';
    if (isGameStart) {
        let hiddenCardElement = document.createElement('img');
        hiddenCardElement.src = "../../static/cards/BACK.png";
        dealerHandElement.appendChild(hiddenCardElement);
        for (let i = 1; i < dealerHand.length; i++) {
            let cardElement = document.createElement('img');
            cardElement.src = dealerHand[i].imagePath;
            dealerHandElement.appendChild(cardElement);
        }
    } else {
        for (let card of dealerHand) {
            let cardElement = document.createElement('img');
            cardElement.src = card.imagePath;
            dealerHandElement.appendChild(cardElement);
        }
    }
}

// Initialize gameOver to false
let gameOver = false;

// Function to check for blackjack
function checkBlackjack() {
    if (getHandValue(playerHand) === 21 && getHandValue(dealerHand) === 21) {
        document.getElementById('result').innerText = 'It\'s a push! Both have blackjack.';
        gameOver = true; // Game ends
        return false;
    } else if (getHandValue(playerHand) === 21) {
        document.getElementById('result').innerText = 'Player wins with blackjack!';
        playerWonBlackjack();
        gameOver = true; // Game ends
        return false;
    } else if (getHandValue(dealerHand) === 21) {
        document.getElementById('result').innerText = 'Dealer wins with blackjack!';
        playerLost();
        gameOver = true; // Game ends
        return false;
    }
    return true; // Game continues
}

// Function for the player to hit
function hit() {
    // Check if the game is over
    if (gameOver) {
        return; // If the game is over, do nothing
    }
    // Add a new card to the player's hand
    let newCard = drawCard();
    playerHand.push(newCard);

    // Update the player's hand display
    displayHands(false);

    // Recalculate the player's hand value
    playerValue = calculateHandValue(playerHand);

    // Recalculate the dealer's hand value
    dealerValue = calculateHandValue(dealerHand);

    while (dealerValue < 17) {
        let newCard = drawCard();
        dealerHand.push(newCard);
        dealerValue = calculateHandValue(dealerHand);
    }

    // Update the display
    document.getElementById('player-value').innerText = "Player Value: " + playerValue;

    // Check if the player has busted
    if (playerValue > 21) {
        // Player busts, dealer wins
        document.getElementById('result').innerText = "Dealer Wins!";
        playerLost();
        gameOver = true; // Game ends
    } else if (dealerValue > 21) {
        // Dealer busts, player wins
        document.getElementById('result').innerText = "Player Wins!";
        playerWon();
        gameOver = true; // Game ends
    } else if (playerValue === 21) {
        // Player hits blackjack, player wins
        document.getElementById('result').innerText = "Player Wins!";
        playerWon();
        gameOver = true; // Game ends
    } else if (playerValue > dealerValue) {
        // Player's hand value is greater than dealer's, player wins
        document.getElementById('result').innerText = "Player Wins!";
        playerWon();
        gameOver = true; // Game ends
    } 
}

// Function for the player to stand
function stand() {

    // Dealer's turn
    let dealerValue = calculateHandValue(dealerHand);
    while (dealerValue < 17) {
        let newCard = drawCard();
        dealerHand.push(newCard);
        dealerValue = calculateHandValue(dealerHand);
    }

    // Recalculate the player's hand value after the dealer's turn
    let playerValue = calculateHandValue(playerHand);

    // Determine the winner
    if (dealerValue > 21) {
        document.getElementById('result').innerText = "Player Wins!";
        playerWon();
    } else if (dealerValue === playerValue) {
        document.getElementById('result').innerText = "Draw!";
    } else if (dealerValue > playerValue) {
        document.getElementById('result').innerText = "Dealer Wins!";
        playerLost();
    } else if (playerValue > dealerValue) {
        document.getElementById('result').innerText = "Player Wins!";
        playerWon();

    }

    // Update the player's hand display
    displayHands(false);
}

let hasDoubledDown = false;

function doubleDown() {
    // Check if the player has already doubled down
    if (hasDoubledDown) {
        return;
    }
    
    // Add a new card to the player's hand
    let newCard = drawCard();
    playerHand.push(newCard);

    // Update the player's hand display
    displayHands(false);

    // Recalculate the player's hand value
    playerValue = calculateHandValue(playerHand);

    // Set hasDoubledDown to true to prevent the player from drawing another card
    hasDoubledDown = true;

    // Dealer's turn
    let dealerValue = calculateHandValue(dealerHand);
    while (dealerValue < 17) {
        let newCard = drawCard();
        dealerHand.push(newCard);
        dealerValue = calculateHandValue(dealerHand);
    }

    // Update the display
    displayHands(false);

    // Update the display
    document.getElementById('player-value').innerText = "Player Value: " + playerValue;

    // Determine the winner
    if (playerValue > 21) {
        // Player busts, dealer wins
        document.getElementById('result').innerText = "Dealer Wins!";
        playerLostDoubleDown();
    } else if (dealerValue > 21) {
        // Dealer busts, player wins
        document.getElementById('result').innerText = "Player Wins!";
        playerWonDoubleDown();
    } else if (playerValue > dealerValue) {
        // Player's hand value is greater than dealer's, player wins
        document.getElementById('result').innerText = "Player Wins!";
        playerWonDoubleDown();
    } else if (dealerValue > playerValue) {
        // Dealer's hand value is greater than player's, dealer wins
        document.getElementById('result').innerText = "Dealer Wins!";
        playerLostDoubleDown();
    } else {
        // It's a tie
        document.getElementById('result').innerText = "It's a tie!";
    }

}

// Function for the dealer's turn
function dealerTurn() {

    // Dealer draws cards until their hand value is at least 17
    while (getHandValue(dealerHand) < 17) {
        dealerHand.push(drawCard());

        document.getElementById('dealer-hand').innerHTML = `<h2>Dealer's Hand</h2>${dealerHand.join('<br>')}`;

        // Display updated hands
        displayHands();
    }

    // Display updated hands
    displayHands();
}

// Function for the dealer's turn on double down
function dealerTurnDoubleDown() {
    // Reveal the hidden card in the dealer's hand
    //document.getElementById('dealer-hand').innerHTML = `<h2>Dealer's Hand</h2>${dealerHand.join('<br>')}`;

    // Display updated hands
    displayHands();

    // Dealer draws cards until their hand value is at least 17
    while (getHandValue(dealerHand) < 17) {
        dealerHand.push(drawCard());

        document.getElementById('dealer-hand').innerHTML = `<h2>Dealer's Hand</h2>${dealerHand.join('<br>')}`;

        // Display updated hands
        displayHands();
    }

    // Determine the winner
    determineWinnerDoubleDown();

    // Display updated hands
    displayHands();
}

// Function to check if a hand busts (total over 21)
function checkBust(hand) {
    if (getHandValue(hand) > 21) {
        document.getElementById('result').innerText = 'Bust! Player loses.';
        // Implement any additional logic for handling a bust, if needed
        playerLost();
        playLoseSound();

        // Display updated hands
        displayHands();
    }
}

// Function to determine the winner
function determineWinner() {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);

    // Determine the winner
    if (playerValue > 21) {
        // Player busts, dealer wins
        document.getElementById('result').innerText = "Dealer Wins!";
    } else if (dealerValue > 21) {
        // Dealer busts, player wins
        document.getElementById('result').innerText = "Player Wins!";
    } else if (dealerValue > playerValue) {
        // Dealer's hand value is greater than player's, dealer wins
        document.getElementById('result').innerText = "Dealer Wins!";
    } else if (dealerValue < playerValue) {
        // Player's hand value is greater than dealer's, player wins
        document.getElementById('result').innerText = "Player Wins!";
    } else {
        // Player's and dealer's hand values are equal, it's a tie
        document.getElementById('result').innerText = "It's a Tie!";
    }

}

// Function to determine the winner of Double Down
function determineWinnerDoubleDown() {
    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(dealerHand);

    if(playerValue > 21){
        document.getElementById('result').innerText = 'Dealer wins! Double down lost.';
        playerLostDoubleDown();
    }
    else if(dealerValue > 21){
        document.getElementById('result').innerText = 'Player wins with a double down!';
        playerWonDoubleDown();
    }
    else if (playerValue > dealerValue) {
        document.getElementById('result').innerText = 'Player wins with a double down!';
        playerWonDoubleDown();
    } else if (dealerValue > playerValue) {
        document.getElementById('result').innerText = 'Dealer wins! Double down lost.';
        playerLostDoubleDown();
    } else {
        document.getElementById('result').innerText = 'It\'s a tie!';
    }

}

// Function to calculate the value of a hand
function getHandValue(hand) {
    let value = 0;
    let hasAce = false;

    for (const card of hand) {
        const rank = card.split(' ')[0];

        if (rank === 'Ace') {
            hasAce = true;
            value += 11;
        } else if (['Jack', 'Queen', 'King'].includes(rank)) {
            value += 10;
        } else {
            value += parseInt(rank);
        }
    }

    // Adjust for Aces if needed
    if (hasAce && value > 21) {
        value -= 10;
    }

    return value;
}

// Function to handle player winning
function playerWon() {
    endGame();
    playWinSound();
    // Add currentBet to the player's bank account balance
    fetch('/win', {
        method: 'POST',
        body: JSON.stringify({ amount: currentBet, win: winAmount}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Fetch the updated bank account balance and update it on the page
            updateBalance();

            // Increment the win count
            fetch('/win_count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Update the win count on the page
                    // updateWinCount();
                } else {
                    // Handle error response
                    console.error('Error incrementing win count:', response.statusText);
                }
            });

        } else {
            // Handle error response
            console.error('Error depositing into bank account:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error depositing into bank account:', error);
    });
}

// Function to handle player losing
function playerLost() {
    endGame();
    playLoseSound();
    // Withdraw currentBet from the player's bank account balance
    fetch('/lose', {
        method: 'POST',
        body: JSON.stringify({ amount: currentBet }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Fetch the updated bank account balance and update it on the page
            updateBalance();

            // Increment the lose count
            fetch('/lose_count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Update the lose count on the page
                    // updateLoseCount();
                } else {
                    // Handle error response
                    console.error('Error incrementing lose count:', response.statusText);
                }
            });
        } else {
            // Handle error response
            console.error('Error withdrawing from bank account:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error withdrawing from bank account:', error);
    });
}

// Function to handle player winning Blackjack
function playerWonBlackjack() {
    let blackJackWin = currentBet * 1.5

    playWinDoubleSound();

    // Add 100 to the player's bank account balance
    fetch('/win', {
        method: 'POST',
        body: JSON.stringify({ amount: blackJackWin }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Fetch the updated bank account balance and update it on the page
            updateBalance();

            // Increment the win count
            fetch('/win_count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Update the win count on the page
                    // updateWinCount();
                } else {
                    // Handle error response
                    console.error('Error incrementing win count:', response.statusText);
                }
            });
            
        } else {
            // Handle error response
            console.error('Error depositing into bank account:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error depositing into bank account:', error);
    });
}

// Define initial bet amount
let currentBet = 100;

//define initial win
let winAmount = 0;

// Function to increase the bet by 50
function increaseBet() {
    if (currentBet + 50 <= 100000) {
        currentBet += 50;
        document.getElementById('current-bet').innerText = currentBet;
    }
}

// Function to decrease the bet by 50
function decreaseBet() {
    if (currentBet - 50 >= 50) {
        currentBet -= 50;
        document.getElementById('current-bet').innerText = currentBet;
    }
}

// Function to handle player winning Double Down
function playerWonDoubleDown() {
    endGame();
    playWinDoubleSound();
    let doubleDownWin = currentBet * 2
    
    // Add 100 to the player's bank account balance
    fetch('/win', {
        method: 'POST',
        body: JSON.stringify({ amount: doubleDownWin }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Fetch the updated bank account balance and update it on the page
            updateBalance();

            // Increment the win count
            fetch('/win_count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Update the win count on the page
                    // updateWinCount();
                } else {
                    // Handle error response
                    console.error('Error incrementing win count:', response.statusText);
                }
            });

        } else {
            // Handle error response
            console.error('Error depositing into bank account:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error depositing into bank account:', error);
    });
}

// Function to handle player losing
function playerLostDoubleDown() {
    endGame();
    playLoseDoubleSound();
    let doubleDownLoss = currentBet * 2
    
    // Withdraw doubleDownLoss from the player's bank account balance
    fetch('/lose', {
        method: 'POST',
        body: JSON.stringify({ amount: doubleDownLoss}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Fetch the updated bank account balance and update it on the page
            updateBalance();

            // Increment the lose count
            fetch('/lose_count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Update the lose count on the page
                    // updateLoseCount();
                } else {
                    // Handle error response
                    console.error('Error incrementing lose count:', response.statusText);
                }
            });

        } else {
            // Handle error response
            console.error('Error withdrawing from bank account:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error withdrawing from bank account:', error);
    });
}

function updateBalance(){
    const div = document.getElementById('bank-account')
    const url = div.getAttribute('data-url')

    fetch(url,{
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        div.innerHTML = `Bank Account: ${data.new_balance}`;
    })
}

// Function to play the win sound
function playWinSound() {
    let winSound = new Audio('static/audio/win.wav');
    winSound.play();
}

// Function to play the lose sound
function playLoseSound() {
    let loseSound = new Audio('static/audio/lose.wav');
    loseSound.play();
}

// Function to play the win double/blackjack sound
function playWinDoubleSound() {
    let winDoubleSound = new Audio('static/audio/winDouble.wav');
    winDoubleSound.play();
}

// Function to play the lose double/blackjack sound
function playLoseDoubleSound() {
    let loseDoubleSound = new Audio('static/audio/loseDouble.wav');
    loseDoubleSound.play();
}

// // Function to update the win count on the page
// function updateWinCount() {
//     fetch('/win_count')
//         .then(response => response.json())
//         .then(data => {
//             // Update the win count on the page
//             document.getElementById('win-count').innerText = data.wins;

//             // Check for 25 wins
//             if (data.wins >= 20) {
//                 // Update the achievement
//                 document.getElementById('achievement-25').innerText = "Achieved!";
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }

// // Function to update the lose count on the page
// function updateLoseCount() {
//     fetch('/lose_count')
//         .then(response => response.json())
//         .then(data => {
//             // Update the win count on the page
//             document.getElementById('lose-count').innerText = data.wins;
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }

// Call updateWinCount when the page loads
window.onload = updateWinCount;

