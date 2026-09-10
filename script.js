const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let splitHand = [];
let dealerHand = [];
let chips = 1000;
let highestBankroll = 1000;
let currentBet = 0;
let splitBet = 0;
let isSplit = false;
let activeHandIndex = 0;
let gameOver = false;
let currentTitle = "Rookie";
let audioCtx = null; // Lazy initialization on first click

const MILESTONES = [
  { threshold: 100000, title: "Luck Is My Name" },
  { threshold: 50000, title: "Unbreakable" },
  { threshold: 20000, title: "Top Gun" },
  { threshold: 10000, title: "Pro" },
  { threshold: 5000, title: "Jack of All Trades" }
];

// --- SOUND SYNTHESIZER ---
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'card') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'chip') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'unlock') {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const noteOsc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      noteOsc.connect(noteGain);
      noteGain.connect(audioCtx.destination);
      
      noteOsc.frequency.setValueAtTime(freq, now + index * 0.1);
      noteGain.gain.setValueAtTime(0.2, now + index * 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.3);
      
      noteOsc.start(now + index * 0.1);
      noteOsc.stop(now + index * 0.1 + 0.3);
    });
  }
}

// --- LOCAL STORAGE MANAGER ---
function loadGameState() {
  const savedChips = localStorage.getItem('bj_chips');
  const savedHigh = localStorage.getItem('bj_highest');
  const savedTitle = localStorage.getItem('bj_title');

  if (savedChips !== null) chips = parseInt(savedChips);
  if (savedHigh !== null) highestBankroll = parseInt(savedHigh);
  if (savedTitle !== null) currentTitle = savedTitle;

  document.getElementById('chips').textContent = chips;
  document.getElementById('player-title').textContent = currentTitle;
}

function saveGameState() {
  localStorage.setItem('bj_chips', chips);
  localStorage.setItem('bj_highest', highestBankroll);
  localStorage.setItem('bj_title', currentTitle);
}

// --- START GAME ACTION ---
function enterGame(event) {
  if (event) event.preventDefault();

  initAudio(); // Safely start audio on user gesture

  const startScreen = document.getElementById('start-screen');
  if (startScreen) {
    startScreen.style.display = 'none';
  }

  loadGameState();
  checkMilestones();
}

function checkMilestones() {
  if (chips > highestBankroll) {
    highestBankroll = chips;
  }

  let earnedTitle = "Rookie";
  for (let milestone of MILESTONES) {
    if (highestBankroll >= milestone.threshold) {
      earnedTitle = milestone.title;
      break;
    }
  }

  let upgraded = false;
  if (earnedTitle !== currentTitle) {
    currentTitle = earnedTitle;
    upgraded = true;
    playSound('unlock');
  }

  document.getElementById('player-title').textContent = currentTitle;
  saveGameState();
  return upgraded;
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
    cardDiv.classList.add('card', 'draw-anim');
    
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

  playSound('chip');
  chips -= currentBet;
  document.getElementById('chips').textContent = chips;
  saveGameState();

  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  splitHand = [];
  isSplit = false;
  activeHandIndex = 0;
  splitBet = 0;
  gameOver = false;

  playSound('card');

  document.getElementById('split-hand-section').style.display = 'none';
  document.getElementById('betting-controls').style.display = 'none';
  document.getElementById('game-controls').style.display = 'block';
  document.getElementById('double-btn').style.display = 'inline-block';

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

  playSound('card');
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

  playSound('chip');
  chips -= currentBet;
  currentBet *= 2;
  document.getElementById('chips').textContent = chips;

  playSound('card');
  playerHand.push(deck.pop());
  updateUI(true);

  if (calculateScore(playerHand) > 21) {
    endGame('Busted on Double Down!');
  } else {
    stand();
  }
}

function handleSplit() {
  if (chips < currentBet) return;

  playSound('chip');
  isSplit = true;
  splitBet = currentBet;
  chips -= splitBet;
  document.getElementById('chips').textContent = chips;

  playSound('card');
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
    playSound('card');
  }

  const dealerScore = calculateScore(dealerHand);
  updateUI(false);

  let totalPayout = 0;
  let summary = [];

  totalPayout += evaluateHandScore(playerHand, currentBet, dealerScore, summary, "Hand 1");

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
    message += ` 🎉 New Title Unlocked: ${currentTitle}!`;
  }

  saveGameState();

  document.getElementById('status-message').textContent = message;
  document.getElementById('betting-controls').style.display = 'block';
  document.getElementById('game-controls').style.display = 'none';
}