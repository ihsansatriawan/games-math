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
