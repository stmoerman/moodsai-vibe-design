'use client';

import { useState, useRef, type FormEvent, type KeyboardEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, ROLE_ROUTES } from '@/contexts/AuthContext';
import a from '../auth.module.css';

export default function VerifyPage() {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { email, role } = useAuth();
  const router = useRouter();

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const next = [...digits];
    next[index] = val[val.length - 1];
    setDigits(next);
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (digits.some((d) => !d)) return;
    setLoading(true);
    const dest = ROLE_ROUTES[role ?? 'client'] ?? '/client';
    setTimeout(() => {
      router.push(dest);
    }, 1500);
  }

  function handleResend() {
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  }

  if (loading) {
    return (
      <div className={a.spinner}>
        <div className={a.spinnerDot} />
        <span className={a.spinnerText}>Code verifiëren...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={a.title}>Verificatie</h1>
      <p className={a.footer} style={{ textAlign: 'left', marginTop: 0, marginBottom: 24 }}>
        Voer de 6-cijferige code in die we naar{' '}
        <strong>{email ?? 'je e-mail'}</strong> hebben gestuurd.
      </p>

      <div className={a.otpRow}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={a.otpInput}
            value={digit}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            autoFocus={i === 0}
          />
        ))}
      </div>

      <button
        type="submit"
        className={a.button}
        disabled={digits.some((d) => !d)}
      >
        Verifiëren
      </button>

      <div className={a.footer}>
        Code niet ontvangen?{' '}
        <button type="button" onClick={handleResend} className={a.linkAccent} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
          Opnieuw versturen
        </button>
      </div>
    </form>
  );
}
