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
function OverzichtTab() {
  const [intakeData, setIntakeData] = useState<{ monthSlots: number; weekSlots: number; todaySlots: number; topLocation: string; topLocationCount: number; locations: { name: string; count: number }[] } | null>(null);
  const [todayData, setTodayData] = useState<{ total: number; therapists: number; firstTime: string; lastTime: string; byType: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`;
    // Week: Monday of current week
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    const weekStart = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
    const weekEnd = `${friday.getFullYear()}-${String(friday.getMonth() + 1).padStart(2, '0')}-${String(friday.getDate()).padStart(2, '0')}`;

    Promise.all([
      // Month intake slots
      fetch(`/api/agenda/entries?start=${monthStart}&end=${monthEnd}&types=intake&limit=2000`).then(r => r.json()).catch(() => ({ entries: [] })),
      // Week intake slots
      fetch(`/api/agenda/entries?start=${weekStart}&end=${weekEnd}&types=intake&limit=500`).then(r => r.json()).catch(() => ({ entries: [] })),
      // Today all entries
      fetch(`/api/agenda/entries?start=${today}&end=${today}&limit=2000`).then(r => r.json()).catch(() => ({ entries: [] })),
    ]).then(([monthRes, weekRes, todayRes]) => {
      const monthEntries = (monthRes.entries ?? []).filter((e: { clientName: string | null }) => !e.clientName);
      const weekEntries = (weekRes.entries ?? []).filter((e: { clientName: string | null }) => !e.clientName);
      const todayEntries = (todayRes.entries ?? []).filter((e: { clientName: string | null }) => !e.clientName);

      // Count by location for month
      const locCounts: Record<string, number> = {};
      for (const e of monthEntries) {
        const desc = (e as { description?: string }).description ?? '';
        const loc = (e as { location?: string }).location ?? '';
        const combined = `${desc} ${loc}`.toLowerCase();
        for (const city of ['amsterdam', 'utrecht', 'rotterdam', 'nijmegen', 'heerlen', 'venray']) {
          if (combined.includes(city)) {
            const cityName = city.charAt(0).toUpperCase() + city.slice(1);
            locCounts[cityName] = (locCounts[cityName] ?? 0) + 1;
            break;
          }
        }
        if (!Object.keys(locCounts).some(c => `${desc} ${loc}`.toLowerCase().includes(c.toLowerCase()))) {
          locCounts['Online'] = (locCounts['Online'] ?? 0) + 1;
        }
      }
      const sortedLocs = Object.entries(locCounts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

      setIntakeData({
        monthSlots: monthEntries.length,
        weekSlots: weekEntries.length,
        todaySlots: todayEntries.length,
        topLocation: sortedLocs[0]?.name ?? '—',
        topLocationCount: sortedLocs[0]?.count ?? 0,
        locations: sortedLocs,
      });

      // Today stats
      const allToday = todayRes.entries ?? [];
      const therapistSet = new Set(allToday.map((e: { therapistName: string }) => e.therapistName));
      const times = allToday.map((e: { startTime: string }) => e.startTime).filter(Boolean).sort();
      const endTimes = allToday.map((e: { endTime: string }) => e.endTime).filter(Boolean).sort();
      const byType: Record<string, number> = {};
      for (const e of allToday) { byType[(e as { activityType: string }).activityType] = (byType[(e as { activityType: string }).activityType] ?? 0) + 1; }

      setTodayData({
        total: allToday.length,
        therapists: therapistSet.size,
        firstTime: times[0] ?? '—',
        lastTime: endTimes[endTimes.length - 1] ?? '—',
        byType,
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className={s.grid}>
      {/* Intake capaciteit */}
      <div className={s.widgetCard}>
        <div className={s.widgetTitle}>Intake capaciteit</div>
        {loading ? (
          <div className="font-mono text-[0.7rem] text-text-faint animate-pulse py-4">Laden...</div>
        ) : intakeData ? (
          <>
            <div className={s.statRow}>
              <div className={s.stat}><div className={s.statValue}>{intakeData.monthSlots}</div><div className={s.statLabel}>Open deze maand</div></div>
              <div className={s.stat}><div className={s.statValue}>{intakeData.weekSlots}</div><div className={s.statLabel}>Open deze week</div></div>
              <div className={s.stat}><div className={s.statValue}>{intakeData.todaySlots}</div><div className={s.statLabel}>Vandaag</div></div>
            </div>
            {intakeData.locations.length > 0 && (
              <>
                <div className={`${s.sectionSub} ${s.sectionSubFirst}`}>Slots per locatie</div>
                {intakeData.locations.slice(0, 5).map((loc, i) => (
                  <div key={i} className={s.listItem}>
                    <div className={s.listAvatar}>{loc.name.charAt(0)}</div>
                    <div><div className={s.listName}>{loc.name}</div></div>
                    <div className={s.listSpacer} />
                    <span className="font-mono text-[0.75rem] text-text">{loc.count}</span>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <div className="font-serif text-sm text-text-faint py-4">Geen data beschikbaar</div>
        )}
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

      {/* Vandaag */}
      <div className={`${s.widgetCard} ${s.gridFull}`}>
        <div className={s.widgetTitle}>Vandaag</div>
        {loading ? (
          <div className="font-mono text-[0.7rem] text-text-faint animate-pulse py-4">Laden...</div>
        ) : todayData ? (
          <div className={s.kpiRow}>
            <div className={s.kpi}><div className={s.kpiValue}>{todayData.total}</div><div className={s.kpiLabel}>Afspraken</div></div>
            <div className={s.kpi}><div className={s.kpiValue}>{todayData.therapists}</div><div className={s.kpiLabel}>Therapeuten actief</div></div>
            <div className={s.kpi}><div className={s.kpiValue}>{todayData.firstTime}</div><div className={s.kpiLabel}>Eerste afspraak</div></div>
            <div className={s.kpi}><div className={s.kpiValue}>{todayData.lastTime}</div><div className={s.kpiLabel}>Laatste afspraak</div></div>
          </div>
        ) : null}
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
