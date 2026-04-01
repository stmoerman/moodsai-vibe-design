'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
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

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
];

const DAY_HEADERS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

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
  { icon: '→', label: 'Teamlid uitnodigen', desc: 'Uitnodiging versturen' },
  { icon: '◉', label: 'Rooster bekijken', desc: 'Weekoverzicht team' },
  { icon: '◈', label: 'Declarabiliteit', desc: 'Controle & alerts' },
  { icon: '◎', label: 'Verlofoverzicht', desc: 'Aanvragen & saldi' },
];

const navTabs = [
  { id: 'overzicht', label: 'Overzicht' },
  { id: 'planning', label: 'Planning' },
  { id: 'team', label: 'Team' },
  { id: 'hr', label: 'HR & Verlof' },
  { id: 'rapportage', label: 'Rapportage' },
];

/* ── Calendar types ── */
type AgendaType = 'alle' | 'intake' | 'behandeling' | 'workshop';
type CalendarView = 'maand' | 'week' | 'dag';

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  time: string;
  endTime: string;
  title: string;
  type: AgendaType;
  therapist: string;
  room?: string;
}

// Generate events relative to current month
function generateMockEvents(): CalendarEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const d = (day: number) => `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  return [
    { date: d(2), time: '09:00', endTime: '10:00', title: 'Intake J. de Vries', type: 'intake', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: d(2), time: '11:00', endTime: '12:00', title: 'Behandeling M. Smit', type: 'behandeling', therapist: 'Kuijpers', room: 'Kamer 2' },
    { date: d(3), time: '14:00', endTime: '16:00', title: 'Workshop Stressregulatie', type: 'workshop', therapist: 'Jansen', room: 'Groepsruimte' },
    { date: d(4), time: '10:00', endTime: '11:00', title: 'Intake P. Bakker', type: 'intake', therapist: 'Smeets', room: 'Kamer 3' },
    { date: d(7), time: '09:00', endTime: '10:00', title: 'Behandeling A. Hoekstra', type: 'behandeling', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: d(7), time: '13:00', endTime: '14:00', title: 'Behandeling S. Jansen', type: 'behandeling', therapist: 'Kuijpers', room: 'Kamer 2' },
    { date: d(8), time: '10:00', endTime: '11:30', title: 'Intake L. Visser', type: 'intake', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: d(9), time: '09:00', endTime: '10:00', title: 'Behandeling N. Mulder', type: 'behandeling', therapist: 'Jansen', room: 'Kamer 2' },
    { date: d(10), time: '14:00', endTime: '16:00', title: 'Workshop Mindfulness', type: 'workshop', therapist: 'Kuijpers', room: 'Groepsruimte' },
    { date: d(11), time: '11:00', endTime: '12:00', title: 'Intake R. Hendriks', type: 'intake', therapist: 'Smeets', room: 'Kamer 3' },
    { date: d(14), time: '09:00', endTime: '10:00', title: 'Behandeling M. de Vries', type: 'behandeling', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: d(14), time: '10:30', endTime: '11:30', title: 'Behandeling J. Kok', type: 'behandeling', therapist: 'Kuijpers', room: 'Kamer 2' },
    { date: d(15), time: '13:00', endTime: '14:00', title: 'Intake D. Meijer', type: 'intake', therapist: 'Jansen', room: 'Kamer 1' },
    { date: d(17), time: '14:00', endTime: '16:00', title: 'Workshop Slaaphygiëne', type: 'workshop', therapist: 'Van den Berg', room: 'Groepsruimte' },
    { date: d(18), time: '10:00', endTime: '11:00', title: 'Behandeling K. Willems', type: 'behandeling', therapist: 'Smeets', room: 'Kamer 3' },
    { date: d(21), time: '09:00', endTime: '10:00', title: 'Intake F. Bos', type: 'intake', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: d(22), time: '11:00', endTime: '12:00', title: 'Behandeling T. Vos', type: 'behandeling', therapist: 'Kuijpers', room: 'Kamer 2' },
    { date: d(24), time: '14:00', endTime: '16:00', title: 'Workshop ACT-basis', type: 'workshop', therapist: 'Van den Berg', room: 'Groepsruimte' },
    { date: d(25), time: '10:00', endTime: '11:00', title: 'Behandeling E. Brouwer', type: 'behandeling', therapist: 'Smeets', room: 'Kamer 3' },
    { date: d(28), time: '09:00', endTime: '10:00', title: 'Intake W. Peters', type: 'intake', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: d(29), time: '13:00', endTime: '14:00', title: 'Behandeling H. Dekker', type: 'behandeling', therapist: 'Kuijpers', room: 'Kamer 2' },
  ];
}

const AGENDA_OPTIONS: { value: AgendaType; label: string }[] = [
  { value: 'alle', label: 'Alle agenda\'s' },
  { value: 'intake', label: 'Intake' },
  { value: 'behandeling', label: 'Behandeling' },
  { value: 'workshop', label: 'Workshops' },
];

const EVENT_COLORS: Record<string, string> = {
  alle: '#3a3a3a',
  intake: '#b85c3a',
  behandeling: '#8b6d4f',
  workshop: '#4a6e8a',
};

/* ── Calendar helpers ── */
interface GridDay {
  day: number;
  current: boolean; // true = this month, false = prev/next month
}

function getMonthGrid(year: number, month: number): GridDay[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  let startDay = first.getDay() - 1; // Monday = 0
  if (startDay < 0) startDay = 6;

  const prevLast = new Date(year, month, 0).getDate();
  const days: GridDay[] = [];

  // Previous month trailing days
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ day: prevLast - i, current: false });
  }
  // Current month
  for (let d = 1; d <= last.getDate(); d++) {
    days.push({ day: d, current: true });
  }
  // Next month leading days
  let nextDay = 1;
  while (days.length % 7 !== 0) {
    days.push({ day: nextDay++, current: false });
  }
  return days;
}

function getWeekDates(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    week.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return week;
}

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 08:00 - 18:00

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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
  const activeTab = searchParams.get('tab') ?? 'overzicht';

  const setActiveTab = useCallback((tab: string) => {
    router.replace(`/admin?tab=${tab}`, { scroll: false });
  }, [router]);

  // Calendar state
  const [calView, setCalView] = useState<CalendarView>('maand');
  const [calDate, setCalDate] = useState(() => new Date());
  const [agendaFilter, setAgendaFilter] = useState<AgendaType>('alle');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [events] = useState(generateMockEvents);

  useEffect(() => {
    const now = new Date();
    setGreeting(getGreeting(now.getHours()));
    setDateStr(formatDate(now));
  }, []);

  const filteredEvents = useMemo(() => {
    if (agendaFilter === 'alle') return events;
    return events.filter((e) => e.type === agendaFilter);
  }, [events, agendaFilter]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of filteredEvents) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, [filteredEvents]);

  // Month navigation
  function prevMonth() {
    setCalDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCalDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  function prevWeek() {
    setCalDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
  }
  function nextWeek() {
    setCalDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });
  }
  function prevDay() {
    setCalDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
  }
  function nextDay() {
    setCalDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });
  }
  function goToday() {
    setCalDate(new Date());
  }

  const monthGrid = getMonthGrid(calDate.getFullYear(), calDate.getMonth());
  const weekDates = getWeekDates(calDate);
  const todayKey = dateKey(new Date());

  // Day view events
  const dayEvents = eventsByDate[dateKey(calDate)] ?? [];

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
        <span className={s.dateTime}>Admin &middot; Amsterdam &middot; {dateStr}</span>
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
        {activeTab === 'overzicht' && (
          <div className={s.grid}>
            <div className={s.widgetCard}>
              <div className={s.widgetTitle}>Teamoverzicht</div>
              <div className={s.statRow}>
                <div className={s.stat}><div className={s.statValue}>18</div><div className={s.statLabel}>Teamleden</div></div>
                <div className={s.stat}><div className={s.statValue}>3</div><div className={s.statLabel}>Recent</div></div>
                <div className={s.stat}><div className={s.statValue}>2</div><div className={s.statLabel}>Uitnodigingen</div></div>
              </div>
              <div className={`${s.sectionSub} ${s.sectionSubFirst}`}>Recent toegetreden</div>
              {recentMembers.map((m, i) => (
                <div key={i} className={s.listItem}>
                  <div className={s.listAvatar}>{m.initials}</div>
                  <div><div className={s.listName}>{m.name}</div><div className={s.listMeta}>{m.role} · {m.date}</div></div>
                </div>
              ))}
              <div className={s.sectionSub} style={{ marginTop: 12 }}>Openstaande uitnodigingen</div>
              {pendingInvites.map((inv, i) => (
                <div key={i} className={s.listItem}>
                  <div className={s.listAvatar}>{inv.initials}</div>
                  <div><div className={s.listName}>{inv.name}</div><div className={s.listMeta}>{inv.role} · Verstuurd {inv.sent}</div></div>
                  <div className={s.listSpacer} />
                  <span className={`${s.listBadge} ${s.badgePending}`}>Verstuurd</span>
                </div>
              ))}
            </div>

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

            <div className={`${s.widgetCard} ${s.gridFull}`}>
              <div className={s.widgetTitle}>Kerncijfers</div>
              <div className={s.kpiRow}>
                {kpis.map((kpi, i) => (
                  <div key={i} className={s.kpi}>
                    <div className={s.kpiValue}>{kpi.value}</div>
                    <div className={s.kpiLabel}>{kpi.label}</div>
                    <div className={`${s.kpiTrend} ${kpi.neg ? s.kpiTrendNeg : ''}`}>{kpi.trend}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${s.widgetCard} ${s.gridFull}`}>
              <div className={s.widgetTitle}>Snelkoppelingen</div>
              <div className={s.quickLinks}>
                {quickLinks.map((link, i) => (
                  <button key={i} className={s.quickLink}>
                    <span className={s.quickLinkIcon}>{link.icon}</span>
                    <div className={s.quickLinkDesc}>{link.desc}</div>
                    <div className={s.quickLinkLabel}>{link.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ Planning Tab ════ */}
        {activeTab === 'planning' && (
          <div className="bg-surface border border-border p-6">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="flex gap-1.5">
                {/* Agenda filter dropdown */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="font-mono text-[0.7rem] text-text bg-paper border border-border px-3 py-1.5 uppercase tracking-wide cursor-pointer flex items-center gap-2 hover:bg-surface-hover transition-colors">
                      {AGENDA_OPTIONS.find((o) => o.value === agendaFilter)?.label}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4l2 2 2-2" /></svg>
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-surface border border-border py-1 min-w-[160px] z-50" sideOffset={4} align="start">
                      {AGENDA_OPTIONS.map((opt) => (
                        <DropdownMenu.Item
                          key={opt.value}
                          className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-2 cursor-pointer outline-none transition-colors ${agendaFilter === opt.value ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
                          onSelect={() => setAgendaFilter(opt.value)}
                        >
                          {opt.label}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

                {/* View selector dropdown */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="font-mono text-[0.7rem] text-text bg-paper border border-border px-3 py-1.5 uppercase tracking-wide cursor-pointer flex items-center gap-2 hover:bg-surface-hover transition-colors">
                      {calView === 'maand' ? 'Maand' : calView === 'week' ? 'Week' : 'Dag'}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 4l2 2 2-2" /></svg>
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-surface border border-border py-1 min-w-[120px] z-50" sideOffset={4} align="start">
                      {(['maand', 'week', 'dag'] as CalendarView[]).map((v) => (
                        <DropdownMenu.Item
                          key={v}
                          className={`font-mono text-[0.7rem] uppercase tracking-wide px-3 py-2 cursor-pointer outline-none transition-colors ${calView === v ? 'bg-text text-paper' : 'text-text-muted hover:bg-surface-hover hover:text-text'}`}
                          onSelect={() => setCalView(v)}
                        >
                          {v === 'maand' ? 'Maand' : v === 'week' ? 'Week' : 'Dag'}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
              <div className="flex-1 flex items-center justify-center gap-3">
                <button className="font-mono text-sm text-text-muted border border-border w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-text hover:text-paper transition-colors" onClick={calView === 'maand' ? prevMonth : calView === 'week' ? prevWeek : prevDay}>←</button>
                <span className="font-display text-lg text-text min-w-[200px] text-center">
                  {calView === 'maand' && `${MONTH_NAMES[calDate.getMonth()]} ${calDate.getFullYear()}`}
                  {calView === 'week' && `Week ${Math.ceil((calDate.getDate() + new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay()) / 7)} · ${MONTH_NAMES[calDate.getMonth()]} ${calDate.getFullYear()}`}
                  {calView === 'dag' && `${DAY_HEADERS[(calDate.getDay() + 6) % 7]} ${calDate.getDate()} ${MONTH_NAMES[calDate.getMonth()]}`}
                </span>
                <button className="font-mono text-sm text-text-muted border border-border w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-text hover:text-paper transition-colors" onClick={calView === 'maand' ? nextMonth : calView === 'week' ? nextWeek : nextDay}>→</button>
              </div>
              <button className="font-mono text-[0.7rem] text-text-muted border border-border px-3.5 py-1.5 uppercase tracking-wide cursor-pointer hover:bg-text hover:text-paper transition-colors" onClick={goToday}>Vandaag</button>
            </div>

            {/* Legend */}
            <div className="flex gap-5 mb-5 flex-wrap">
              {AGENDA_OPTIONS.filter((o) => o.value !== 'alle').map((opt) => (
                <div key={opt.value} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 shrink-0" style={{ background: EVENT_COLORS[opt.value] }} />
                  <span className="font-mono text-[0.65rem] text-text-muted uppercase tracking-wide">{opt.label}</span>
                </div>
              ))}
            </div>

            {/* ── Month View ── */}
            {calView === 'maand' && (
              <div className="grid grid-cols-7">
                {DAY_HEADERS.map((d) => (
                  <div key={d} className="font-mono text-[0.7rem] text-text-muted uppercase tracking-wider text-center py-2.5">
                    {d}
                  </div>
                ))}
                {monthGrid.map((gd, i) => {
                  const dk = gd.current ? `${calDate.getFullYear()}-${String(calDate.getMonth() + 1).padStart(2, '0')}-${String(gd.day).padStart(2, '0')}` : null;
                  const dayEvts = dk ? (eventsByDate[dk] ?? []) : [];
                  const isToday = dk === todayKey;
                  const isSelected = dk === selectedDay;
                  return (
                    <div
                      key={i}
                      className={[
                        'min-h-[130px] p-2 overflow-hidden transition-colors bg-surface',
                        gd.current
                          ? 'border-t border-border-subtle/60 cursor-pointer hover:bg-surface-hover'
                          : 'opacity-40',
                        isToday && !isSelected ? 'bg-warm/5!' : '',
                        isSelected ? 'bg-warm/10! ring-1 ring-warm/40 ring-inset' : '',
                      ].join(' ')}
                      onClick={() => gd.current && dk && setSelectedDay(selectedDay === dk ? null : dk)}
                    >
                      <span className={`block font-mono text-xs mb-1.5 ${gd.current && isToday ? 'text-warm font-bold' : 'text-text'}`}>{gd.day}</span>
                      {dayEvts.slice(0, 3).map((ev, j) => (
                        <div key={j} className="flex gap-1 items-baseline py-0.5 pl-2 mb-0.5 border-l-[3px] bg-paper/60" style={{ borderLeftColor: EVENT_COLORS[ev.type] }}>
                          <span className="font-mono text-[0.6rem] text-text-faint shrink-0">{ev.time}</span>
                          <span className="font-serif text-[0.8rem] text-text truncate">{ev.title}</span>
                        </div>
                      ))}
                      {dayEvts.length > 3 && (
                        <div className="font-mono text-[0.6rem] text-text-muted pl-2 pt-0.5">+{dayEvts.length - 3} meer</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Week View ── */}
            {calView === 'week' && (
              <div className="grid grid-cols-[60px_repeat(7,1fr)]">
                <div className="border-b border-border-subtle bg-paper" />
                {weekDates.map((wd, i) => {
                  const dk = dateKey(wd);
                  return (
                    <div key={i} className={`font-mono text-[0.7rem] uppercase tracking-wide text-center py-2.5 border-b border-border-subtle ${dk === todayKey ? 'bg-[#f5edd8] text-text font-bold' : 'text-text-muted'}`}>
                      {DAY_HEADERS[i]} {wd.getDate()}
                    </div>
                  );
                })}
                {HOURS.map((hour) => (
                  <div key={`row-${hour}`} className="contents">
                    <div className="font-mono text-[0.65rem] text-text-faint px-2 py-2 text-right border-r border-border-subtle border-b border-b-border-subtle/50">{String(hour).padStart(2, '0')}:00</div>
                    {weekDates.map((wd, di) => {
                      const dk = dateKey(wd);
                      const hourEvts = (eventsByDate[dk] ?? []).filter((e) => parseInt(e.time) === hour);
                      return (
                        <div key={`${hour}-${di}`} className="min-h-[52px] p-1 border-r border-b border-border-subtle/50">
                          {hourEvts.map((ev, j) => (
                            <div key={j} className="py-1 px-2 mb-0.5 border-l-[3px] bg-paper/60" style={{ borderLeftColor: EVENT_COLORS[ev.type] }}>
                              <span className="block font-mono text-[0.6rem] text-text-faint">{ev.time}–{ev.endTime}</span>
                              <span className="block font-serif text-[0.8rem] text-text truncate">{ev.title}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* ── Day View ── */}
            {calView === 'dag' && (
              <div>
                {HOURS.map((hour) => {
                  const hourEvts = dayEvents.filter((e) => parseInt(e.time) === hour);
                  return (
                    <div key={hour} className="flex border-b border-border-subtle/50 min-h-[56px]">
                      <div className="w-[70px] shrink-0 font-mono text-[0.65rem] text-text-faint py-2.5 px-2.5 text-right border-r border-border-subtle">{String(hour).padStart(2, '0')}:00</div>
                      <div className="flex-1 p-1.5 flex flex-col gap-1">
                        {hourEvts.map((ev, j) => (
                          <div key={j} className="py-2.5 px-3.5 border-l-[3px] bg-paper/60" style={{ borderLeftColor: EVENT_COLORS[ev.type] }}>
                            <div className="font-mono text-[0.65rem] text-text-muted">{ev.time} – {ev.endTime}</div>
                            <div className="font-serif text-[0.95rem] text-text mt-0.5">{ev.title}</div>
                            <div className="font-mono text-[0.65rem] text-text-faint mt-0.5">{ev.therapist}{ev.room ? ` · ${ev.room}` : ''}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Selected day detail (month view) */}
            {calView === 'maand' && selectedDay && eventsByDate[selectedDay] && (
              <div className="mt-5 pt-5 border-t border-border">
                <div className="font-display text-lg text-text mb-3 capitalize">
                  {new Date(selectedDay + 'T00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                {eventsByDate[selectedDay].map((ev, i) => (
                  <div key={i} className="py-2.5 px-3.5 border-l-[3px] bg-paper mb-1.5" style={{ borderLeftColor: EVENT_COLORS[ev.type] }}>
                    <div className="font-mono text-[0.65rem] text-text-muted">{ev.time} – {ev.endTime}</div>
                    <div className="font-serif text-[0.95rem] text-text mt-0.5">{ev.title}</div>
                    <div className="font-mono text-[0.65rem] text-text-faint mt-0.5">{ev.therapist}{ev.room ? ` · ${ev.room}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
