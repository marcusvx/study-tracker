import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { StudyItem } from '../../../types/study';
import { UNIT_LABEL_KEYS } from '../../../constants/unitLabels';
import { BottomSheet } from '../../ui/BottomSheet';

interface ProgressSheetProps {
  item: StudyItem;
  onSave: (amount: number, minutes: number, note: string) => void;
  onClose: () => void;
}

const labelClassName =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-secondary';

const inputClassName =
  'mb-4 w-full rounded-md border border-border bg-input px-3.5 py-3 text-[15px] text-text-primary outline-none';

export function ProgressSheet({
  item,
  onSave,
  onClose,
}: Readonly<ProgressSheetProps>) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [minutes, setMinutes] = useState('');
  const [note, setNote] = useState('');
  const [minutesError, setMinutesError] = useState<string | undefined>();

  const remaining =
    item.totalScope != null ? item.totalScope - item.currentProgress : Infinity;
  const unitLabel = t(UNIT_LABEL_KEYS[item.unit]);

  const handleAmountChange = (raw: string) => {
    const parsed = Number.parseFloat(raw);
    if (Number.isFinite(parsed) && parsed > remaining) {
      setAmount(String(remaining));
      toast.error(
        t('progressSheet.amountClamped', { max: remaining, unit: unitLabel }),
      );
      return;
    }
    setAmount(raw);
  };

  const handleSave = () => {
    const m = Number.parseInt(minutes, 10);
    if (!m || m <= 0) {
      setMinutesError(t('progressSheet.errorMinutesRequired'));
      return;
    }
    setMinutesError(undefined);
    // Advancement is optional: logging time spent must stand on its own
    // (e.g. "studied a module but didn't finish it").
    const a = Number.parseFloat(amount) || 0;
    onSave(a, m, note);
  };

  return (
    <BottomSheet onClose={onClose}>
      <div className="px-6 pt-3">
        <div className="mb-1 text-lg font-bold text-text-primary">
          {t('progressSheet.title')}
        </div>
        <div className="mb-5 text-[13px] text-text-secondary">{item.title}</div>

        <label className={labelClassName}>
          {t('progressSheet.amountLabel')}{' '}
          <span className="text-text-secondary">
            ({unitLabel}) {t('common.optional')}
          </span>
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder={t('progressSheet.amountPlaceholder', {
            unit: unitLabel,
          })}
          className={inputClassName}
          autoFocus
        />

        <label className={labelClassName}>
          {t('progressSheet.minutesLabel')}
        </label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => {
            setMinutes(e.target.value);
            if (minutesError) setMinutesError(undefined);
          }}
          placeholder={t('progressSheet.minutesPlaceholder')}
          className={inputClassName}
        />
        {minutesError && (
          <div
            className="-mt-3 mb-3 text-xs leading-snug text-alert"
            role="alert"
          >
            {minutesError}
          </div>
        )}

        <label className={labelClassName}>
          {t('progressSheet.noteLabel')}{' '}
          <span className="text-text-secondary">{t('common.optional')}</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('progressSheet.notePlaceholder')}
          rows={2}
          className={`${inputClassName} resize-none`}
        />

        <button
          onClick={handleSave}
          className="mt-2 w-full cursor-pointer rounded-md bg-accent p-3.5 text-[15px] font-bold text-ink transition-opacity duration-150 hover:opacity-90"
        >
          {t('progressSheet.save')}
        </button>
      </div>
    </BottomSheet>
  );
}
