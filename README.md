# Tarik Ketupat Matematika

A classroom math game where a teacher (host) projects a quiz on screen and students join via their phones. Two teams — **Tim Opor** and **Tim Rendang** — compete by answering math questions. Correct answers "pull" a ketupat marker toward their side in a tug-of-war animation.

## How It Works

1. **Teacher** opens the app, logs in via magic link email, configures math mode and difficulty, and creates a room
2. A **6-digit PIN** and QR code are displayed for students to join
3. **Students** join via phone, log in, enter the PIN and their name, and are assigned to a team
4. The teacher starts the game — questions appear on the projector with a countdown timer
5. Students answer on their phones; correct answers shift the tug-of-war ketupat marker in real time
6. After all questions, the winning team is announced

## Tech Stack

- **React 19** + **Vite**
- **React Router v7** — client-side routing
- **Supabase** — authentication (magic link OTP) + Realtime Broadcast for multiplayer sync
- **Tailwind CSS v3** — neubrutalism design system
- **lucide-react** — icons
- **qrcode.react** — QR code generation

## Getting Started

```bash
npm install
```

Create `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
```

Open `http://localhost:5173`. Log in as teacher on one device and as student on another to test real multiplayer.

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
├── lib/
│   └── supabase.js             # Supabase client (reads VITE_SUPABASE_* env vars)
├── context/
│   ├── AuthContext.jsx         # Auth state + magic link signIn/signOut
│   └── GameContext.jsx         # Game state + Supabase rooms DB + Realtime Broadcast
├── components/
│   ├── host/
│   │   ├── TimerBar.jsx        # Countdown timer (green → amber → red)
│   │   └── KetupatAnim.jsx     # Tug-of-war marker animation
│   ├── player/
│   │   └── AnswerPad.jsx       # 2×2 answer buttons with correct/wrong feedback
│   └── shared/
│       ├── LoginForm.jsx       # Magic link email form
│       └── ProtectedRoute.jsx  # Auth guard — shows LoginForm if not logged in
├── pages/
│   ├── Home.jsx                # Landing page (logout button when logged in)
│   ├── host/
│   │   ├── HostSetup.jsx       # Configure mode & difficulty, create room
│   │   ├── HostLobby.jsx       # Show PIN/QR code, wait for players
│   │   ├── HostGameplay.jsx    # Project questions + timer + tug-of-war
│   │   └── HostResult.jsx      # Winner announcement
│   └── player/
│       ├── PlayerJoin.jsx      # Enter PIN and name (pre-filled from email)
│       ├── PlayerWaiting.jsx   # Show team assignment, wait for host
│       ├── PlayerGamepad.jsx   # 4-button answer controller
│       └── PlayerResult.jsx    # Win/lose screen
└── data/
    └── mockSoal.json           # Question bank — 3 questions per mode+difficulty combo
```

## Routes

| Path | Page | Role |
|------|------|------|
| `/` | Home | Choose Host or Player |
| `/host` | HostSetup | Configure game settings (protected) |
| `/host/lobby` | HostLobby | Display PIN, wait for players (protected) |
| `/host/game` | HostGameplay | Active question display (protected) |
| `/host/result` | HostResult | Final scores & winner (protected) |
| `/play` | PlayerJoin | Enter PIN and name (protected) |
| `/play/wait` | PlayerWaiting | Team assignment screen (protected) |
| `/play/game` | PlayerGamepad | Answer buttons (protected) |
| `/play/result` | PlayerResult | Win/lose screen (protected) |

## Architecture

### Authentication

`AuthContext` wraps the app with Supabase magic link OTP auth. `ProtectedRoute` guards all game routes — unauthenticated users see `LoginForm` instead of the page.

### Multiplayer (Realtime)

`GameContext` manages all game state using two mechanisms:

- **Supabase DB** — `rooms` table stores PIN, config, host, and status
- **Supabase Realtime Broadcast** — channel `room-{pin}` syncs events between host and players

| Event | Direction | Payload |
|-------|-----------|---------|
| `player_join` | player → host | `{ playerName, team }` |
| `player_answer` | player → host | `{ team, isCorrect }` |
| `game_start` | host → players | — |
| `next_question` | host → players | `{ questionIndex }` |
| `score_update` | host → players | `{ teamScores }` |
| `game_end` | host → players | `{ teamScores }` |

The host is source of truth for scores. Players broadcast answers; the host tallies and re-broadcasts scores.

## Database

Single table: `public.rooms` (RLS enabled, authenticated users only)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `pin` | varchar(6) | Unique room PIN |
| `host_id` | uuid | References `auth.users` |
| `config` | jsonb | `{ mode, difficulty }` |
| `status` | varchar | `lobby` \| `playing` \| `finished` |
| `created_at` | timestamptz | — |
