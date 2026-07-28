import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cva } from 'class-variance-authority';
import toast from 'react-hot-toast';
import { Category, StudyItem, Unit } from '../types/study';
import { categoryMeta } from '../components/icons/categoryMeta';
import { BackButton } from '../components/ui/BackButton';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Switch } from '../components/ui/Switch';

interface CreateEditViewProps {
  initial?: StudyItem;
  onSave: (
    item: Omit<StudyItem, 'id' | 'log'> & { id?: string },
  ) => Promise<void>;
  onBack: () => void;
}

type FieldErrors = {
  title?: string;
  totalScope?: string;
  currentProgress?: string;
  sessionMinutes?: string;
};

const labelClassName =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-secondary';

const inputClassName =
  'mb-4 w-full rounded-md border border-border bg-ink px-3.5 py-3 text-[15px] text-text-primary outline-none';

const inputErrorClassName =
  'mb-1.5 w-full rounded-md border border-alert bg-ink px-3.5 py-3 text-[15px] text-text-primary outline-none';

const errorTextClassName = 'mb-4 -mt-2.5 text-xs text-alert';

// Shared active/inactive look for unit and cadence selector chips.
// (The category chips have their own per-category runtime colors, so
// they aren't expressed with this variant.)
const chipToggle = cva('cursor-pointer border transition-[all] duration-150', {
  variants: {
    selected: {
      true: 'border-[1.5px] border-accent bg-accent-light text-accent',
      false: 'border-border bg-ink text-[var(--text-secondary)]',
    },
  },
});

const stepperButtonClassName =
  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border bg-ink text-[16px] font-bold text-text-primary';

export function CreateEditView({
  initial,
  onSave,
  onBack,
}: Readonly<CreateEditViewProps>) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState<Category>(
    initial?.category ?? 'book',
  );
  const [unit, setUnit] = useState<Unit>(initial?.unit ?? 'pages');
  const [totalScope, setTotalScope] = useState(
    String(initial?.totalScope ?? ''),
  );
  const [currentProgress, setCurrentProgress] = useState(
    String(initial?.currentProgress ?? '0'),
  );
  const [deadline, setDeadline] = useState(initial?.deadline ?? '');
  const [cadenceDays, setCadenceDays] = useState(initial?.cadenceDays ?? 1);
  const [sessionMinutes, setSessionMinutes] = useState(
    String(initial?.sessionMinutes ?? '30'),
  );
  const [reminderTime, setReminderTime] = useState(initial?.reminderTime ?? '');
  const [notificationsOn, setNotificationsOn] = useState(
    initial?.notificationsOn ?? true,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!title.trim()) next.title = t('createEdit.errorTitleRequired');
    if (!totalScope || Number.parseFloat(totalScope) <= 0)
      next.totalScope = t('createEdit.errorTotalScopeRequired');
    if (currentProgress && Number.parseFloat(currentProgress) < 0)
      next.currentProgress = t('createEdit.errorCurrentProgressInvalid');
    if (sessionMinutes && Number.parseInt(sessionMinutes) <= 0)
      next.sessionMinutes = t('createEdit.errorSessionMinutesInvalid');
    return next;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error(t('createEdit.errorFormInvalid'));
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        id: initial?.id,
        title: title.trim(),
        category,
        unit,
        totalScope: Number.parseFloat(totalScope),
        currentProgress: Number.parseFloat(currentProgress) || 0,
        deadline: deadline || undefined,
        cadenceDays,
        sessionMinutes: Number.parseInt(sessionMinutes) || 30,
        reminderTime: reminderTime || undefined,
        notificationsOn,
        status: initial?.status ?? 'active',
      });
    } finally {
      setIsSaving(false);
    }
  };

  let submitLabel: string;
  if (isSaving) {
    submitLabel = initial
      ? t('createEdit.submitSaving')
      : t('createEdit.submitCreating');
  } else {
    submitLabel = initial
      ? t('createEdit.submitSave')
      : t('createEdit.submitCreate');
  }

  const units: Unit[] = ['pages', '%', 'hours', 'modules'];
  const unitLabels: Record<Unit, string> = {
    pages: t('createEdit.unitPages'),
    '%': t('createEdit.unitPercent'),
    hours: t('createEdit.unitHours'),
    modules: t('createEdit.unitModules'),
  };

  return (
    <div className="min-h-screen bg-base pb-12">
      <div className="border-b border-border bg-surface p-5">
        <BackButton onClick={onBack} label={t('common.cancel')} />
        <div className="text-xl font-bold text-text-primary">
          {initial ? t('createEdit.titleEdit') : t('createEdit.titleNew')}
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 py-5">
        {/* Title */}
        <Card>
          <label className={labelClassName}>{t('createEdit.fieldTitle')}</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title)
                setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder={t('createEdit.titlePlaceholder')}
            className={errors.title ? inputErrorClassName : inputClassName}
          />
          {errors.title && (
            <div className={errorTextClassName}>{errors.title}</div>
          )}

          {/* Category */}
          <label className={labelClassName}>
            {t('createEdit.fieldCategory')}
          </label>
          <div className="mb-4 grid grid-cols-4 gap-2">
            {(Object.keys(categoryMeta) as Category[]).map((c) => {
              const m = categoryMeta[c];
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-border bg-ink px-2 py-3 text-text-secondary transition-[all] duration-150"
                  style={
                    active
                      ? {
                          border: `2px solid ${m.color}`,
                          background: m.bg,
                          color: m.color,
                        } // per-category runtime color from categoryMeta
                      : undefined
                  }
                >
                  <m.Icon size={20} />
                  <span className="text-[10px] font-semibold">
                    {t(m.labelKey)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Unit */}
          <label className={labelClassName}>{t('createEdit.fieldUnit')}</label>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {units.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`rounded-md px-3.5 py-[7px] text-xs font-semibold ${chipToggle({ selected: unit === u })}`}
              >
                {unitLabels[u]}
              </button>
            ))}
          </div>
        </Card>

        {/* Scope */}
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClassName}>
                {t('createEdit.fieldTotalScope')}
              </label>
              <input
                type="number"
                value={totalScope}
                onChange={(e) => {
                  setTotalScope(e.target.value);
                  if (errors.totalScope)
                    setErrors((prev) => ({ ...prev, totalScope: undefined }));
                }}
                placeholder={t('createEdit.totalScopePlaceholder')}
                className={
                  errors.totalScope ? inputErrorClassName : inputClassName
                }
              />
              {errors.totalScope && (
                <div className={errorTextClassName}>{errors.totalScope}</div>
              )}
            </div>
            <div>
              <label className={labelClassName}>
                {t('createEdit.fieldCurrentProgress')}
              </label>
              <input
                type="number"
                value={currentProgress}
                onChange={(e) => {
                  setCurrentProgress(e.target.value);
                  if (errors.currentProgress)
                    setErrors((prev) => ({
                      ...prev,
                      currentProgress: undefined,
                    }));
                }}
                placeholder="0"
                className={
                  errors.currentProgress ? inputErrorClassName : inputClassName
                }
              />
              {errors.currentProgress && (
                <div className={errorTextClassName}>
                  {errors.currentProgress}
                </div>
              )}
            </div>
          </div>
          <label className={labelClassName}>
            {t('createEdit.fieldDeadline')}{' '}
            <span className="text-text-secondary">{t('common.optional')}</span>
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={inputClassName}
          />
        </Card>

        {/* Cadence */}
        <Card>
          <label className={labelClassName}>
            {t('createEdit.fieldCadence')}
          </label>
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCadenceDays(1)}
              className={`flex-1 rounded-md p-2.5 text-[13px] font-semibold ${chipToggle({ selected: cadenceDays === 1 })}`}
            >
              {t('createEdit.daily')}
            </button>
            <div className="flex flex-[2] items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCadenceDays(
                    Math.max(2, cadenceDays === 1 ? 2 : cadenceDays),
                  )
                }
                className={`flex-1 rounded-md p-2.5 text-[13px] font-semibold ${chipToggle({ selected: cadenceDays > 1 })}`}
              >
                {t('createEdit.every')}
              </button>
              {cadenceDays > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCadenceDays(Math.max(2, cadenceDays - 1))}
                    className={stepperButtonClassName}
                  >
                    –
                  </button>
                  <span className="min-w-6 text-center font-mono text-[16px] font-bold">
                    {cadenceDays}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCadenceDays(cadenceDays + 1)}
                    className={stepperButtonClassName}
                  >
                    +
                  </button>
                  <span className="text-[13px] text-text-secondary">
                    {t('createEdit.days')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <label className={labelClassName}>
            {t('createEdit.fieldSessionMinutes')}
          </label>
          <input
            type="number"
            value={sessionMinutes}
            onChange={(e) => {
              setSessionMinutes(e.target.value);
              if (errors.sessionMinutes)
                setErrors((prev) => ({ ...prev, sessionMinutes: undefined }));
            }}
            placeholder="30"
            className={
              errors.sessionMinutes ? inputErrorClassName : inputClassName
            }
          />
          {errors.sessionMinutes && (
            <div className={errorTextClassName}>{errors.sessionMinutes}</div>
          )}

          <label className={labelClassName}>
            {t('createEdit.fieldReminderTime')}
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className={inputClassName}
          />

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {t('createEdit.notifications')}
            </span>
            <Switch
              checked={notificationsOn}
              onChange={() => setNotificationsOn(!notificationsOn)}
            />
          </div>
        </Card>

        <button
          onClick={() => void handleSave()}
          disabled={isSaving}
          className={`flex w-full items-center justify-center gap-2.5 rounded-md border-none bg-accent p-4 text-[16px] font-bold text-ink ${
            isSaving
              ? 'cursor-default opacity-70'
              : 'cursor-pointer opacity-100'
          }`}
        >
          {isSaving && <Spinner size={18} color="#14171A" />}
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
