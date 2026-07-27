import React from 'react';
import { StudyItem } from '../types/study';
import { IconArrowLeft } from '../components/icons/Index';
import { supabase } from '../lib/supabaseClient';

interface SettingsViewProps {
  items: StudyItem[];
  onBack: () => void;
}

export function SettingsView({ items, onBack }: SettingsViewProps) {
  const withReminders = items.filter(
    (i) => i.notificationsOn && i.reminderTime,
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base, #14171A)',
        paddingBottom: 32,
      }}
    >
      <div
        style={{
          background: 'var(--surface-card, #1E2226)',
          borderBottom: '1px solid var(--border, #2D3339)',
          padding: '20px',
        }}
      >
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
          <IconArrowLeft size={18} /> Voltar
        </button>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary, #EDEEEC)',
          }}
        >
          Configurações
        </div>
      </div>

      <div
        style={{
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Notifications */}
        <div style={cardStyle}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-muted, #8B929A)',
              fontWeight: 600,
              marginBottom: 12,
              letterSpacing: '0.05em',
            }}
          >
            LEMBRETES ATIVOS
          </div>
          {withReminders.length === 0 && (
            <div style={{ fontSize: 14, color: 'var(--text-muted, #8B929A)' }}>
              Nenhum lembrete configurado.
            </div>
          )}
          {withReminders.map((i) => (
            <div
              key={i.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid var(--border, #2D3339)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500 }}>{i.title}</div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--accent, #E8A33D)',
                }}
              >
                {i.reminderTime}
              </div>
            </div>
          ))}
        </div>

        {/* Account / Supabase Auth */}
        <div style={cardStyle}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-muted, #8B929A)',
              fontWeight: 600,
              marginBottom: 12,
              letterSpacing: '0.05em',
            }}
          >
            CONTA
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'var(--text-secondary, #8B929A)',
              marginBottom: 14,
            }}
          >
            Seus hábitos de estudo estão sincronizados na nuvem.
          </div>
          <button
            onClick={() => void supabase.auth.signOut()}
            style={{
              width: '100%',
              background: 'var(--accent, #E8A33D)',
              color: '#14171A',
              border: 'none',
              borderRadius: 6,
              padding: '13px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Sair
          </button>
        </div>

        {/* About */}
        <div style={cardStyle}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-muted, #8B929A)',
              fontWeight: 600,
              marginBottom: 8,
              letterSpacing: '0.05em',
            }}
          >
            SOBRE O COMPASSO
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-primary, #EDEEEC)' }}>
            Compasso — v1.0.0
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-muted, #8B929A)',
              marginTop: 4,
            }}
          >
            Um instrumento de precisão para frentes de estudo paralelas.
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'var(--surface-card, #1E2226)',
  border: '1px solid var(--border, #2D3339)',
  borderRadius: 8,
  padding: '18px',
};
