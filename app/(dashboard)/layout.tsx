'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import s from './layout.module.css';

const ROLE_LABELS: Record<string, string> = {
  therapist: 'Therapeut Dashboard',
  client: 'Cliënt Dashboard',
  admin: 'Admin Dashboard',
  owner: 'Eigenaar Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (role === null) {
      const saved = localStorage.getItem('moods-demo-auth');
      if (!saved) {
        router.push('/login');
      }
    }
  }, [role, router]);

  return (
    <div>
      <div className={s.topBarOuter}>
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
        <button className={s.logoutBtn} onClick={logout}>Uitloggen</button>
      </header>
      </div>
      <main className={s.content}>
        {children}
      </main>
    </div>
  );
}
