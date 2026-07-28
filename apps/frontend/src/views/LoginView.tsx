import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';

const inputClassName =
  'rounded-md border border-border bg-base p-3 text-sm text-text-primary';

export function LoginView() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else if (mode === 'sign-up') {
      setMessage(t('login.signUpSuccess'));
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base p-6">
      <div className="w-full max-w-[360px] rounded-lg border border-border bg-surface p-6">
        <div className="mb-1 text-xl font-bold text-text-primary">
          Study Tracker
        </div>
        <div className="mb-5 text-[13px] text-text-secondary">
          {mode === 'sign-in' ? 'Entre na sua conta' : 'Crie sua conta'}
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
          />

          {error && <div className="text-[13px] text-[#F87171]">{error}</div>}
          {message && <div className="text-[13px] text-success">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`rounded-md border-none bg-accent p-[13px] text-sm font-bold text-ink ${
              loading
                ? 'cursor-default opacity-70'
                : 'cursor-pointer opacity-100'
            }`}
          >
            {mode === 'sign-in' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
            setError(null);
            setMessage(null);
          }}
          className="mt-4 w-full cursor-pointer border-none bg-transparent text-[13px] text-text-secondary"
        >
          {mode === 'sign-in'
            ? 'Não tem conta? Criar uma agora'
            : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
}
