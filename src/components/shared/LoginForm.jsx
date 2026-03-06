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
