// Card suits
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

// Card values
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Function to create a deck of cards
function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({suit, value});
        }
    }
    return deck;
}

// Function to get a random card from the deck
function getRandomCard(deck) {
    return deck[Math.floor(Math.random() * deck.length)];
}

// Function to determine the total value of a hand
function getTotal(hand) {
    let total = 0;
    for (let card of hand) {
        if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
            total += 0;
        } else if (card.value === 'A') {
            total += 1;
        } else {
            total += parseInt(card.value);
        }
    }
    return total % 10;
}

// Function to determine whether a third card should be drawn for player
function shouldPlayerDraw(playerTotal) {
    return playerTotal <= 5;
}

// Function to determine whether a third card should be drawn for banker
function shouldBankerDraw(playerThirdCard, bankerTotal) {
    if (bankerTotal <= 2) {
        return true;
    } else if (bankerTotal === 3 && playerThirdCard !== 8) {
        return true;
    } else if (bankerTotal === 4 && (playerThirdCard >= 2 && playerThirdCard <= 7)) {
        return true;
    } else if (bankerTotal === 5 && (playerThirdCard >= 4 && playerThirdCard <= 7)) {
        return true;
    } else if (bankerTotal === 6 && (playerThirdCard === 6 || playerThirdCard === 7)) {
        return true;
    } else {
        return false;
    }
}

// Function to deal two cards to player and banker
function deal() {
    let deck = createDeck();
    let playerHand = [getRandomCard(deck), getRandomCard(deck)];
    let bankerHand = [getRandomCard(deck), getRandomCard(deck)];

    let playerTotal = getTotal(playerHand);
    let bankerTotal = getTotal(bankerHand);

    let playerThirdCard = null;
    let bankerThirdCard = null;

    if (shouldPlayerDraw(playerTotal)) {
        playerThirdCard = getRandomCard(deck);
        playerHand.push(playerThirdCard);
        playerTotal = getTotal(playerHand);
    }

    if (shouldBankerDraw(playerThirdCard, bankerTotal)) {
        bankerThirdCard = getRandomCard(deck);
        bankerHand.push(bankerThirdCard);
        bankerTotal = getTotal(bankerHand);
    }

    let result = '';

    if (playerTotal > bankerTotal) {
        result = 'Player wins!';
        // Get the audio and video elements
        const winningSound = document.getElementById('winning-sound');
        const confettiVideo = document.getElementById('confetti-video');
        
        // Play the winning sound
        winningSound.play();
    
        // Show the confetti video
        confettiVideo.style.display = 'block';
        confettiVideo.play();
    
        // Hide the video once it ends
        confettiVideo.addEventListener('ended', function() {
            confettiVideo.style.display = 'none';
        });
    } else if (playerTotal < bankerTotal) {
        result = 'Banker wins!';
    } else {
        result = 'It\'s a tie!';
    }

       // Update player panel
       let playerPanel = document.getElementById('player-result');
       playerPanel.innerHTML = `Hand: ${playerHand[0].value}, ${playerHand[1].value}`;
       if (playerThirdCard) {
           playerPanel.innerHTML += `, ${playerThirdCard.value} (${getTotal(playerHand)})`;
       } else {
           playerPanel.innerHTML += ` (${getTotal(playerHand)})`;
       }
   
       // Update banker panel
       let bankerPanel = document.getElementById('banker-result');
       bankerPanel.innerHTML = `Hand: ${bankerHand[0].value}, ${bankerHand[1].value}`;
       if (bankerThirdCard) {
           bankerPanel.innerHTML += `, ${bankerThirdCard.value} (${getTotal(bankerHand)})`;
       } else {
           bankerPanel.innerHTML += ` (${getTotal(bankerHand)})`;
       }
   
       // Display the result in the gold result panel
       let resultElement = document.getElementById('result');
       resultElement.innerHTML = `Result: ${result}`;
   

    let playerLastCardIndex = playerHand.length - 1;
    let bankerLastCardIndex = bankerHand.length - 1;

    document.getElementById('result').innerHTML = `Player Hand: ${playerHand[0].value}, ${playerHand[1].value}`;
    if (playerThirdCard) {
        document.getElementById('result').innerHTML += `, ${playerThirdCard.value} (${getTotal(playerHand)})`;
    } else {
        document.getElementById('result').innerHTML += ` (${getTotal(playerHand)})`;
    }
    document.getElementById('result').innerHTML += `<br>`;

    document.getElementById('result').innerHTML += `Banker Hand: ${bankerHand[0].value}, ${bankerHand[1].value}`;
    if (bankerThirdCard) {
        document.getElementById('result').innerHTML += `, ${bankerThirdCard.value} (${getTotal(bankerHand)})`;
    } else {
        document.getElementById('result').innerHTML += ` (${getTotal(bankerHand)})`;
    }
    document.getElementById('result').innerHTML += `<br>`;

    document.getElementById('result').innerHTML += `Result: ${result}`;
}
