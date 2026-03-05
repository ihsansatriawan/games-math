import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timer } from 'lucide-react'
import { useMockGame } from '../../context/MockGameContext'

export default function PlayerWaiting() {
  const navigate = useNavigate()
  const { players, gameStatus } = useMockGame()

  const thisPlayer = players[players.length - 1]

  useEffect(() => {
    if (gameStatus === 'playing') navigate('/play/game')
    if (gameStatus === 'idle') navigate('/play')
  }, [gameStatus, navigate])

  if (!thisPlayer) return null

  const isOpor = thisPlayer.team === 'opor'
  const teamName = isOpor ? 'TIM OPOR' : 'TIM RENDANG'
  const bgColor = isOpor ? 'bg-amber-400' : 'bg-amber-900'
  const textColor = isOpor ? 'text-slate-900' : 'text-white'

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} flex flex-col items-center justify-center gap-8 p-8`}>
      <div className="animate-bounce">
        <Timer size={80} />
      </div>
      <h2 className="text-4xl font-black uppercase">Halo, {thisPlayer.name}!</h2>
      <div className="bg-white text-slate-900 p-6 neubrutalism rounded-2xl text-center w-full max-w-xs">
        <p className="font-bold text-lg mb-1">Kamu masuk</p>
        <p className="text-3xl font-black text-primary">{teamName}</p>
      </div>
      <p className="font-bold text-lg opacity-80 animate-pulse">Tunggu guru memulai permainan...</p>
    </div>
  )
}
