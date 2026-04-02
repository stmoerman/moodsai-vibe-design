'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PlanningTab } from './planning';
import s from './page.module.css';

function getGreeting(hour: number) {
  if (hour < 12) return 'Goedemorgen';
  if (hour < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

function formatDate(date: Date) {
  const days = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
  const months = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

/* ── Mock data ── */
const recentMembers = [
  { initials: 'LK', name: 'L. Kuijpers', role: 'Therapeut', date: '28 mrt' },
  { initials: 'RS', name: 'R. Smeets', role: 'Stagiair', date: '24 mrt' },
  { initials: 'NB', name: 'N. Bakker', role: 'Therapeut', date: '18 mrt' },
];

const pendingInvites = [
  { initials: 'MV', name: 'M. Visser', role: 'Therapeut', sent: '30 mrt' },
  { initials: 'JH', name: 'J. Hendriks', role: 'Admin', sent: '29 mrt' },
];

const hrItems = [
  { initials: 'AH', name: 'A. Hoekstra', reason: 'Ziek gemeld', badge: 'Afwezig', badgeType: 'warning' as const },
  { initials: 'PD', name: 'P. Dijkstra', reason: 'Verlofaanvraag · 14-18 apr', badge: 'In afwachting', badgeType: 'pending' as const },
  { initials: 'SJ', name: 'S. Jansen', reason: 'Verlofaanvraag · 21-22 apr', badge: 'In afwachting', badgeType: 'pending' as const },
  { initials: 'MK', name: 'M.D. Kemme', reason: 'Declarabiliteit onder target (68%)', badge: 'Alert', badgeType: 'warning' as const },
];

const kpis = [
  { value: '14', label: 'Nieuwe cliënten', trend: '+3 vs vorige maand', neg: false },
  { value: '87%', label: 'Gem. declarabiliteit', trend: '-2% vs target', neg: true },
  { value: '6', label: 'E-health opdrachten', trend: '92% voltooiing', neg: false },
  { value: '3', label: 'Workshops deze week', trend: '28 deelnemers', neg: false },
];

const quickLinks = [
  { icon: '→', label: 'Cliënt uitnodigen', desc: 'Uitnodiging versturen', href: '/admin/invite' },
  { icon: '◉', label: 'Intake agenda', desc: 'Beschikbare slots', href: '/admin/intake' },
  { icon: '◈', label: 'Declarabiliteit', desc: 'Controle & alerts', href: '#' },
  { icon: '◎', label: 'Verlofoverzicht', desc: 'Aanvragen & saldi', href: '#' },
];

const navTabs = [
  { id: 'overzicht', label: 'Overzicht' },
  { id: 'planning', label: 'Planning' },
  { id: 'team', label: 'Team' },
  { id: 'hr', label: 'HR & Verlof' },
  { id: 'rapportage', label: 'Rapportage' },
];


/* ── Overzicht Tab (fetches live data) ── */
const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

interface MonthForecast { month: string; label: string; slots: number; }

function OverzichtTab() {
  const [forecast, setForecast] = useState<MonthForecast[]>([]);
  const [todayData, setTodayData] = useState<{ total: number; therapists: number; firstTime: string; lastTime: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Build 6 month ranges
    const months: { start: string; end: string; label: string }[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
      const end = `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, '0')}-${String(last.getDate()).padStart(2, '0')}`;
      months.push({ start, end, label: `${MONTH_NAMES_SHORT[d.getMonth()]} ${d.getFullYear()}` });
    }

    // Fetch the full 6-month range in one call
    const rangeStart = months[0].start;
    const rangeEnd = months[months.length - 1].end;

    Promise.all([
      fetch(`/api/agenda/entries?start=${rangeStart}&end=${rangeEnd}&types=intake&limit=2000`).then(r => r.json()).catch(() => ({ entries: [] })),
      fetch(`/api/agenda/entries?start=${today}&end=${today}&limit=2000`).then(r => r.json()).catch(() => ({ entries: [] })),
    ]).then(([intakeRes, todayRes]) => {
      // Count open intake slots per month
      const openSlots = (intakeRes.entries ?? []).filter((e: { clientName: string | null }) => !e.clientName);
      const monthCounts: Record<string, number> = {};
      for (const e of openSlots) {
        const m = (e as { date: string }).date.slice(0, 7); // "2026-06"
        monthCounts[m] = (monthCounts[m] ?? 0) + 1;
      }
      const fc: MonthForecast[] = months.map(m => ({
        month: m.start.slice(0, 7),
        label: m.label,
        slots: monthCounts[m.start.slice(0, 7)] ?? 0,
      }));
      setForecast(fc);

      // Today stats
      const allToday = todayRes.entries ?? [];
      const therapistSet = new Set(allToday.map((e: { therapistName: string }) => e.therapistName));
      const times = allToday.map((e: { startTime: string }) => e.startTime).filter(Boolean).sort();
      const endTimes = allToday.map((e: { endTime: string }) => e.endTime).filter(Boolean).sort();
      setTodayData({
        total: allToday.length,
        therapists: therapistSet.size,
        firstTime: times[0] ?? '—',
        lastTime: endTimes[endTimes.length - 1] ?? '—',
      });
    }).finally(() => setLoading(false));
  }, []);

  const totalOpen = forecast.reduce((sum, m) => sum + m.slots, 0);

  return (
    <div className={s.grid}>
      {/* Intake forecast — full width */}
      <div className={`${s.widgetCard} ${s.gridFull}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={s.widgetTitle} style={{ marginBottom: 0 }}>Open intake slots</div>
          {!loading && <span className="font-mono text-[0.7rem] text-text-muted">{totalOpen} totaal komende 6 maanden</span>}
        </div>
        {loading ? (
          <div className="font-mono text-[0.7rem] text-text-faint animate-pulse py-4">Laden...</div>
        ) : (
          <div className="grid grid-cols-6 gap-2">
            {forecast.map((m) => (
              <div key={m.month} className={`border p-4 text-center ${m.slots > 0 ? 'border-border bg-paper' : 'border-border-subtle/50 bg-paper/50'}`}>
                <div className={`font-display text-2xl ${m.slots > 0 ? 'text-text' : 'text-text-faint'}`}>{m.slots}</div>
                <div className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide mt-1">{m.label}</div>
                {m.slots > 0 && (
                  <a href={`/admin?tab=planning`} className="inline-block mt-2 font-mono text-[0.55rem] text-warm uppercase tracking-wide hover:underline no-underline">Bekijk →</a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vandaag */}
      <div className={s.widgetCard}>
        <div className={s.widgetTitle}>Vandaag</div>
        {loading ? (
          <div className="font-mono text-[0.7rem] text-text-faint animate-pulse py-4">Laden...</div>
        ) : todayData ? (
          <>
            <div className={s.statRow}>
              <div className={s.stat}><div className={s.statValue}>{todayData.total}</div><div className={s.statLabel}>Afspraken</div></div>
              <div className={s.stat}><div className={s.statValue}>{todayData.therapists}</div><div className={s.statLabel}>Therapeuten</div></div>
            </div>
            <div className={s.listItem}>
              <div className={s.listAvatar}>▶</div>
              <div><div className={s.listName}>Eerste: {todayData.firstTime}</div><div className={s.listMeta}>Laatste: {todayData.lastTime}</div></div>
            </div>
          </>
        ) : null}
      </div>

      {/* HR Snapshot */}
      <div className={s.widgetCard}>
        <div className={s.widgetTitle}>HR Snapshot</div>
        <div className={s.statRow}>
          <div className={s.stat}><div className={s.statValue}>1</div><div className={s.statLabel}>Afwezig</div></div>
          <div className={s.stat}><div className={s.statValue}>2</div><div className={s.statLabel}>Verlofaanvragen</div></div>
          <div className={s.stat}><div className={s.statValue}>1</div><div className={s.statLabel}>Alert</div></div>
        </div>
        {hrItems.map((item, i) => (
          <div key={i} className={s.listItem}>
            <div className={s.listAvatar}>{item.initials}</div>
            <div><div className={s.listName}>{item.name}</div><div className={s.listMeta}>{item.reason}</div></div>
            <div className={s.listSpacer} />
            <span className={`${s.listBadge} ${item.badgeType === 'warning' ? s.badgeWarning : s.badgePending}`}>{item.badge}</span>
          </div>
        ))}
      </div>

      {/* Acties */}
      <div className={`${s.widgetCard} ${s.gridFull}`}>
        <div className={s.widgetTitle}>Acties</div>
        <div className={s.quickLinks}>
          {quickLinks.map((link, i) => (
            <a key={i} href={link.href} className={s.quickLink}>
              <span className={s.quickLinkIcon}>{link.icon}</span>
              <div className={s.quickLinkDesc}>{link.desc}</div>
              <div className={s.quickLinkLabel}>{link.label}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense>
      <AdminDashboard />
    </Suspense>
  );
}

function AdminDashboard() {
  const { displayName } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const activeTab = searchParams.get('tab') ?? 'overzicht';

  const setActiveTab = useCallback((tab: string) => {
    router.replace(`/admin?tab=${tab}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    function tick() {
      const now = new Date();
      setGreeting(getGreeting(now.getHours()));
      setDateStr(formatDate(now));
      setTimeStr(now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' }));
    }
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={s.root}>
      <div className={s.dotGrid} aria-hidden="true" />

      {/* ── Welcome Hero ── */}
      <div className={s.welcomeHero}>
        <h1 className={s.greeting}>{greeting}, {displayName ?? 'Demo Admin'}</h1>
        <svg className={s.greetingUnderline} width="280" height="12" viewBox="0 0 280 12" aria-hidden="true">
          <path
            d="M0,6 C23,1 46,11 70,5 C93,0 116,10 140,4 C163,-1 186,9 210,5 C233,1 256,9 280,6"
            className={s.greetingUnderlinePath}
          />
        </svg>
        <span className={s.dateTime} suppressHydrationWarning>Admin &middot; Amsterdam &middot; {dateStr} &middot; {timeStr}</span>
      </div>

      {/* ── Navigation Tabs ── */}
      <nav className={s.navTabs}>
        <div className={s.navTabsInner}>
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              className={`${s.navTab} ${activeTab === tab.id ? s.navTabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content ── */}
      <div className={s.content}>

        {/* ════ Overzicht Tab ════ */}
        {activeTab === 'overzicht' && <OverzichtTab />}

        {/* ════ Planning Tab ════ */}
        {activeTab === 'planning' && <PlanningTab />}
      </div>
    </div>
  );
}
