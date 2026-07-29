import { cva } from 'class-variance-authority';
import { useTranslation } from 'react-i18next';
import { StudyItem } from '../../types/study';
import { UNIT_LABEL_KEYS } from '../../constants/unitLabels';
import { calcETA, pct } from '../../utils/eta';
import { categoryMeta } from '../icons/categoryMeta';
import { CircularProgressDial } from '../ui/CircularProgressDial';
import { ProgressBar } from '../ui/ProgressBar';

interface StudyCardProps {
  item: StudyItem;
  onRegister: () => void;
  onSelect: () => void;
}

const rhythmBadge = cva('rounded-full px-2.5 py-1 text-[11px] font-medium', {
  variants: {
    tone: {
      // On-pace mirrors the progress dial's on-track color (amber accent);
      // amber stays reserved for actions/progress, never for neutral states.
      onTrack: 'text-accent bg-accent-light',
      neutral: 'text-text-secondary bg-input',
      late: 'text-alert bg-alert-light',
    },
  },
});

const categoryTagClassName =
  'rounded-full bg-input px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-text-secondary';

export function StudyCard({
  item,
  onRegister,
  onSelect,
}: Readonly<StudyCardProps>) {
  const { t } = useTranslation();
  const meta = categoryMeta[item.category];
  const { daysLeft, onTrack } = calcETA(item);
  const p = pct(item);

  let tone: 'onTrack' | 'neutral' | 'late';
  if (item.status === 'done') tone = 'neutral';
  else if (item.status === 'paused') tone = 'neutral';
  else if (onTrack) tone = 'onTrack';
  else tone = 'late';

  let rhythmText: string;
  if (item.status === 'done') rhythmText = t('studyCard.done');
  else if (item.status === 'paused') rhythmText = t('studyCard.paused');
  else if (daysLeft === Infinity) rhythmText = t('studyCard.noData');
  else if (onTrack) rhythmText = t('studyCard.onTrack', { days: daysLeft });
  else rhythmText = t('studyCard.late', { days: daysLeft });

  return (
    <div className="relative rounded-lg border border-border bg-surface p-[18px] transition-[border-color,transform] duration-150 hover:border-accent">
      <button
        type="button"
        onClick={onSelect}
        aria-label={item.title}
        className="absolute inset-0 z-0 cursor-pointer rounded-lg"
      />

      <div className="pointer-events-none relative z-[1]">
        {/* Header row */}
        <div className="mb-3.5 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Category badge */}
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="flex text-text-secondary">
                <meta.Icon size={14} />
              </span>
              <span className={categoryTagClassName}>{t(meta.labelKey)}</span>
            </div>

            <div className="text-[15px] font-semibold leading-tight text-text-primary">
              {item.title}
            </div>
            <div className="mt-1 font-mono text-xs text-text-secondary">
              {item.totalScope != null
                ? `${item.currentProgress} / ${item.totalScope} ${t(UNIT_LABEL_KEYS[item.unit])}`
                : `${item.currentProgress} ${t(UNIT_LABEL_KEYS[item.unit])}`}
            </div>
          </div>

          {/* Circular progress dial */}
          <div className="shrink-0">
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
          max={item.totalScope ?? 0}
          color={onTrack ? 'var(--accent)' : 'var(--alert)'}
        />

        {/* Footer row */}
        <div className="mt-3.5 flex items-center justify-between gap-2">
          <span className={rhythmBadge({ tone })}>{rhythmText}</span>
          {item.status !== 'done' && (
            <button
              onClick={onRegister}
              className="pointer-events-auto relative z-[1] cursor-pointer whitespace-nowrap rounded-md border-[1.5px] border-accent bg-transparent px-3 py-[5px] text-xs font-semibold text-accent transition-colors duration-150 hover:bg-accent hover:text-ink"
            >
              {t('studyCard.register')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
