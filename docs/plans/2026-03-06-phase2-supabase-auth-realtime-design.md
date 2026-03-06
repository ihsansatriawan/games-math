# Phase 2 Design: Supabase Auth + Realtime Backend

**Date:** 2026-03-06
**Scope:** Replace MockGameContext with Supabase-backed auth, rooms DB, and Realtime Broadcast.

---

## 1. Auth Layer (Email Magic Link)

- **AuthContext** wraps entire app in `main.jsx`
  - On mount: `supabase.auth.getSession()` + `onAuthStateChange` listener
  - Exposes: `user`, `loading`, `signIn(email)`, `signOut()`
  - `signIn` calls `supabase.auth.signInWithOtp({ email })`
- **ProtectedRoute** wrapper component
  - `loading` -> spinner
  - No `user` -> inline LoginForm (email input + "Send Magic Link" button)
  - Has `user` -> render children
- **Route protection:**
  - `/` (Home) stays public
  - `/host/*` and `/play/*` wrapped in ProtectedRoute
- **User name:** pre-fill PlayerJoin name field with email prefix (before `@`), editable

## 2. Supabase Infrastructure

### Client (`src/lib/supabase.js`)
- Singleton: reads `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` from env

### Database — `rooms` table
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

### Environment
```
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

## 3. GameContext (replaces MockGameContext)

### State (unchanged shape)
`roomPin`, `gameStatus`, `gameConfig`, `players`, `currentQuestion`, `currentQuestionIndex`, `teamScores`, `questions`

### Actions — Mock vs Supabase

| Action | Before (Mock) | After (Supabase) |
|--------|--------------|-------------------|
| `createRoom(config)` | Generate PIN locally | INSERT into `rooms`, get PIN |
| `joinRoom(pin, name)` | Check local PIN | SELECT room by PIN, broadcast `player_join` |
| `startGame()` | Set local status | UPDATE room status, broadcast `game_start` |
| `submitAnswer(team, isCorrect)` | Update local score | Broadcast `player_answer` to host |
| `nextQuestion()` | Increment local index | Host broadcasts `next_question` |
| `endGame()` | Set local status | UPDATE room status, broadcast `game_end` |

### Realtime Broadcast Events (channel: `room-${pin}`)

| Event | Direction | Payload |
|-------|-----------|---------|
| `player_join` | Player -> Host | `{ playerName, team, email }` |
| `player_answer` | Player -> Host | `{ team, isCorrect }` |
| `game_start` | Host -> Players | `{ questionId }` |
| `next_question` | Host -> Players | `{ questionId }` |
| `score_update` | Host -> Players | `{ teamScores }` |
| `game_end` | Host -> Players | `{ teamScores }` |

- Host is source of truth for scores
- Questions stay client-side from `mockSoal.json` (DB later)

## 4. Page Changes

All pages swap `useMockGame()` -> `useGame()`. Key async changes:
- `createRoom`, `joinRoom` become async
- Host pages subscribe to broadcast events for player joins and answers
- Player pages listen for `game_start`, `next_question`, `score_update`, `game_end`
- PlayerJoin pre-fills name from auth email prefix

## 5. New/Deleted Files

**New:**
- `src/lib/supabase.js`
- `src/context/AuthContext.jsx`
- `src/context/GameContext.jsx`
- `src/components/shared/ProtectedRoute.jsx`
- `src/components/shared/LoginForm.jsx`

**Deleted:**
- `src/context/MockGameContext.jsx`
- `src/context/MockGameContext.test.jsx`

## 6. Deployment (Netlify)

- `public/_redirects` with `/* /index.html 200` for SPA routing
- Env vars in Netlify dashboard
- Add Netlify URL to Supabase Auth redirect URL config
