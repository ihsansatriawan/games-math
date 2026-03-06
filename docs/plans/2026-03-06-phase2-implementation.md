# Phase 2 Implementation Plan: Supabase Auth + Realtime Backend

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace MockGameContext with Supabase-backed email magic link auth, rooms DB, and Realtime Broadcast for true multiplayer.

**Architecture:** AuthContext manages sessions via Supabase OTP magic link. GameContext replaces MockGameContext — rooms stored in Supabase DB, gameplay synced via Realtime Broadcast channels. Host is source of truth for scores.

**Tech Stack:** React 19, Supabase JS Client (`@supabase/supabase-js`), Vite env vars, Tailwind CSS v3

---

### Task 1: Install Supabase and create client

**Files:**
- Modify: `package.json` (add dependency)
- Create: `src/lib/supabase.js`
- Create: `.env.local` (gitignored)
- Modify: `.gitignore`

**Step 1: Install @supabase/supabase-js**

```bash
npm install @supabase/supabase-js
```

**Step 2: Create Supabase client**

Create `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Step 3: Create .env.local with real project credentials**

```env
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

**Step 4: Ensure .gitignore includes .env.local**

Check `.gitignore` has `.env.local` entry. Add if missing.

**Step 5: Commit**

```bash
git add src/lib/supabase.js .gitignore package.json package-lock.json
git commit -m "feat: add Supabase client setup"
```

---

### Task 2: Run rooms table migration via Supabase MCP

**Files:**
- Database migration (via MCP)

**Step 1: Apply the rooms table migration using Supabase MCP**

Use `mcp__supabase__apply_migration` with this SQL:

```sql
CREATE TABLE public.rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pin varchar(6) NOT NULL UNIQUE,
  host_id uuid REFERENCES auth.users(id),
  config jsonb NOT NULL DEFAULT '{}',
  status varchar(20) DEFAULT 'lobby' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read" ON public.rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert" ON public.rooms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.rooms FOR UPDATE TO authenticated USING (true);
```

**Step 2: Verify via `mcp__supabase__list_tables`**

Confirm `rooms` table exists with expected columns.

---

### Task 3: Create AuthContext with magic link auth

**Files:**
- Create: `src/context/AuthContext.jsx`

**Step 1: Implement AuthContext**

Create `src/context/AuthContext.jsx`:

```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
```

**Step 2: Commit**

```bash
git add src/context/AuthContext.jsx
git commit -m "feat: add AuthContext with magic link OTP auth"
```

---

### Task 4: Create LoginForm and ProtectedRoute components

**Files:**
- Create: `src/components/shared/LoginForm.jsx`
- Create: `src/components/shared/ProtectedRoute.jsx`

**Step 1: Create LoginForm**

Create `src/components/shared/LoginForm.jsx`:

```jsx
import { useState } from 'react'
import { Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LoginForm() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error: err } = await signIn(email.trim())
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white neubrutalism rounded-2xl p-8 text-center space-y-4">
          <Mail size={48} className="mx-auto text-primary" />
          <h2 className="text-2xl font-black uppercase">Cek Email Kamu!</h2>
          <p className="font-bold text-slate-500">
            Kami kirim magic link ke <span className="text-slate-900">{email}</span>
          </p>
          <p className="text-sm text-slate-400">Klik link di email untuk masuk.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary neubrutalism rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black uppercase">Masuk Dulu!</h2>
          <p className="text-slate-500 font-bold mt-1">Login pakai email kamu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="EMAIL KAMU"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-4 neubrutalism rounded-xl font-bold text-center text-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <p className="text-center text-rose-600 font-bold text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="neubrutalism neo-btn w-full py-5 bg-primary text-white text-xl font-black uppercase rounded-xl disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Magic Link'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

**Step 2: Create ProtectedRoute**

Create `src/components/shared/ProtectedRoute.jsx`:

```jsx
import { useAuth } from '../../context/AuthContext'
import LoginForm from './LoginForm'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-2xl font-black text-slate-400 animate-pulse">Memuat...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return children
}
```

**Step 3: Commit**

```bash
git add src/components/shared/LoginForm.jsx src/components/shared/ProtectedRoute.jsx
git commit -m "feat: add LoginForm and ProtectedRoute components"
```

---

### Task 5: Wire AuthProvider and ProtectedRoute into app

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`

**Step 1: Add AuthProvider to main.jsx**

Replace `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
```

Note: MockGameProvider is removed here. GameProvider will be added in Task 7.

**Step 2: Wrap host and player routes with ProtectedRoute in App.jsx**

Replace `src/App.jsx`:

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/shared/ProtectedRoute'
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
      <Route path="/host" element={<ProtectedRoute><HostSetup /></ProtectedRoute>} />
      <Route path="/host/lobby" element={<ProtectedRoute><HostLobby /></ProtectedRoute>} />
      <Route path="/host/game" element={<ProtectedRoute><HostGameplay /></ProtectedRoute>} />
      <Route path="/host/result" element={<ProtectedRoute><HostResult /></ProtectedRoute>} />
      <Route path="/play" element={<ProtectedRoute><PlayerJoin /></ProtectedRoute>} />
      <Route path="/play/wait" element={<ProtectedRoute><PlayerWaiting /></ProtectedRoute>} />
      <Route path="/play/game" element={<ProtectedRoute><PlayerGamepad /></ProtectedRoute>} />
      <Route path="/play/result" element={<ProtectedRoute><PlayerResult /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
```

**Step 3: Verify dev server starts without errors**

```bash
npm run dev
```

Open browser, confirm Home page loads and clicking "Saya Guru" or "Saya Siswa" shows LoginForm.

**Step 4: Commit**

```bash
git add src/main.jsx src/App.jsx
git commit -m "feat: wire AuthProvider and ProtectedRoute into app"
```

---

### Task 6: Add logout button to Home page

**Files:**
- Modify: `src/pages/Home.jsx`

**Step 1: Add conditional logout UI**

Replace `src/pages/Home.jsx`:

```jsx
import { useNavigate } from 'react-router-dom'
import { Monitor, Smartphone, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center gap-10 p-8">
      {user && (
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500">{user.email}</span>
          <button
            onClick={signOut}
            className="neubrutalism p-2 bg-white rounded-lg"
            title="Keluar"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}

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

**Step 2: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: add logout button to Home page for logged-in users"
```

---

### Task 7: Create GameContext with Supabase rooms and Realtime Broadcast

**Files:**
- Create: `src/context/GameContext.jsx`

This is the core task. GameContext replaces MockGameContext with real Supabase operations.

**Step 1: Create GameContext**

Create `src/context/GameContext.jsx`:

```jsx
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import mockSoal from '../data/mockSoal.json'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const { user } = useAuth()
  const [roomPin, setRoomPin] = useState('')
  const [gameStatus, setGameStatus] = useState('idle')
  const [gameConfig, setGameConfig] = useState({ mode: 'penjumlahan', difficulty: 'mudah' })
  const [players, setPlayers] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [teamScores, setTeamScores] = useState({ opor: 0, rendang: 0 })
  const [playerTeam, setPlayerTeam] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const channelRef = useRef(null)
  const isHostRef = useRef(false)

  const questions = mockSoal.filter(
    q => q.tipe === gameConfig.mode && q.difficulty === gameConfig.difficulty
  ).length > 0
    ? mockSoal.filter(q => q.tipe === gameConfig.mode && q.difficulty === gameConfig.difficulty)
    : mockSoal

  const currentQuestion = questions[currentQuestionIndex] ?? null

  // Cleanup channel on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [])

  const subscribeToChannel = useCallback(async (pin, isHost) => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    await supabase.realtime.setAuth()

    const channel = supabase.channel(`room-${pin}`)

    if (isHost) {
      channel
        .on('broadcast', { event: 'player_join' }, ({ payload }) => {
          setPlayers(prev => [...prev, { name: payload.playerName, team: payload.team }])
        })
        .on('broadcast', { event: 'player_answer' }, ({ payload }) => {
          if (payload.isCorrect) {
            setTeamScores(prev => ({ ...prev, [payload.team]: prev[payload.team] + 10 }))
          }
        })
    } else {
      channel
        .on('broadcast', { event: 'game_start' }, () => {
          setGameStatus('playing')
        })
        .on('broadcast', { event: 'next_question' }, ({ payload }) => {
          setCurrentQuestionIndex(payload.questionIndex)
        })
        .on('broadcast', { event: 'score_update' }, ({ payload }) => {
          setTeamScores(payload.teamScores)
        })
        .on('broadcast', { event: 'game_end' }, ({ payload }) => {
          setTeamScores(payload.teamScores)
          setGameStatus('finished')
        })
    }

    await channel.subscribe()
    channelRef.current = channel
  }, [])

  const createRoom = useCallback(async (config) => {
    const pin = String(Math.floor(100000 + Math.random() * 900000))
    const { error } = await supabase.from('rooms').insert({
      pin,
      host_id: user?.id,
      config,
      status: 'lobby',
    })
    if (error) throw error

    setRoomPin(pin)
    setGameConfig(config)
    setGameStatus('lobby')
    setPlayers([])
    setTeamScores({ opor: 0, rendang: 0 })
    setCurrentQuestionIndex(0)
    isHostRef.current = true

    await subscribeToChannel(pin, true)
  }, [user, subscribeToChannel])

  const joinRoom = useCallback(async (pin, name) => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('pin', pin)
      .single()

    if (error || !data) return false

    const team = Math.random() < 0.5 ? 'opor' : 'rendang'
    setRoomPin(pin)
    setGameConfig(data.config)
    setGameStatus('lobby')
    setPlayerTeam(team)
    setPlayerName(name)
    isHostRef.current = false

    await subscribeToChannel(pin, false)

    // Broadcast join to host
    channelRef.current.send({
      type: 'broadcast',
      event: 'player_join',
      payload: { playerName: name, team, email: user?.email },
    })

    return team
  }, [user, subscribeToChannel])

  const startGame = useCallback(async () => {
    await supabase.from('rooms').update({ status: 'playing' }).eq('pin', roomPin)
    setGameStatus('playing')
    setCurrentQuestionIndex(0)
    setTeamScores({ opor: 0, rendang: 0 })

    channelRef.current?.send({
      type: 'broadcast',
      event: 'game_start',
      payload: { questionId: questions[0]?.id },
    })
  }, [roomPin, questions])

  const submitAnswer = useCallback((team, isCorrect) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'player_answer',
      payload: { team, isCorrect },
    })
  }, [])

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => {
      const next = prev + 1
      if (next >= questions.length) {
        setGameStatus('finished')
        supabase.from('rooms').update({ status: 'finished' }).eq('pin', roomPin)
        // Broadcast game end with current scores
        // Note: we read teamScores via ref pattern to avoid stale closure
        setTeamScores(currentScores => {
          channelRef.current?.send({
            type: 'broadcast',
            event: 'game_end',
            payload: { teamScores: currentScores },
          })
          return currentScores
        })
        return prev
      }
      // Broadcast next question and current scores
      setTeamScores(currentScores => {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'next_question',
          payload: { questionIndex: next, questionId: questions[next]?.id },
        })
        channelRef.current?.send({
          type: 'broadcast',
          event: 'score_update',
          payload: { teamScores: currentScores },
        })
        return currentScores
      })
      return next
    })
  }, [questions, roomPin])

  const endGame = useCallback(() => {
    setGameStatus('finished')
    supabase.from('rooms').update({ status: 'finished' }).eq('pin', roomPin)
    setTeamScores(currentScores => {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'game_end',
        payload: { teamScores: currentScores },
      })
      return currentScores
    })
  }, [roomPin])

  return (
    <GameContext.Provider value={{
      roomPin, gameStatus, gameConfig, players,
      currentQuestion, currentQuestionIndex,
      teamScores, questions,
      playerTeam, playerName,
      createRoom, joinRoom, startGame,
      submitAnswer, nextQuestion, endGame,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
```

**Step 2: Commit**

```bash
git add src/context/GameContext.jsx
git commit -m "feat: add GameContext with Supabase rooms and Realtime Broadcast"
```

---

### Task 8: Wire GameProvider and update all pages to use useGame

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/pages/host/HostSetup.jsx`
- Modify: `src/pages/host/HostLobby.jsx`
- Modify: `src/pages/host/HostGameplay.jsx`
- Modify: `src/pages/host/HostResult.jsx`
- Modify: `src/pages/player/PlayerJoin.jsx`
- Modify: `src/pages/player/PlayerWaiting.jsx`
- Modify: `src/pages/player/PlayerGamepad.jsx`
- Modify: `src/pages/player/PlayerResult.jsx`
- Modify: `src/components/player/AnswerPad.jsx`

**Step 1: Add GameProvider to main.jsx**

Update `src/main.jsx` — add GameProvider inside AuthProvider:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GameProvider } from './context/GameContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
```

**Step 2: Update HostSetup.jsx**

Change imports and make `handleCreate` async:

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../../context/GameContext'

// ... MODES and DIFFICULTIES constants stay the same ...

export default function HostSetup() {
  const navigate = useNavigate()
  const { createRoom } = useGame()
  const [mode, setMode] = useState('penjumlahan')
  const [difficulty, setDifficulty] = useState('mudah')

  async function handleCreate() {
    await createRoom({ mode, difficulty })
    navigate('/host/lobby')
  }

  // ... rest of JSX stays identical ...
}
```

Key change: `useMockGame()` -> `useGame()`, `handleCreate` is now `async`.

**Step 3: Update HostLobby.jsx**

Change import only:

```diff
- import { useMockGame } from '../../context/MockGameContext'
+ import { useGame } from '../../context/GameContext'
```

And in the component:

```diff
- const { roomPin, players, gameStatus, startGame } = useMockGame()
+ const { roomPin, players, gameStatus, startGame } = useGame()
```

Make `startGame` call async — wrap the onClick:

```jsx
<button
  onClick={async () => await startGame()}
  // ... rest stays same
>
```

**Step 4: Update HostGameplay.jsx**

```diff
- import { useMockGame } from '../../context/MockGameContext'
+ import { useGame } from '../../context/GameContext'
```

```diff
- const { currentQuestion, currentQuestionIndex, questions, teamScores, gameStatus, nextQuestion } = useMockGame()
+ const { currentQuestion, currentQuestionIndex, questions, teamScores, gameStatus, nextQuestion } = useGame()
```

**Step 5: Update HostResult.jsx**

```diff
- import { useMockGame } from '../../context/MockGameContext'
+ import { useGame } from '../../context/GameContext'
```

```diff
- const { teamScores, createRoom, gameConfig } = useMockGame()
+ const { teamScores, createRoom, gameConfig } = useGame()
```

Make `handlePlayAgain` async:

```jsx
async function handlePlayAgain() {
  await createRoom(gameConfig)
  navigate('/host/lobby')
}
```

**Step 6: Update PlayerJoin.jsx**

```diff
- import { useMockGame } from '../../context/MockGameContext'
+ import { useGame } from '../../context/GameContext'
+ import { useAuth } from '../../context/AuthContext'
```

```diff
- const { joinRoom } = useMockGame()
+ const { joinRoom } = useGame()
+ const { user } = useAuth()
```

Pre-fill name from email:

```diff
- const [name, setName] = useState('')
+ const [name, setName] = useState(() => {
+   if (user?.email) return user.email.split('@')[0]
+   return ''
+ })
```

Make `handleJoin` async:

```jsx
async function handleJoin() {
  if (!pin.trim() || !name.trim()) {
    setError('PIN dan nama harus diisi!')
    return
  }
  const team = await joinRoom(pin.trim(), name.trim())
  if (!team) {
    setError('PIN tidak valid. Coba lagi.')
    return
  }
  navigate('/play/wait')
}
```

**Step 7: Update PlayerWaiting.jsx**

```diff
- import { useMockGame } from '../../context/MockGameContext'
+ import { useGame } from '../../context/GameContext'
```

Replace `useMockGame()` call and use `playerTeam`/`playerName` from GameContext instead of `players[players.length - 1]`:

```jsx
export default function PlayerWaiting() {
  const navigate = useNavigate()
  const { playerTeam, playerName, gameStatus } = useGame()

  useEffect(() => {
    if (gameStatus === 'playing') navigate('/play/game')
    if (gameStatus === 'idle') navigate('/play')
  }, [gameStatus, navigate])

  if (!playerTeam) return null

  const isOpor = playerTeam === 'opor'
  const teamName = isOpor ? 'TIM OPOR' : 'TIM RENDANG'
  const bgColor = isOpor ? 'bg-amber-400' : 'bg-amber-900'
  const textColor = isOpor ? 'text-slate-900' : 'text-white'

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} flex flex-col items-center justify-center gap-8 p-8`}>
      <div className="animate-bounce">
        <Timer size={80} />
      </div>
      <h2 className="text-4xl font-black uppercase">Halo, {playerName}!</h2>
      <div className="bg-white text-slate-900 p-6 neubrutalism rounded-2xl text-center w-full max-w-xs">
        <p className="font-bold text-lg mb-1">Kamu masuk</p>
        <p className="text-3xl font-black text-primary">{teamName}</p>
      </div>
      <p className="font-bold text-lg opacity-80 animate-pulse">Tunggu guru memulai permainan...</p>
    </div>
  )
}
```

**Step 8: Update PlayerGamepad.jsx**

```diff
- import { useMockGame } from '../../context/MockGameContext'
+ import { useGame } from '../../context/GameContext'
```

Use `playerTeam`/`playerName` instead of `players[players.length - 1]`:

```jsx
export default function PlayerGamepad() {
  const navigate = useNavigate()
  const { currentQuestion, playerTeam, gameStatus, teamScores } = useGame()

  useEffect(() => {
    if (gameStatus === 'finished') navigate('/play/result')
    if (gameStatus === 'idle' || gameStatus === 'lobby') navigate('/play')
  }, [gameStatus, navigate])

  if (!playerTeam || !currentQuestion) return null

  const isOpor = playerTeam === 'opor'
  const teamScore = isOpor ? teamScores.opor : teamScores.rendang
  const teamBg = isOpor ? 'bg-amber-400' : 'bg-amber-900'
  const teamText = isOpor ? 'text-slate-900' : 'text-white'

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <div className="p-6 bg-slate-900 text-white text-center">
        <p className="text-xs font-black text-primary uppercase mb-1">Pertanyaan</p>
        <h3 className="text-xl font-black leading-tight">{currentQuestion.soal}</h3>
      </div>
      <div className="flex-1 p-4">
        <AnswerPad playerTeam={playerTeam} />
      </div>
      <div className={`p-4 ${teamBg} ${teamText} border-t-4 border-slate-900 text-center`}>
        <p className="font-black text-sm uppercase">
          {isOpor ? 'Tim Opor' : 'Tim Rendang'} — Poin: {teamScore}
        </p>
      </div>
    </div>
  )
}
```

**Step 9: Update PlayerResult.jsx**

```diff
- import { useMockGame } from '../../context/MockGameContext'
+ import { useGame } from '../../context/GameContext'
```

Use `playerTeam` instead of `players[players.length - 1]`:

```jsx
export default function PlayerResult() {
  const navigate = useNavigate()
  const { playerTeam, teamScores } = useGame()

  if (!playerTeam) {
    navigate('/')
    return null
  }

  const { opor, rendang } = teamScores
  const winnerTeam = opor > rendang ? 'opor' : rendang > opor ? 'rendang' : 'draw'
  const playerWon = winnerTeam === playerTeam || winnerTeam === 'draw'
  const playerScore = playerTeam === 'opor' ? opor : rendang

  // ... rest of JSX stays identical ...
}
```

**Step 10: Update AnswerPad.jsx**

```diff
- import { useMockGame } from '../../context/MockGameContext'
+ import { useGame } from '../../context/GameContext'
```

```diff
- const { currentQuestion, submitAnswer } = useMockGame()
+ const { currentQuestion, submitAnswer } = useGame()
```

**Step 11: Verify dev server and basic flow**

```bash
npm run dev
```

Check: Home loads, clicking Guru/Siswa shows login (if not authed) or page (if authed), no import errors.

**Step 12: Commit**

```bash
git add src/main.jsx src/pages/ src/components/player/AnswerPad.jsx
git commit -m "feat: wire GameProvider and migrate all pages from MockGameContext to GameContext"
```

---

### Task 9: Delete MockGameContext

**Files:**
- Delete: `src/context/MockGameContext.jsx`
- Delete: `src/context/MockGameContext.test.jsx`

**Step 1: Delete old files**

```bash
rm src/context/MockGameContext.jsx src/context/MockGameContext.test.jsx
```

**Step 2: Verify no remaining imports**

```bash
grep -r "MockGameContext" src/
```

Should return nothing.

**Step 3: Verify build passes**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add -u
git commit -m "chore: remove MockGameContext (replaced by GameContext)"
```

---

### Task 10: Add SPA redirect for Netlify

**Files:**
- Create: `public/_redirects`

**Step 1: Create _redirects**

Create `public/_redirects`:

```
/* /index.html 200
```

**Step 2: Commit**

```bash
git add public/_redirects
git commit -m "chore: add Netlify SPA _redirects"
```

---

### Task 11: End-to-end smoke test

**Steps:**

1. Start dev server: `npm run dev`
2. Open browser tab 1 (Host): go to `/`, click "Saya Guru"
   - Should see LoginForm → enter email → check email for magic link → click link → redirected to HostSetup
3. Configure game and click "Buat Ruangan" → should navigate to HostLobby with a PIN
4. Open browser tab 2 (Player): go to `/`, click "Saya Siswa"
   - Should see LoginForm → login with different email → see PlayerJoin
   - Enter PIN from Host tab, name pre-filled from email → click "Gabung!"
   - Player should appear in Host's lobby
5. Host clicks "Mulai Permainan!" → Host sees HostGameplay, Player sees PlayerGamepad
6. Player answers questions → Host sees score updates and ketupat moves
7. Timer expires → next question broadcasts to player
8. After all questions → both see result screens

**If any step fails:** debug the specific broadcast event or DB operation.

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Install Supabase + create client | `supabase.js`, `.env.local` |
| 2 | Rooms table migration | DB via MCP |
| 3 | AuthContext (magic link) | `AuthContext.jsx` |
| 4 | LoginForm + ProtectedRoute | `LoginForm.jsx`, `ProtectedRoute.jsx` |
| 5 | Wire auth into app | `main.jsx`, `App.jsx` |
| 6 | Logout button on Home | `Home.jsx` |
| 7 | GameContext (core) | `GameContext.jsx` |
| 8 | Migrate all pages | All page files + AnswerPad |
| 9 | Delete MockGameContext | Cleanup |
| 10 | Netlify SPA redirect | `_redirects` |
| 11 | End-to-end smoke test | Manual verification |
