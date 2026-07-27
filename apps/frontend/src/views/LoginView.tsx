import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function LoginView() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
      setMessage(
        'Conta criada! Verifique seu e-mail para confirmar o cadastro.',
      );
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg-base, #14171A)',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          background: 'var(--surface-card, #1E2226)',
          border: '1px solid var(--border, #2D3339)',
          borderRadius: 8,
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary, #EDEEEC)',
            marginBottom: 4,
          }}
        >
          Study Tracker
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'var(--text-secondary, #8B929A)',
            marginBottom: 20,
          }}
        >
          {mode === 'sign-in' ? 'Entre na sua conta' : 'Crie sua conta'}
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error && (
            <div style={{ fontSize: 13, color: '#F87171' }}>{error}</div>
          )}
          {message && (
            <div style={{ fontSize: 13, color: '#34D399' }}>{message}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--accent, #E8A33D)',
              color: '#14171A',
              border: 'none',
              borderRadius: 6,
              padding: '13px',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
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
          style={{
            background: 'none',
            border: 'none',
            marginTop: 16,
            width: '100%',
            color: 'var(--text-secondary, #8B929A)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {mode === 'sign-in'
            ? 'Não tem conta? Criar uma agora'
            : 'Já tem conta? Entrar'}
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-base, #14171A)',
  border: '1px solid var(--border, #2D3339)',
  borderRadius: 6,
  padding: '12px',
  fontSize: 14,
  color: 'var(--text-primary, #EDEEEC)',
};
