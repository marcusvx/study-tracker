import React, { useState } from 'react'
import { StudyItem } from '../../types/study'

interface ProgressSheetProps {
  item: StudyItem
  onSave: (amount: number, minutes: number, note: string) => void
  onClose: () => void
}

export function ProgressSheet({ item, onSave, onClose }: ProgressSheetProps) {
  const [amount, setAmount] = useState('')
  const [minutes, setMinutes] = useState('')
  const [note, setNote] = useState('')

  const handleSave = () => {
    const a = parseFloat(amount)
    const m = parseInt(minutes)
    if (!a || !m) return
    onSave(a, m, note)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: 'var(--surface-card, #1E2226)',
          borderRadius: '16px 16px 0 0',
          borderTop: '1px solid var(--border, #2D3339)',
          width: '100%',
          padding: '0 0 32px',
          maxWidth: 480,
          margin: '0 auto',
          animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, background: '#3A4048', borderRadius: 99 }} />
        </div>

        <div style={{ padding: '12px 24px 0' }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: 'var(--text-primary, #EDEEEC)' }}>
            Registrar progresso
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary, #8B929A)', marginBottom: 20 }}>
            {item.title}
          </div>

          <label style={labelStyle}>
            Quanto avançou? <span style={{ color: 'var(--text-muted, #8B929A)' }}>({item.unit})</span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder={`Ex: 20 ${item.unit}`}
            style={inputStyle}
            autoFocus
          />

          <label style={labelStyle}>Minutos gastos</label>
          <input
            type="number"
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
            placeholder="Ex: 30"
            style={inputStyle}
          />

          <label style={labelStyle}>
            Nota <span style={{ color: 'var(--text-muted, #8B929A)' }}>(opcional)</span>
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Como foi a sessão?"
            rows={2}
            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
          />

          <button
            onClick={handleSave}
            style={{
              width: '100%',
              background: 'var(--accent, #E8A33D)',
              color: '#14171A',
              border: 'none',
              borderRadius: 6,
              padding: '14px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: 8,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Salvar
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted, #8B929A)',
  marginBottom: 6,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--border, #2D3339)',
  borderRadius: 6,
  padding: '12px 14px',
  fontSize: 15,
  color: 'var(--text-primary, #EDEEEC)',
  background: '#14171A',
  marginBottom: 16,
  outline: 'none',
  fontFamily: 'inherit',
}
