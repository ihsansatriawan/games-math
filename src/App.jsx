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
