'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import a from '../auth.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className={a.successMessage}>
        <div className={a.successIcon}>✓</div>
        <p className={a.successText}>Herstellink verstuurd</p>
        <p className={a.successSub}>Controleer je inbox voor een link om je wachtwoord te herstellen.</p>
        <Link href="/login" className={a.linkAccent}>Terug naar inloggen</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={a.title}>Wachtwoord vergeten</h1>
      <p className={a.footer} style={{ textAlign: 'left', marginTop: 0, marginBottom: 24 }}>
        Voer je e-mailadres in en we sturen je een herstellink.
      </p>

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

      <button type="submit" className={a.button}>Versturen</button>

      <div className={a.footer}>
        <Link href="/login" className={a.link}>← Terug naar inloggen</Link>
      </div>
    </form>
  );
}
