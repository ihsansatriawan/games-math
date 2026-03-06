import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import mockSoal from '../data/mockSoal.json'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const { user } = useAuth()
  const [roomPin, setRoomPin] = useState('')
  const [gameStatus, setGameStatus] = useState('idle')
  const [gameConfig, setGameConfig] = useState({ mode: 'penjumlahan', difficulty: 'mudah' })
  const [players, setPlayers] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [teamScores, setTeamScores] = useState({ opor: 0, rendang: 0 })
  const [playerTeam, setPlayerTeam] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const channelRef = useRef(null)
  const isHostRef = useRef(false)

  const questions = mockSoal.filter(
    q => q.tipe === gameConfig.mode && q.difficulty === gameConfig.difficulty
  ).length > 0
    ? mockSoal.filter(q => q.tipe === gameConfig.mode && q.difficulty === gameConfig.difficulty)
    : mockSoal

  const currentQuestion = questions[currentQuestionIndex] ?? null

  // Cleanup channel on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [])

  const subscribeToChannel = useCallback(async (pin, isHost) => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    await supabase.realtime.setAuth()

    const channel = supabase.channel(`room-${pin}`)

    if (isHost) {
      channel
        .on('broadcast', { event: 'player_join' }, ({ payload }) => {
          setPlayers(prev => [...prev, { name: payload.playerName, team: payload.team }])
        })
        .on('broadcast', { event: 'player_answer' }, ({ payload }) => {
          if (payload.isCorrect) {
            setTeamScores(prev => ({ ...prev, [payload.team]: prev[payload.team] + 10 }))
          }
        })
    } else {
      channel
        .on('broadcast', { event: 'game_start' }, () => {
          setGameStatus('playing')
        })
        .on('broadcast', { event: 'next_question' }, ({ payload }) => {
          setCurrentQuestionIndex(payload.questionIndex)
        })
        .on('broadcast', { event: 'score_update' }, ({ payload }) => {
          setTeamScores(payload.teamScores)
        })
        .on('broadcast', { event: 'game_end' }, ({ payload }) => {
          setTeamScores(payload.teamScores)
          setGameStatus('finished')
        })
    }

    await channel.subscribe()
    channelRef.current = channel
  }, [])

  const createRoom = useCallback(async (config) => {
    const pin = String(Math.floor(100000 + Math.random() * 900000))
    const { error } = await supabase.from('rooms').insert({
      pin,
      host_id: user?.id,
      config,
      status: 'lobby',
    })
    if (error) throw error

    setRoomPin(pin)
    setGameConfig(config)
    setGameStatus('lobby')
    setPlayers([])
    setTeamScores({ opor: 0, rendang: 0 })
    setCurrentQuestionIndex(0)
    isHostRef.current = true

    await subscribeToChannel(pin, true)
  }, [user, subscribeToChannel])

  const joinRoom = useCallback(async (pin, name) => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('pin', pin)
      .single()

    if (error || !data) return false

    const team = Math.random() < 0.5 ? 'opor' : 'rendang'
    setRoomPin(pin)
    setGameConfig(data.config)
    setGameStatus('lobby')
    setPlayerTeam(team)
    setPlayerName(name)
    isHostRef.current = false

    await subscribeToChannel(pin, false)

    // Broadcast join to host
    channelRef.current.send({
      type: 'broadcast',
      event: 'player_join',
      payload: { playerName: name, team, email: user?.email },
    })

    return team
  }, [user, subscribeToChannel])

  const startGame = useCallback(async () => {
    await supabase.from('rooms').update({ status: 'playing' }).eq('pin', roomPin)
    setGameStatus('playing')
    setCurrentQuestionIndex(0)
    setTeamScores({ opor: 0, rendang: 0 })

    channelRef.current?.send({
      type: 'broadcast',
      event: 'game_start',
      payload: { questionId: questions[0]?.id },
    })
  }, [roomPin, questions])

  const submitAnswer = useCallback((team, isCorrect) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'player_answer',
      payload: { team, isCorrect },
    })
  }, [])

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => {
      const next = prev + 1
      if (next >= questions.length) {
        setGameStatus('finished')
        supabase.from('rooms').update({ status: 'finished' }).eq('pin', roomPin)
        setTeamScores(currentScores => {
          channelRef.current?.send({
            type: 'broadcast',
            event: 'game_end',
            payload: { teamScores: currentScores },
          })
          return currentScores
        })
        return prev
      }
      setTeamScores(currentScores => {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'next_question',
          payload: { questionIndex: next, questionId: questions[next]?.id },
        })
        channelRef.current?.send({
          type: 'broadcast',
          event: 'score_update',
          payload: { teamScores: currentScores },
        })
        return currentScores
      })
      return next
    })
  }, [questions, roomPin])

  const endGame = useCallback(() => {
    setGameStatus('finished')
    supabase.from('rooms').update({ status: 'finished' }).eq('pin', roomPin)
    setTeamScores(currentScores => {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'game_end',
        payload: { teamScores: currentScores },
      })
      return currentScores
    })
  }, [roomPin])

  return (
    <GameContext.Provider value={{
      roomPin, gameStatus, gameConfig, players,
      currentQuestion, currentQuestionIndex,
      teamScores, questions,
      playerTeam, playerName,
      createRoom, joinRoom, startGame,
      submitAnswer, nextQuestion, endGame,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
