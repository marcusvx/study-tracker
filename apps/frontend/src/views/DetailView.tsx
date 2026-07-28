import React from 'react';
import { useTranslation } from 'react-i18next';
import { StudyItem } from '../types/study';
import { calcETA, formatDate, pct } from '../utils/eta';
import { categoryMeta, IconArrowLeft } from '../components/icons/Index';
import { CircularProgressDial } from '../components/ui/CircularProgressDial';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SvgBarChart } from '../components/ui/SvgBarChart';

interface DetailViewProps {
  item: StudyItem;
  onBack: () => void;
  onRegister: () => void;
  onEdit: () => void;
  onPause: () => void;
  onArchive: () => void;
}

export function DetailView({
  item,
  onBack,
  onRegister,
  onEdit,
  onPause,
  onArchive,
}: DetailViewProps) {
  const { t } = useTranslation();
  const meta = categoryMeta[item.category];
  const { daysLeft, onTrack, etaDate } = calcETA(item);
  const p = pct(item);

  const chartData = item.log.slice(-7).map((l) => ({
    date: l.date.slice(5),
    progresso: l.amount,
  }));

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base, #14171A)',
        paddingBottom: 32,
      }}
    >
      {/* Header */}
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
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span style={{ color: meta.color }}>
            <meta.Icon size={16} />
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: meta.color,
              background: meta.bg,
              padding: '2px 8px',
              borderRadius: 99,
              textTransform: 'uppercase',
            }}
          >
            {t(meta.labelKey)}
          </span>
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 6,
            color: 'var(--text-primary, #EDEEEC)',
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'var(--text-muted, #8B929A)',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {item.currentProgress} / {item.totalScope} {item.unit}
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
        {/* Signature Circular Dial Progress Card */}
        <div style={cardStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted, #8B929A)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                {t('detail.progressPanel')}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary, #8B929A)',
                  marginTop: 4,
                }}
              >
                {t('detail.progressPanelSub', {
                  current: item.currentProgress,
                  total: item.totalScope,
                  unit: item.unit,
                })}
              </div>
            </div>

            <CircularProgressDial
              percentage={p}
              onTrack={onTrack}
              size={90}
              strokeWidth={8}
              showLabel
              label={t('detail.dialLabel')}
            />
          </div>

          <ProgressBar
            value={item.currentProgress}
            max={item.totalScope}
            color={onTrack ? 'var(--accent)' : 'var(--alert)'}
          />

          {item.status === 'active' && (
            <button
              onClick={onRegister}
              style={{
                width: '100%',
                background: 'var(--accent, #E8A33D)',
                color: '#14171A',
                border: 'none',
                borderRadius: 6,
                padding: '12px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 16,
              }}
            >
              {t('detail.registerProgress')}
            </button>
          )}
        </div>

        {/* ETA card */}
        {item.status !== 'done' && (
          <div
            style={{
              ...cardStyle,
              borderLeft: `4px solid ${onTrack ? '#34D399' : 'var(--alert, #C9694F)'}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted, #8B929A)',
                fontWeight: 600,
                marginBottom: 8,
                letterSpacing: '0.05em',
              }}
            >
              {t('detail.etaTitle')}
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <div
                  style={{ fontSize: 11, color: 'var(--text-muted, #8B929A)' }}
                >
                  {t('detail.etaCurrent')}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: onTrack ? '#34D399' : 'var(--alert, #C9694F)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {daysLeft === Infinity ? '–' : formatDate(etaDate)}
                </div>
              </div>
              {item.deadline && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text-muted, #8B929A)',
                    }}
                  >
                    {t('detail.etaOriginalGoal')}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--text-primary, #EDEEEC)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {formatDate(new Date(item.deadline))}
                  </div>
                </div>
              )}
              <div>
                <div
                  style={{ fontSize: 11, color: 'var(--text-muted, #8B929A)' }}
                >
                  {t('detail.etaDaysLeft')}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--text-primary, #EDEEEC)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {daysLeft === Infinity ? '–' : daysLeft}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted, #8B929A)',
                fontWeight: 600,
                marginBottom: 16,
                letterSpacing: '0.05em',
              }}
            >
              {t('detail.chartHistoryTitle')}
            </div>
            <SvgBarChart data={chartData} />
          </div>
        )}

        {/* Config */}
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
            {t('detail.paramsTitle')}
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            {[
              {
                label: t('detail.cadence'),
                value:
                  item.cadenceDays === 1
                    ? t('detail.cadenceDaily')
                    : t('detail.cadenceEvery', { days: item.cadenceDays }),
              },
              {
                label: t('detail.sessionTime'),
                value: t('detail.sessionTimeValue', {
                  minutes: item.sessionMinutes,
                }),
              },
              { label: t('detail.reminder'), value: item.reminderTime || '–' },
              {
                label: t('detail.notifications'),
                value: item.notificationsOn
                  ? t('detail.notificationsOn')
                  : t('detail.notificationsOff'),
              },
            ].map((r) => (
              <div key={r.label}>
                <div
                  style={{ fontSize: 11, color: 'var(--text-muted, #8B929A)' }}
                >
                  {r.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                    marginTop: 2,
                    color: 'var(--text-primary)',
                  }}
                >
                  {r.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Log History */}
        {item.log.length > 0 && (
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
              {t('detail.logHistoryTitle')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[...item.log].reverse().map((l, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom:
                      i < item.log.length - 1
                        ? '1px solid var(--border, #2D3339)'
                        : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {l.date.slice(5).replace('-', '/')}
                    </div>
                    {l.note && (
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--text-muted, #8B929A)',
                          marginTop: 2,
                        }}
                      >
                        {l.note}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--accent, #E8A33D)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      +{l.amount} {item.unit}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-muted, #8B929A)',
                      }}
                    >
                      {l.minutes} min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onEdit}
            style={{
              ...actionBtn,
              flex: 1,
              background: 'var(--accent, #E8A33D)',
              color: '#14171A',
              border: 'none',
            }}
          >
            {t('detail.edit')}
          </button>
          <button
            onClick={onPause}
            style={{
              ...actionBtn,
              flex: 1,
              background: 'transparent',
              color: 'var(--text-secondary, #8B929A)',
              border: '1px solid var(--border, #2D3339)',
            }}
          >
            {item.status === 'paused' ? t('detail.resume') : t('detail.pause')}
          </button>
          <button
            onClick={onArchive}
            style={{
              ...actionBtn,
              background: 'transparent',
              color: 'var(--alert, #C9694F)',
              border: '1px solid rgba(201, 105, 79, 0.4)',
            }}
          >
            {t('detail.archive')}
          </button>
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

const actionBtn: React.CSSProperties = {
  padding: '13px 16px',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
};
