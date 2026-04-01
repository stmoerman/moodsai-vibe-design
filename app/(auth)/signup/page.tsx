'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import a from '../auth.module.css';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className={a.successMessage}>
        <div className={a.successIcon}>✓</div>
        <p className={a.successText}>Verificatie e-mail verstuurd</p>
        <p className={a.successSub}>Controleer je inbox om je account te activeren.</p>
        <Link href="/login" className={a.linkAccent}>Terug naar inloggen</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={a.title}>Registreren</h1>

      <div className={a.field}>
        <label className={a.label} htmlFor="name">Naam</label>
        <input
          id="name"
          type="text"
          className={a.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Volledige naam"
          autoComplete="name"
          required
        />
      </div>

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

      <div className={a.field}>
        <label className={a.label} htmlFor="password">Wachtwoord</label>
        <input
          id="password"
          type="password"
          className={a.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />
      </div>

      <button type="submit" className={a.button}>Registreren</button>

      <div className={a.footer}>
        Al een account?{' '}
        <Link href="/login" className={a.linkAccent}>Inloggen</Link>
      </div>
    </form>
  );
}
