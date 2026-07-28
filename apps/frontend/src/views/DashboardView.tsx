import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterTab, StudyItem } from '../types/study';
import { IconPlus } from '../components/icons/IconPlus';
import { IconSettings } from '../components/icons/IconSettings';
import { StudyCard } from '../components/study/StudyCard';

interface DashboardViewProps {
  items: StudyItem[];
  onRegister: (id: string) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onSettings: () => void;
}

export function DashboardView({
  items,
  onRegister,
  onSelect,
  onNew,
  onSettings,
}: Readonly<DashboardViewProps>) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered = items.filter((i) => {
    if (filter === 'all') return true;
    if (filter === 'active') return i.status === 'active';
    if (filter === 'paused') return i.status === 'paused';
    if (filter === 'done') return i.status === 'done';
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: t('dashboard.tabAll') },
    { key: 'active', label: t('dashboard.tabActive') },
    { key: 'paused', label: t('dashboard.tabPaused') },
    { key: 'done', label: t('dashboard.tabDone') },
  ];

  const activeCount = items.filter((i) => i.status === 'active').length;

  return (
    <div className="min-h-screen bg-base pb-[100px]">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-surface px-5 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-mono text-xl font-bold tracking-[-0.02em] text-text-primary">
              {t('common.appName')}
            </div>
            <div className="mt-0.5 text-xs text-text-secondary">
              {t('dashboard.activeCount', { count: activeCount })}
            </div>
          </div>
          <button
            onClick={onSettings}
            className="cursor-pointer rounded-md border-none bg-transparent p-1.5 text-text-secondary"
          >
            <IconSettings />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`cursor-pointer rounded-t border-none bg-transparent px-3.5 py-2 text-[13px] font-semibold transition-colors duration-150 ${
                filter === tab.key
                  ? 'border-b-2 border-accent text-accent'
                  : 'border-b-2 border-transparent text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-3 px-4 py-5">
        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-text-secondary">
            {t('dashboard.emptyList')}
          </div>
        )}
        {filtered.map((item) => (
          <StudyCard
            key={item.id}
            item={item}
            onRegister={() => onRegister(item.id)}
            onSelect={() => onSelect(item.id)}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={onNew}
        className="fixed bottom-7 right-5 z-20 flex h-[54px] w-[54px] cursor-pointer items-center justify-center rounded-full border-none bg-accent text-ink shadow-[0_4px_20px_rgba(232,163,61,0.25)] transition-transform duration-150 hover:scale-[1.06]"
      >
        <IconPlus size={24} />
      </button>
    </div>
  );
}
