import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../../context/GameContext'
import AnswerPad from '../../components/player/AnswerPad'

export default function PlayerGamepad() {
  const navigate = useNavigate()
  const { currentQuestion, playerTeam, gameStatus, teamScores } = useGame()

  useEffect(() => {
    if (gameStatus === 'finished') navigate('/play/result')
    if (gameStatus === 'idle' || gameStatus === 'lobby') navigate('/play')
  }, [gameStatus, navigate])

  if (!playerTeam || !currentQuestion) return null

  const isOpor = playerTeam === 'opor'
  const teamScore = isOpor ? teamScores.opor : teamScores.rendang
  const teamBg = isOpor ? 'bg-amber-400' : 'bg-amber-900'
  const teamText = isOpor ? 'text-slate-900' : 'text-white'

  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      {/* Question header */}
      <div className="p-6 bg-slate-900 text-white text-center">
        <p className="text-xs font-black text-primary uppercase mb-1">Pertanyaan</p>
        <h3 className="text-xl font-black leading-tight">{currentQuestion.soal}</h3>
      </div>

      {/* Answer pad */}
      <div className="flex-1 p-4">
        <AnswerPad playerTeam={playerTeam} />
      </div>

      {/* Team score footer */}
      <div className={`p-4 ${teamBg} ${teamText} border-t-4 border-slate-900 text-center`}>
        <p className="font-black text-sm uppercase">
          {isOpor ? 'Tim Opor' : 'Tim Rendang'} — Poin: {teamScore}
        </p>
      </div>
    </div>
  )
}
