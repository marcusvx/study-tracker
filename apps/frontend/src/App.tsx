import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import { StudyItem, View } from './types/study';
import { DashboardView } from './views/DashboardView';
import { DetailView } from './views/DetailView';
import { CreateEditView } from './views/CreateEditView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';
import { ProgressSheet } from './components/study/ProgressSheet';
import { supabase } from './lib/supabaseClient';
import {
  fetchStudyItems,
  createStudyItem,
  updateStudyItem,
  deleteStudyItem,
  addProgressLog,
  togglePauseStudyItem,
} from './services/api';

export function App() {
  const { t } = useTranslation();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [items, setItems] = useState<StudyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<View>('dashboard');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sheetItemId, setSheetItemId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<StudyItem | undefined>(undefined);

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
      const data = await fetchStudyItems();
      setItems(data);
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

  const activeItem = activeId
    ? items.find((i) => i.id === activeId)
    : undefined;
  const sheetItem = sheetItemId
    ? items.find((i) => i.id === sheetItemId)
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
    } catch (err: any) {
      console.error('Error adding progress log:', err);
      alert('Erro ao registrar progresso no servidor.');
    } finally {
      setSheetItemId(null);
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
      } else {
        const newItem = await createStudyItem(data);
        setItems((prev) => [newItem, ...prev]);
      }
      setView('dashboard');
      setEditItem(undefined);
    } catch (err: any) {
      console.error('Error saving study item:', err);
      alert('Erro ao salvar item no servidor.');
    }
  };

  const handlePause = async (id: string) => {
    try {
      const updatedItem = await togglePauseStudyItem(id);
      setItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)));
    } catch (err: any) {
      console.error('Error toggling pause state:', err);
      alert('Erro ao alterar status no servidor.');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await deleteStudyItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setView('dashboard');
    } catch (err: any) {
      console.error('Error deleting study item:', err);
      alert('Erro ao arquivar item no servidor.');
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
      {loading ? (
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
          <div
            style={{
              width: 32,
              height: 32,
              border: '3px solid #334155',
              borderTopColor: '#3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span>{t('app.loading')}</span>
        </div>
      ) : error ? (
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
      ) : (
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
              onSave={(data) => void handleSaveItem(data)}
              onBack={() => setView(editItem ? 'detail' : 'dashboard')}
            />
          )}

          {view === 'settings' && (
            <SettingsView items={items} onBack={() => setView('dashboard')} />
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
        </>
      )}
    </div>
  );
}

export default App;
