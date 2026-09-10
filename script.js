const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let splitHand = [];
let dealerHand = [];
let chips = 1000;
let currentBet = 0;
let splitBet = 0;
let isSplit = false;
let activeHandIndex = 0; // 0 for main hand, 1 for split hand
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
    return true;
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
  splitHand = [];
  isSplit = false;
  activeHandIndex = 0;
  splitBet = 0;
  gameOver = false;

  document.getElementById('split-hand-section').style.display = 'none';
  document.getElementById('betting-controls').style.display = 'none';
  document.getElementById('game-controls').style.display = 'block';
  document.getElementById('double-btn').style.display = 'inline-block';

  // Check for Split condition (Matching Ranks)
  if (playerHand[0].rank === playerHand[1].rank && chips >= currentBet) {
    document.getElementById('split-btn').style.display = 'inline-block';
  } else {
    document.getElementById('split-btn').style.display = 'none';
  }

  document.getElementById('status-message').textContent = 'Hit, Stand, or Double Down?';
  updateUI(true);
}

function updateUI(hideDealerCard = false) {
  renderHand(playerHand, 'player-cards');
  document.getElementById('player-score').textContent = calculateScore(playerHand);

  if (isSplit) {
    renderHand(splitHand, 'player-cards-2');
    document.getElementById('player-score-2').textContent = calculateScore(splitHand);
    document.getElementById('active-hand-indicator').textContent = activeHandIndex === 0 ? '(Playing Hand 1)' : '(Playing Hand 2)';
  } else {
    document.getElementById('active-hand-indicator').textContent = '';
  }

  renderHand(dealerHand, 'dealer-cards', hideDealerCard);
  document.getElementById('dealer-score').textContent = hideDealerCard ? '?' : calculateScore(dealerHand);
}

function hit() {
  if (gameOver) return;

  document.getElementById('double-btn').style.display = 'none';
  document.getElementById('split-btn').style.display = 'none';

  const currentHand = activeHandIndex === 0 ? playerHand : splitHand;
  currentHand.push(deck.pop());
  updateUI(true);

  if (calculateScore(currentHand) > 21) {
    if (isSplit && activeHandIndex === 0) {
      activeHandIndex = 1;
      document.getElementById('status-message').textContent = 'Hand 1 Busted! Playing Hand 2...';
      updateUI(true);
    } else {
      if (!isSplit) {
        endGame('Bust! You lost your bet.');
      } else {
        processDealerTurn();
      }
    }
  }
}

function doubleDown() {
  if (gameOver || chips < currentBet) {
    document.getElementById('status-message').textContent = 'Not enough chips to Double Down!';
    return;
  }

  chips -= currentBet;
  currentBet *= 2;
  document.getElementById('chips').textContent = chips;

  playerHand.push(deck.pop());
  updateUI(true);

  if (calculateScore(playerHand) > 21) {
    endGame('Busted on Double Down!');
  } else {
    stand();
  }
}

function splitHand() {
  if (chips < currentBet) return;

  isSplit = true;
  splitBet = currentBet;
  chips -= splitBet;
  document.getElementById('chips').textContent = chips;

  splitHand.push(playerHand.pop());
  playerHand.push(deck.pop());
  splitHand.push(deck.pop());

  document.getElementById('split-hand-section').style.display = 'block';
  document.getElementById('split-btn').style.display = 'none';
  document.getElementById('double-btn').style.display = 'none';
  document.getElementById('status-message').textContent = 'Playing Hand 1...';

  updateUI(true);
}

function stand() {
  if (gameOver) return;

  if (isSplit && activeHandIndex === 0) {
    activeHandIndex = 1;
    document.getElementById('status-message').textContent = 'Playing Hand 2...';
    updateUI(true);
    return;
  }

  processDealerTurn();
}

function processDealerTurn() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  const dealerScore = calculateScore(dealerHand);
  updateUI(false);

  let totalPayout = 0;
  let summary = [];

  // Evaluate Hand 1
  totalPayout += evaluateHandScore(playerHand, currentBet, dealerScore, summary, "Hand 1");

  // Evaluate Hand 2 if split
  if (isSplit) {
    totalPayout += evaluateHandScore(splitHand, splitBet, dealerScore, summary, "Hand 2");
  }

  chips += totalPayout;
  endGame(summary.join(' | '));
}

function evaluateHandScore(hand, bet, dealerScore, summaryArray, label) {
  const score = calculateScore(hand);
  if (score > 21) {
    summaryArray.push(`${label}: Bust`);
    return 0;
  }
  if (dealerScore > 21 || score > dealerScore) {
    summaryArray.push(`${label}: Win`);
    return bet * 2;
  } else if (score === dealerScore) {
    summaryArray.push(`${label}: Push`);
    return bet;
  } else {
    summaryArray.push(`${label}: Loss`);
    return 0;
  }
}

function endGame(message) {
  gameOver = true;
  document.getElementById('chips').textContent = chips;

  const upgraded = checkMilestones();
  if (upgraded) {
    message += ` 🎉 New Title: ${currentTitle}!`;
  }

  document.getElementById('status-message').textContent = message;
  document.getElementById('betting-controls').style.display = 'block';
  document.getElementById('game-controls').style.display = 'none';
}