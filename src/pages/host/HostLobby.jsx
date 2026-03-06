import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { User, UtensilsCrossed, Flame } from 'lucide-react'
import { useGame } from '../../context/GameContext'

export default function HostLobby() {
  const navigate = useNavigate()
  const { roomPin, players, gameStatus, startGame } = useGame()

  useEffect(() => {
    if (!roomPin) navigate('/host', { replace: true })
  }, [roomPin, navigate])

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
                onClick={async () => await startGame()}
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
