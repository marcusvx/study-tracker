import { useState } from 'react'
import { StudyItem, View } from './types/study'
import { DashboardView } from './views/DashboardView'
import { DetailView } from './views/DetailView'
import { CreateEditView } from './views/CreateEditView'
import { SettingsView } from './views/SettingsView'
import { ProgressSheet } from './components/study/ProgressSheet'

const seedItems: StudyItem[] = [
  {
    id: '1',
    title: 'Designing Data-Intensive Applications',
    category: 'book',
    unit: 'pages',
    totalScope: 562,
    currentProgress: 210,
    deadline: '2026-08-30',
    cadenceDays: 1,
    sessionMinutes: 30,
    reminderTime: '21:00',
    notificationsOn: true,
    status: 'active',
    log: [
      { date: '2026-07-20', amount: 22, minutes: 35, note: 'Cap. 4 completo' },
      { date: '2026-07-21', amount: 18, minutes: 30 },
      { date: '2026-07-22', amount: 25, minutes: 40 },
      { date: '2026-07-23', amount: 20, minutes: 30 },
      { date: '2026-07-24', amount: 28, minutes: 45 },
      { date: '2026-07-25', amount: 15, minutes: 25 },
      { date: '2026-07-26', amount: 22, minutes: 35 },
    ],
  },
  {
    id: '2',
    title: 'AWS Solutions Architect Associate',
    category: 'cert',
    unit: '%',
    totalScope: 100,
    currentProgress: 42,
    deadline: '2026-09-15',
    cadenceDays: 1,
    sessionMinutes: 60,
    reminderTime: '07:00',
    notificationsOn: true,
    status: 'active',
    log: [
      { date: '2026-07-22', amount: 8, minutes: 60 },
      { date: '2026-07-23', amount: 6, minutes: 50 },
      { date: '2026-07-24', amount: 10, minutes: 70 },
      { date: '2026-07-25', amount: 9, minutes: 65 },
      { date: '2026-07-26', amount: 9, minutes: 60 },
    ],
  },
  {
    id: '3',
    title: 'React 19 Deep Dive — Udemy',
    category: 'course',
    unit: 'modules',
    totalScope: 24,
    currentProgress: 11,
    deadline: '2026-08-10',
    cadenceDays: 2,
    sessionMinutes: 45,
    reminderTime: '19:30',
    notificationsOn: false,
    status: 'active',
    log: [
      { date: '2026-07-18', amount: 2, minutes: 50 },
      { date: '2026-07-20', amount: 2, minutes: 45 },
      { date: '2026-07-22', amount: 3, minutes: 60 },
      { date: '2026-07-24', amount: 2, minutes: 40 },
      { date: '2026-07-26', amount: 2, minutes: 45 },
    ],
  },
  {
    id: '4',
    title: 'RFC 9110 — HTTP Semantics',
    category: 'work',
    unit: 'pages',
    totalScope: 194,
    currentProgress: 194,
    cadenceDays: 1,
    sessionMinutes: 20,
    notificationsOn: false,
    status: 'done',
    log: [
      { date: '2026-07-10', amount: 40, minutes: 30 },
      { date: '2026-07-12', amount: 50, minutes: 35 },
      { date: '2026-07-14', amount: 54, minutes: 40 },
      { date: '2026-07-16', amount: 50, minutes: 30 },
    ],
  },
]

export function App() {
  const [items, setItems] = useState<StudyItem[]>(seedItems)
  const [view, setView] = useState<View>('dashboard')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sheetItemId, setSheetItemId] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<StudyItem | undefined>(undefined)

  const activeItem = activeId ? items.find(i => i.id === activeId) : undefined
  const sheetItem = sheetItemId ? items.find(i => i.id === sheetItemId) : undefined

  const handleRegister = (id: string, amount: number, minutes: number, note: string) => {
    const today = new Date().toISOString().slice(0, 10)
    setItems(prev =>
      prev.map(i => {
        if (i.id !== id) return i
        const newProgress = Math.min(i.totalScope, i.currentProgress + amount)
        const newStatus = newProgress >= i.totalScope ? 'done' : i.status
        return {
          ...i,
          currentProgress: newProgress,
          status: newStatus,
          log: [...i.log, { date: today, amount, minutes, note: note || undefined }],
        }
      })
    )
    setSheetItemId(null)
  }

  const handleSaveItem = (data: Omit<StudyItem, 'id' | 'log'> & { id?: string }) => {
    if (data.id) {
      setItems(prev => prev.map(i => (i.id === data.id ? { ...i, ...data, log: i.log } : i)))
    } else {
      const newItem: StudyItem = { ...data, id: String(Date.now()), log: [] }
      setItems(prev => [...prev, newItem])
    }
    setView('dashboard')
    setEditItem(undefined)
  }

  const handlePause = (id: string) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status: i.status === 'paused' ? 'active' : 'paused' } : i)))
  }

  const handleArchive = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    setView('dashboard')
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', minHeight: '100vh', background: 'var(--bg-base, #14171A)' }}>
      {view === 'dashboard' && (
        <DashboardView
          items={items}
          onRegister={id => setSheetItemId(id)}
          onSelect={id => {
            setActiveId(id)
            setView('detail')
          }}
          onNew={() => {
            setEditItem(undefined)
            setView('create')
          }}
          onSettings={() => setView('settings')}
        />
      )}

      {view === 'detail' && activeItem && (
        <DetailView
          item={activeItem}
          onBack={() => setView('dashboard')}
          onRegister={() => setSheetItemId(activeItem.id)}
          onEdit={() => {
            setEditItem(activeItem)
            setView('create')
          }}
          onPause={() => handlePause(activeItem.id)}
          onArchive={() => handleArchive(activeItem.id)}
        />
      )}

      {view === 'create' && (
        <CreateEditView
          initial={editItem}
          onSave={handleSaveItem}
          onBack={() => setView(editItem ? 'detail' : 'dashboard')}
        />
      )}

      {view === 'settings' && (
        <SettingsView items={items} onBack={() => setView('dashboard')} />
      )}

      {sheetItem && (
        <ProgressSheet
          item={sheetItem}
          onSave={(amount, minutes, note) => handleRegister(sheetItem.id, amount, minutes, note)}
          onClose={() => setSheetItemId(null)}
        />
      )}
    </div>
  )
}

export default App

