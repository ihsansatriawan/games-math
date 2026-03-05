# Tarik Ketupat Matematika — Frontend Phase 1 Design

**Date:** 2026-03-05
**Scope:** Phase 1 — Full UI, routing, and local state mock (no backend)
**Approach:** Option A — Single Vite React app with MockGameContext

---

## 1. Architecture & Project Setup

**Stack:**
- Vite + React, scaffolded at `tarik-ketupat/` inside the repo root
- Tailwind CSS v3 with custom design tokens:
  - `primary: #f59f0a` (amber brand)
  - `background-light: #FFFDF5` (cream)
  - Font: `Plus Jakarta Sans` (display weights 400–800)
  - Custom CSS classes: `.neubrutalism` (4px border + 8px shadow), `.neubrutalism-sm` (3px border + 4px shadow)
  - `.ketupat-pattern` background for result screens
- React Router v6 (`BrowserRouter`)
- Lucide React for icons
- `qrcode.react` for QR code in HostLobby

**Directory structure:**
```
tarik-ketupat/src/
├── assets/images/
├── components/
│   ├── shared/Button.jsx
│   ├── host/
│   │   ├── TimerBar.jsx
│   │   └── KetupatAnim.jsx
│   └── player/
│       └── AnswerPad.jsx
├── context/
│   └── MockGameContext.jsx
├── data/
│   └── mockSoal.json
└── pages/
    ├── Home.jsx
    ├── host/
    │   ├── HostSetup.jsx
    │   ├── HostLobby.jsx
    │   ├── HostGameplay.jsx
    │   └── HostResult.jsx
    └── player/
        ├── PlayerJoin.jsx
        ├── PlayerWaiting.jsx
        ├── PlayerGamepad.jsx
        └── PlayerResult.jsx
```

---

## 2. Routing

All routes live in `App.jsx` using `BrowserRouter`.

| Path | Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Landing: two neubrutalism buttons → `/host` and `/play` |
| `/host` | `HostSetup.jsx` | Game config (math mode cards + difficulty pills) |
| `/host/lobby` | `HostLobby.jsx` | Giant PIN + QR code + two team player columns |
| `/host/game` | `HostGameplay.jsx` | Timer bar + question text + KetupatAnim |
| `/host/result` | `HostResult.jsx` | Winner banner on ketupat-pattern background |
| `/play` | `PlayerJoin.jsx` | PIN + name input form |
| `/play/wait` | `PlayerWaiting.jsx` | Team color bg + team name + waiting message |
| `/play/game` | `PlayerGamepad.jsx` | 4 large colored answer buttons via AnswerPad |
| `/play/result` | `PlayerResult.jsx` | Win/lose card |

---

## 3. State Management (MockGameContext)

Single React Context simulating the backend. Opening two browser tabs on the same app lets teacher and student UIs interact.

**State shape:**
```js
{
  roomPin: String,          // "789123" — 6-digit generated PIN
  gameStatus: String,       // 'idle' | 'lobby' | 'playing' | 'finished'
  gameConfig: {
    mode: String,           // 'penjumlahan' | 'pengurangan' | 'perkalian'
    difficulty: String,     // 'mudah' | 'sedang' | 'sulit'
  },
  players: Array,           // [{ name: String, team: 'opor' | 'rendang' }]
  currentQuestion: Object,  // { id, soal, opsi: {A,B,C,D}, jawaban_benar }
  currentQuestionIndex: Number,
  teamScores: {
    opor: Number,           // raw points, +10 per correct answer
    rendang: Number,
  },
}
```

**Actions:**
- `createRoom(config)` — generates random PIN, sets `gameConfig`, status → `'lobby'`
- `joinRoom(pin, name)` — validates PIN, adds player with random team assignment, status → `'lobby'`
- `startGame()` — status → `'playing'`, loads `currentQuestion[0]`
- `submitAnswer(team, isCorrect)` — if correct: `teamScores[team] += 10`
- `nextQuestion()` — advances `currentQuestionIndex`; if last question, status → `'finished'`
- `endGame()` — status → `'finished'`

---

## 4. Component Designs

### `KetupatAnim.jsx`
- Props: `scoreOpor` (Number), `scoreRendang` (Number)
- Rope container: full-width `bg-amber-50` rounded card with neubrutalism border
- Horizontal rope: `h-4 bg-amber-800` stripe across center
- Ketupat marker: `size-20 bg-primary rotate-45` positioned on rope via absolute positioning
- Position formula: `netPos = clamp(scoreRendang - scoreOpor, -50, 50)`
- Applied as `style={{ transform: `translateX(${netPos}%)` }}`
- Animation: `transition-transform duration-500 ease-out`
- Team labels: "Tim Opor" (left, amber-600), "Tim Rendang" (right, amber-900)

### `AnswerPad.jsx`
- Props: reads `currentQuestion` from Context
- Internal state: `selectedAnswer` (String|null), `isSubmitted` (Boolean)
- Layout: `grid grid-cols-2 gap-4 h-[70vh]`
- Button colors: A=blue-500, B=red-500, C=emerald-500, D=yellow-500
- On click:
  1. `isSubmitted = true`
  2. Show green border if `answer === jawaban_benar`, else red
  3. Call `submitAnswer(playerTeam, isCorrect)`
  4. All buttons: `opacity-50 pointer-events-none`
- `useEffect` on `currentQuestion.id` → resets `selectedAnswer` and `isSubmitted`

### `TimerBar.jsx`
- Internal state: `timeLeft` (Number, starts at 10)
- `setInterval` countdown in `useEffect`, calls `nextQuestion()` on expire
- Visual: full-width progress bar, `bg-rose-500` fill shrinks proportionally, neubrutalism border

### `Button.jsx` (shared)
- Props: `variant` (`primary` | `success` | `danger` | `outline`), `children`, `onClick`, `disabled`
- Always applies `.neubrutalism` class + hover lift (`hover:-translate-x-0.5 hover:-translate-y-0.5`)

---

## 5. Mock Data Schema

`src/data/mockSoal.json` — at minimum 5 questions per mode/difficulty combination used in Phase 1:

```json
[
  {
    "id": "q_001",
    "tipe": "penjumlahan",
    "soal": "Ibu merebus 8 ketupat. Ayah membawa 5 ketupat lagi. Totalnya?",
    "opsi": { "A": "11", "B": "12", "C": "13", "D": "14" },
    "jawaban_benar": "C"
  }
]
```

---

## 6. Visual Design System

All screens follow neubrutalism language:
- **Colors:** amber-brand (`#f59f0a`), cream background (`#FFFDF5`), emerald for success, rose for danger
- **Tim Opor:** `bg-amber-400` / amber accents
- **Tim Rendang:** `bg-amber-900` / dark amber accents
- **Typography:** Plus Jakarta Sans, `font-black` for headings, `uppercase` + `tracking-wide` for labels
- **Borders/shadows:** 3-4px solid `#181511`, `box-shadow: 4-8px 4-8px 0 #181511`
- **Interactive elements:** `hover:-translate-y-0.5 hover:-translate-x-0.5` lift + increased shadow

---

## 7. Phase 1 Acceptance Criteria

- [ ] All 9 routes render without errors
- [ ] Host can create room → PIN generated → navigates to lobby
- [ ] Player can join with PIN → assigned team → sees waiting screen
- [ ] Host starts game → both views update (same-tab simulation)
- [ ] Player submits answer → correct/wrong feedback shown → KetupatAnim rope moves
- [ ] Timer counts down 10s → auto-advances to next question
- [ ] Game ends after all questions → both views show result screen
- [ ] Responsive: host optimized for desktop/projector, player optimized for mobile portrait
