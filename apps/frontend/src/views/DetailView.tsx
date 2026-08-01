import { useTranslation } from 'react-i18next';
import { cva } from 'class-variance-authority';
import { StudyItem } from '../types/study';
import { UNIT_LABEL_KEYS } from '../constants/unitLabels';
import { calcETA, formatDate, pct } from '../utils/eta';
import { categoryMeta } from '../components/icons/categoryMeta';
import { BackButton } from '../components/ui/BackButton';
import { Card } from '../components/ui/Card';
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

const sectionLabelClassName =
  'text-[11px] font-semibold tracking-wider text-text-secondary';

const actionButton = cva(
  'cursor-pointer rounded-md px-4 py-[13px] text-sm font-semibold transition-opacity duration-150',
  {
    variants: {
      intent: {
        primary: 'flex-1 border-none bg-accent text-ink',
        // Real --text-secondary var (not --text-muted); left unmapped to a
        // named token per design decision, referenced directly instead.
        secondary:
          'flex-1 border border-border bg-transparent text-[var(--text-secondary)]',
        // Border color is a literal (non-var) rgba in the original inline
        // style, so it's theme-independent — kept as an arbitrary value
        // rather than the theme-tracking `border-alert` token.
        danger:
          'border border-[rgba(201,105,79,0.4)] bg-transparent text-alert',
      },
    },
  },
);

export function DetailView({
  item,
  onBack,
  onRegister,
  onEdit,
  onPause,
  onArchive,
}: Readonly<DetailViewProps>) {
  const { t } = useTranslation();
  const meta = categoryMeta[item.category];
  const { daysLeft, onTrack, etaDate } = calcETA(item);
  const p = pct(item);

  const chartData = item.log.slice(-7).map((l) => ({
    date: l.date.slice(5),
    progresso: l.amount,
  }));

  const unitLabel = t(UNIT_LABEL_KEYS[item.unit]);

  return (
    <div className="min-h-screen bg-base pb-8">
      {/* Header */}
      <div className="pt-safe border-b border-border bg-surface p-5">
        <BackButton onClick={onBack} label={t('common.back')} />
        <div className="mb-2 flex items-center gap-2">
          <span className="text-text-secondary">
            <meta.Icon size={16} />
          </span>
          <span className="rounded-full bg-input px-2 py-0.5 text-[11px] font-semibold uppercase text-text-secondary">
            {t(meta.labelKey)}
          </span>
        </div>
        <div className="mb-1.5 text-xl font-bold leading-[1.2] text-text-primary">
          {item.title}
        </div>
        <div className="font-mono text-[13px] text-text-secondary">
          {item.totalScope != null
            ? `${item.currentProgress} / ${item.totalScope} ${unitLabel}`
            : `${item.currentProgress} ${unitLabel}`}
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-5">
        {/* Signature Circular Dial Progress Card */}
        <Card>
          <div className="mb-3.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-text-secondary">
                {t('detail.progressPanel')}
              </div>
              <div className="mt-1 text-[13px] text-[var(--text-secondary)]">
                {item.totalScope != null
                  ? t('detail.progressPanelSub', {
                      current: item.currentProgress,
                      total: item.totalScope,
                      unit: unitLabel,
                    })
                  : t('detail.progressPanelSubNoScope', {
                      current: item.currentProgress,
                      unit: unitLabel,
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
            max={item.totalScope ?? 0}
            color={onTrack ? 'var(--accent)' : 'var(--alert)'}
          />

          {item.status === 'active' && (
            <button
              onClick={onRegister}
              className="mt-4 w-full cursor-pointer rounded-md border-none bg-accent p-3 text-sm font-bold text-ink"
            >
              {t('detail.registerProgress')}
            </button>
          )}
        </Card>

        {/* ETA card */}
        {item.status !== 'done' && (
          <Card
            className={`border-l-4 ${onTrack ? 'border-l-accent' : 'border-l-alert'}`}
          >
            <div className={`${sectionLabelClassName} mb-2`}>
              {t('detail.etaTitle')}
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-[11px] text-text-secondary">
                  {t('detail.etaCurrent')}
                </div>
                <div
                  className={`font-mono text-lg font-bold ${onTrack ? 'text-accent' : 'text-alert'}`}
                >
                  {daysLeft === Infinity ? '–' : formatDate(etaDate)}
                </div>
              </div>
              {item.deadline && (
                <div>
                  <div className="text-[11px] text-text-secondary">
                    {t('detail.etaOriginalGoal')}
                  </div>
                  <div className="font-mono text-lg font-bold text-text-primary">
                    {formatDate(new Date(item.deadline))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-[11px] text-text-secondary">
                  {t('detail.etaDaysLeft')}
                </div>
                <div className="font-mono text-lg font-bold text-text-primary">
                  {daysLeft === Infinity ? '–' : daysLeft}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <Card>
            <div className={`${sectionLabelClassName} mb-4`}>
              {t('detail.chartHistoryTitle')}
            </div>
            <SvgBarChart data={chartData} />
          </Card>
        )}

        {/* Config */}
        <Card>
          <div className={`${sectionLabelClassName} mb-3`}>
            {t('detail.paramsTitle')}
          </div>
          <div className="grid grid-cols-2 gap-3">
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
              {
                label: t('detail.notifications'),
                value: item.notificationsOn
                  ? t('detail.notificationsOn')
                  : t('detail.notificationsOff'),
              },
            ].map((r) => (
              <div key={r.label}>
                <div className="text-[11px] text-text-secondary">{r.label}</div>
                <div className="mt-0.5 font-mono text-sm font-semibold text-text-primary">
                  {r.value}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Log History */}
        {item.log.length > 0 && (
          <Card>
            <div className={`${sectionLabelClassName} mb-3`}>
              {t('detail.logHistoryTitle')}
            </div>
            <div className="flex flex-col gap-px">
              {[...item.log].reverse().map((l, i) => (
                <div
                  key={i}
                  className={`flex justify-between py-2.5 ${
                    i < item.log.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div>
                    <div className="text-[13px] font-medium">
                      {l.date.slice(5).replace('-', '/')}
                    </div>
                    {l.note && (
                      <div className="mt-0.5 text-[11px] text-text-secondary">
                        {l.note}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[13px] font-semibold text-accent">
                      +{l.amount} {unitLabel}
                    </div>
                    <div className="text-[11px] text-text-secondary">
                      {l.minutes} min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className={actionButton({ intent: 'primary' })}
          >
            {t('detail.edit')}
          </button>
          <button
            onClick={onPause}
            className={actionButton({ intent: 'secondary' })}
          >
            {item.status === 'paused' ? t('detail.resume') : t('detail.pause')}
          </button>
          <button
            onClick={onArchive}
            className={actionButton({ intent: 'danger' })}
          >
            {t('detail.archive')}
          </button>
        </div>
      </div>
    </div>
  );
}
