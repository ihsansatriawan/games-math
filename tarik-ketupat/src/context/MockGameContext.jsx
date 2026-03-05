import { createContext, useContext, useState, useCallback } from 'react'
import mockSoal from '../data/mockSoal.json'

const MockGameContext = createContext(null)

export function MockGameProvider({ children }) {
  const [roomPin, setRoomPin] = useState('')
  const [gameStatus, setGameStatus] = useState('idle')
  const [gameConfig, setGameConfig] = useState({ mode: 'penjumlahan', difficulty: 'mudah' })
  const [players, setPlayers] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [teamScores, setTeamScores] = useState({ opor: 0, rendang: 0 })

  const questions = mockSoal.filter(
    q => q.tipe === gameConfig.mode && q.difficulty === gameConfig.difficulty
  ).length > 0
    ? mockSoal.filter(q => q.tipe === gameConfig.mode && q.difficulty === gameConfig.difficulty)
    : mockSoal

  const currentQuestion = questions[currentQuestionIndex] ?? null

  const createRoom = useCallback((config) => {
    const pin = String(Math.floor(100000 + Math.random() * 900000))
    setRoomPin(pin)
    setGameConfig(config)
    setGameStatus('lobby')
    setPlayers([])
    setTeamScores({ opor: 0, rendang: 0 })
    setCurrentQuestionIndex(0)
  }, [])

  const joinRoom = useCallback((pin, name) => {
    if (pin !== roomPin) return false
    const team = Math.random() < 0.5 ? 'opor' : 'rendang'
    setPlayers(prev => [...prev, { name, team }])
    return team
  }, [roomPin])

  const startGame = useCallback(() => {
    setGameStatus('playing')
    setCurrentQuestionIndex(0)
    setTeamScores({ opor: 0, rendang: 0 })
  }, [])

  const submitAnswer = useCallback((team, isCorrect) => {
    if (!isCorrect) return
    setTeamScores(prev => ({ ...prev, [team]: prev[team] + 10 }))
  }, [])

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => {
      if (prev + 1 >= questions.length) {
        setGameStatus('finished')
        return prev
      }
      return prev + 1
    })
  }, [questions.length])

  const endGame = useCallback(() => {
    setGameStatus('finished')
  }, [])

  return (
    <MockGameContext.Provider value={{
      roomPin, gameStatus, gameConfig, players,
      currentQuestion, currentQuestionIndex,
      teamScores, questions,
      createRoom, joinRoom, startGame,
      submitAnswer, nextQuestion, endGame,
    }}>
      {children}
    </MockGameContext.Provider>
  )
}

export function useMockGame() {
  const ctx = useContext(MockGameContext)
  if (!ctx) throw new Error('useMockGame must be used inside MockGameProvider')
  return ctx
}
