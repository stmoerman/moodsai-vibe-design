'use client';

import { useState, useEffect, useMemo } from 'react';
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
type AgendaType = 'alle' | 'intake' | 'behandeling' | 'workshop' | 'beschikbaar';
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

  return [
    { date: `${y}-${String(m+1).padStart(2,'0')}-02`, time: '09:00', endTime: '10:00', title: 'Intake J. de Vries', type: 'intake', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-02`, time: '11:00', endTime: '12:00', title: 'Behandeling M. Smit', type: 'behandeling', therapist: 'Kuijpers', room: 'Kamer 2' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-03`, time: '14:00', endTime: '16:00', title: 'Workshop Stressregulatie', type: 'workshop', therapist: 'Jansen', room: 'Groepsruimte' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-04`, time: '09:00', endTime: '09:30', title: 'Beschikbaar', type: 'beschikbaar', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-04`, time: '10:00', endTime: '11:00', title: 'Intake P. Bakker', type: 'intake', therapist: 'Smeets', room: 'Kamer 3' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-07`, time: '09:00', endTime: '10:00', title: 'Behandeling A. Hoekstra', type: 'behandeling', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-07`, time: '13:00', endTime: '14:00', title: 'Behandeling S. Jansen', type: 'behandeling', therapist: 'Kuijpers', room: 'Kamer 2' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-08`, time: '08:30', endTime: '09:00', title: 'Beschikbaar', type: 'beschikbaar', therapist: 'Smeets' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-08`, time: '10:00', endTime: '11:30', title: 'Intake L. Visser', type: 'intake', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-09`, time: '09:00', endTime: '10:00', title: 'Behandeling N. Mulder', type: 'behandeling', therapist: 'Jansen', room: 'Kamer 2' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-10`, time: '14:00', endTime: '16:00', title: 'Workshop Mindfulness', type: 'workshop', therapist: 'Kuijpers', room: 'Groepsruimte' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-11`, time: '09:00', endTime: '09:30', title: 'Beschikbaar', type: 'beschikbaar', therapist: 'Van den Berg' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-11`, time: '11:00', endTime: '12:00', title: 'Intake R. Hendriks', type: 'intake', therapist: 'Smeets', room: 'Kamer 3' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-14`, time: '09:00', endTime: '10:00', title: 'Behandeling M. de Vries', type: 'behandeling', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-14`, time: '10:30', endTime: '11:30', title: 'Behandeling J. Kok', type: 'behandeling', therapist: 'Kuijpers', room: 'Kamer 2' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-15`, time: '13:00', endTime: '14:00', title: 'Intake D. Meijer', type: 'intake', therapist: 'Jansen', room: 'Kamer 1' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-16`, time: '09:00', endTime: '09:30', title: 'Beschikbaar', type: 'beschikbaar', therapist: 'Kuijpers' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-17`, time: '14:00', endTime: '16:00', title: 'Workshop Slaaphygiëne', type: 'workshop', therapist: 'Van den Berg', room: 'Groepsruimte' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-18`, time: '10:00', endTime: '11:00', title: 'Behandeling K. Willems', type: 'behandeling', therapist: 'Smeets', room: 'Kamer 3' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-21`, time: '09:00', endTime: '10:00', title: 'Intake F. Bos', type: 'intake', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-22`, time: '11:00', endTime: '12:00', title: 'Behandeling T. Vos', type: 'behandeling', therapist: 'Kuijpers', room: 'Kamer 2' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-23`, time: '09:00', endTime: '09:30', title: 'Beschikbaar', type: 'beschikbaar', therapist: 'Jansen' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-24`, time: '14:00', endTime: '16:00', title: 'Workshop ACT-basis', type: 'workshop', therapist: 'Van den Berg', room: 'Groepsruimte' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-25`, time: '10:00', endTime: '11:00', title: 'Behandeling E. Brouwer', type: 'behandeling', therapist: 'Smeets', room: 'Kamer 3' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-28`, time: '09:00', endTime: '10:00', title: 'Intake W. Peters', type: 'intake', therapist: 'Van den Berg', room: 'Kamer 1' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-29`, time: '13:00', endTime: '14:00', title: 'Behandeling H. Dekker', type: 'behandeling', therapist: 'Kuijpers', room: 'Kamer 2' },
    { date: `${y}-${String(m+1).padStart(2,'0')}-30`, time: '09:00', endTime: '09:30', title: 'Beschikbaar', type: 'beschikbaar', therapist: 'Van den Berg' },
  ];
}

const AGENDA_OPTIONS: { value: AgendaType; label: string }[] = [
  { value: 'alle', label: 'Alle agenda\'s' },
  { value: 'intake', label: 'Intake' },
  { value: 'behandeling', label: 'Behandeling' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'beschikbaar', label: 'Beschikbare slots' },
];

const EVENT_COLORS: Record<AgendaType, string> = {
  alle: '#3a3a3a',
  intake: '#c47050',
  behandeling: '#c4a050',
  workshop: '#5078a0',
  beschikbaar: '#5a9a60',
};

/* ── Calendar helpers ── */
function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  // Monday = 0 in our grid
  let startDay = first.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const days: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
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

export default function AdminDashboard() {
  const { displayName } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [activeTab, setActiveTab] = useState('overzicht');

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
          <div className={s.widgetCard}>
            {/* Toolbar */}
            <div className={s.calToolbar}>
              <div className={s.calToolbarLeft}>
                <select
                  className={s.calSelect}
                  value={agendaFilter}
                  onChange={(e) => setAgendaFilter(e.target.value as AgendaType)}
                >
                  {AGENDA_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  className={s.calSelect}
                  value={calView}
                  onChange={(e) => setCalView(e.target.value as CalendarView)}
                >
                  <option value="maand">Maand</option>
                  <option value="week">Week</option>
                  <option value="dag">Dag</option>
                </select>
              </div>
              <div className={s.calToolbarCenter}>
                <button className={s.calNavBtn} onClick={calView === 'maand' ? prevMonth : calView === 'week' ? prevWeek : prevDay}>←</button>
                <span className={s.calTitle}>
                  {calView === 'maand' && `${MONTH_NAMES[calDate.getMonth()]} ${calDate.getFullYear()}`}
                  {calView === 'week' && `Week ${Math.ceil((calDate.getDate() + new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay()) / 7)} · ${MONTH_NAMES[calDate.getMonth()]} ${calDate.getFullYear()}`}
                  {calView === 'dag' && `${DAY_HEADERS[(calDate.getDay() + 6) % 7]} ${calDate.getDate()} ${MONTH_NAMES[calDate.getMonth()]}`}
                </span>
                <button className={s.calNavBtn} onClick={calView === 'maand' ? nextMonth : calView === 'week' ? nextWeek : nextDay}>→</button>
              </div>
              <div className={s.calToolbarRight}>
                <button className={s.calTodayBtn} onClick={goToday}>Vandaag</button>
              </div>
            </div>

            {/* Legend */}
            <div className={s.calLegend}>
              {AGENDA_OPTIONS.filter((o) => o.value !== 'alle').map((opt) => (
                <div key={opt.value} className={s.calLegendItem}>
                  <span className={s.calLegendDot} style={{ background: EVENT_COLORS[opt.value] }} />
                  <span className={s.calLegendLabel}>{opt.label}</span>
                </div>
              ))}
            </div>

            {/* ── Month View ── */}
            {calView === 'maand' && (
              <div className={s.calMonthGrid}>
                {DAY_HEADERS.map((d) => (
                  <div key={d} className={s.calDayHeader}>{d}</div>
                ))}
                {monthGrid.map((day, i) => {
                  const dk = day ? `${calDate.getFullYear()}-${String(calDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
                  const dayEvts = dk ? (eventsByDate[dk] ?? []) : [];
                  const isToday = dk === todayKey;
                  return (
                    <div
                      key={i}
                      className={`${s.calDayCell} ${day ? '' : s.calDayCellEmpty} ${isToday ? s.calDayCellToday : ''} ${dk === selectedDay ? s.calDayCellSelected : ''}`}
                      onClick={() => day && dk && setSelectedDay(selectedDay === dk ? null : dk)}
                    >
                      {day && <span className={s.calDayNum}>{day}</span>}
                      {dayEvts.slice(0, 3).map((ev, j) => (
                        <div
                          key={j}
                          className={s.calEventPill}
                          style={{ borderLeftColor: EVENT_COLORS[ev.type] }}
                        >
                          <span className={s.calEventTime}>{ev.time}</span>
                          <span className={s.calEventTitle}>{ev.title}</span>
                        </div>
                      ))}
                      {dayEvts.length > 3 && (
                        <div className={s.calEventMore}>+{dayEvts.length - 3} meer</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Week View ── */}
            {calView === 'week' && (
              <div className={s.calWeekGrid}>
                <div className={s.calWeekGutter} />
                {weekDates.map((wd, i) => {
                  const dk = dateKey(wd);
                  return (
                    <div key={i} className={`${s.calWeekDayHeader} ${dk === todayKey ? s.calWeekDayHeaderToday : ''}`}>
                      {DAY_HEADERS[i]} {wd.getDate()}
                    </div>
                  );
                })}
                {HOURS.map((hour) => (
                  <>
                    <div key={`g-${hour}`} className={s.calWeekGutterTime}>{String(hour).padStart(2, '0')}:00</div>
                    {weekDates.map((wd, di) => {
                      const dk = dateKey(wd);
                      const hourEvts = (eventsByDate[dk] ?? []).filter((e) => parseInt(e.time) === hour);
                      return (
                        <div key={`${hour}-${di}`} className={s.calWeekCell}>
                          {hourEvts.map((ev, j) => (
                            <div
                              key={j}
                              className={s.calWeekEvent}
                              style={{ borderLeftColor: EVENT_COLORS[ev.type] }}
                            >
                              <span className={s.calWeekEventTime}>{ev.time}–{ev.endTime}</span>
                              <span className={s.calWeekEventTitle}>{ev.title}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            )}

            {/* ── Day View ── */}
            {calView === 'dag' && (
              <div className={s.calDayView}>
                {HOURS.map((hour) => {
                  const hourEvts = dayEvents.filter((e) => parseInt(e.time) === hour);
                  return (
                    <div key={hour} className={s.calDayRow}>
                      <div className={s.calDayRowTime}>{String(hour).padStart(2, '0')}:00</div>
                      <div className={s.calDayRowContent}>
                        {hourEvts.map((ev, j) => (
                          <div
                            key={j}
                            className={s.calDayEvent}
                            style={{ borderLeftColor: EVENT_COLORS[ev.type] }}
                          >
                            <div className={s.calDayEventTime}>{ev.time} – {ev.endTime}</div>
                            <div className={s.calDayEventTitle}>{ev.title}</div>
                            <div className={s.calDayEventMeta}>{ev.therapist}{ev.room ? ` · ${ev.room}` : ''}</div>
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
              <div className={s.calDayDetail}>
                <div className={s.calDayDetailTitle}>
                  {new Date(selectedDay + 'T00:00').toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                {eventsByDate[selectedDay].map((ev, i) => (
                  <div key={i} className={s.calDayDetailItem} style={{ borderLeftColor: EVENT_COLORS[ev.type] }}>
                    <div className={s.calDayDetailItemTime}>{ev.time} – {ev.endTime}</div>
                    <div className={s.calDayDetailItemTitle}>{ev.title}</div>
                    <div className={s.calDayDetailItemMeta}>{ev.therapist}{ev.room ? ` · ${ev.room}` : ''}</div>
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
