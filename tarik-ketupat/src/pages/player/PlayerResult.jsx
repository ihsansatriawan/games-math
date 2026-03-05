import { useNavigate } from 'react-router-dom'
import { Trophy, Frown } from 'lucide-react'
import { useMockGame } from '../../context/MockGameContext'

export default function PlayerResult() {
  const navigate = useNavigate()
  const { players, teamScores } = useMockGame()

  const thisPlayer = players[players.length - 1]

  if (!thisPlayer) {
    navigate('/')
    return null
  }

  const { opor, rendang } = teamScores
  const winnerTeam = opor > rendang ? 'opor' : rendang > opor ? 'rendang' : 'draw'
  const playerWon = winnerTeam === thisPlayer.team || winnerTeam === 'draw'
  const playerScore = thisPlayer.team === 'opor' ? opor : rendang

  return (
    <div className="min-h-screen ketupat-pattern flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white neubrutalism rounded-3xl p-8 text-center space-y-6">
        {playerWon ? (
          <>
            <h2 className="text-4xl font-black uppercase">HORE!</h2>
            <div className="w-32 h-32 mx-auto bg-emerald-100 neubrutalism rounded-full flex items-center justify-center">
              <Trophy size={64} className="text-emerald-600" />
            </div>
            <h3 className="text-3xl font-black text-emerald-600 uppercase">MENANG!</h3>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-black uppercase">Yah...</h2>
            <div className="w-32 h-32 mx-auto bg-slate-100 neubrutalism rounded-full flex items-center justify-center">
              <Frown size={64} className="text-slate-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-500 uppercase">KALAH</h3>
          </>
        )}
        <p className="font-bold text-slate-500">Poin Tim Kamu: <span className="text-2xl font-black text-slate-900">{playerScore}</span></p>
        <button
          onClick={() => navigate('/play')}
          className="neubrutalism neo-btn w-full py-4 bg-slate-900 text-white font-black text-lg uppercase rounded-xl"
        >
          {playerWon ? 'KEREN!' : 'Coba Lagi'}
        </button>
      </div>
    </div>
  )
}
