# Tarik Ketupat Matematika

A classroom math game where a teacher (host) projects a quiz on screen and students join via their phones. Two teams — **Tim Opor** and **Tim Rendang** — compete by answering math questions. Correct answers "pull" a ketupat marker toward their side in a tug-of-war animation.

## How It Works

1. **Teacher** opens the app, configures math mode and difficulty, and creates a room
2. A **6-digit PIN** and QR code are displayed for students to join
3. **Students** join via phone, enter the PIN and their name, and are assigned to a team
4. The teacher starts the game — questions appear on the projector with a countdown timer
5. Students answer on their phones; correct answers shift the tug-of-war ketupat marker
6. After all questions, the winning team is announced

## Tech Stack

- **React 19** + **Vite**
- **React Router v7** — client-side routing
- **Tailwind CSS v3** — neubrutalism design system
- **lucide-react** — icons
- **qrcode.react** — QR code generation
- **Vitest** + **Testing Library** — unit tests

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in two tabs — one as host, one as player — to simulate multiplayer locally.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run test       # Run tests once
npm run test:watch # Run tests in watch mode
```

## Project Structure

```
src/
├── context/
│   └── MockGameContext.jsx     # Single source of truth — all game state & actions
├── pages/
│   ├── Home.jsx                # Landing page
│   ├── host/
│   │   ├── HostSetup.jsx       # Configure mode & difficulty, create room
│   │   ├── HostLobby.jsx       # Show PIN/QR code, wait for players
│   │   ├── HostGameplay.jsx    # Project questions + timer + tug-of-war
│   │   └── HostResult.jsx      # Winner announcement
│   └── player/
│       ├── PlayerJoin.jsx      # Enter PIN and name
│       ├── PlayerWaiting.jsx   # Show team assignment, wait for host
│       ├── PlayerGamepad.jsx   # 4-button answer controller
│       └── PlayerResult.jsx    # Win/lose screen
├── components/
│   ├── host/
│   │   ├── TimerBar.jsx        # Countdown timer (green -> amber -> red)
│   │   └── KetupatAnim.jsx     # Tug-of-war marker animation
│   ├── player/
│   │   └── AnswerPad.jsx       # 2x2 answer buttons with feedback
│   └── shared/
│       └── Button.jsx
└── data/
    └── mockSoal.json           # Question bank (addition, subtraction, multiplication)
```

## Routes

| Path | Page | Role |
|------|------|------|
| `/` | Home | Choose Host or Player |
| `/host` | HostSetup | Configure game settings |
| `/host/lobby` | HostLobby | Display PIN, wait for players |
| `/host/game` | HostGameplay | Active question display |
| `/host/result` | HostResult | Final scores & winner |
| `/play` | PlayerJoin | Enter PIN and name |
| `/play/wait` | PlayerWaiting | Team assignment screen |
| `/play/game` | PlayerGamepad | Answer buttons |
| `/play/result` | PlayerResult | Win/lose screen |

## Game State

`MockGameContext` manages:

| Field | Values |
|-------|--------|
| `gameStatus` | `idle` \| `lobby` \| `playing` \| `finished` |
| `gameConfig.mode` | `penjumlahan` \| `pengurangan` \| `perkalian` |
| `gameConfig.difficulty` | `mudah` \| `sedang` \| `sulit` |
| `teamScores` | `{ opor: number, rendang: number }` |

> **Phase 1:** Fully functional UI with mock state via React Context. No backend — multiplayer is simulated by sharing state across browser tabs.
