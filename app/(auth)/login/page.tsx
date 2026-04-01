'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import a from '../auth.module.css';
import s from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    login(email);
    setTimeout(() => {
      router.push('/verify');
    }, 1500);
  }

  if (loading) {
    return (
      <div className={a.spinner}>
        <div className={a.spinnerDot} />
        <span className={a.spinnerText}>Bezig met inloggen...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={a.title}>Inloggen</h1>

      <div className={a.field}>
        <label className={a.label} htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          className={a.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="naam@voorbeeld.nl"
          autoComplete="email"
          required
        />
      </div>

      <div className={`${a.field} ${s.passwordRow}`}>
        <label className={a.label} htmlFor="password">Wachtwoord</label>
        <Link href="/forgot-password" className={s.forgotLink}>Vergeten?</Link>
        <input
          id="password"
          type="password"
          className={a.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <button type="submit" className={a.button}>Inloggen</button>

      <div className={a.divider}>of</div>

      <div className={a.footer}>
        Nog geen account?{' '}
        <Link href="/signup" className={a.linkAccent}>Registreren</Link>
      </div>
    </form>
  );
}
