import { ReactNode, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { StudyItem, View } from './types/study';
import { DashboardView } from './views/DashboardView';
import { DetailView } from './views/DetailView';
import { CreateEditView } from './views/CreateEditView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';
import { ProgressSheet } from './components/features/study/ProgressSheet';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { Spinner } from './components/ui/Spinner';
import { supabase } from './lib/supabaseClient';
import {
  fetchStudyItems,
  createStudyItem,
  updateStudyItem,
  deleteStudyItem,
  addProgressLog,
  togglePauseStudyItem,
  fetchUserSettings,
  updateUserSettings,
} from './services/api';
import { syncStudyReminders } from './services/localNotifications';

export function App() {
  const { t } = useTranslation();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [items, setItems] = useState<StudyItem[]>([]);
  const [reminderTime, setReminderTime] = useState<string>('19:00');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<View>('dashboard');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sheetItemId, setSheetItemId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<StudyItem | undefined>(undefined);
  const [confirmDoneId, setConfirmDoneId] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );
    return () => subscription.subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, settings] = await Promise.all([
        fetchStudyItems(),
        fetchUserSettings(),
      ]);
      setItems(data);
      setReminderTime(settings.reminderTime);
    } catch (err) {
      console.error('Error fetching study items:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to connect to backend server',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) void loadData();
  }, [session]);

  useEffect(() => {
    void syncStudyReminders(items, reminderTime);
  }, [items, reminderTime]);

  const activeItem = activeId
    ? items.find((i) => i.id === activeId)
    : undefined;
  const sheetItem = sheetItemId
    ? items.find((i) => i.id === sheetItemId)
    : undefined;
  const confirmDoneItem = confirmDoneId
    ? items.find((i) => i.id === confirmDoneId)
    : undefined;

  const handleRegister = async (
    id: string,
    amount: number,
    minutes: number,
    note: string,
  ) => {
    try {
      const updatedItem = await addProgressLog(id, { amount, minutes, note });
      setItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)));
      toast.success(t('toasts.registerSuccess'));
      // Reaching the total scope no longer auto-completes the item — ask
      // for confirmation instead, so a data-entry mistake can't silently
      // close it out.
      if (
        updatedItem.totalScope != null &&
        updatedItem.currentProgress >= updatedItem.totalScope &&
        updatedItem.status !== 'done'
      ) {
        setConfirmDoneId(id);
      }
    } catch (err: any) {
      console.error('Error adding progress log:', err);
      toast.error(t('toasts.registerError'));
    } finally {
      setSheetItemId(null);
    }
  };

  const handleConfirmDone = async (id: string) => {
    try {
      const updatedItem = await updateStudyItem(id, { status: 'done' });
      setItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)));
      toast.success(t('toasts.updateSuccess'));
    } catch (err) {
      console.error('Error marking item as done:', err);
      toast.error(t('toasts.saveError'));
    } finally {
      setConfirmDoneId(null);
    }
  };

  const handleSaveItem = async (
    data: Omit<StudyItem, 'id' | 'log'> & { id?: string },
  ) => {
    try {
      if (data.id) {
        const { id, ...updateFields } = data;
        const updatedItem = await updateStudyItem(id, updateFields);
        setItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)));
        toast.success(t('toasts.updateSuccess'));
      } else {
        const newItem = await createStudyItem(data);
        setItems((prev) => [newItem, ...prev]);
        toast.success(t('toasts.createSuccess'));
      }
      setView('dashboard');
      setEditItem(undefined);
    } catch (err: any) {
      console.error('Error saving study item:', err);
      toast.error(t('toasts.saveError'));
    }
  };

  const handlePause = async (id: string) => {
    try {
      const updatedItem = await togglePauseStudyItem(id);
      setItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)));
      toast.success(
        updatedItem.status === 'paused'
          ? t('toasts.pauseSuccess')
          : t('toasts.resumeSuccess'),
      );
    } catch (err: any) {
      console.error('Error toggling pause state:', err);
      toast.error(t('toasts.pauseError'));
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await deleteStudyItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setView('dashboard');
      toast.success(t('toasts.archiveSuccess'));
    } catch (err: any) {
      console.error('Error deleting study item:', err);
      toast.error(t('toasts.archiveError'));
    }
  };

  const handleUpdateReminderTime = async (newReminderTime: string) => {
    const previous = reminderTime;
    setReminderTime(newReminderTime);
    try {
      await updateUserSettings({ reminderTime: newReminderTime });
      toast.success(t('toasts.reminderTimeSuccess'));
    } catch (err) {
      console.error('Error updating reminder time:', err);
      setReminderTime(previous);
      toast.error(t('toasts.reminderTimeError'));
    }
  };

  if (session === undefined) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-base, #14171A)',
        }}
      />
    );
  }

  if (!session) {
    return <LoginView />;
  }

  let content: ReactNode;
  if (loading) {
    content = (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: '#94A3B8',
          gap: 12,
        }}
      >
        <Spinner size={32} color="#3B82F6" />
        <span>{t('app.loading')}</span>
      </div>
    );
  } else if (error) {
    content = (
      <div
        style={{
          padding: 24,
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          color: '#F87171',
        }}
      >
        <p style={{ fontWeight: 600, fontSize: 16 }}>{t('app.loadError')}</p>
        <p style={{ color: '#94A3B8', fontSize: 14 }}>{error}</p>
        <button
          onClick={() => void loadData()}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: '#2563EB',
            color: '#FFF',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t('app.retry')}
        </button>
      </div>
    );
  } else {
    content = (
      <>
        {view === 'dashboard' && (
          <DashboardView
            items={items}
            onRegister={(id) => setSheetItemId(id)}
            onSelect={(id) => {
              setActiveId(id);
              setView('detail');
            }}
            onNew={() => {
              setEditItem(undefined);
              setView('create');
            }}
            onSettings={() => setView('settings')}
          />
        )}

        {view === 'detail' && activeItem && (
          <DetailView
            item={activeItem}
            onBack={() => setView('dashboard')}
            onRegister={() => setSheetItemId(activeItem.id)}
            onEdit={() => {
              setEditItem(activeItem);
              setView('create');
            }}
            onPause={() => void handlePause(activeItem.id)}
            onArchive={() => void handleArchive(activeItem.id)}
          />
        )}

        {view === 'create' && (
          <CreateEditView
            initial={editItem}
            onSave={handleSaveItem}
            onBack={() => setView(editItem ? 'detail' : 'dashboard')}
          />
        )}

        {view === 'settings' && (
          <SettingsView
            items={items}
            reminderTime={reminderTime}
            onUpdateReminderTime={(time) => void handleUpdateReminderTime(time)}
            onBack={() => setView('dashboard')}
          />
        )}

        {sheetItem && (
          <ProgressSheet
            item={sheetItem}
            onSave={(amount, minutes, note) =>
              void handleRegister(sheetItem.id, amount, minutes, note)
            }
            onClose={() => setSheetItemId(null)}
          />
        )}

        {confirmDoneItem && (
          <ConfirmDialog
            title={t('progressSheet.confirmDoneTitle')}
            message={t('progressSheet.confirmDoneMessage', {
              title: confirmDoneItem.title,
            })}
            confirmLabel={t('common.confirm')}
            cancelLabel={t('common.notNow')}
            onConfirm={() => void handleConfirmDone(confirmDoneItem.id)}
            onCancel={() => setConfirmDoneId(null)}
          />
        )}
      </>
    );
  }

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--bg-base, #14171A)',
      }}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--surface-card, #1E2226)',
            color: 'var(--text-primary, #EDEEEC)',
            border: '1px solid var(--border, #2D3339)',
            fontSize: 14,
          },
          success: { iconTheme: { primary: '#E8A33D', secondary: '#14171A' } },
          error: { iconTheme: { primary: '#C9694F', secondary: '#14171A' } },
        }}
      />
      {content}
    </div>
  );
}

export default App;
