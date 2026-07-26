import React, { useState } from 'react'
import { Category, StudyItem, Unit } from '../types/study'
import { categoryMeta, IconArrowLeft } from '../components/icons/Index'

interface CreateEditViewProps {
  initial?: StudyItem
  onSave: (item: Omit<StudyItem, 'id' | 'log'> & { id?: string }) => void
  onBack: () => void
}

export function CreateEditView({ initial, onSave, onBack }: CreateEditViewProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState<Category>(initial?.category ?? 'book')
  const [unit, setUnit] = useState<Unit>(initial?.unit ?? 'pages')
  const [totalScope, setTotalScope] = useState(String(initial?.totalScope ?? ''))
  const [currentProgress, setCurrentProgress] = useState(String(initial?.currentProgress ?? '0'))
  const [deadline, setDeadline] = useState(initial?.deadline ?? '')
  const [cadenceDays, setCadenceDays] = useState(initial?.cadenceDays ?? 1)
  const [sessionMinutes, setSessionMinutes] = useState(String(initial?.sessionMinutes ?? '30'))
  const [reminderTime, setReminderTime] = useState(initial?.reminderTime ?? '')
  const [notificationsOn, setNotificationsOn] = useState(initial?.notificationsOn ?? true)

  const handleSave = () => {
    if (!title.trim() || !totalScope) return
    onSave({
      id: initial?.id,
      title: title.trim(),
      category,
      unit,
      totalScope: parseFloat(totalScope),
      currentProgress: parseFloat(currentProgress) || 0,
      deadline: deadline || undefined,
      cadenceDays,
      sessionMinutes: parseInt(sessionMinutes) || 30,
      reminderTime: reminderTime || undefined,
      notificationsOn,
      status: initial?.status ?? 'active',
    })
  }

  const units: Unit[] = ['pages', '%', 'hours', 'modules']
  const unitLabels: Record<Unit, string> = { pages: 'Páginas', '%': 'Percentual', hours: 'Horas', modules: 'Módulos' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base, #14171A)', paddingBottom: 48 }}>
      <div style={{ background: 'var(--surface-card, #1E2226)', borderBottom: '1px solid var(--border, #2D3339)', padding: '20px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary, #8B929A)',
            padding: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
          }}
        >
          <IconArrowLeft size={18} /> Cancelar
        </button>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary, #EDEEEC)' }}>
          {initial ? 'Editar item' : 'Novo item de estudo'}
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Title */}
        <div style={cardStyle}>
          <label style={labelStyle}>Título</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Designing Data-Intensive Applications"
            style={inputStyle}
          />

          {/* Category */}
          <label style={labelStyle}>Categoria</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
            {(Object.keys(categoryMeta) as Category[]).map(c => {
              const m = categoryMeta[c]
              const active = category === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '12px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    border: active ? `2px solid ${m.color}` : '1px solid var(--border, #2D3339)',
                    background: active ? m.bg : '#14171A',
                    color: active ? m.color : 'var(--text-muted, #8B929A)',
                    transition: 'all 0.15s',
                  }}
                >
                  <m.Icon size={20} />
                  <span style={{ fontSize: 10, fontWeight: 600 }}>{m.label}</span>
                </button>
              )
            })}
          </div>

          {/* Unit */}
          <label style={labelStyle}>Unidade</label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {units.map(u => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '7px 14px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: unit === u ? '1.5px solid var(--accent, #E8A33D)' : '1px solid var(--border, #2D3339)',
                  background: unit === u ? 'rgba(232, 163, 61, 0.12)' : '#14171A',
                  color: unit === u ? 'var(--accent, #E8A33D)' : 'var(--text-secondary, #8B929A)',
                  transition: 'all 0.15s',
                }}
              >
                {unitLabels[u]}
              </button>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Escopo total</label>
              <input
                type="number"
                value={totalScope}
                onChange={e => setTotalScope(e.target.value)}
                placeholder="Ex: 500"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Progresso atual</label>
              <input
                type="number"
                value={currentProgress}
                onChange={e => setCurrentProgress(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </div>
          </div>
          <label style={labelStyle}>
            Prazo final <span style={{ color: 'var(--text-muted, #8B929A)' }}>(opcional)</span>
          </label>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Cadence */}
        <div style={cardStyle}>
          <label style={labelStyle}>Cadência dos Estudos</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setCadenceDays(1)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                border: cadenceDays === 1 ? '1.5px solid var(--accent, #E8A33D)' : '1px solid var(--border, #2D3339)',
                background: cadenceDays === 1 ? 'rgba(232, 163, 61, 0.12)' : '#14171A',
                color: cadenceDays === 1 ? 'var(--accent, #E8A33D)' : 'var(--text-secondary, #8B929A)',
              }}
            >
              Diário
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 2 }}>
              <button
                type="button"
                onClick={() => setCadenceDays(Math.max(2, cadenceDays === 1 ? 2 : cadenceDays))}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  border: cadenceDays > 1 ? '1.5px solid var(--accent, #E8A33D)' : '1px solid var(--border, #2D3339)',
                  background: cadenceDays > 1 ? 'rgba(232, 163, 61, 0.12)' : '#14171A',
                  color: cadenceDays > 1 ? 'var(--accent, #E8A33D)' : 'var(--text-secondary, #8B929A)',
                }}
              >
                A cada
              </button>
              {cadenceDays > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button type="button" onClick={() => setCadenceDays(Math.max(2, cadenceDays - 1))} style={stepperBtn}>
                    –
                  </button>
                  <span style={{ fontSize: 16, fontWeight: 700, minWidth: 24, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
                    {cadenceDays}
                  </span>
                  <button type="button" onClick={() => setCadenceDays(cadenceDays + 1)} style={stepperBtn}>
                    +
                  </button>
                  <span style={{ fontSize: 13, color: 'var(--text-muted, #8B929A)' }}>dias</span>
                </div>
              )}
            </div>
          </div>

          <label style={labelStyle}>Tempo por sessão (minutos)</label>
          <input
            type="number"
            value={sessionMinutes}
            onChange={e => setSessionMinutes(e.target.value)}
            placeholder="30"
            style={inputStyle}
          />

          <label style={labelStyle}>Horário do lembrete</label>
          <input
            type="time"
            value={reminderTime}
            onChange={e => setReminderTime(e.target.value)}
            style={inputStyle}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary, #EDEEEC)' }}>Notificações</span>
            <div
              onClick={() => setNotificationsOn(!notificationsOn)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 99,
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                background: notificationsOn ? 'var(--accent, #E8A33D)' : '#2D3339',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  left: notificationsOn ? 23 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#EDEEEC',
                  transition: 'left 0.2s',
                }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            background: 'var(--accent, #E8A33D)',
            color: '#14171A',
            border: 'none',
            borderRadius: 6,
            padding: '16px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%',
          }}
        >
          {initial ? 'Salvar alterações' : 'Criar item'}
        </button>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface-card, #1E2226)',
  border: '1px solid var(--border, #2D3339)',
  borderRadius: 8,
  padding: '18px',
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

const stepperBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: '1px solid var(--border, #2D3339)',
  background: '#14171A',
  color: 'var(--text-primary, #EDEEEC)',
  cursor: 'pointer',
  fontSize: 16,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
