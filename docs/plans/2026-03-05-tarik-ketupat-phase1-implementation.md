# Tarik Ketupat Matematika — Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the complete Phase 1 frontend for Tarik Ketupat Matematika — all UI screens, routing, and mocked real-time state — as a single Vite+React app at `tarik-ketupat/`.

**Architecture:** Single Vite+React app. Host and Player share one `MockGameContext` so opening two browser tabs simulates multiplayer. No backend. All routes in `App.jsx` under `/host/*` and `/play/*`.

**Tech Stack:** Vite, React 18, Tailwind CSS v3, React Router v6, Lucide React, qrcode.react, Vitest + @testing-library/react (for context logic tests)

---

## Task 1: Scaffold Vite React App

**Files:**
- Create: `tarik-ketupat/` (new Vite project)

**Step 1: Scaffold the app**

Run from the repo root:
```bash
cd /Users/ihsansatriawan/Projects/personal/games-math
npm create vite@latest tarik-ketupat -- --template react
cd tarik-ketupat
npm install
```
Expected: `tarik-ketupat/` directory created, `npm install` completes without errors.

**Step 2: Install all dependencies**

```bash
npm install react-router-dom lucide-react qrcode.react
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npx tailwindcss init -p
```

**Step 3: Verify dev server starts**

```bash
npm run dev
```
Expected: `http://localhost:5173` opens with the default Vite+React page. Kill the server (`Ctrl+C`).

**Step 4: Commit**

```bash
cd /Users/ihsansatriawan/Projects/personal/games-math
git add tarik-ketupat/
git commit -m "chore: scaffold Vite React app with all dependencies"
```

---

## Task 2: Tailwind Config & Design System

**Files:**
- Modify: `tarik-ketupat/tailwind.config.js`
- Modify: `tarik-ketupat/src/index.css`
- Modify: `tarik-ketupat/index.html`
- Modify: `tarik-ketupat/vite.config.js`

**Step 1: Configure Tailwind with design tokens**

Replace `tarik-ketupat/tailwind.config.js` entirely:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#f59f0a',
        'bg-light': '#FFFDF5',
        opor: '#fbbf24',
        rendang: '#92400e',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Step 2: Add global styles and neubrutalism CSS classes**

Replace `tarik-ketupat/src/index.css` entirely:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg-light font-display text-slate-900 min-h-screen;
  }
}

@layer components {
  .neubrutalism {
    border: 4px solid #181511;
    box-shadow: 8px 8px 0px 0px #181511;
  }
  .neubrutalism-sm {
    border: 3px solid #181511;
    box-shadow: 4px 4px 0px 0px #181511;
  }
  .ketupat-pattern {
    background-color: #f59f0a;
    background-image: radial-gradient(#ffffff 1px, transparent 1px);
    background-size: 20px 20px;
  }
  .neo-btn {
    @apply transition-all duration-150;
  }
  .neo-btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0px 0px #181511;
  }
  .neo-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px #181511;
  }
}
```

**Step 3: Add Plus Jakarta Sans font to index.html**

In `tarik-ketupat/index.html`, add inside `<head>` before the closing tag:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
```

**Step 4: Configure Vitest in vite.config.js**

Replace `tarik-ketupat/vite.config.js` entirely:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
  },
})
```

**Step 5: Create test setup file**

Create `tarik-ketupat/src/test-setup.js`:
```js
import '@testing-library/jest-dom'
```

**Step 6: Add test script to package.json**

In `tarik-ketupat/package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 7: Verify Tailwind works**

Edit `tarik-ketupat/src/App.jsx` to just:
```jsx
export default function App() {
  return <div className="neubrutalism p-8 m-8 bg-primary text-white font-display font-black text-2xl">Design system works!</div>
}
```
Run `npm run dev` — verify you see an amber box with thick black border and shadow. Kill server.

**Step 8: Commit**

```bash
git add tarik-ketupat/
git commit -m "chore: configure Tailwind design system, neubrutalism classes, and Vitest"
```

---

## Task 3: Mock Data (mockSoal.json)

**Files:**
- Create: `tarik-ketupat/src/data/mockSoal.json`

**Step 1: Create mock questions file**

Create `tarik-ketupat/src/data/mockSoal.json`:
```json
[
  {
    "id": "q_001",
    "tipe": "penjumlahan",
    "difficulty": "mudah",
    "soal": "Ibu merebus 8 ketupat. Ayah membawa 5 ketupat lagi. Totalnya?",
    "opsi": { "A": "11", "B": "12", "C": "13", "D": "14" },
    "jawaban_benar": "C"
  },
  {
    "id": "q_002",
    "tipe": "pengurangan",
    "difficulty": "mudah",
    "soal": "Ada 15 kue nastar. Dimakan Hafizh 4. Sisa berapa?",
    "opsi": { "A": "10", "B": "11", "C": "12", "D": "13" },
    "jawaban_benar": "B"
  },
  {
    "id": "q_003",
    "tipe": "penjumlahan",
    "difficulty": "mudah",
    "soal": "Andi punya 12 ketupat. Siti memberi 7 lagi. Jumlahnya?",
    "opsi": { "A": "17", "B": "18", "C": "19", "D": "20" },
    "jawaban_benar": "C"
  },
  {
    "id": "q_004",
    "tipe": "pengurangan",
    "difficulty": "mudah",
    "soal": "Ada 20 opor ayam. Dimakan 9. Sisa berapa?",
    "opsi": { "A": "9", "B": "10", "C": "11", "D": "12" },
    "jawaban_benar": "C"
  },
  {
    "id": "q_005",
    "tipe": "perkalian",
    "difficulty": "mudah",
    "soal": "Ada 4 piring, masing-masing berisi 3 ketupat. Total?",
    "opsi": { "A": "10", "B": "11", "C": "12", "D": "13" },
    "jawaban_benar": "C"
  },
  {
    "id": "q_006",
    "tipe": "penjumlahan",
    "difficulty": "sedang",
    "soal": "Toko rendang menjual 47 porsi pagi. Siang 38 porsi. Total?",
    "opsi": { "A": "83", "B": "84", "C": "85", "D": "86" },
    "jawaban_benar": "C"
  },
  {
    "id": "q_007",
    "tipe": "pengurangan",
    "difficulty": "sedang",
    "soal": "Ada 100 ketupat disiapkan. 63 sudah dibagikan. Sisa?",
    "opsi": { "A": "35", "B": "36", "C": "37", "D": "38" },
    "jawaban_benar": "C"
  },
  {
    "id": "q_008",
    "tipe": "perkalian",
    "difficulty": "sedang",
    "soal": "8 keluarga, masing-masing membuat 9 ketupat. Total?",
    "opsi": { "A": "70", "B": "71", "C": "72", "D": "73" },
    "jawaban_benar": "C"
  },
  {
    "id": "q_009",
    "tipe": "penjumlahan",
    "difficulty": "sulit",
    "soal": "Warung A menjual 256 ketupat. Warung B menjual 378. Totalnya?",
    "opsi": { "A": "632", "B": "633", "C": "634", "D": "635" },
    "jawaban_benar": "C"
  },
  {
    "id": "q_010",
    "tipe": "perkalian",
    "difficulty": "sulit",
    "soal": "Ada 24 toples. Setiap toples berisi 12 kue. Total kue?",
    "opsi": { "A": "286", "B": "287", "C": "288", "D": "289" },
    "jawaban_benar": "C"
  }
]
```

**Step 2: Commit**

```bash
git add tarik-ketupat/src/data/
git commit -m "feat: add mock question bank (mockSoal.json)"
```

---

## Task 4: MockGameContext

**Files:**
- Create: `tarik-ketupat/src/context/MockGameContext.jsx`
- Create: `tarik-ketupat/src/context/MockGameContext.test.jsx`

**Step 1: Write the failing test**

Create `tarik-ketupat/src/context/MockGameContext.test.jsx`:
```jsx
import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MockGameProvider, useMockGame } from './MockGameContext'

function TestHarness({ action }) {
  const ctx = useMockGame()
  return (
    <div>
      <span data-testid="status">{ctx.gameStatus}</span>
      <span data-testid="pin">{ctx.roomPin}</span>
      <span data-testid="players">{ctx.players.length}</span>
      <span data-testid="opor">{ctx.teamScores.opor}</span>
      <span data-testid="rendang">{ctx.teamScores.rendang}</span>
      <button onClick={() => ctx.createRoom({ mode: 'penjumlahan', difficulty: 'mudah' })}>create</button>
      <button onClick={() => ctx.joinRoom(ctx.roomPin, 'Hafizh')}>join</button>
      <button onClick={() => ctx.startGame()}>start</button>
      <button onClick={() => ctx.submitAnswer('opor', true)}>correct</button>
      <button onClick={() => ctx.submitAnswer('rendang', false)}>wrong</button>
    </div>
  )
}

describe('MockGameContext', () => {
  it('starts with idle status', () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    expect(screen.getByTestId('status').textContent).toBe('idle')
  })

  it('createRoom sets status to lobby and generates PIN', async () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    await act(() => screen.getByText('create').click())
    expect(screen.getByTestId('status').textContent).toBe('lobby')
    expect(screen.getByTestId('pin').textContent).toMatch(/^\d{6}$/)
  })

  it('joinRoom adds a player', async () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    await act(() => screen.getByText('create').click())
    await act(() => screen.getByText('join').click())
    expect(Number(screen.getByTestId('players').textContent)).toBe(1)
  })

  it('startGame sets status to playing', async () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    await act(() => screen.getByText('create').click())
    await act(() => screen.getByText('start').click())
    expect(screen.getByTestId('status').textContent).toBe('playing')
  })

  it('correct answer adds 10 points to team score', async () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    await act(() => screen.getByText('create').click())
    await act(() => screen.getByText('start').click())
    await act(() => screen.getByText('correct').click())
    expect(Number(screen.getByTestId('opor').textContent)).toBe(10)
  })

  it('wrong answer does not change score', async () => {
    render(<MockGameProvider><TestHarness /></MockGameProvider>)
    await act(() => screen.getByText('create').click())
    await act(() => screen.getByText('start').click())
    await act(() => screen.getByText('wrong').click())
    expect(Number(screen.getByTestId('rendang').textContent)).toBe(0)
  })
})
```

**Step 2: Run tests to verify they fail**

```bash
cd tarik-ketupat && npm test
```
Expected: FAIL — `MockGameContext` module not found.

**Step 3: Implement MockGameContext**

Create `tarik-ketupat/src/context/MockGameContext.jsx`:
```jsx
import { createContext, useContext, useState, useCallback } from 'react'
import mockSoal from '../data/mockSoal.json'

const MockGameContext = createContext(null)

export function MockGameProvider({ children }) {
  const [roomPin, setRoomPin] = useState('')
  const [gameStatus, setGameStatus] = useState('idle')
  const [gameConfig, setGameConfig] = useState({ mode: 'penjumlahan', difficulty: 'mudah' })
  const [players, setPlayers] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [teamScores, setTeamScores] = useState({ opor: 0, rendang: 0 })

  const questions = mockSoal.filter(
    q => q.tipe === gameConfig.mode && q.difficulty === gameConfig.difficulty
  ).length > 0
    ? mockSoal.filter(q => q.tipe === gameConfig.mode && q.difficulty === gameConfig.difficulty)
    : mockSoal

  const currentQuestion = questions[currentQuestionIndex] ?? null

  const createRoom = useCallback((config) => {
    const pin = String(Math.floor(100000 + Math.random() * 900000))
    setRoomPin(pin)
    setGameConfig(config)
    setGameStatus('lobby')
    setPlayers([])
    setTeamScores({ opor: 0, rendang: 0 })
    setCurrentQuestionIndex(0)
  }, [])

  const joinRoom = useCallback((pin, name) => {
    if (pin !== roomPin) return false
    const team = Math.random() < 0.5 ? 'opor' : 'rendang'
    setPlayers(prev => [...prev, { name, team }])
    return team
  }, [roomPin])

  const startGame = useCallback(() => {
    setGameStatus('playing')
    setCurrentQuestionIndex(0)
    setTeamScores({ opor: 0, rendang: 0 })
  }, [])

  const submitAnswer = useCallback((team, isCorrect) => {
    if (!isCorrect) return
    setTeamScores(prev => ({ ...prev, [team]: prev[team] + 10 }))
  }, [])

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => {
      if (prev + 1 >= questions.length) {
        setGameStatus('finished')
        return prev
      }
      return prev + 1
    })
  }, [questions.length])

  const endGame = useCallback(() => {
    setGameStatus('finished')
  }, [])

  return (
    <MockGameContext.Provider value={{
      roomPin, gameStatus, gameConfig, players,
      currentQuestion, currentQuestionIndex,
      teamScores, questions,
      createRoom, joinRoom, startGame,
      submitAnswer, nextQuestion, endGame,
    }}>
      {children}
    </MockGameContext.Provider>
  )
}

export function useMockGame() {
  const ctx = useContext(MockGameContext)
  if (!ctx) throw new Error('useMockGame must be used inside MockGameProvider')
  return ctx
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test
```
Expected: All 6 tests PASS.

**Step 5: Wrap app in provider — update main.jsx**

Replace `tarik-ketupat/src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MockGameProvider } from './context/MockGameContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MockGameProvider>
        <App />
      </MockGameProvider>
    </BrowserRouter>
  </StrictMode>
)
```

**Step 6: Commit**

```bash
git add tarik-ketupat/src/
git commit -m "feat: implement MockGameContext with full state and actions (6 tests pass)"
```

---

## Task 5: Shared Button Component & App Router

**Files:**
- Create: `tarik-ketupat/src/components/shared/Button.jsx`
- Modify: `tarik-ketupat/src/App.jsx`

**Step 1: Create Button component**

Create `tarik-ketupat/src/components/shared/Button.jsx`:
```jsx
const VARIANTS = {
  primary:  'bg-primary text-white',
  success:  'bg-emerald-500 text-white',
  danger:   'bg-rose-500 text-white',
  warning:  'bg-amber-400 text-slate-900',
  outline:  'bg-white text-slate-900',
}

export default function Button({ variant = 'primary', children, onClick, disabled, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        neubrutalism neo-btn
        px-6 py-3 rounded-xl font-black uppercase tracking-wide
        ${VARIANTS[variant]}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
```

**Step 2: Set up all routes in App.jsx**

Replace `tarik-ketupat/src/App.jsx`:
```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import HostSetup from './pages/host/HostSetup'
import HostLobby from './pages/host/HostLobby'
import HostGameplay from './pages/host/HostGameplay'
import HostResult from './pages/host/HostResult'
import PlayerJoin from './pages/player/PlayerJoin'
import PlayerWaiting from './pages/player/PlayerWaiting'
import PlayerGamepad from './pages/player/PlayerGamepad'
import PlayerResult from './pages/player/PlayerResult'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/host" element={<HostSetup />} />
      <Route path="/host/lobby" element={<HostLobby />} />
      <Route path="/host/game" element={<HostGameplay />} />
      <Route path="/host/result" element={<HostResult />} />
      <Route path="/play" element={<PlayerJoin />} />
      <Route path="/play/wait" element={<PlayerWaiting />} />
      <Route path="/play/game" element={<PlayerGamepad />} />
      <Route path="/play/result" element={<PlayerResult />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
```

**Step 3: Create stub pages** (so the router doesn't crash)

Create each of these files with a minimal placeholder. Run this pattern for all 9:

`tarik-ketupat/src/pages/Home.jsx`:
```jsx
export default function Home() { return <div className="p-8 font-black text-2xl">Home</div> }
```

Repeat for: `pages/host/HostSetup.jsx`, `pages/host/HostLobby.jsx`, `pages/host/HostGameplay.jsx`, `pages/host/HostResult.jsx`, `pages/player/PlayerJoin.jsx`, `pages/player/PlayerWaiting.jsx`, `pages/player/PlayerGamepad.jsx`, `pages/player/PlayerResult.jsx`

**Step 4: Verify all routes load**

```bash
npm run dev
```
Navigate to `/`, `/host`, `/host/lobby`, `/host/game`, `/host/result`, `/play`, `/play/wait`, `/play/game`, `/play/result` — each should render the stub text without errors. Kill server.

**Step 5: Commit**

```bash
git add tarik-ketupat/src/
git commit -m "feat: add shared Button, configure all routes, create page stubs"
```

---

## Task 6: Home Page

**Files:**
- Modify: `tarik-ketupat/src/pages/Home.jsx`

**Step 1: Implement Home.jsx**

Replace `tarik-ketupat/src/pages/Home.jsx`:
```jsx
import { useNavigate } from 'react-router-dom'
import { Monitor, Smartphone } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center gap-10 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-black uppercase tracking-tight leading-tight">
          TARIK KETUPAT <span className="text-primary">MATEMATIKA</span>
        </h1>
        <p className="mt-3 text-lg font-bold text-slate-500">Tarik sekuat tenaga dengan menjawab soal!</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
        <button
          onClick={() => navigate('/host')}
          className="neubrutalism neo-btn flex-1 flex flex-col items-center gap-4 p-10 bg-primary text-white rounded-2xl"
        >
          <Monitor size={48} />
          <span className="text-2xl font-black uppercase">Saya Guru</span>
          <span className="text-sm font-bold opacity-80">Tampilkan di proyektor</span>
        </button>

        <button
          onClick={() => navigate('/play')}
          className="neubrutalism neo-btn flex-1 flex flex-col items-center gap-4 p-10 bg-white text-slate-900 rounded-2xl"
        >
          <Smartphone size={48} />
          <span className="text-2xl font-black uppercase">Saya Siswa</span>
          <span className="text-sm font-bold text-slate-500">Masuk dari HP</span>
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Verify**

```bash
npm run dev
```
Open `http://localhost:5173` — verify two big neubrutalism buttons appear. Click each to confirm navigation.

**Step 3: Commit**

```bash
git add tarik-ketupat/src/pages/Home.jsx
git commit -m "feat: implement Home landing page with Host/Player navigation"
```

---

## Task 7: HostSetup Page

**Files:**
- Modify: `tarik-ketupat/src/pages/host/HostSetup.jsx`

**Step 1: Implement HostSetup.jsx**

Replace `tarik-ketupat/src/pages/host/HostSetup.jsx`:
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockGame } from '../../context/MockGameContext'

const MODES = [
  { id: 'penjumlahan', label: 'Tambah', symbol: '+' },
  { id: 'pengurangan', label: 'Kurang', symbol: '−' },
  { id: 'perkalian',   label: 'Kali',   symbol: '×' },
]
const DIFFICULTIES = [
  { id: 'mudah',  label: 'Mudah',  active: 'bg-emerald-400' },
  { id: 'sedang', label: 'Sedang', active: 'bg-amber-400' },
  { id: 'sulit',  label: 'Sulit',  active: 'bg-rose-400' },
]

export default function HostSetup() {
  const navigate = useNavigate()
  const { createRoom } = useMockGame()
  const [mode, setMode] = useState('penjumlahan')
  const [difficulty, setDifficulty] = useState('mudah')

  function handleCreate() {
    createRoom({ mode, difficulty })
    navigate('/host/lobby')
  }

  return (
    <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl neubrutalism">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-black uppercase italic text-slate-900">Persiapan Perang Ketupat!</h2>
          <p className="mt-2 text-lg font-bold text-slate-500">Konfigurasi arena pertandingan matematika kamu</p>
        </div>

        <div className="space-y-8">
          {/* Math Mode */}
          <div>
            <label className="block text-xl font-black mb-4 uppercase tracking-wide">Pilih Mode Matematika</label>
            <div className="grid grid-cols-3 gap-4">
              {MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`
                    neubrutalism neo-btn flex flex-col items-center justify-center p-6 rounded-xl
                    ${mode === m.id ? 'bg-primary text-white shadow-[6px_6px_0px_0px_#181511]' : 'bg-amber-50 text-slate-900'}
                  `}
                >
                  <span className="text-4xl font-black mb-2">{m.symbol}</span>
                  <span className="font-bold uppercase text-sm">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xl font-black mb-4 uppercase tracking-wide">Tingkat Kesulitan</label>
            <div className="flex gap-4">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`
                    flex-1 py-4 text-center rounded-xl border-4 border-slate-900 font-black uppercase tracking-wider
                    ${difficulty === d.id ? `${d.active} shadow-[4px_4px_0px_0px_#181511]` : 'bg-white'}
                    transition-all
                  `}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="neubrutalism neo-btn w-full py-6 bg-emerald-500 text-white text-3xl font-black uppercase tracking-widest rounded-2xl"
          >
            Buat Ruangan
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify**

```bash
npm run dev
```
Open `/host`. Verify: math mode cards highlight on click, difficulty buttons highlight, "Buat Ruangan" navigates to `/host/lobby`.

**Step 3: Commit**

```bash
git add tarik-ketupat/src/pages/host/HostSetup.jsx
git commit -m "feat: implement HostSetup page with math mode and difficulty selection"
```

---

## Task 8: HostLobby Page

**Files:**
- Modify: `tarik-ketupat/src/pages/host/HostLobby.jsx`

**Step 1: Implement HostLobby.jsx**

Replace `tarik-ketupat/src/pages/host/HostLobby.jsx`:
```jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { User, UtensilsCrossed, Flame } from 'lucide-react'
import { useMockGame } from '../../context/MockGameContext'

export default function HostLobby() {
  const navigate = useNavigate()
  const { roomPin, players, gameStatus, startGame } = useMockGame()

  // If no room was created yet, redirect to setup
  useEffect(() => {
    if (!roomPin) navigate('/host', { replace: true })
  }, [roomPin, navigate])

  // When game starts, navigate to gameplay
  useEffect(() => {
    if (gameStatus === 'playing') navigate('/host/game')
  }, [gameStatus, navigate])

  const oporPlayers = players.filter(p => p.team === 'opor')
  const rendangPlayers = players.filter(p => p.team === 'rendang')
  const joinUrl = `${window.location.origin}/play`

  return (
    <div className="min-h-screen bg-bg-light p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-8 text-center">
          TARIK KETUPAT <span className="text-primary">MATEMATIKA</span>
        </h1>

        <div className="grid grid-cols-12 gap-8 h-[70vh]">
          {/* PIN & QR */}
          <div className="col-span-5 flex flex-col items-center justify-center bg-white rounded-2xl neubrutalism p-10">
            <h3 className="text-2xl font-black uppercase mb-2 text-slate-500">PIN RUANGAN</h3>
            <div className="text-8xl font-black tracking-tighter text-slate-900">{roomPin}</div>
            <div className="mt-8 p-4 bg-white neubrutalism-sm rounded-xl">
              <QRCodeSVG value={joinUrl} size={140} />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-500">Scan atau ketik PIN di HP kamu</p>
          </div>

          {/* Team Lists */}
          <div className="col-span-7 grid grid-cols-2 gap-6">
            {/* Tim Opor */}
            <div className="rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_#181511] flex flex-col overflow-hidden">
              <div className="p-4 border-b-4 border-slate-900 bg-amber-400 flex items-center gap-2">
                <UtensilsCrossed size={20} />
                <h4 className="text-xl font-black uppercase">Tim Opor ({oporPlayers.length})</h4>
              </div>
              <div className="flex-1 p-4 space-y-2 bg-amber-50 overflow-y-auto">
                {oporPlayers.length === 0 && (
                  <p className="text-sm font-bold text-slate-400 text-center pt-4">Menunggu pemain...</p>
                )}
                {oporPlayers.map((p, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border-2 border-slate-900 font-bold flex items-center gap-2">
                    <User size={16} /> {p.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Tim Rendang */}
            <div className="rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_#181511] flex flex-col overflow-hidden">
              <div className="p-4 border-b-4 border-slate-900 bg-amber-900 text-white flex items-center gap-2">
                <Flame size={20} />
                <h4 className="text-xl font-black uppercase">Tim Rendang ({rendangPlayers.length})</h4>
              </div>
              <div className="flex-1 p-4 space-y-2 bg-amber-950 overflow-y-auto">
                {rendangPlayers.length === 0 && (
                  <p className="text-sm font-bold text-amber-300 text-center pt-4">Menunggu pemain...</p>
                )}
                {rendangPlayers.map((p, i) => (
                  <div key={i} className="bg-black/20 p-3 rounded-lg border-2 border-white/20 font-bold text-white flex items-center gap-2">
                    <User size={16} /> {p.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Start button spans both columns */}
            <div className="col-span-2">
              <button
                onClick={startGame}
                className="neubrutalism neo-btn w-full py-8 bg-primary text-white text-4xl font-black uppercase tracking-widest rounded-2xl"
              >
                Mulai Permainan!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify**

```bash
npm run dev
```
Open `/host`, create room → should navigate to `/host/lobby`. Verify PIN shown, QR rendered, team columns visible. Click "Mulai Permainan!" — should navigate to `/host/game`.

**Step 3: Commit**

```bash
git add tarik-ketupat/src/pages/host/HostLobby.jsx
git commit -m "feat: implement HostLobby with PIN display, QR code, and team lists"
```

---

## Task 9: TimerBar & KetupatAnim Components

**Files:**
- Create: `tarik-ketupat/src/components/host/TimerBar.jsx`
- Create: `tarik-ketupat/src/components/host/KetupatAnim.jsx`

**Step 1: Implement TimerBar.jsx**

Create `tarik-ketupat/src/components/host/TimerBar.jsx`:
```jsx
import { useState, useEffect, useRef } from 'react'

export default function TimerBar({ duration = 10, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpireRef.current?.()
      return
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timeLeft])

  const pct = (timeLeft / duration) * 100
  const barColor = pct > 50 ? 'bg-emerald-500' : pct > 25 ? 'bg-amber-400' : 'bg-rose-500'

  return (
    <div className="w-full h-10 bg-white rounded-full border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_#181511]">
      <div
        className={`h-full ${barColor} border-r-4 border-slate-900 transition-all duration-1000 ease-linear`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
```

**Step 2: Implement KetupatAnim.jsx**

Create `tarik-ketupat/src/components/host/KetupatAnim.jsx`:
```jsx
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

export default function KetupatAnim({ scoreOpor = 0, scoreRendang = 0 }) {
  const netPos = clamp(scoreRendang - scoreOpor, -50, 50)

  return (
    <div className="relative h-44 bg-amber-50 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#181511] flex flex-col justify-center overflow-hidden">
      {/* Team labels */}
      <div className="absolute top-4 w-full flex justify-between px-8">
        <span className="text-lg font-black uppercase text-amber-600">← Tim Opor</span>
        <span className="text-lg font-black uppercase text-amber-900">Tim Rendang →</span>
      </div>

      {/* Rope */}
      <div className="relative w-full h-4 bg-amber-800 border-y-2 border-slate-900">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-slate-900/30" />

        {/* Ketupat marker */}
        <div
          className="absolute top-1/2 left-1/2 -translate-y-1/2 transition-transform duration-500 ease-out"
          style={{ transform: `translate(calc(-50% + ${netPos}%), -50%)` }}
        >
          <div className="w-16 h-16 bg-primary neubrutalism-sm rotate-45 flex items-center justify-center">
            <span className="text-white font-black text-lg -rotate-45">K</span>
          </div>
        </div>
      </div>

      {/* Score labels */}
      <div className="absolute bottom-4 w-full flex justify-between px-8">
        <span className="text-2xl font-black text-amber-600">{scoreOpor}</span>
        <span className="text-2xl font-black text-amber-900">{scoreRendang}</span>
      </div>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add tarik-ketupat/src/components/
git commit -m "feat: implement TimerBar countdown and KetupatAnim rope components"
```

---

## Task 10: HostGameplay Page

**Files:**
- Modify: `tarik-ketupat/src/pages/host/HostGameplay.jsx`

**Step 1: Implement HostGameplay.jsx**

Replace `tarik-ketupat/src/pages/host/HostGameplay.jsx`:
```jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockGame } from '../../context/MockGameContext'
import TimerBar from '../../components/host/TimerBar'
import KetupatAnim from '../../components/host/KetupatAnim'

export default function HostGameplay() {
  const navigate = useNavigate()
  const { currentQuestion, currentQuestionIndex, questions, teamScores, gameStatus, nextQuestion } = useMockGame()

  useEffect(() => {
    if (gameStatus === 'finished') navigate('/host/result')
    if (gameStatus === 'idle' || gameStatus === 'lobby') navigate('/host')
  }, [gameStatus, navigate])

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-bg-light flex flex-col gap-6 p-8">
      {/* Timer */}
      <TimerBar key={currentQuestion.id} duration={10} onExpire={nextQuestion} />

      {/* Question card */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl neubrutalism p-12 text-center relative">
        <span className="absolute top-4 left-4 px-4 py-2 bg-emerald-100 text-emerald-800 font-black rounded-lg border-2 border-slate-900 text-sm">
          SOAL {currentQuestionIndex + 1}/{questions.length}
        </span>
        <p className="text-6xl font-black text-slate-900 leading-tight max-w-3xl">
          {currentQuestion.soal}
        </p>
        <div className="mt-10 flex gap-6 flex-wrap justify-center">
          {Object.entries(currentQuestion.opsi).map(([key, val]) => (
            <div
              key={key}
              className={`w-36 h-20 border-4 border-slate-900 rounded-xl flex items-center justify-center text-3xl font-black
                ${key === currentQuestion.jawaban_benar ? 'bg-emerald-100' : 'bg-slate-100'}`}
            >
              {key}. {val}
            </div>
          ))}
        </div>
      </div>

      {/* Tug of war */}
      <KetupatAnim scoreOpor={teamScores.opor} scoreRendang={teamScores.rendang} />
    </div>
  )
}
```

**Step 2: Verify**

```bash
npm run dev
```
Full flow: `/host` → create room → lobby → start game → gameplay. Verify timer bar counts down, question shown, KetupatAnim visible. Timer auto-advances question after 10s.

**Step 3: Commit**

```bash
git add tarik-ketupat/src/pages/host/HostGameplay.jsx
git commit -m "feat: implement HostGameplay with timer, question display, and rope animation"
```

---

## Task 11: HostResult Page

**Files:**
- Modify: `tarik-ketupat/src/pages/host/HostResult.jsx`

**Step 1: Implement HostResult.jsx**

Replace `tarik-ketupat/src/pages/host/HostResult.jsx`:
```jsx
import { useNavigate } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import { useMockGame } from '../../context/MockGameContext'

export default function HostResult() {
  const navigate = useNavigate()
  const { teamScores, createRoom, gameConfig } = useMockGame()

  const winner = teamScores.opor > teamScores.rendang
    ? 'TIM OPOR'
    : teamScores.rendang > teamScores.opor
    ? 'TIM RENDANG'
    : 'SERI'

  const winnerBg = teamScores.opor > teamScores.rendang
    ? 'bg-amber-400'
    : teamScores.rendang > teamScores.opor
    ? 'bg-amber-900 text-white'
    : 'bg-slate-200'

  function handlePlayAgain() {
    createRoom(gameConfig)
    navigate('/host/lobby')
  }

  return (
    <div className="min-h-screen ketupat-pattern flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white p-16 rounded-3xl neubrutalism text-center">
        <PartyPopper size={64} className="mx-auto mb-6 text-primary" />
        <h2 className="text-2xl font-black uppercase text-slate-500 mb-2">Hasil Pertandingan</h2>
        <div className={`text-6xl font-black uppercase italic leading-none mb-8 py-4 px-8 rounded-2xl inline-block ${winnerBg}`}>
          {winner}<br />MENANG!
        </div>
        <div className="flex justify-center gap-12 mb-12">
          <div className="text-center">
            <div className="neubrutalism w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black mb-2 bg-amber-100">
              {teamScores.opor}
            </div>
            <span className="font-bold uppercase text-amber-700">Skor Opor</span>
          </div>
          <div className="text-center">
            <div className="neubrutalism w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black mb-2 bg-amber-900 text-white">
              {teamScores.rendang}
            </div>
            <span className="font-bold uppercase text-amber-900">Skor Rendang</span>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handlePlayAgain}
            className="neubrutalism neo-btn px-10 py-5 bg-slate-900 text-white text-xl font-black uppercase rounded-xl"
          >
            Main Lagi
          </button>
          <button
            onClick={() => navigate('/')}
            className="neubrutalism neo-btn px-10 py-5 bg-white text-slate-900 text-xl font-black uppercase rounded-xl"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify**

Run through the full host flow end-to-end. Verify result screen shows correct scores and winner.

**Step 3: Commit**

```bash
git add tarik-ketupat/src/pages/host/HostResult.jsx
git commit -m "feat: implement HostResult winner screen with scores and replay button"
```

---

## Task 12: PlayerJoin Page

**Files:**
- Modify: `tarik-ketupat/src/pages/player/PlayerJoin.jsx`

**Step 1: Implement PlayerJoin.jsx**

Replace `tarik-ketupat/src/pages/player/PlayerJoin.jsx`:
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gamepad2 } from 'lucide-react'
import { useMockGame } from '../../context/MockGameContext'

export default function PlayerJoin() {
  const navigate = useNavigate()
  const { joinRoom } = useMockGame()
  const [pin, setPin] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleJoin() {
    if (!pin.trim() || !name.trim()) {
      setError('PIN dan nama harus diisi!')
      return
    }
    const team = joinRoom(pin.trim(), name.trim())
    if (!team) {
      setError('PIN tidak valid. Coba lagi.')
      return
    }
    navigate('/play/wait')
  }

  return (
    <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary neubrutalism rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gamepad2 size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black uppercase">Masuk Game</h2>
          <p className="text-slate-500 font-bold mt-1">Minta PIN dari gurumu!</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="PIN RUANGAN"
            value={pin}
            onChange={e => setPin(e.target.value)}
            maxLength={6}
            className="w-full p-4 neubrutalism rounded-xl font-black text-center text-2xl uppercase tracking-widest bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="NAMA KAMU"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-4 neubrutalism rounded-xl font-bold text-center text-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <p className="text-center text-rose-600 font-bold text-sm">{error}</p>
          )}
          <button
            onClick={handleJoin}
            className="neubrutalism neo-btn w-full py-5 bg-primary text-white text-xl font-black uppercase rounded-xl"
          >
            Gabung!
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify**

Open `/play` in a second tab (after creating a room via `/host` in another tab). Enter the PIN and name. Should navigate to `/play/wait`.

**Step 3: Commit**

```bash
git add tarik-ketupat/src/pages/player/PlayerJoin.jsx
git commit -m "feat: implement PlayerJoin page with PIN and name input"
```

---

## Task 13: PlayerWaiting Page

**Files:**
- Modify: `tarik-ketupat/src/pages/player/PlayerWaiting.jsx`

**Step 1: Implement PlayerWaiting.jsx**

Replace `tarik-ketupat/src/pages/player/PlayerWaiting.jsx`:
```jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timer } from 'lucide-react'
import { useMockGame } from '../../context/MockGameContext'

export default function PlayerWaiting() {
  const navigate = useNavigate()
  const { players, gameStatus } = useMockGame()

  // NOTE: In Phase 1 same-tab simulation, the player name comes from the last joiner.
  // We take the last player added to the list as "this player".
  const thisPlayer = players[players.length - 1]

  useEffect(() => {
    if (gameStatus === 'playing') navigate('/play/game')
    if (gameStatus === 'idle') navigate('/play')
  }, [gameStatus, navigate])

  if (!thisPlayer) return null

  const isOpor = thisPlayer.team === 'opor'
  const teamName = isOpor ? 'TIM OPOR' : 'TIM RENDANG'
  const bgColor = isOpor ? 'bg-amber-400' : 'bg-amber-900'
  const textColor = isOpor ? 'text-slate-900' : 'text-white'

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} flex flex-col items-center justify-center gap-8 p-8`}>
      <div className="animate-bounce">
        <Timer size={80} />
      </div>
      <h2 className="text-4xl font-black uppercase">Halo, {thisPlayer.name}!</h2>
      <div className="bg-white text-slate-900 p-6 neubrutalism rounded-2xl text-center w-full max-w-xs">
        <p className="font-bold text-lg mb-1">Kamu masuk</p>
        <p className="text-3xl font-black text-primary">{teamName}</p>
      </div>
      <p className="font-bold text-lg opacity-80 animate-pulse">Tunggu guru memulai permainan...</p>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add tarik-ketupat/src/pages/player/PlayerWaiting.jsx
git commit -m "feat: implement PlayerWaiting with team assignment display"
```

---

## Task 14: AnswerPad Component & PlayerGamepad Page

**Files:**
- Create: `tarik-ketupat/src/components/player/AnswerPad.jsx`
- Modify: `tarik-ketupat/src/pages/player/PlayerGamepad.jsx`

**Step 1: Implement AnswerPad.jsx**

Create `tarik-ketupat/src/components/player/AnswerPad.jsx`:
```jsx
import { useState, useEffect } from 'react'
import { useMockGame } from '../../context/MockGameContext'

const OPTION_STYLES = {
  A: { base: 'bg-blue-500',    correct: 'bg-emerald-500', wrong: 'bg-rose-600' },
  B: { base: 'bg-red-500',     correct: 'bg-emerald-500', wrong: 'bg-rose-600' },
  C: { base: 'bg-emerald-500', correct: 'bg-emerald-500', wrong: 'bg-rose-600' },
  D: { base: 'bg-yellow-500',  correct: 'bg-emerald-500', wrong: 'bg-rose-600' },
}

export default function AnswerPad({ playerTeam }) {
  const { currentQuestion, submitAnswer } = useMockGame()
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Reset when question changes
  useEffect(() => {
    setSelectedAnswer(null)
    setIsSubmitted(false)
  }, [currentQuestion?.id])

  if (!currentQuestion) return null

  function handleAnswer(key) {
    if (isSubmitted) return
    const isCorrect = key === currentQuestion.jawaban_benar
    setSelectedAnswer(key)
    setIsSubmitted(true)
    submitAnswer(playerTeam, isCorrect)
  }

  return (
    <div className="grid grid-cols-2 gap-4 h-[60vh]">
      {Object.entries(currentQuestion.opsi).map(([key, value]) => {
        let colorClass = OPTION_STYLES[key].base
        if (isSubmitted) {
          if (key === currentQuestion.jawaban_benar) {
            colorClass = OPTION_STYLES[key].correct
          } else if (key === selectedAnswer) {
            colorClass = OPTION_STYLES[key].wrong
          } else {
            colorClass = 'bg-slate-300'
          }
        }

        return (
          <button
            key={key}
            onClick={() => handleAnswer(key)}
            disabled={isSubmitted}
            className={`
              neubrutalism text-white font-black text-3xl rounded-2xl
              flex flex-col items-center justify-center gap-2
              ${colorClass}
              ${isSubmitted ? 'opacity-70 pointer-events-none' : 'neo-btn'}
              transition-all duration-300
            `}
          >
            <span className="text-sm font-black opacity-80">{key}</span>
            <span>{value}</span>
          </button>
        )
      })}
    </div>
  )
}
```

**Step 2: Implement PlayerGamepad.jsx**

Replace `tarik-ketupat/src/pages/player/PlayerGamepad.jsx`:
```jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockGame } from '../../context/MockGameContext'
import AnswerPad from '../../components/player/AnswerPad'

export default function PlayerGamepad() {
  const navigate = useNavigate()
  const { currentQuestion, players, gameStatus, teamScores } = useMockGame()

  const thisPlayer = players[players.length - 1]

  useEffect(() => {
    if (gameStatus === 'finished') navigate('/play/result')
    if (gameStatus === 'idle' || gameStatus === 'lobby') navigate('/play')
  }, [gameStatus, navigate])

  if (!thisPlayer || !currentQuestion) return null

  const isOpor = thisPlayer.team === 'opor'
  const teamScore = isOpor ? teamScores.opor : teamScores.rendang
  const teamBg = isOpor ? 'bg-amber-400' : 'bg-amber-900'
  const teamText = isOpor ? 'text-slate-900' : 'text-white'

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      {/* Question header */}
      <div className="p-6 bg-slate-900 text-white text-center">
        <p className="text-xs font-black text-primary uppercase mb-1">Pertanyaan</p>
        <h3 className="text-xl font-black leading-tight">{currentQuestion.soal}</h3>
      </div>

      {/* Answer pad */}
      <div className="flex-1 p-4">
        <AnswerPad playerTeam={thisPlayer.team} />
      </div>

      {/* Team score footer */}
      <div className={`p-4 ${teamBg} ${teamText} border-t-4 border-slate-900 text-center`}>
        <p className="font-black text-sm uppercase">
          {isOpor ? 'Tim Opor' : 'Tim Rendang'} — Poin: {teamScore}
        </p>
      </div>
    </div>
  )
}
```

**Step 3: Verify**

Run full two-tab flow:
1. Tab 1: `/host` → create room → lobby
2. Tab 2: `/play` → join with PIN → wait
3. Tab 1: Start game → `/host/game`
4. Tab 2: should show question + 4 answer buttons
5. Tab 2: tap an answer → see color feedback (green/red)
6. Tab 1: verify rope moves when correct answers given

**Step 4: Commit**

```bash
git add tarik-ketupat/src/components/player/ tarik-ketupat/src/pages/player/PlayerGamepad.jsx
git commit -m "feat: implement AnswerPad with feedback and PlayerGamepad controller"
```

---

## Task 15: PlayerResult Page

**Files:**
- Modify: `tarik-ketupat/src/pages/player/PlayerResult.jsx`

**Step 1: Implement PlayerResult.jsx**

Replace `tarik-ketupat/src/pages/player/PlayerResult.jsx`:
```jsx
import { useNavigate } from 'react-router-dom'
import { Trophy, Frown } from 'lucide-react'
import { useMockGame } from '../../context/MockGameContext'

export default function PlayerResult() {
  const navigate = useNavigate()
  const { players, teamScores } = useMockGame()

  const thisPlayer = players[players.length - 1]

  if (!thisPlayer) {
    navigate('/')
    return null
  }

  const { opor, rendang } = teamScores
  const winnerTeam = opor > rendang ? 'opor' : rendang > opor ? 'rendang' : 'draw'
  const playerWon = winnerTeam === thisPlayer.team || winnerTeam === 'draw'
  const playerScore = thisPlayer.team === 'opor' ? opor : rendang

  return (
    <div className="min-h-screen ketupat-pattern flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white neubrutalism rounded-3xl p-8 text-center space-y-6">
        {playerWon ? (
          <>
            <h2 className="text-4xl font-black uppercase">HORE!</h2>
            <div className="w-32 h-32 mx-auto bg-emerald-100 neubrutalism rounded-full flex items-center justify-center">
              <Trophy size={64} className="text-emerald-600" />
            </div>
            <h3 className="text-3xl font-black text-emerald-600 uppercase">MENANG!</h3>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-black uppercase">Yah...</h2>
            <div className="w-32 h-32 mx-auto bg-slate-100 neubrutalism rounded-full flex items-center justify-center">
              <Frown size={64} className="text-slate-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-500 uppercase">KALAH</h3>
          </>
        )}
        <p className="font-bold text-slate-500">Poin Tim Kamu: <span className="text-2xl font-black text-slate-900">{playerScore}</span></p>
        <button
          onClick={() => navigate('/play')}
          className="neubrutalism neo-btn w-full py-4 bg-slate-900 text-white font-black text-lg uppercase rounded-xl"
        >
          {playerWon ? 'KEREN!' : 'Coba Lagi'}
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Verify complete end-to-end flow**

Run the full game from start to finish:
1. `/` → click Guru → Setup → create room
2. Second tab: `/` → click Siswa → join with PIN
3. Tab 1: Start game → play through all questions (let timer expire)
4. Tab 1: Verify HostResult shows winner
5. Tab 2: Verify PlayerResult shows correct win/loss state

**Step 3: Commit**

```bash
git add tarik-ketupat/src/pages/player/PlayerResult.jsx
git commit -m "feat: implement PlayerResult win/lose screen"
```

---

## Task 16: Polish & Acceptance Criteria Check

**Files:**
- Modify: `tarik-ketupat/src/App.jsx` (add 404 fallback)
- Modify: `tarik-ketupat/index.html` (update page title)

**Step 1: Update page title**

In `tarik-ketupat/index.html`, change `<title>` to:
```html
<title>Tarik Ketupat Matematika</title>
```

**Step 2: Run full test suite**

```bash
cd tarik-ketupat && npm test
```
Expected: All 6 MockGameContext tests PASS.

**Step 3: Manual acceptance criteria walkthrough**

Check each item from the design doc:
- [ ] All 9 routes render without errors (navigate to each manually)
- [ ] Host creates room → PIN generated → navigates to lobby
- [ ] Player joins with PIN → assigned team → sees waiting screen
- [ ] Host starts game → both tabs update
- [ ] Player submits answer → correct/wrong color feedback shown
- [ ] KetupatAnim rope moves when team scores change
- [ ] Timer counts down 10s → auto-advances to next question
- [ ] After all questions, both tabs show result screen
- [ ] Host layout is wide (desktop), Player layout is narrow (mobile portrait)

**Step 4: Final commit**

```bash
git add tarik-ketupat/
git commit -m "feat: Phase 1 complete — all screens, routing, and mock game flow working"
```

---

## Quick Reference

**Run dev server:**
```bash
cd tarik-ketupat && npm run dev
```

**Run tests:**
```bash
cd tarik-ketupat && npm test
```

**Key context hook:** `useMockGame()` — use in any component inside `MockGameProvider`

**Two-tab simulation:** Open `http://localhost:5173` in two tabs — one as Host, one as Player — to test the full multiplayer flow locally.

**Design classes:**
- `.neubrutalism` — 4px border + 8px hard shadow
- `.neubrutalism-sm` — 3px border + 4px shadow
- `.neo-btn` — hover lift + active press animations
- `.ketupat-pattern` — amber dotted background for result screens
