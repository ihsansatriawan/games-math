import { useState, useEffect, useRef } from 'react'

export default function TimerBar({ duration = 10, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpireRef.current?.()
      return
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timeLeft])

  const pct = (timeLeft / duration) * 100
  const barColor = pct > 50 ? 'bg-emerald-500' : pct > 25 ? 'bg-amber-400' : 'bg-rose-500'

  return (
    <div className="w-full h-10 bg-white rounded-full border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_#181511]">
      <div
        className={`h-full ${barColor} border-r-4 border-slate-900 transition-all duration-1000 ease-linear`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
