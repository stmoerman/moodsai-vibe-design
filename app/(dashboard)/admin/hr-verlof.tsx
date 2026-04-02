'use client';

import { useState, useEffect } from 'react';
import s from './page.module.css';

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
  phaseStart: string;
  status: string;
  notes: string | null;
}

interface TimeOffEntry {
  firstName: string;
  lastName: string;
  type: string;
  baseType: string;
  startDate: string;
  endDate: string;
  leaveUnit: string;
  notes: string | null;
}

const LEAVE_TYPE_LABELS: Record<string, string> = {
  LEAVE: 'Verlof',
  OVERTIME_PAYOUT: 'Overuren uitbetaling',
  OVERTIME_TIME_OFF_IN_LIEU: 'Overuren opname',
  TRANSACTION_CORRECTION: 'Correctie',
  TRANSACTION_SPENT: 'Transactie',
};

export function HrVerlofTab() {
  const [stats, setStats] = useState<HrStats | null>(null);
  const [sickEntries, setSickEntries] = useState<SickEntry[]>([]);
  const [timeOff, setTimeOff] = useState<TimeOffEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const future = new Date(now.getTime() + 90 * 86400000).toISOString().slice(0, 10);

    Promise.all([
      fetch('/api/hr/stats').then(r => r.json()).catch(() => null),
      fetch('/api/hr/sick-leave').then(r => r.json()).catch(() => ({ currentlySick: [] })),
      fetch(`/api/hr/time-off?start=${today}&end=${future}`).then(r => r.json()).catch(() => ({ entries: [] })),
    ]).then(([statsRes, sickRes, timeOffRes]) => {
      if (statsRes && !statsRes.error) setStats(statsRes);
      setSickEntries(sickRes.currentlySick ?? []);
      setTimeOff(timeOffRes.entries ?? []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><span className="font-mono text-[0.7rem] text-text-faint animate-pulse">HR data laden...</span></div>;
  }

  return (
    <div className={s.grid}>
      {/* Ziekmeldingen */}
      <div className={s.widgetCard}>
        <div className={s.widgetTitle}>Ziekmeldingen</div>
        {sickEntries.length === 0 ? (
          <div className="font-serif text-sm text-text-faint py-4">Geen actieve ziekmeldingen</div>
        ) : (
          sickEntries.slice(0, 10).map((entry, i) => (
            <div key={i} className={s.listItem}>
              <div className={s.listAvatar}>
                {entry.firstName.charAt(0)}{entry.lastName.charAt(0)}
              </div>
              <div>
                <div className={s.listName}>{entry.firstName} {entry.lastName}</div>
                <div className={s.listMeta}>
                  Sinds {new Date(entry.phaseStart).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                  {entry.notes ? ` · ${entry.notes}` : ''}
                </div>
              </div>
              <div className={s.listSpacer} />
              <span className={`${s.listBadge} ${s.badgeWarning}`}>
                {entry.percentage >= 100 ? 'Ziek' : `${100 - entry.percentage}% herstel`}
              </span>
            </div>
          ))
        )}
        {sickEntries.length > 10 && (
          <div className="font-mono text-[0.65rem] text-text-faint mt-2">+{sickEntries.length - 10} meer</div>
        )}
      </div>

      {/* Verlof aankomend */}
      <div className={s.widgetCard}>
        <div className={s.widgetTitle}>Verlof aankomend</div>
        {timeOff.length === 0 ? (
          <div className="font-serif text-sm text-text-faint py-4">Geen verlof ingepland</div>
        ) : (
          timeOff.slice(0, 10).map((entry, i) => (
            <div key={i} className={s.listItem}>
              <div className={s.listAvatar}>
                {entry.firstName.charAt(0)}{entry.lastName.charAt(0)}
              </div>
              <div>
                <div className={s.listName}>{entry.firstName} {entry.lastName}</div>
                <div className={s.listMeta}>
                  {new Date(entry.startDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                  {entry.startDate !== entry.endDate ? ` – ${new Date(entry.endDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}` : ''}
                  {entry.notes ? ` · ${entry.notes}` : ''}
                </div>
              </div>
              <div className={s.listSpacer} />
              <span className={`${s.listBadge} ${s.badgePending}`}>
                {LEAVE_TYPE_LABELS[entry.type] ?? entry.baseType}
              </span>
            </div>
          ))
        )}
        {timeOff.length > 10 && (
          <div className="font-mono text-[0.65rem] text-text-faint mt-2">+{timeOff.length - 10} meer</div>
        )}
      </div>

      {/* HR Stats */}
      {stats && (
        <div className={`${s.widgetCard} ${s.gridFull}`}>
          <div className={s.widgetTitle}>HR overzicht</div>
          <div className={s.kpiRow}>
            <div className={s.kpi}><div className={s.kpiValue}>{stats.activeEmployees}</div><div className={s.kpiLabel}>Actieve medewerkers</div></div>
            <div className={s.kpi}><div className={s.kpiValue}>{stats.inactiveEmployees}</div><div className={s.kpiLabel}>Inactief</div></div>
            <div className={s.kpi}><div className={s.kpiValue}>{stats.currentlySick}</div><div className={s.kpiLabel}>Ziek gemeld</div></div>
            <div className={s.kpi}><div className={s.kpiValue}>{stats.onLeaveToday}</div><div className={s.kpiLabel}>Verlof vandaag</div></div>
            <div className={s.kpi}><div className={s.kpiValue}>{stats.contractsExpiring90d}</div><div className={s.kpiLabel}>Contract verloopt &lt;90d</div></div>
          </div>
        </div>
      )}
    </div>
  );
}
