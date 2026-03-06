import { useState, useEffect } from 'react'
import { useGame } from '../../context/GameContext'

const OPTION_STYLES = {
  A: { base: 'bg-blue-500',    correct: 'bg-emerald-500', wrong: 'bg-rose-600' },
  B: { base: 'bg-red-500',     correct: 'bg-emerald-500', wrong: 'bg-rose-600' },
  C: { base: 'bg-emerald-500', correct: 'bg-emerald-500', wrong: 'bg-rose-600' },
  D: { base: 'bg-yellow-500',  correct: 'bg-emerald-500', wrong: 'bg-rose-600' },
}

export default function AnswerPad({ playerTeam }) {
  const { currentQuestion, submitAnswer } = useGame()
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    setSelectedAnswer(null)
    setIsSubmitted(false)
  }, [currentQuestion?.id])

  if (!currentQuestion) return null

  function handleAnswer(key) {
    if (isSubmitted) return
    const isCorrect = key === currentQuestion.jawaban_benar
    setSelectedAnswer(key)
    setIsSubmitted(true)
    submitAnswer(playerTeam, isCorrect)
  }

  return (
    <div className="grid grid-cols-2 gap-4 h-[60vh]">
      {Object.entries(currentQuestion.opsi).map(([key, value]) => {
        let colorClass = OPTION_STYLES[key].base
        if (isSubmitted) {
          if (key === currentQuestion.jawaban_benar) {
            colorClass = OPTION_STYLES[key].correct
          } else if (key === selectedAnswer) {
            colorClass = OPTION_STYLES[key].wrong
          } else {
            colorClass = 'bg-slate-300'
          }
        }

        return (
          <button
            key={key}
            onClick={() => handleAnswer(key)}
            disabled={isSubmitted}
            className={`
              neubrutalism text-white font-black text-3xl rounded-2xl
              flex flex-col items-center justify-center gap-2
              ${colorClass}
              ${isSubmitted ? 'opacity-70 pointer-events-none' : 'neo-btn'}
              transition-all duration-300
            `}
          >
            <span className="text-sm font-black opacity-80">{key}</span>
            <span>{value}</span>
          </button>
        )
      })}
    </div>
  )
}
