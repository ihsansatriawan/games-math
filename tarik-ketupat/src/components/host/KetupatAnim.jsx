function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

export default function KetupatAnim({ scoreOpor = 0, scoreRendang = 0 }) {
  const netPos = clamp(scoreRendang - scoreOpor, -50, 50)

  return (
    <div className="relative h-44 bg-amber-50 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_#181511] flex flex-col justify-center overflow-hidden">
      {/* Team labels */}
      <div className="absolute top-4 w-full flex justify-between px-8">
        <span className="text-lg font-black uppercase text-amber-600">← Tim Opor</span>
        <span className="text-lg font-black uppercase text-amber-900">Tim Rendang →</span>
      </div>

      {/* Rope */}
      <div className="relative w-full h-4 bg-amber-800 border-y-2 border-slate-900">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-slate-900/30" />

        {/* Ketupat marker */}
        <div
          className="absolute top-1/2 left-1/2 -translate-y-1/2 transition-transform duration-500 ease-out"
          style={{ transform: `translate(calc(-50% + ${netPos}%), -50%)` }}
        >
          <div className="w-16 h-16 bg-primary neubrutalism-sm rotate-45 flex items-center justify-center">
            <span className="text-white font-black text-lg -rotate-45">K</span>
          </div>
        </div>
      </div>

      {/* Score labels */}
      <div className="absolute bottom-4 w-full flex justify-between px-8">
        <span className="text-2xl font-black text-amber-600">{scoreOpor}</span>
        <span className="text-2xl font-black text-amber-900">{scoreRendang}</span>
      </div>
    </div>
  )
}
