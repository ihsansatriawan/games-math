const VARIANTS = {
  primary:  'bg-primary text-white',
  success:  'bg-emerald-500 text-white',
  danger:   'bg-rose-500 text-white',
  warning:  'bg-amber-400 text-slate-900',
  outline:  'bg-white text-slate-900',
}

export default function Button({ variant = 'primary', children, onClick, disabled, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        neubrutalism neo-btn
        px-6 py-3 rounded-xl font-black uppercase tracking-wide
        ${VARIANTS[variant]}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
