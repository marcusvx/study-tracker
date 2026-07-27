import { StudyItem } from '../../types/study';
import { calcETA, pct } from '../../utils/eta';
import { categoryMeta } from '../icons/Index';
import { CircularProgressDial } from '../ui/CircularProgressDial';
import { ProgressBar } from '../ui/ProgressBar';

interface StudyCardProps {
  item: StudyItem;
  onRegister: () => void;
  onSelect: () => void;
}

export function StudyCard({ item, onRegister, onSelect }: StudyCardProps) {
  const meta = categoryMeta[item.category];
  const { daysLeft, onTrack } = calcETA(item);
  const p = pct(item);

  const rhythmColor =
    item.status === 'done'
      ? '#34D399'
      : item.status === 'paused'
        ? '#FBBF24'
        : onTrack
          ? '#34D399'
          : '#C9694F';

  const rhythmBg =
    item.status === 'done'
      ? 'rgba(52,211,153,0.12)'
      : item.status === 'paused'
        ? 'rgba(251,191,36,0.12)'
        : onTrack
          ? 'rgba(52,211,153,0.12)'
          : 'rgba(201,105,79,0.12)';

  let rhythmText: string;
  if (item.status === 'done') rhythmText = 'Concluído';
  else if (item.status === 'paused') rhythmText = 'Pausado';
  else if (daysLeft === Infinity) rhythmText = 'Sem dados suficientes';
  else if (onTrack) rhythmText = `No ritmo · conclui em ${daysLeft}d`;
  else rhythmText = `Atrasado · mais ${daysLeft}d que o planejado`;

  return (
    <div
      onClick={onSelect}
      style={{
        background: 'var(--surface-card, #1E2226)',
        border: '1px solid var(--border, #2D3339)',
        borderRadius: 8,
        padding: '18px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent, #E8A33D)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border, #2D3339)';
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Category badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 6,
            }}
          >
            <span style={{ color: meta.color, display: 'flex' }}>
              <meta.Icon size={14} />
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: meta.color,
                background: meta.bg,
                padding: '2px 8px',
                borderRadius: 99,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              {meta.label}
            </span>
          </div>

          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-primary, #EDEEEC)',
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-muted, #8B929A)',
              marginTop: 4,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {item.currentProgress} / {item.totalScope} {item.unit}
          </div>
        </div>

        {/* Circular progress dial */}
        <div style={{ flexShrink: 0 }}>
          <CircularProgressDial
            percentage={p}
            onTrack={onTrack}
            size={56}
            strokeWidth={5}
          />
        </div>
      </div>

      {/* Progress Bar fallback / secondary visual */}
      <ProgressBar
        value={item.currentProgress}
        max={item.totalScope}
        color={onTrack ? 'var(--accent)' : 'var(--alert)'}
      />

      {/* Footer row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 14,
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: rhythmColor,
            background: rhythmBg,
            padding: '4px 10px',
            borderRadius: 99,
          }}
        >
          {rhythmText}
        </span>
        {item.status !== 'done' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegister();
            }}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--accent, #E8A33D)',
              border: '1.5px solid var(--accent, #E8A33D)',
              background: 'transparent',
              borderRadius: 6,
              padding: '5px 12px',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent, #E8A33D)';
              e.currentTarget.style.color = '#14171A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--accent, #E8A33D)';
            }}
          >
            + Registrar
          </button>
        )}
      </div>
    </div>
  );
}
