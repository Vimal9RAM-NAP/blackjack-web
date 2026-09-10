const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let chips = 1000;
let currentBet = 0;
let gameOver = false;
let currentTitle = "Rookie";

const MILESTONES = [
  { threshold: 100000, title: "Luck Is My Name" },
  { threshold: 50000, title: "Unbreakable" },
  { threshold: 20000, title: "Top Gun" },
  { threshold: 10000, title: "Pro" },
  { threshold: 5000, title: "Jack of All Trades" }
];

function enterGame() {
  document.getElementById('start-screen').style.display = 'none';
  checkMilestones();
}

function checkMilestones() {
  let earnedTitle = "Rookie";
  
  for (let milestone of MILESTONES) {
    if (chips >= milestone.threshold) {
      earnedTitle = milestone.title;
      break;
    }
  }

  if (earnedTitle !== currentTitle) {
    currentTitle = earnedTitle;
    document.getElementById('player-title').textContent = currentTitle;
    return true; // Indicates title upgraded
  }
  
  document.getElementById('player-title').textContent = currentTitle;
  return false;
}

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  if (card.rank === 'A') return 11;
  return parseInt(card.rank);
}

function calculateScore(hand) {
  let total = 0;
  let aces = 0;

  for (let card of hand) {
    total += getCardValue(card);
    if (card.rank === 'A') aces++;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

function renderHand(hand, elementId, hideFirstCard = false) {
  const container = document.getElementById(elementId);
  container.innerHTML = '';

  hand.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    
    if (hideFirstCard && index === 0) {
      cardDiv.classList.add('hidden');
      cardDiv.textContent = '?';
    } else {
      if (card.suit === '♥' || card.suit === '♦') {
        cardDiv.classList.add('red');
      }
      cardDiv.textContent = `${card.rank}${card.suit}`;
    }
    
    container.appendChild(cardDiv);
  });
}

function startGame() {
  const betInput = document.getElementById('bet-input');
  currentBet = parseInt(betInput.value);

  if (isNaN(currentBet) || currentBet <= 0 || currentBet > chips) {
    document.getElementById('status-message').textContent = 'Invalid bet amount!';
    return;
  }

  chips -= currentBet;
  document.getElementById('chips').textContent = chips;

  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  gameOver = false;

  document.getElementById('betting-controls').style.display = 'none';
  document.getElementById('game-controls').style.display = 'block';
  document.getElementById('status-message').textContent = 'Hit or Stand?';

  updateUI(true);
}

function updateUI(hideDealerCard = false) {
  renderHand(playerHand, 'player-cards');
  document.getElementById('player-score').textContent = calculateScore(playerHand);

  renderHand(dealerHand, 'dealer-cards', hideDealerCard);
  if (hideDealerCard) {
    document.getElementById('dealer-score').textContent = '?';
  } else {
    document.getElementById('dealer-score').textContent = calculateScore(dealerHand);
  }
}

function hit() {
  if (gameOver) return;

  playerHand.push(deck.pop());
  updateUI(true);

  if (calculateScore(playerHand) > 21) {
    endGame('Bust! You lost your bet.');
  }
}

function stand() {
  if (gameOver) return;

  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  updateUI(false);

  if (dealerScore > 21) {
    chips += currentBet * 2;
    endGame('Dealer busted! You win!');
  } else if (playerScore > dealerScore) {
    chips += currentBet * 2;
    endGame('You win!');
  } else if (playerScore < dealerScore) {
    endGame('Dealer wins!');
  } else {
    chips += currentBet;
    endGame('Push (Tie)! Bet returned.');
  }
}

function endGame(message) {
  gameOver = true;
  document.getElementById('chips').textContent = chips;
  
  const upgraded = checkMilestones();
  if (upgraded) {
    message += ` 🎉 New Title Unlocked: ${currentTitle}!`;
  }

  document.getElementById('status-message').textContent = message;
  document.getElementById('betting-controls').style.display = 'block';
  document.getElementById('game-controls').style.display = 'none';
}