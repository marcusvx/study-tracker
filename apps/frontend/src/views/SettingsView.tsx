import React from 'react';
import { useTranslation } from 'react-i18next';
import { StudyItem } from '../types/study';
import { IconArrowLeft, IconMoon, IconSun } from '../components/icons/Index';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsViewProps {
  items: StudyItem[];
  onBack: () => void;
}

export function SettingsView({ items, onBack }: SettingsViewProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
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
          <IconArrowLeft size={18} /> {t('common.back')}
        </button>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary, #EDEEEC)',
          }}
        >
          {t('settings.title')}
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
        {/* Appearance */}
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
            {t('settings.appearance')}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-primary, #EDEEEC)',
              }}
            >
              {theme === 'dark' ? (
                <IconMoon size={16} />
              ) : (
                <IconSun size={16} />
              )}
              {t('settings.darkTheme')}
            </div>
            <div
              onClick={toggleTheme}
              style={{
                width: 44,
                height: 24,
                borderRadius: 99,
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                background:
                  theme === 'dark' ? 'var(--accent, #E8A33D)' : '#2D3339',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  left: theme === 'dark' ? 23 : 3,
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
            {t('settings.activeReminders')}
          </div>
          {withReminders.length === 0 && (
            <div style={{ fontSize: 14, color: 'var(--text-muted, #8B929A)' }}>
              {t('settings.noReminders')}
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
            {t('settings.account')}
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'var(--text-secondary, #8B929A)',
              marginBottom: 14,
            }}
          >
            {t('settings.accountDesc')}
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
            {t('settings.signOut')}
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
            {t('settings.about')}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-primary, #EDEEEC)' }}>
            {t('settings.aboutVersion')}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-muted, #8B929A)',
              marginTop: 4,
            }}
          >
            {t('settings.aboutDesc')}
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
