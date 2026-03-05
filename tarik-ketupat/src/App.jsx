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
