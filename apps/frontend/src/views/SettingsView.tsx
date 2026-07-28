import { useTranslation } from 'react-i18next';
import { StudyItem } from '../types/study';
import { IconMoon } from '../components/icons/IconMoon';
import { IconSun } from '../components/icons/IconSun';
import { BackButton } from '../components/ui/BackButton';
import { Card } from '../components/ui/Card';
import { Switch } from '../components/ui/Switch';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsViewProps {
  items: StudyItem[];
  onBack: () => void;
}

const sectionLabelClassName =
  'text-[11px] font-semibold tracking-wider text-text-secondary';

export function SettingsView({ items, onBack }: SettingsViewProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const withReminders = items.filter(
    (i) => i.notificationsOn && i.reminderTime,
  );

  return (
    <div className="min-h-screen bg-base pb-8">
      <div className="border-b border-border bg-surface p-5">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
              {theme === 'dark' ? (
                <IconMoon size={16} />
              ) : (
                <IconSun size={16} />
              )}
              {t('settings.darkTheme')}
            </div>
            <Switch checked={theme === 'dark'} onChange={toggleTheme} />
          </div>
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
