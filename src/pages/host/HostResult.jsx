import { useNavigate } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import { useGame } from '../../context/GameContext'

export default function HostResult() {
  const navigate = useNavigate()
  const { teamScores, createRoom, gameConfig } = useGame()

  const winner = teamScores.opor > teamScores.rendang
    ? 'TIM OPOR'
    : teamScores.rendang > teamScores.opor
    ? 'TIM RENDANG'
    : 'SERI'

  const winnerBg = teamScores.opor > teamScores.rendang
    ? 'bg-amber-400'
    : teamScores.rendang > teamScores.opor
    ? 'bg-amber-900 text-white'
    : 'bg-slate-200'

  async function handlePlayAgain() {
    await createRoom(gameConfig)
    navigate('/host/lobby')
  }

  return (
    <div className="min-h-screen ketupat-pattern flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white p-16 rounded-3xl neubrutalism text-center">
        <PartyPopper size={64} className="mx-auto mb-6 text-primary" />
        <h2 className="text-2xl font-black uppercase text-slate-500 mb-2">Hasil Pertandingan</h2>
        <div className={`text-6xl font-black uppercase italic leading-none mb-8 py-4 px-8 rounded-2xl inline-block ${winnerBg}`}>
          {winner}<br />MENANG!
        </div>
        <div className="flex justify-center gap-12 mb-12">
          <div className="text-center">
            <div className="neubrutalism w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black mb-2 bg-amber-100">
              {teamScores.opor}
            </div>
            <span className="font-bold uppercase text-amber-700">Skor Opor</span>
          </div>
          <div className="text-center">
            <div className="neubrutalism w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black mb-2 bg-amber-900 text-white">
              {teamScores.rendang}
            </div>
            <span className="font-bold uppercase text-amber-900">Skor Rendang</span>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handlePlayAgain}
            className="neubrutalism neo-btn px-10 py-5 bg-slate-900 text-white text-xl font-black uppercase rounded-xl"
          >
            Main Lagi
          </button>
          <button
            onClick={() => navigate('/')}
            className="neubrutalism neo-btn px-10 py-5 bg-white text-slate-900 text-xl font-black uppercase rounded-xl"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  )
}
