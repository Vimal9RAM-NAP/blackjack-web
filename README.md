# 🃏 Interactive Web Blackjack

An interactive, browser-based Blackjack game engineered with pure HTML5, CSS3, and modern Vanilla JavaScript (ES6+). Features full game loop state management, dynamic Ace value adjustment, dealer AI decision-making, and bankroll tracking.

Features full game loop state management, dynamic Ace total adjustment, dealer AI logic, real-time bankroll tracking, synthesized sound effects via the **Web Audio API**, state persistence via **localStorage**, and an achievement-based milestone reward system.

🎮 **[Play Live Demo Here](https://Vimal9RAM-NAP.github.io/blackjack-web/)**

---

## 🏆 Tiered Milestone System

Track your chip balance and climb the ranks from **Rookie** to elite player titles as you win rounds and build your bankroll:

| Bankroll Threshold | Player Title Unlocked  |
| :----------------- | :--------------------- |
| **$5,000**         | **Jack of All Trades** |
| **$10,000**        | **Pro**                |
| **$20,000**        | **Top Gun**            |
| **$50,000**        | **Unbreakable**        |
| **$100,000**       | **Luck Is My Name**    |

---

---

## 🌟 Key Features

- **Landing Modal / Start Screen:** Introduces game rules, objective, and milestone previews before launching into gameplay.
- **Dynamic Hand Evaluation:** Automatically evaluates hands and handles Ace soft/hard total adjustments (1 vs 11) dynamically.
- **Dealer AI Logic:** Built-in automated dealer loop that draws cards until reaching a minimum score of 17.

* **Synthesized Audio Engine:** Built-in card slide, chip clink, and milestone unlock fanfare generated dynamically using the native browser **Web Audio API** (zero external mp3 assets).
* **Modern Typography & Dark Felt UI:** Styled with Google Fonts (**Plus Jakarta Sans** headings and **Inter** body text) over a classic casino felt layout optimized for desktop and mobile devices.

- **Bankroll & Betting System:** Real-time balance tracking, custom wager inputs, and win/loss/push payout calculations.
- **Responsive UI:** Styled with pure CSS to fit seamlessly across mobile and desktop browsers.
- **Zero Dependencies:** Lightweight architecture built without external frameworks or heavy build tools.

---

## 🛠️ Tech Stack & Concepts Applied

| Component           | Technology          | Core Concepts Demonstrated                                                         |
| :------------------ | :------------------ | :--------------------------------------------------------------------------------- |
| **Logic & State**   | Vanilla JavaScript  | ES6 Array methods, Fisher-Yates shuffle algorithm, DOM manipulation, state control |
| **Structure**       | HTML5               | Semantic markup, structured input controls                                         |
| **Audio**           | Web Audio API       | Frequency synthesis, gain control envelopes, real-time audio contexts              |
| **Styling & Fonts** | CSS3 & Google Fonts | Modern CSS variables, Flexbox layout, Plus Jakarta Sans & Inter typography         |
| **Hosting**         | GitHub Pages        | Continuous deployment directly from source branch                                  |

---

## 🚀 Local Setup & Installation

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/blackjack-web.git](https://github.com/YOUR_GITHUB_USERNAME/blackjack-web.git)
   ```
2. **Navigate into the directory:**
   ```bash
   cd blackjack-web
   ```
3. **Open in browser:**
   Open `index.html` directly in your browser, or use VS Code's Live Server extension.

## 📄 License

This project is open source and available under the MIT License.
