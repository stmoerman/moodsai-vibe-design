'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import s from './page.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  function: string | null;
  isActive: boolean;
  contractType: string | null;
  contractStart: string | null;
  contractEnd: string | null;
  locatie: string | null;
  team: string | null;
  functieCode: string | null;
  doelstellingProcent: number | null;
}

interface HrStats {
  activeEmployees: number;
  inactiveEmployees: number;
  currentlySick: number;
  onLeaveToday: number;
  contractsExpiring90d: number;
}

interface SickEntry {
  firstName: string;
  lastName: string;
  percentage: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function nameHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const AVATAR_COLORS = [
  '#6b8f71', '#8a7196', '#c4924a', '#5a8aaa', '#b85c3a',
  '#7a6e5d', '#5e8c6a', '#9a6b8a', '#b0885a', '#4a7a9a',
];

function avatarColor(firstName: string, lastName: string): string {
  return AVATAR_COLORS[nameHash(firstName + lastName) % AVATAR_COLORS.length];
}

// ---------------------------------------------------------------------------
// KPI Strip
// ---------------------------------------------------------------------------

function KpiStrip({ stats, employees }: { stats: HrStats | null; employees: Employee[] }) {
  const locatieCount = useMemo(
    () => new Set(employees.map((e) => e.locatie).filter(Boolean)).size,
    [employees],
  );
  const teamCount = useMemo(
    () => new Set(employees.map((e) => e.team).filter(Boolean)).size,
    [employees],
  );

  return (
    <div className={`${s.widgetCard} ${s.gridFull}`} style={{ marginBottom: 0 }}>
      <div className={s.kpiRow}>
        <div className={s.kpi}>
          <div className={s.kpiValue}>{stats?.activeEmployees ?? '—'}</div>
          <div className={s.kpiLabel}>Medewerkers</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiValue}>{locatieCount || '—'}</div>
          <div className={s.kpiLabel}>Locaties</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiValue}>{stats?.currentlySick ?? '—'}</div>
          <div className={s.kpiLabel}>Ziek gemeld</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiValue}>{teamCount || '—'}</div>
          <div className={s.kpiLabel}>Teams</div>
        </div>
        <div className={s.kpi}>
          <div className={s.kpiValue}>{stats?.onLeaveToday ?? '—'}</div>
          <div className={s.kpiLabel}>Verlof vandaag</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TeamTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<HrStats | null>(null);
  const [sickNames, setSickNames] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/hr/employees?active=true').then((r) => r.json()).catch(() => ({ employees: [] })),
      fetch('/api/hr/stats').then((r) => r.json()).catch(() => null),
      fetch('/api/hr/sick-leave').then((r) => r.json()).catch(() => ({ currentlySick: [] })),
    ]).then(([empRes, statsRes, sickRes]) => {
      setEmployees(empRes.employees ?? []);
      if (statsRes && !statsRes.error) setStats(statsRes);
      const names = new Set<string>(
        (sickRes.currentlySick ?? []).map((e: SickEntry) => `${e.firstName} ${e.lastName}`),
      );
      setSickNames(names);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="font-mono text-[0.7rem] text-text-faint animate-pulse">Team laden...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      <KpiStrip stats={stats} employees={employees} />
      <div className="px-5 py-12 text-center font-serif text-sm text-text-faint">
        {employees.length} medewerkers geladen
      </div>
    </div>
  );
}
