import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockGame } from '../../context/MockGameContext'

const MODES = [
  { id: 'penjumlahan', label: 'Tambah', symbol: '+' },
  { id: 'pengurangan', label: 'Kurang', symbol: '−' },
  { id: 'perkalian',   label: 'Kali',   symbol: '×' },
]
const DIFFICULTIES = [
  { id: 'mudah',  label: 'Mudah',  active: 'bg-emerald-400' },
  { id: 'sedang', label: 'Sedang', active: 'bg-amber-400' },
  { id: 'sulit',  label: 'Sulit',  active: 'bg-rose-400' },
]

export default function HostSetup() {
  const navigate = useNavigate()
  const { createRoom } = useMockGame()
  const [mode, setMode] = useState('penjumlahan')
  const [difficulty, setDifficulty] = useState('mudah')

  function handleCreate() {
    createRoom({ mode, difficulty })
    navigate('/host/lobby')
  }

  return (
    <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl neubrutalism">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-black uppercase italic text-slate-900">Persiapan Perang Ketupat!</h2>
          <p className="mt-2 text-lg font-bold text-slate-500">Konfigurasi arena pertandingan matematika kamu</p>
        </div>

        <div className="space-y-8">
          {/* Math Mode */}
          <div>
            <label className="block text-xl font-black mb-4 uppercase tracking-wide">Pilih Mode Matematika</label>
            <div className="grid grid-cols-3 gap-4">
              {MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`
                    neubrutalism neo-btn flex flex-col items-center justify-center p-6 rounded-xl
                    ${mode === m.id ? 'bg-primary text-white shadow-[6px_6px_0px_0px_#181511]' : 'bg-amber-50 text-slate-900'}
                  `}
                >
                  <span className="text-4xl font-black mb-2">{m.symbol}</span>
                  <span className="font-bold uppercase text-sm">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xl font-black mb-4 uppercase tracking-wide">Tingkat Kesulitan</label>
            <div className="flex gap-4">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`
                    flex-1 py-4 text-center rounded-xl border-4 border-slate-900 font-black uppercase tracking-wider
                    ${difficulty === d.id ? `${d.active} shadow-[4px_4px_0px_0px_#181511]` : 'bg-white'}
                    transition-all
                  `}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="neubrutalism neo-btn w-full py-6 bg-emerald-500 text-white text-3xl font-black uppercase tracking-widest rounded-2xl"
          >
            Buat Ruangan
          </button>
        </div>
      </div>
    </div>
  )
}
