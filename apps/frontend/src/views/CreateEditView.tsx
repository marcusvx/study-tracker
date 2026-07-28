import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Category, StudyItem, Unit } from '../types/study';
import { categoryMeta, IconArrowLeft } from '../components/icons/Index';
import { Spinner } from '../components/ui/Spinner';

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

export function CreateEditView({
  initial,
  onSave,
  onBack,
}: CreateEditViewProps) {
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
    if (!totalScope || parseFloat(totalScope) <= 0)
      next.totalScope = t('createEdit.errorTotalScopeRequired');
    if (currentProgress && parseFloat(currentProgress) < 0)
      next.currentProgress = t('createEdit.errorCurrentProgressInvalid');
    if (sessionMinutes && parseInt(sessionMinutes) <= 0)
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
        totalScope: parseFloat(totalScope),
        currentProgress: parseFloat(currentProgress) || 0,
        deadline: deadline || undefined,
        cadenceDays,
        sessionMinutes: parseInt(sessionMinutes) || 30,
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
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base, #14171A)',
        paddingBottom: 48,
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
          <IconArrowLeft size={18} /> {t('common.cancel')}
        </button>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary, #EDEEEC)',
          }}
        >
          {initial ? t('createEdit.titleEdit') : t('createEdit.titleNew')}
        </div>
      </div>

      <div
        style={{
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Title */}
        <div style={cardStyle}>
          <label style={labelStyle}>{t('createEdit.fieldTitle')}</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder={t('createEdit.titlePlaceholder')}
            style={errors.title ? inputErrorStyle : inputStyle}
          />
          {errors.title && <div style={errorTextStyle}>{errors.title}</div>}

          {/* Category */}
          <label style={labelStyle}>{t('createEdit.fieldCategory')}</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              marginBottom: 16,
            }}
          >
            {(Object.keys(categoryMeta) as Category[]).map((c) => {
              const m = categoryMeta[c];
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '12px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    border: active
                      ? `2px solid ${m.color}`
                      : '1px solid var(--border, #2D3339)',
                    background: active ? m.bg : '#14171A',
                    color: active ? m.color : 'var(--text-muted, #8B929A)',
                    transition: 'all 0.15s',
                  }}
                >
                  <m.Icon size={20} />
                  <span style={{ fontSize: 10, fontWeight: 600 }}>
                    {t(m.labelKey)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Unit */}
          <label style={labelStyle}>{t('createEdit.fieldUnit')}</label>
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 16,
              flexWrap: 'wrap',
            }}
          >
            {units.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '7px 14px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border:
                    unit === u
                      ? '1.5px solid var(--accent, #E8A33D)'
                      : '1px solid var(--border, #2D3339)',
                  background:
                    unit === u ? 'rgba(232, 163, 61, 0.12)' : '#14171A',
                  color:
                    unit === u
                      ? 'var(--accent, #E8A33D)'
                      : 'var(--text-secondary, #8B929A)',
                  transition: 'all 0.15s',
                }}
              >
                {unitLabels[u]}
              </button>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div style={cardStyle}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            <div>
              <label style={labelStyle}>
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
                style={errors.totalScope ? inputErrorStyle : inputStyle}
              />
              {errors.totalScope && (
                <div style={errorTextStyle}>{errors.totalScope}</div>
              )}
            </div>
            <div>
              <label style={labelStyle}>
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
                style={errors.currentProgress ? inputErrorStyle : inputStyle}
              />
              {errors.currentProgress && (
                <div style={errorTextStyle}>{errors.currentProgress}</div>
              )}
            </div>
          </div>
          <label style={labelStyle}>
            {t('createEdit.fieldDeadline')}{' '}
            <span style={{ color: 'var(--text-muted, #8B929A)' }}>
              {t('common.optional')}
            </span>
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Cadence */}
        <div style={cardStyle}>
          <label style={labelStyle}>{t('createEdit.fieldCadence')}</label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
            }}
          >
            <button
              type="button"
              onClick={() => setCadenceDays(1)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                border:
                  cadenceDays === 1
                    ? '1.5px solid var(--accent, #E8A33D)'
                    : '1px solid var(--border, #2D3339)',
                background:
                  cadenceDays === 1 ? 'rgba(232, 163, 61, 0.12)' : '#14171A',
                color:
                  cadenceDays === 1
                    ? 'var(--accent, #E8A33D)'
                    : 'var(--text-secondary, #8B929A)',
              }}
            >
              {t('createEdit.daily')}
            </button>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 2 }}
            >
              <button
                type="button"
                onClick={() =>
                  setCadenceDays(
                    Math.max(2, cadenceDays === 1 ? 2 : cadenceDays),
                  )
                }
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  border:
                    cadenceDays > 1
                      ? '1.5px solid var(--accent, #E8A33D)'
                      : '1px solid var(--border, #2D3339)',
                  background:
                    cadenceDays > 1 ? 'rgba(232, 163, 61, 0.12)' : '#14171A',
                  color:
                    cadenceDays > 1
                      ? 'var(--accent, #E8A33D)'
                      : 'var(--text-secondary, #8B929A)',
                }}
              >
                {t('createEdit.every')}
              </button>
              {cadenceDays > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setCadenceDays(Math.max(2, cadenceDays - 1))}
                    style={stepperBtn}
                  >
                    –
                  </button>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      minWidth: 24,
                      textAlign: 'center',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {cadenceDays}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCadenceDays(cadenceDays + 1)}
                    style={stepperBtn}
                  >
                    +
                  </button>
                  <span
                    style={{
                      fontSize: 13,
                      color: 'var(--text-muted, #8B929A)',
                    }}
                  >
                    {t('createEdit.days')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <label style={labelStyle}>
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
            style={errors.sessionMinutes ? inputErrorStyle : inputStyle}
          />
          {errors.sessionMinutes && (
            <div style={errorTextStyle}>{errors.sessionMinutes}</div>
          )}

          <label style={labelStyle}>
            {t('createEdit.fieldReminderTime')}
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            style={inputStyle}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-primary, #EDEEEC)',
              }}
            >
              {t('createEdit.notifications')}
            </span>
            <div
              onClick={() => setNotificationsOn(!notificationsOn)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 99,
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                background: notificationsOn
                  ? 'var(--accent, #E8A33D)'
                  : '#2D3339',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  left: notificationsOn ? 23 : 3,
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

        <button
          onClick={() => void handleSave()}
          disabled={isSaving}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            background: 'var(--accent, #E8A33D)',
            color: '#14171A',
            border: 'none',
            borderRadius: 6,
            padding: '16px',
            fontSize: 16,
            fontWeight: 700,
            cursor: isSaving ? 'default' : 'pointer',
            opacity: isSaving ? 0.7 : 1,
            width: '100%',
          }}
        >
          {isSaving && <Spinner size={18} color="#14171A" />}
          {submitLabel}
        </button>
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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted, #8B929A)',
  marginBottom: 6,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--border, #2D3339)',
  borderRadius: 6,
  padding: '12px 14px',
  fontSize: 15,
  color: 'var(--text-primary, #EDEEEC)',
  background: '#14171A',
  marginBottom: 16,
  outline: 'none',
  fontFamily: 'inherit',
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  border: '1px solid var(--alert, #C9694F)',
  marginBottom: 6,
};

const errorTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--alert, #C9694F)',
  marginTop: -10,
  marginBottom: 16,
};

const stepperBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: '1px solid var(--border, #2D3339)',
  background: '#14171A',
  color: 'var(--text-primary, #EDEEEC)',
  cursor: 'pointer',
  fontSize: 16,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
