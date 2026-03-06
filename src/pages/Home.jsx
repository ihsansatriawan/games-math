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
