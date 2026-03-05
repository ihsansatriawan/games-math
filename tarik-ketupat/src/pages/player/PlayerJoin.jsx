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
