import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../../context/GameContext'
import TimerBar from '../../components/host/TimerBar'
import KetupatAnim from '../../components/host/KetupatAnim'

export default function HostGameplay() {
  const navigate = useNavigate()
  const { currentQuestion, currentQuestionIndex, questions, teamScores, gameStatus, nextQuestion } = useGame()

  useEffect(() => {
    if (gameStatus === 'finished') navigate('/host/result')
    if (gameStatus === 'idle' || gameStatus === 'lobby') navigate('/host')
  }, [gameStatus, navigate])

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen bg-bg-light flex flex-col gap-6 p-8">
      {/* Timer */}
      <TimerBar key={currentQuestion.id} duration={10} onExpire={nextQuestion} />

      {/* Question card */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl neubrutalism p-12 text-center relative">
        <span className="absolute top-4 left-4 px-4 py-2 bg-emerald-100 text-emerald-800 font-black rounded-lg border-2 border-slate-900 text-sm">
          SOAL {currentQuestionIndex + 1}/{questions.length}
        </span>
        <p className="text-6xl font-black text-slate-900 leading-tight max-w-3xl">
          {currentQuestion.soal}
        </p>
        <div className="mt-10 flex gap-6 flex-wrap justify-center">
          {Object.entries(currentQuestion.opsi).map(([key, val]) => (
            <div
              key={key}
              className={`w-36 h-20 border-4 border-slate-900 rounded-xl flex items-center justify-center text-3xl font-black
                ${key === currentQuestion.jawaban_benar ? 'bg-emerald-100' : 'bg-slate-100'}`}
            >
              {key}. {val}
            </div>
          ))}
        </div>
      </div>

      {/* Tug of war */}
      <KetupatAnim scoreOpor={teamScores.opor} scoreRendang={teamScores.rendang} />
    </div>
  )
}
