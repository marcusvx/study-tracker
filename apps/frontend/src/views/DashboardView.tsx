import { useState } from 'react';
import { FilterTab, StudyItem } from '../types/study';
import { IconPlus, IconSettings } from '../components/icons/Index';
import { StudyCard } from '../components/study/StudyCard';

interface DashboardViewProps {
  items: StudyItem[];
  onRegister: (id: string) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onSettings: () => void;
}

export function DashboardView({
  items,
  onRegister,
  onSelect,
  onNew,
  onSettings,
}: DashboardViewProps) {
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered = items.filter((i) => {
    if (filter === 'all') return true;
    if (filter === 'active') return i.status === 'active';
    if (filter === 'paused') return i.status === 'paused';
    if (filter === 'done') return i.status === 'done';
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'active', label: 'Ativos' },
    { key: 'paused', label: 'Pausados' },
    { key: 'done', label: 'Concluídos' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base, #14171A)',
        paddingBottom: 100,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: 'var(--surface-card, #1E2226)',
          borderBottom: '1px solid var(--border, #2D3339)',
          padding: '20px 20px 0',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--text-primary, #EDEEEC)',
              }}
            >
              Compasso
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--text-muted, #8B929A)',
                marginTop: 2,
              }}
            >
              {items.filter((i) => i.status === 'active').length} frentes de
              estudo ativas
            </div>
          </div>
          <button
            onClick={onSettings}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary, #8B929A)',
              padding: 6,
              borderRadius: 6,
            }}
          >
            <IconSettings />
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: '8px 14px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom:
                  filter === t.key
                    ? '2px solid var(--accent, #E8A33D)'
                    : '2px solid transparent',
                color:
                  filter === t.key
                    ? 'var(--accent, #E8A33D)'
                    : 'var(--text-secondary, #8B929A)',
                borderRadius: '4px 4px 0 0',
                transition: 'color 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card list */}
      <div
        style={{
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-muted, #8B929A)',
              padding: '40px 0',
              fontSize: 14,
            }}
          >
            Nenhum item nesta lista.
          </div>
        )}
        {filtered.map((item) => (
          <StudyCard
            key={item.id}
            item={item}
            onRegister={() => onRegister(item.id)}
            onSelect={() => onSelect(item.id)}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={onNew}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 20,
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'var(--accent, #E8A33D)',
          border: 'none',
          color: '#14171A',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(232, 163, 61, 0.25)',
          transition: 'transform 0.15s',
          zIndex: 20,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <IconPlus size={24} />
      </button>
    </div>
  );
}
