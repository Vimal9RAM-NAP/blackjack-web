# 🃏 INTERACTIVE WEB BLACKJACK : HIGH ROLLER BLACKJACK

![High Roller Blackjack](screenshots/linkedin-thumbnail.png)

An interactive, browser-based Blackjack game engineered with pure HTML5, CSS3, and modern Vanilla JavaScript (ES6+). Features full game loop state management, dynamic Ace value adjustment, dealer AI decision-making, synthesized Web Audio API sound effects, local storage persistence, and an achievement milestone system.

🎮 **[Play Live Demo Here](https://Vimal9RAM-NAP.github.io/blackjack-web/)**

---

## 🌟 Key Features

- **Landing Modal / Start Screen:** Introduces game rules, objectives, and milestone previews before launching into gameplay.
- **Dynamic Hand Evaluation:** Automatically evaluates hands and handles Ace soft/hard total adjustments (1 vs 11) dynamically.
- **Dealer AI Logic:** Automated dealer turn that hits until reaching a minimum score of 17.
- **Synthesized Audio Engine:** Custom card slide, chip placement, and milestone unlock sound effects generated dynamically using the native browser **Web Audio API** (zero external MP3 assets).
- **State Persistence:** Automatically saves your bankroll, highest balance, and unlocked titles using browser **localStorage**.
- **Dark Felt Casino UI:** Designed with an authentic dark-green felt aesthetic, recessed table slots, and clean typography using Google Fonts (**Cinzel** and **Inter**).
- **CSS Keyframe Animations:** Smooth card slide-in and placement transitions on every deal and hit.
- **Bankroll & Betting System:** Real-time balance tracking, custom chip wagers, split/double-down actions, and win/loss/push payout logic.
- **Zero Dependencies:** Built entirely with lightweight vanilla technologies without external frameworks or build tools.

---

## 🏆 Tiered Milestone System

Track your chip balance and climb the ranks from **Rookie** to elite player titles as you win rounds and build your bankroll:

| Bankroll Threshold | Player Title Unlocked  |
| :----------------- | :--------------------- |
| **$5,000**         | **Jack of All Trades** |
| **$10,000**        | **Pro**                |
| **$20,000**        | **Top Gun**            |
| **$50,0000**       | **Unbreakable**        |
| **$100,000**       | **Luck Is My Name**    |

---

## 🛠️ Tech Stack & Concepts Applied

| Component            | Technology          | Core Concepts Demonstrated                                                         |
| :------------------- | :------------------ | :--------------------------------------------------------------------------------- |
| **Logic & State**    | Vanilla JavaScript  | ES6 Array methods, Fisher-Yates shuffle algorithm, DOM manipulation, state control |
| **Structure**        | HTML5               | Semantic markup, modal overlays, structured input controls                         |
| **Styling & Design** | CSS3 & Google Fonts | Custom felt UI design, Flexbox layouts, Cinzel & Inter typography                  |
| **Animations**       | CSS3 Keyframes      | Transform compositions, scale transitions, dynamic class toggles                   |
| **Audio**            | Web Audio API       | Frequency synthesis, gain control envelopes, real-time audio contexts              |
| **Storage**          | Web Storage API     | LocalStorage state management and high-score retention                             |
| **Hosting**          | GitHub Pages        | Continuous deployment directly from source repository                              |

---

## 🚀 Local Setup & Installation

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Vimal9RAM-NAP/blackjack-web.git](https://github.com/Vimal9RAM-NAP/blackjack-web.git)
   ```
2. **Navigate into the directory:**
   ```bash
   cd blackjack-web
   ```
3. **Open in browser:**
   Open `index.html` directly in your browser, or use VS Code's Live Server extension.

## 📄 License

This project is open source and available under the MIT License.
