'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import s from './layout.module.css';

const ROLE_LABELS: Record<string, string> = {
  therapist: 'Therapeut Dashboard',
  client: 'Cliënt Dashboard',
  admin: 'Beheerder Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, logout } = useAuth();
  const router = useRouter();
  const [textSize, setTextSize] = useState(0);

  useEffect(() => {
    if (role === null) {
      const saved = localStorage.getItem('moods-demo-auth');
      if (!saved) {
        router.push('/login');
      }
    }
  }, [role, router]);

  const sizeClass = textSize !== 0
    ? `dashboard-size-${textSize > 0 ? 'up' : 'down'}-${Math.abs(textSize)}`
    : '';

  return (
    <div className={sizeClass}>
      <header className={s.topBar}>
        <div className={s.logo}>
          <Image
            src="/images/logo.png"
            alt="Moods.ai"
            width={100}
            height={26}
            className={s.logoImg}
            priority
          />
        </div>
        <span className={s.roleLabel}>{ROLE_LABELS[role ?? ''] ?? ''}</span>
        <div className={s.spacer} />
        <div className={s.sizeControls}>
          <button
            className={s.sizeBtn}
            onClick={() => setTextSize((v) => Math.max(-2, v - 1))}
            disabled={textSize <= -2}
            title="Kleiner"
          >
            A<span className={s.sizeBtnMinus}>−</span>
          </button>
          <button
            className={s.sizeBtn}
            onClick={() => setTextSize((v) => Math.min(2, v + 1))}
            disabled={textSize >= 2}
            title="Groter"
          >
            A<span className={s.sizeBtnPlus}>+</span>
          </button>
        </div>
        <button className={s.logoutBtn} onClick={logout}>Uitloggen</button>
      </header>
      <main className={s.content}>
        {children}
      </main>
    </div>
  );
}
