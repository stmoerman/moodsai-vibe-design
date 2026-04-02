'use client';

import { useState, useEffect, useMemo } from 'react';
import s from './page.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatsResponse {
  totalEntries: number;
  byType: Record<string, { count: number; avgDuration: number; withClient: number }>;
  byMonth: { year: number; month: number; total: number; therapists: number }[];
}

interface TherapistEntry {
  name: string;
  entryCount: number;
  activityTypes: string[];
}

// ---------------------------------------------------------------------------
// Activity colors (shared with planning.tsx)
// ---------------------------------------------------------------------------

const ACTIVITY_COLORS: Record<string, string> = {
  behandeling: '#2d9e47',
  workshop: '#7c3aed',
  diagnostiek: '#e68a00',
  evaluatie: '#2577b5',
  intake: '#dc4323',
  reserved: '#78716c',
};

const ACTIVITY_LABELS: Record<string, string> = {
  behandeling: 'Behandeling',
  workshop: 'Workshop',
  diagnostiek: 'Diagnostiek',
  evaluatie: 'Evaluatie',
  intake: 'Intake',
  reserved: 'Gereserveerd',
};

// ---------------------------------------------------------------------------
// Period helpers
// ---------------------------------------------------------------------------

type PeriodType = 'week' | 'maand' | 'kwartaal' | 'jaar';

const PERIOD_LABELS: Record<PeriodType, string> = {
  week: 'Deze week',
  maand: 'Deze maand',
  kwartaal: 'Dit kwartaal',
  jaar: 'Dit jaar',
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

function getPeriodRange(type: PeriodType, offset: number): { start: string; end: string; label: string } {
  const now = new Date();
  let start: Date;
  let end: Date;
  let label: string;

  switch (type) {
    case 'week': {
      const d = new Date(now);
      d.setDate(d.getDate() + offset * 7);
      const day = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 6);
      start = monday;
      end = friday;
      label = `Week ${Math.ceil((monday.getDate() + new Date(monday.getFullYear(), monday.getMonth(), 1).getDay()) / 7)}, ${MONTH_NAMES[monday.getMonth()]} ${monday.getFullYear()}`;
      break;
    }
    case 'maand': {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      start = d;
      end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
      break;
    }
    case 'kwartaal': {
      const currentQ = Math.floor(now.getMonth() / 3);
      const q = currentQ + offset;
      const year = now.getFullYear() + Math.floor(q / 4);
      const qIdx = ((q % 4) + 4) % 4;
      start = new Date(year, qIdx * 3, 1);
      end = new Date(year, qIdx * 3 + 3, 0);
      label = `Q${qIdx + 1} ${year}`;
      break;
    }
    case 'jaar': {
      const year = now.getFullYear() + offset;
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31);
      label = `${year}`;
      break;
    }
  }

  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { start: fmt(start), end: fmt(end), label };
}

function getChartRange(): { start: string; end: string } {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { start: fmt(startDate), end: fmt(endDate) };
}

// ---------------------------------------------------------------------------
// Chart types constant
// ---------------------------------------------------------------------------

const CHART_TYPES = ['behandeling', 'intake', 'diagnostiek', 'workshop', 'evaluatie', 'reserved'] as const;

// ---------------------------------------------------------------------------
// MonthlyChart component
// ---------------------------------------------------------------------------

function MonthlyChart({ data }: { data: StatsResponse | null }) {
  if (!data?.byMonth || data.byMonth.length === 0) {
    return (
      <div className="px-5 py-12 text-center font-serif text-sm text-text-faint">
        Geen data beschikbaar voor grafiek
      </div>
    );
  }

  const months = data.byMonth.sort((a, b) => a.year - b.year || a.month - b.month);
  const maxTotal = Math.max(...months.map((m) => m.total), 1);
  const chartHeight = 200;

  return (
    <div className="px-5 py-6">
      <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-4">Sessies per maand</div>

      <div className="flex items-end gap-2" style={{ height: `${chartHeight}px` }}>
        {months.map((m) => {
          const pct = (m.total / maxTotal) * 100;
          return (
            <div key={`${m.year}-${m.month}`} className="flex-1 flex flex-col items-center gap-1">
              <span className="font-mono text-[0.6rem] text-text-muted">{m.total}</span>
              <div className="w-full relative" style={{ height: `${(pct / 100) * (chartHeight - 30)}px`, minHeight: '4px' }}>
                <div
                  className="absolute inset-0 transition-all"
                  style={{ backgroundColor: ACTIVITY_COLORS.behandeling, opacity: 0.85 }}
                />
              </div>
              <span className="font-mono text-[0.6rem] text-text-faint">{MONTH_NAMES[m.month - 1]}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 flex-wrap">
        {CHART_TYPES.map((type) => {
          const count = data.byType?.[type]?.count ?? 0;
          if (count === 0) return null;
          return (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-2 h-2 shrink-0" style={{ background: ACTIVITY_COLORS[type] }} />
              <span className="font-mono text-[0.6rem] text-text-muted">{ACTIVITY_LABELS[type]} <span className="text-text font-medium">{count}</span></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TopTherapists component
// ---------------------------------------------------------------------------

function TopTherapists({ therapists }: { therapists: TherapistEntry[] }) {
  if (therapists.length === 0) {
    return (
      <div className="px-5 py-8 text-center font-serif text-sm text-text-faint">
        Geen therapeuten in deze periode
      </div>
    );
  }

  const top5 = therapists.slice(0, 5);

  return (
    <div className="px-5 pb-6">
      <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mb-3">Top therapeuten</div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="font-mono text-[0.6rem] uppercase tracking-wider text-text-muted text-left py-2 px-2">Therapeut</th>
            <th className="font-mono text-[0.6rem] uppercase tracking-wider text-text-muted text-left py-2 px-2">Sessies</th>
            <th className="font-mono text-[0.6rem] uppercase tracking-wider text-text-muted text-left py-2 px-2">Activiteiten</th>
          </tr>
        </thead>
        <tbody>
          {top5.map((t) => (
            <tr key={t.name} className="border-b border-border-subtle/60 hover:bg-surface-hover transition-colors">
              <td className="py-2.5 px-2 font-serif text-[0.9rem] text-text font-medium">{t.name}</td>
              <td className="py-2.5 px-2 font-mono text-[0.75rem] text-text">{t.entryCount}</td>
              <td className="py-2.5 px-2">
                <div className="flex gap-1 flex-wrap">
                  {t.activityTypes.map((at) => (
                    <span
                      key={at}
                      className="font-mono text-[0.55rem] uppercase tracking-wide px-1.5 py-0.5 border"
                      style={{ borderColor: ACTIVITY_COLORS[at] ?? '#999', color: ACTIVITY_COLORS[at] ?? '#999' }}
                    >
                      {ACTIVITY_LABELS[at] ?? at}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function RapportageTab() {
  const [periodType, setPeriodType] = useState<PeriodType>(() => {
    if (typeof window === 'undefined') return 'maand';
    return (localStorage.getItem('moods-rapport-period') as PeriodType) ?? 'maand';
  });
  const [periodOffset, setPeriodOffset] = useState(0);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [chartStats, setChartStats] = useState<StatsResponse | null>(null);
  const [therapists, setTherapists] = useState<TherapistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { localStorage.setItem('moods-rapport-period', periodType); }, [periodType]);

  const period = useMemo(() => getPeriodRange(periodType, periodOffset), [periodType, periodOffset]);
  const chartRange = useMemo(() => getChartRange(), []);

  // Fetch KPI stats + therapists for selected period
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/agenda/stats?start=${period.start}&end=${period.end}`).then((r) => r.json()).catch(() => null),
      fetch(`/api/agenda/therapists?start=${period.start}&end=${period.end}`).then((r) => r.json()).catch(() => ({ therapists: [] })),
    ]).then(([statsRes, thRes]) => {
      if (statsRes && !statsRes.error) setStats(statsRes);
      setTherapists(thRes.therapists ?? []);
    }).finally(() => setLoading(false));
  }, [period.start, period.end]);

  // Fetch chart data (6-month range, once)
  useEffect(() => {
    fetch(`/api/agenda/stats?start=${chartRange.start}&end=${chartRange.end}`)
      .then((r) => r.json())
      .then((data) => { if (data && !data.error) setChartStats(data); })
      .catch(() => {});
  }, [chartRange.start, chartRange.end]);

  // Computed KPIs
  const kpis = useMemo(() => {
    if (!stats) return null;
    const byType = stats.byType ?? {};
    const declarable = (byType.behandeling?.count ?? 0) + (byType.diagnostiek?.count ?? 0);
    const total = stats.totalEntries || 1;
    const declPct = Math.round((declarable / total) * 100);

    let totalDuration = 0;
    let totalCount = 0;
    for (const t of Object.values(byType)) {
      totalDuration += t.avgDuration * t.count;
      totalCount += t.count;
    }
    const avgDuration = totalCount > 0 ? Math.round(totalDuration / totalCount) : 0;

    let withClient = 0;
    for (const t of Object.values(byType)) withClient += t.withClient;

    const therapistCount = stats.byMonth?.length > 0
      ? Math.max(...stats.byMonth.map((m) => m.therapists))
      : 0;

    return { total: stats.totalEntries, declPct, therapistCount, avgDuration, withClient };
  }, [stats]);

  return (
    <div className="flex flex-col gap-0">
      {/* KPI Cards */}
      <div className={`${s.widgetCard} ${s.gridFull}`} style={{ marginBottom: 0 }}>
        <div className={s.kpiRow}>
          <div className={s.kpi}>
            <div className={s.kpiValue}>{loading ? '—' : kpis?.total ?? '—'}</div>
            <div className={s.kpiLabel}>Sessies</div>
          </div>
          <div className={s.kpi}>
            <div className={s.kpiValue}>{loading ? '—' : kpis ? `${kpis.declPct}%` : '—'}</div>
            <div className={s.kpiLabel}>Declarabiliteit</div>
            {kpis && (
              <div className="w-full h-1.5 bg-border mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 bg-[#5a9a60] transition-all" style={{ width: `${Math.min(kpis.declPct, 100)}%` }} />
                <div className="absolute inset-y-0 left-[75%] w-px bg-text/30" title="Target: 75%" />
              </div>
            )}
          </div>
          <div className={s.kpi}>
            <div className={s.kpiValue}>{loading ? '—' : kpis?.therapistCount ?? '—'}</div>
            <div className={s.kpiLabel}>Therapeuten actief</div>
          </div>
          <div className={s.kpi}>
            <div className={s.kpiValue}>{loading ? '—' : kpis ? `${kpis.avgDuration} min` : '—'}</div>
            <div className={s.kpiLabel}>Gem. duur per sessie</div>
          </div>
          <div className={s.kpi}>
            <div className={s.kpiValue}>{loading ? '—' : kpis?.withClient ?? '—'}</div>
            <div className={s.kpiLabel}>Met cliënt</div>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2 px-5 py-3 bg-paper border-b border-border">
        <select
          value={periodType}
          onChange={(e) => { setPeriodType(e.target.value as PeriodType); setPeriodOffset(0); }}
          className="font-mono text-[0.68rem] uppercase tracking-wide px-3 py-1.5 border border-border bg-paper text-text-muted cursor-pointer outline-none"
        >
          {(Object.keys(PERIOD_LABELS) as PeriodType[]).map((p) => (
            <option key={p} value={p}>{PERIOD_LABELS[p]}</option>
          ))}
        </select>

        <button
          onClick={() => setPeriodOffset((o) => o - 1)}
          className="w-7 h-7 border border-border flex items-center justify-center text-text-muted font-mono text-sm cursor-pointer hover:bg-surface-hover transition-colors"
        >←</button>
        <span className="font-display text-sm text-text min-w-[120px] text-center">{period.label}</span>
        <button
          onClick={() => setPeriodOffset((o) => o + 1)}
          className="w-7 h-7 border border-border flex items-center justify-center text-text-muted font-mono text-sm cursor-pointer hover:bg-surface-hover transition-colors"
        >→</button>
        <button
          onClick={() => setPeriodOffset(0)}
          className="font-mono text-[0.65rem] text-text-muted border border-border px-2.5 py-1 uppercase tracking-wide cursor-pointer hover:bg-text hover:text-paper transition-colors"
        >Nu</button>
      </div>

      {/* Monthly trend chart */}
      <MonthlyChart data={chartStats} />

      {/* Top therapists */}
      <TopTherapists therapists={therapists} />
    </div>
  );
}
