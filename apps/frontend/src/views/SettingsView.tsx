import { useTranslation } from 'react-i18next';
import { StudyItem } from '../types/study';
import { IconMonitor } from '../components/icons/IconMonitor';
import { IconMoon } from '../components/icons/IconMoon';
import { IconSun } from '../components/icons/IconSun';
import { BackButton } from '../components/ui/BackButton';
import { Card } from '../components/ui/Card';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../contexts/useTheme';
import type { ThemeMode } from '../contexts/ThemeContext';
import {
  setAppLanguage,
  type AppLanguage,
  SUPPORTED_LANGUAGES,
} from '../i18n';

interface SettingsViewProps {
  items: StudyItem[];
  onBack: () => void;
}

const sectionLabelClassName =
  'text-[11px] font-semibold tracking-wider text-text-secondary';

const selectClassName =
  'w-full cursor-pointer rounded-md border border-border bg-input px-3.5 py-3 text-[15px] text-text-primary outline-none';

function isAppLanguage(value: string): value is AppLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function SettingsView({ items, onBack }: Readonly<SettingsViewProps>) {
  const { t, i18n } = useTranslation();
  const { mode, setThemeMode } = useTheme();
  const withReminders = items.filter(
    (i) => i.notificationsOn && i.reminderTime,
  );
  const currentLanguage: AppLanguage = isAppLanguage(i18n.language)
    ? i18n.language
    : 'pt';

  return (
    <div className="min-h-screen bg-base pb-8">
      <div className="pt-safe border-b border-border bg-surface p-5">
        <BackButton onClick={onBack} label={t('common.back')} />
        <div className="text-xl font-bold text-text-primary">
          {t('settings.title')}
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-5">
        {/* Appearance */}
        <Card>
          <div className={`${sectionLabelClassName} mb-3`}>
            {t('settings.appearance')}
          </div>
          <SegmentedControl<ThemeMode>
            value={mode}
            onChange={setThemeMode}
            options={[
              {
                value: 'system',
                label: t('settings.themeSystem'),
                icon: <IconMonitor size={15} />,
              },
              {
                value: 'light',
                label: t('settings.themeLight'),
                icon: <IconSun size={15} />,
              },
              {
                value: 'dark',
                label: t('settings.themeDark'),
                icon: <IconMoon size={15} />,
              },
            ]}
          />
        </Card>

        {/* Language */}
        <Card>
          <div className={`${sectionLabelClassName} mb-3`}>
            {t('settings.language')}
          </div>
          <label
            htmlFor="language-select"
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            {t('settings.languageLabel')}
          </label>
          <select
            id="language-select"
            className={selectClassName}
            value={currentLanguage}
            onChange={(e) => {
              if (isAppLanguage(e.target.value)) {
                setAppLanguage(e.target.value);
              }
            }}
          >
            <option value="pt">{t('settings.languagePt')}</option>
            <option value="en-US">{t('settings.languageEnUS')}</option>
          </select>
        </Card>

        {/* Notifications */}
        <Card>
          <div className={`${sectionLabelClassName} mb-3`}>
            {t('settings.activeReminders')}
          </div>
          {withReminders.length === 0 && (
            <div className="text-sm text-text-secondary">
              {t('settings.noReminders')}
            </div>
          )}
          {withReminders.map((i) => (
            <div
              key={i.id}
              className="flex items-center justify-between border-b border-border py-2.5"
            >
              <div className="text-sm font-medium">{i.title}</div>
              <div className="font-mono text-[13px] text-accent">
                {i.reminderTime}
              </div>
            </div>
          ))}
        </Card>

        {/* Account / Supabase Auth */}
        <Card>
          <div className={`${sectionLabelClassName} mb-3`}>
            {t('settings.account')}
          </div>
          <div className="mb-3.5 text-sm text-[var(--text-secondary)]">
            {t('settings.accountDesc')}
          </div>
          <button
            onClick={() => void supabase.auth.signOut()}
            className="w-full cursor-pointer rounded-md border-none bg-accent p-[13px] text-sm font-bold text-ink"
          >
            {t('settings.signOut')}
          </button>
        </Card>

        {/* About */}
        <Card>
          <div className={`${sectionLabelClassName} mb-2`}>
            {t('settings.about')}
          </div>
          <div className="text-sm text-text-primary">
            {t('settings.aboutVersion')}
          </div>
          <div className="mt-1 text-xs text-text-secondary">
            {t('settings.aboutDesc')}
          </div>
        </Card>
      </div>
    </div>
  );
}
