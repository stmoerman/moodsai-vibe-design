'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

type AppointmentStatus = 'confirmed' | 'pending' | 'available' | 'break';

interface Appointment {
  time: string;
  endTime: string;
  durationMin: number;
  client: string;
  type: string;
  status: AppointmentStatus;
}

const schedule: Appointment[] = [
  { time: '08:00', endTime: '09:00', durationMin: 60, client: '',                    type: 'Beschikbaar',          status: 'available' },
  { time: '09:00', endTime: '10:00', durationMin: 60, client: 'M. de Vries',         type: 'Behandeling (ZPM)',    status: 'confirmed' },
  { time: '09:30', endTime: '10:30', durationMin: 60, client: 'S. Jansen',           type: 'Behandeling (ZPM)',    status: 'confirmed' },
  { time: '10:30', endTime: '12:00', durationMin: 90, client: 'Workshop Stressregulatie', type: '8 deelnemers',    status: 'confirmed' },
  { time: '12:00', endTime: '12:30', durationMin: 30, client: '',                    type: 'Beschikbaar',          status: 'available' },
  { time: '12:30', endTime: '13:00', durationMin: 30, client: 'M.D. Kemme',          type: 'Behandeling (ZPM)',    status: 'confirmed' },
  { time: '13:00', endTime: '13:30', durationMin: 30, client: '',                    type: 'Pauze',                status: 'break' },
  { time: '13:30', endTime: '14:30', durationMin: 60, client: 'A. Hoekstra',         type: 'Intake',               status: 'pending' },
  { time: '14:30', endTime: '15:30', durationMin: 60, client: 'J. Bakker',           type: 'Vervolgconsult',       status: 'confirmed' },
  { time: '15:30', endTime: '16:00', durationMin: 30, client: '',                    type: 'Beschikbaar',          status: 'available' },
  { time: '16:00', endTime: '17:00', durationMin: 60, client: '',                    type: 'Beschikbaar',          status: 'available' },
  { time: '17:00', endTime: '18:00', durationMin: 60, client: '',                    type: 'Beschikbaar',          status: 'available' },
];

const appointmentDetails: Record<string, {
  fullName: string;
  initials: string;
  location: string;
  lastSession: string;
  notes: string;
}> = {
  'M. de Vries': {
    fullName: 'Maria de Vries',
    initials: 'MV',
    location: 'Kamer 3',
    lastSession: '18 maart 2026',
    notes: 'GAD-7 gedaald van 12 naar 8. Behandelplan loopt goed.',
  },
  'M.D. Kemme': {
    fullName: 'Marcus D. Kemme',
    initials: 'MK',
    location: 'Kamer 1',
    lastSession: '20 maart 2026',
    notes: 'PHQ-9: stabiel op 6. Volgende sessie: cognitieve herstructurering.',
  },
  'A. Hoekstra': {
    fullName: 'Anna Hoekstra',
    initials: 'AH',
    location: 'Online (video)',
    lastSession: 'Eerste intake',
    notes: 'Verwezen door huisarts. Klachten: angst en slapeloosheid.',
  },
  'J. Bakker': {
    fullName: 'Jan Bakker',
    initials: 'JB',
    location: 'Kamer 2',
    lastSession: '21 maart 2026',
    notes: 'EMDR fase 3 gestart. Goede voortgang.',
  },
  'S. Jansen': {
    fullName: 'Sophie Jansen',
    initials: 'SJ',
    location: 'Kamer 3',
    lastSession: '19 maart 2026',
    notes: 'CGT fase 2. Huiswerkopdrachten besproken.',
  },
};

const recentNotes = [
  { text: 'M. de Vries — Sessienotitie', time: 'gisteren' },
  { text: 'M.D. Kemme — Behandelplan', time: '2d geleden' },
  { text: 'Workshop — Samenvatting', time: '3d geleden' },
];

const messages = [
  { name: 'M. de Vries', preview: 'Bedankt voor de sessie', time: '10m' },
  { name: 'A. Hoekstra', preview: 'Ik heb de vragenlijst ingevuld', time: '2u' },
  { name: 'J. Bakker', preview: 'Kan ik de afspraak verzetten?', time: '3u' },
  { name: 'M.D. Kemme', preview: 'Heb je het verslag al gezien?', time: '5u' },
  { name: 'S. Jansen', preview: 'Tot volgende week', time: '1d' },
  { name: 'Dr. van Dijk', preview: 'Overleg over casus Hoekstra', time: '1d' },
  { name: 'T. van Berg', preview: 'Ik voel me veel beter', time: '2d' },
];

const navTabs = [
  { label: 'Agenda', id: 'agenda' },
  { label: 'Teamchats', id: 'teamchats' },
  { label: 'Directe Tijd', id: 'directe-tijd' },
  { label: 'Mijn Cliënten', id: 'clienten' },
  { label: 'Cliënt Chat', id: 'client-chat' },
];

const mockDates = ['Di 24 maart', 'Wo 25 maart', 'Do 26 maart'];
const mockWeeks = ['Week 12 · 17–21 mrt', 'Week 13 · 24–28 mrt', 'Week 14 · 31 mrt–4 apr'];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function parseHour(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

const weekSchedule: Record<string, Appointment[]> = {
  'Ma': [
    { time: '09:00', endTime: '10:00', durationMin: 60, client: 'S. Jansen', type: 'Behandeling', status: 'confirmed' },
    { time: '11:00', endTime: '12:00', durationMin: 60, client: 'T. van Berg', type: 'Intake', status: 'confirmed' },
    { time: '14:00', endTime: '15:00', durationMin: 60, client: 'M. de Vries', type: 'Vervolgconsult', status: 'confirmed' },
  ],
  'Di': [
    { time: '08:30', endTime: '09:30', durationMin: 60, client: 'J. Bakker', type: 'Behandeling', status: 'confirmed' },
    { time: '10:00', endTime: '11:30', durationMin: 90, client: 'Workshop ACT', type: '6 deelnemers', status: 'confirmed' },
    { time: '13:00', endTime: '14:00', durationMin: 60, client: 'A. Hoekstra', type: 'Behandeling', status: 'confirmed' },
    { time: '15:00', endTime: '16:00', durationMin: 60, client: 'M.D. Kemme', type: 'Behandeling', status: 'pending' },
  ],
  'Wo': [], // Will use the existing `schedule` array
  'Do': [
    { time: '09:00', endTime: '10:00', durationMin: 60, client: 'M. de Vries', type: 'Behandeling', status: 'confirmed' },
    { time: '10:30', endTime: '11:30', durationMin: 60, client: 'S. Jansen', type: 'Behandeling', status: 'confirmed' },
    { time: '13:30', endTime: '14:30', durationMin: 60, client: 'M.D. Kemme', type: 'Diagnostiek', status: 'confirmed' },
  ],
  'Vr': [
    { time: '09:00', endTime: '09:30', durationMin: 30, client: '', type: 'Administratietijd', status: 'break' },
    { time: '09:30', endTime: '10:30', durationMin: 60, client: 'J. Bakker', type: 'Behandeling', status: 'confirmed' },
    { time: '11:00', endTime: '12:00', durationMin: 60, client: 'T. van Berg', type: 'Vervolgconsult', status: 'confirmed' },
  ],
};

const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr'] as const;
const weekDates = ['Ma 24', 'Di 25', 'Wo 26', 'Do 27', 'Vr 28'];

export default function DashboardExample() {
  const [now, setNow] = useState<Date | null>(null);
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);
  const [selectedWeekApt, setSelectedWeekApt] = useState<{ day: string; idx: number } | null>(null);
  const [dateIndex, setDateIndex] = useState(1);
  const [weekIndex, setWeekIndex] = useState(1);
  const [viewMode, setViewMode] = useState<'dag' | 'week'>('dag');
  const [isAgendaExpanded, setIsAgendaExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda');
  const [textSize, setTextSize] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setNow(new Date());
  }, []);

  // Close dialogs on Escape
  useEffect(() => {
    if (expandedAppointment === null && selectedWeekApt === null && !isAgendaExpanded) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedAppointment(null);
        setSelectedWeekApt(null);
        setIsAgendaExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expandedAppointment, selectedWeekApt, isAgendaExpanded]);

  const greeting = now ? getGreeting(now.getHours()) : 'Goedemorgen';
  const dateStr = now ? formatDate(now) : '';
  const currentHour = now ? now.getHours() + now.getMinutes() / 60 : 10.5;

  // Calculate "now" line position as percentage of the timeline (08:00 - 18:00)
  const nowPct = Math.max(0, Math.min(100, ((currentHour - 8) / 10) * 100));
  const showNowLine = currentHour >= 8 && currentHour <= 18;

  const handlePrev = () => {
    if (viewMode === 'dag') setDateIndex((i) => Math.max(0, i - 1));
    else setWeekIndex((i) => Math.max(0, i - 1));
  };
  const handleNext = () => {
    if (viewMode === 'dag') setDateIndex((i) => Math.min(mockDates.length - 1, i + 1));
    else setWeekIndex((i) => Math.min(mockWeeks.length - 1, i + 1));
  };
  const handleToday = () => {
    setDateIndex(1);
    setWeekIndex(1);
  };
  const navLabel = viewMode === 'dag' ? mockDates[dateIndex] : mockWeeks[weekIndex];
  const isPrevDisabled = viewMode === 'dag' ? dateIndex === 0 : weekIndex === 0;
  const isNextDisabled = viewMode === 'dag' ? dateIndex === mockDates.length - 1 : weekIndex === mockWeeks.length - 1;

  const toggleExpand = (idx: number) => {
    setExpandedAppointment((prev) => (prev === idx ? null : idx));
  };

  const getWeekDaySchedule = (day: string): Appointment[] => {
    if (day === 'Wo') return schedule;
    return weekSchedule[day] || [];
  };

  const handleWeekAptClick = (day: string, idx: number, apt: Appointment) => {
    const isAppointment = apt.status === 'confirmed' || apt.status === 'pending';
    if (!isAppointment) return;
    setSelectedWeekApt({ day, idx });
  };

  // Resolve selected week appointment for dialog
  const selectedWeekAptData = selectedWeekApt
    ? (() => {
        const daySchedule = getWeekDaySchedule(selectedWeekApt.day);
        const apt = daySchedule[selectedWeekApt.idx];
        const details = apt?.client ? appointmentDetails[apt.client] : null;
        return apt && details ? { apt, details } : null;
      })()
    : null;

  // Renders the agenda content (used both inline and in expanded dialog)
  const renderAgendaContent = (inExpandedDialog: boolean) => (
    <>
      {/* Agenda Header */}
      <div className={s.agendaHeader}>
        <div className={s.agendaNav}>
          <button className={s.agendaNavBtn} onClick={handlePrev} disabled={isPrevDisabled}>&lt;</button>
          <button className={s.agendaTodayBtn} onClick={handleToday}>Vandaag</button>
          <button className={s.agendaNavBtn} onClick={handleNext} disabled={isNextDisabled}>&gt;</button>
          <span className={s.agendaDateLabel}>{navLabel}</span>
        </div>
        <div className={s.agendaHeaderRight}>
          <div className={s.togglePills}>
            <button
              className={`${s.togglePill} ${viewMode === 'dag' ? s.togglePillActive : ''}`}
              onClick={() => setViewMode('dag')}
            >
              Dag
            </button>
            <button
              className={`${s.togglePill} ${viewMode === 'week' ? s.togglePillActive : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
          </div>
          {inExpandedDialog ? (
            <button className={s.expandBtn} onClick={() => setIsAgendaExpanded(false)} title="Sluiten">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="12" y2="12" />
                <line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
          ) : (
            <button className={s.expandBtn} onClick={() => setIsAgendaExpanded(true)} title="Volledig scherm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Day View */}
      {viewMode === 'dag' && (
        <div className={s.timeline}>
          <div className={s.timelineGutter}>
            {timeSlots.map((t) => (
              <div key={t} className={s.timelineGutterSlot}>
                <span className={s.timelineGutterTime}>{t}</span>
              </div>
            ))}
          </div>
          <div className={s.timelineBody}>
            <div className={s.timelineVerticalLine} />
            {showNowLine && dateIndex === 1 && (
              <div className={s.nowMarker} style={{ top: `${nowPct}%` }}>
                <div className={s.nowDot} />
                <div className={s.nowLine} />
              </div>
            )}
            {schedule.map((apt, i) => {
              const topPct = ((parseHour(apt.time) - 8) / 10) * 100;
              const heightPct = (apt.durationMin / 600) * 100;
              const isAppointment = apt.status === 'confirmed' || apt.status === 'pending';
              return (
                <div
                  key={i}
                  className={[
                    s.aptBlock,
                    apt.status === 'confirmed' ? s.aptConfirmed : '',
                    apt.status === 'pending' ? s.aptPending : '',
                    apt.status === 'available' ? s.aptAvailable : '',
                    apt.status === 'break' ? s.aptBreak : '',
                  ].filter(Boolean).join(' ')}
                  style={{
                    top: `${topPct}%`,
                    height: `${heightPct}%`,
                    animationDelay: `${i * 0.03}s`,
                  }}
                  onClick={isAppointment ? () => toggleExpand(i) : undefined}
                >
                  <div className={s.aptCollapsed}>
                    <span className={s.aptClient}>
                      {isAppointment ? apt.client : apt.type}
                    </span>
                    <span className={s.aptMeta}>
                      {isAppointment && `${apt.type} — ${apt.durationMin} min`}
                      {apt.status === 'break' && `${apt.durationMin} min`}
                      {apt.status === 'available' && 'Beschikbaar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className={s.weekTimeline}>
          {/* Time gutter */}
          <div className={s.weekGutter}>
            <div className={s.weekGutterHeader} />
            <div className={s.weekGutterSlots}>
              {timeSlots.map((t) => (
                <div key={t} className={s.timelineGutterSlot}>
                  <span className={s.timelineGutterTime}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Day columns */}
          {weekDays.map((day, di) => {
            const dayScheduleItems = getWeekDaySchedule(day);
            const isToday = day === 'Wo';
            return (
              <div key={day} className={s.weekDayCol}>
                <div className={`${s.weekDayHeader} ${isToday ? s.weekDayHeaderActive : ''}`}>
                  {weekDates[di]}
                </div>
                <div className={`${s.weekDayBody} ${isToday ? s.weekDayBodyActive : ''}`}>
                  {/* Now marker for current day */}
                  {isToday && showNowLine && dateIndex === 1 && (
                    <div className={s.nowMarker} style={{ top: `${nowPct}%` }}>
                      <div className={s.nowDot} />
                      <div className={s.nowLine} />
                    </div>
                  )}
                  {dayScheduleItems.map((apt, i) => {
                    const topPct = ((parseHour(apt.time) - 8) / 10) * 100;
                    const heightPct = (apt.durationMin / 600) * 100;
                    const isAppointment = apt.status === 'confirmed' || apt.status === 'pending';
                    return (
                      <div
                        key={i}
                        className={[
                          s.weekAptBlock,
                          apt.status === 'confirmed' ? s.aptConfirmed : '',
                          apt.status === 'pending' ? s.aptPending : '',
                          apt.status === 'available' ? s.aptAvailable : '',
                          apt.status === 'break' ? s.aptBreak : '',
                        ].filter(Boolean).join(' ')}
                        style={{
                          top: `${topPct}%`,
                          height: `${heightPct}%`,
                        }}
                        onClick={isAppointment ? () => handleWeekAptClick(day, i, apt) : undefined}
                      >
                        <span className={s.weekAptClient}>
                          {isAppointment ? apt.client : apt.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <div className={`${s.root} ${darkMode ? s.darkTheme : ''} ${textSize !== 0 ? s[`size${textSize > 0 ? 'Up' : 'Down'}${Math.abs(textSize)}`] || '' : ''}`}>
      <div className={s.dotGrid} aria-hidden="true" />

      {/* Top Bar */}
      <header className={s.topBar}>
        <Link href="/" className={s.logo}>
          <Image src="/images/logo.png" alt="Oh My Mood" width={120} height={32} className={s.logoImg} />
        </Link>
        <div className={s.topBarRight}>
          <div className={s.sizeControls}>
            <button className={s.sizeBtn} onClick={() => setTextSize((v) => Math.max(-2, v - 1))} disabled={textSize <= -2} title="Kleiner">A<span className={s.sizeBtnMinus}>−</span></button>
            <button className={s.sizeBtn} onClick={() => setTextSize((v) => Math.min(2, v + 1))} disabled={textSize >= 2} title="Groter">A<span className={s.sizeBtnPlus}>+</span></button>
          </div>
          <button
            className={`${s.themeToggle} ${darkMode ? s.themeToggleActive : ''}`}
            onClick={() => setDarkMode((v) => !v)}
            title={darkMode ? 'Licht thema' : 'Donker thema'}
          >
            {darkMode ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="8" cy="8" r="3.5" />
                <line x1="8" y1="1" x2="8" y2="3" />
                <line x1="8" y1="13" x2="8" y2="15" />
                <line x1="1" y1="8" x2="3" y2="8" />
                <line x1="13" y1="8" x2="15" y2="8" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M13.5 8.5a5.5 5.5 0 1 1-7-7 4.5 4.5 0 0 0 7 7z" />
              </svg>
            )}
          </button>
          <span className={s.userName}>Amsterdam</span>
          <div className={s.avatar}>JS</div>
        </div>
      </header>

      {/* Welcome */}
      <div className={s.welcomeHero}>
        <h1 className={s.greeting}>{greeting}, Jaime</h1>
        <svg className={s.greetingUnderline} width="280" height="12" viewBox="0 0 280 12" aria-hidden="true">
          <path
            d="M0,6 C23,1 46,11 70,5 C93,0 116,10 140,4 C163,-1 186,9 210,5 C233,1 256,9 280,6"
            className={s.greetingUnderlinePath}
          />
        </svg>
        <span className={s.dateTime}>Therapeut &middot; Amsterdam &middot; {dateStr}</span>
      </div>

      {/* Navigation Tabs */}
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

      {/* Tab: Teamchats */}
      {activeTab === 'teamchats' && (
        <div className={s.teamchatsView}>
          <div className={s.teamchatsSidebar}>
            <button className={s.teamchatNewBtn}>+ Nieuw gesprek</button>
            <div className={s.teamchatSearch}>
              <input type="text" placeholder="Zoek gesprek..." className={s.teamchatSearchInput} readOnly />
            </div>
            {[
              { name: '# Algemeen', preview: 'Dr. van Dijk: Wie kan morgen de 14:00 overnemen?', time: '5m', unread: 2 },
              { name: '# Klinisch overleg', preview: 'S. Jansen: Nieuwe richtlijn bijgevoegd', time: '1u', unread: 0 },
              { name: '# Rooster', preview: 'Jaime: Ik ben er vrijdag niet', time: '3u', unread: 0 },
              { name: 'Dr. van Dijk', preview: 'Heb je de verwijsbrief gezien?', time: '20m', unread: 1 },
              { name: 'S. Jansen', preview: 'Bedankt voor de workshop tips!', time: '2u', unread: 0 },
              { name: 'M. de Groot', preview: 'Vergadering verzet naar 15:00', time: '4u', unread: 0 },
              { name: '# Admin', preview: 'Systeem update gepland voor zondag', time: '1d', unread: 0 },
            ].map((chat, i) => (
              <div key={i} className={`${s.teamchatItem} ${i === 0 ? s.teamchatItemActive : ''}`}>
                <div className={s.teamchatItemTop}>
                  <span className={s.teamchatItemName}>{chat.name}</span>
                  <span className={s.teamchatItemTime}>{chat.time}</span>
                </div>
                <div className={s.teamchatItemPreview}>
                  {chat.preview}
                  {chat.unread > 0 && <span className={s.teamchatUnread}>{chat.unread}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className={s.teamchatMain}>
            <div className={s.teamchatHeader}>
              <span className={s.teamchatChannelName}># Algemeen</span>
              <span className={s.teamchatChannelMeta}>8 leden</span>
            </div>
            <div className={s.teamchatMessages}>
              {[
                { author: 'Dr. van Dijk', initials: 'VD', time: '14:32', text: 'Wie kan morgen de 14:00 slot overnemen? Ik heb een spoedafspraak.' },
                { author: 'S. Jansen', initials: 'SJ', time: '14:35', text: 'Ik kan dat doen, heb nog ruimte.' },
                { author: 'Jaime', initials: 'JS', time: '14:36', text: 'Top, bedankt Sophie! Ik update de agenda.' },
                { author: 'Dr. van Dijk', initials: 'VD', time: '14:38', text: 'Fijn, het gaat om een cliënt van mij — M. Bakker. Dossier staat klaar.' },
                { author: 'M. de Groot', initials: 'MG', time: '14:45', text: 'Vergeet niet dat we morgen ook teamoverleg hebben om 16:00.' },
              ].map((msg, i) => (
                <div key={i} className={s.teamchatMsg}>
                  <div className={s.teamchatMsgAvatar}>{msg.initials}</div>
                  <div className={s.teamchatMsgBody}>
                    <div className={s.teamchatMsgTop}>
                      <span className={s.teamchatMsgAuthor}>{msg.author}</span>
                      <span className={s.teamchatMsgTime}>{msg.time}</span>
                    </div>
                    <p className={s.teamchatMsgText}>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={s.teamchatInputRow}>
              <div className={s.teamchatInputActions}>
                <button className={s.teamchatInputAction} title="Bijlage">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M7 1v8M3 5l4-4 4 4" />
                  </svg>
                </button>
                <button className={s.teamchatInputAction} title="Audio opname">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="5" y="1" width="4" height="7" rx="2" />
                    <path d="M3 7a4 4 0 0 0 8 0M7 11v2" />
                  </svg>
                </button>
              </div>
              <input type="text" placeholder="Bericht naar # Algemeen..." className={s.teamchatInputField} readOnly />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Directe Tijd */}
      {activeTab === 'directe-tijd' && (
        <div className={s.tabContent}>
          <div className={s.tabContentHeader}>
            <h2 className={s.tabContentTitle}>Directe tijd</h2>
            <span className={s.tabContentMeta}>Week 13 · 24–28 maart 2026</span>
          </div>
          <div className={s.directeTijdGrid}>
            <div className={s.directeTijdCard}>
              <div className={s.statLabel}>Directe uren deze week</div>
              <div className={s.statValue}>19,0</div>
              <div className={s.statSub}>van 23,4 uur target</div>
            </div>
            <div className={s.directeTijdCard}>
              <div className={s.statLabel}>Declarabiliteit</div>
              <div className={s.statValue}>81%</div>
              <div className={s.statSub}>Target: 80%</div>
            </div>
            <div className={s.directeTijdCard}>
              <div className={s.statLabel}>Indirecte uren</div>
              <div className={s.statValue}>4,4</div>
              <div className={s.statSub}>Administratie, overleg</div>
            </div>
          </div>
          <div className={s.directeTijdTable}>
            <div className={s.dtRow}>
              <span className={s.dtDay}>Maandag</span>
              <span className={s.dtHours}>4,0 uur</span>
              <span className={s.dtBar}><span className={s.dtBarFill} style={{ width: '80%' }} /></span>
            </div>
            <div className={s.dtRow}>
              <span className={s.dtDay}>Dinsdag</span>
              <span className={s.dtHours}>5,0 uur</span>
              <span className={s.dtBar}><span className={s.dtBarFill} style={{ width: '100%' }} /></span>
            </div>
            <div className={s.dtRow}>
              <span className={s.dtDay}>Woensdag</span>
              <span className={s.dtHours}>4,5 uur</span>
              <span className={s.dtBar}><span className={s.dtBarFill} style={{ width: '90%' }} /></span>
            </div>
            <div className={s.dtRow}>
              <span className={s.dtDay}>Donderdag</span>
              <span className={s.dtHours}>3,5 uur</span>
              <span className={s.dtBar}><span className={s.dtBarFill} style={{ width: '70%' }} /></span>
            </div>
            <div className={s.dtRow}>
              <span className={s.dtDay}>Vrijdag</span>
              <span className={s.dtHours}>2,0 uur</span>
              <span className={s.dtBar}><span className={s.dtBarFill} style={{ width: '40%' }} /></span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Mijn Cliënten */}
      {activeTab === 'clienten' && (
        <div className={s.tabContent}>
          <div className={s.tabContentHeader}>
            <h2 className={s.tabContentTitle}>Mijn cli&euml;nten</h2>
            <span className={s.tabContentMeta}>12 actieve cli&euml;nten</span>
          </div>
          <div className={s.clientList}>
            {[
              { name: 'Maria de Vries', code: 'MV', status: 'In behandeling', since: 'jan 2026', next: 'Wo 26 mrt · 09:00' },
              { name: 'Marcus D. Kemme', code: 'MK', status: 'In behandeling', since: 'feb 2026', next: 'Wo 26 mrt · 09:30' },
              { name: 'Anna Hoekstra', code: 'AH', status: 'Intake gepland', since: 'mrt 2026', next: 'Wo 26 mrt · 13:30' },
              { name: 'Jan Bakker', code: 'JB', status: 'In behandeling', since: 'dec 2025', next: 'Wo 26 mrt · 14:30' },
              { name: 'Sophie Jansen', code: 'SJ', status: 'In behandeling', since: 'nov 2025', next: 'Do 27 mrt · 10:30' },
              { name: 'Thijs van Berg', code: 'TB', status: 'Afronding', since: 'sep 2025', next: 'Vr 28 mrt · 11:00' },
            ].map((client, i) => (
              <div key={i} className={s.clientRow}>
                <div className={s.clientAvatar}>{client.code}</div>
                <div className={s.clientInfo}>
                  <span className={s.clientName}>{client.name}</span>
                  <span className={s.clientMeta}>{client.status} &middot; sinds {client.since}</span>
                </div>
                <div className={s.clientNext}>
                  <span className={s.clientNextLabel}>Volgende afspraak</span>
                  <span className={s.clientNextValue}>{client.next}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Cliënt Chat */}
      {activeTab === 'client-chat' && (
        <div className={s.teamchatsView}>
          <div className={s.teamchatsSidebar}>
            <button className={s.teamchatNewBtn}>+ Nieuw gesprek</button>
            <div className={s.teamchatSearch}>
              <input type="text" placeholder="Zoek cli&euml;nt..." className={s.teamchatSearchInput} readOnly />
            </div>
            {[
              { name: 'M. de Vries', preview: 'Bedankt voor de sessie', time: '10m', unread: 1 },
              { name: 'A. Hoekstra', preview: 'Ik heb de vragenlijst ingevuld', time: '2u', unread: 1 },
              { name: 'J. Bakker', preview: 'Kan ik de afspraak verzetten?', time: '3u', unread: 0 },
              { name: 'M.D. Kemme', preview: 'Heb je het verslag al gezien?', time: '5u', unread: 0 },
              { name: 'T. van Berg', preview: 'Ik voel me veel beter', time: '2d', unread: 0 },
            ].map((chat, i) => (
              <div key={i} className={`${s.teamchatItem} ${i === 0 ? s.teamchatItemActive : ''}`}>
                <div className={s.teamchatItemTop}>
                  <span className={s.teamchatItemName}>{chat.name}</span>
                  <span className={s.teamchatItemTime}>{chat.time}</span>
                </div>
                <div className={s.teamchatItemPreview}>
                  {chat.preview}
                  {chat.unread > 0 && <span className={s.teamchatUnread}>{chat.unread}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className={s.teamchatMain}>
            <div className={s.teamchatHeader}>
              <span className={s.teamchatChannelName}>M. de Vries</span>
              <span className={s.teamchatChannelMeta}>Beveiligde zorgchat</span>
            </div>
            <div className={s.teamchatMessages}>
              {[
                { author: 'M. de Vries', initials: 'MV', time: '14:20', text: 'Bedankt voor de sessie van vandaag. Ik ga de oefeningen proberen.' },
                { author: 'Jaime', initials: 'JS', time: '14:25', text: 'Graag gedaan! Probeer de ademhalingsoefening twee keer per dag. Laat weten hoe het gaat.' },
                { author: 'M. de Vries', initials: 'MV', time: '14:28', text: 'Zal ik doen. Moet ik de vragenlijst ook nog invullen voor volgende week?' },
                { author: 'Jaime', initials: 'JS', time: '14:30', text: 'Ja, die krijg je automatisch per email. Vul hem in voor onze volgende sessie.' },
              ].map((msg, i) => (
                <div key={i} className={s.teamchatMsg}>
                  <div className={s.teamchatMsgAvatar}>{msg.initials}</div>
                  <div className={s.teamchatMsgBody}>
                    <div className={s.teamchatMsgTop}>
                      <span className={s.teamchatMsgAuthor}>{msg.author}</span>
                      <span className={s.teamchatMsgTime}>{msg.time}</span>
                    </div>
                    <p className={s.teamchatMsgText}>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={s.teamchatInputRow}>
              <div className={s.teamchatInputActions}>
                <button className={s.teamchatInputAction} title="Bijlage">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M7 1v8M3 5l4-4 4 4" />
                  </svg>
                </button>
                <button className={s.teamchatInputAction} title="Audio opname">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="5" y="1" width="4" height="7" rx="2" />
                    <path d="M3 7a4 4 0 0 0 8 0M7 11v2" />
                  </svg>
                </button>
              </div>
              <input type="text" placeholder="Bericht naar M. de Vries..." className={s.teamchatInputField} readOnly />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Agenda — Main 3-Column Grid */}
      {activeTab === 'agenda' && <main className={s.mainGrid}>

        {/* Left Column — Key Stats */}
        <div className={s.leftCol}>
          <div className={s.statBlock}>
            <div className={s.statLabel}>Cli&euml;nten vandaag</div>
            <div className={s.statValue}>6</div>
            <div className={s.statSub}>2 in afwachting</div>
          </div>
          <div className={s.statBlock}>
            <div className={s.statLabel}>Declarabiliteit</div>
            <div className={s.statValue}>81%</div>
            <div className={s.statSub}>19,0 / 23,4 uur deze week</div>
          </div>
          <div className={s.statBlock}>
            <div className={s.statLabel}>Ongelezen</div>
            <div className={s.statValue}>3</div>
            <div className={s.statSub}>2 chats, 1 rapport</div>
          </div>

          <section className={s.messagesSection}>
            <div className={s.messagesHeader}>
              <h3 className={s.sectionHeading}>Berichten</h3>
              <span className={s.messageBadge}>{messages.length}</span>
            </div>
            <div className={s.messagesScroll}>
              {messages.map((msg, i) => (
                <div key={i} className={s.messageRow}>
                  <span className={s.messageName}>{msg.name}</span>
                  <span className={s.messagePreview}>{msg.preview}</span>
                  <span className={s.messageTime}>{msg.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Center Column — Interactive Agenda */}
        <div className={s.centerCol}>
          <section className={s.agendaSection}>
            {renderAgendaContent(false)}
          </section>
        </div>

        {/* Right Column — Context */}
        <div className={s.rightCol}>
          <section className={s.askMoody}>
            <div className={s.askMoodyHeader}>
              <span className={s.askMoodyLabel}>ASKMOODY</span>
              <span className={s.askMoodyDot} />
            </div>
            <div className={s.askMoodyBody}>
              <p className={s.askMoodyMsg}>
                Je hebt 6 sessies vandaag. M.&nbsp;de&nbsp;Vries scoorde lager op de GAD-7 vorige sessie.
              </p>
            </div>
            <input
              type="text"
              className={s.askMoodyInput}
              placeholder="Stel een vraag..."
              readOnly
            />
          </section>

          <section className={s.notesSection}>
            <h3 className={s.sectionHeading}>Recente verslagen</h3>
            {recentNotes.map((note, i) => (
              <div key={i} className={s.noteRow}>
                <span className={s.noteText}>{note.text}</span>
                <span className={s.noteTime}>{note.time}</span>
              </div>
            ))}
          </section>

          <a href="#" target="_blank" rel="noopener noreferrer" className={s.roomLinkCard}>
            Mijn kamer
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 1.5H2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V7.5" />
              <path d="M7 1.5h3.5V5" />
              <path d="M5 7L10.5 1.5" />
            </svg>
          </a>

        </div>
      </main>}

      {/* Mobile-only: Berichten below agenda */}
      {activeTab === 'agenda' && (
        <div className={s.mobileBerichtenWrap}>
          <section className={s.messagesSection}>
            <div className={s.messagesHeader}>
              <h3 className={s.sectionHeading}>Berichten</h3>
              <span className={s.messageBadge}>{messages.length}</span>
            </div>
            <div className={s.messagesScroll}>
              {messages.map((msg, i) => (
                <div key={i} className={s.messageRow}>
                  <span className={s.messageName}>{msg.name}</span>
                  <span className={s.messagePreview}>{msg.preview}</span>
                  <span className={s.messageTime}>{msg.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Appointment Dialog */}
      {expandedAppointment !== null && (() => {
        const apt = schedule[expandedAppointment];
        const details = apt.client ? appointmentDetails[apt.client] : null;
        if (!details) return null;
        return (
          <div className={s.dialogOverlay} onClick={() => setExpandedAppointment(null)}>
            <div className={s.dialog} onClick={(e) => e.stopPropagation()}>
              <div className={s.dialogHeader}>
                <div className={s.aptDetailsTop}>
                  <div className={s.aptDetailAvatar}>{details.initials}</div>
                  <div className={s.aptDetailInfo}>
                    <span className={s.aptDetailName}>{details.fullName}</span>
                    <span className={s.aptDetailType}>
                      {apt.type} &middot; {apt.durationMin} min &middot; {details.location}
                    </span>
                  </div>
                </div>
                <button className={s.dialogClose} onClick={() => setExpandedAppointment(null)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="4" y1="4" x2="12" y2="12" />
                    <line x1="12" y1="4" x2="4" y2="12" />
                  </svg>
                </button>
              </div>
              <div className={s.dialogBody}>
                <div className={s.aptDetailRow}>
                  <span className={s.aptDetailLabel}>Tijd</span>
                  <span className={s.aptDetailValue}>{apt.time} — {apt.endTime}</span>
                </div>
                <div className={s.aptDetailRow}>
                  <span className={s.aptDetailLabel}>Vorige sessie</span>
                  <span className={s.aptDetailValue}>{details.lastSession}</span>
                </div>
                <div className={s.aptDetailRow}>
                  <span className={s.aptDetailLabel}>Notities</span>
                  <span className={s.aptDetailValue}>{details.notes}</span>
                </div>
              </div>
              <div className={s.dialogActions}>
                <button className={s.aptDetailAction}>Start videogesprek</button>
                <button className={s.aptDetailAction}>Bekijk dossier</button>
                <button className={s.aptDetailAction}>Notitie maken</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Appointment Dialog (week view) */}
      {selectedWeekAptData && (
        <div className={s.dialogOverlay} onClick={() => setSelectedWeekApt(null)}>
          <div className={s.dialog} onClick={(e) => e.stopPropagation()}>
            <div className={s.dialogHeader}>
              <div className={s.aptDetailsTop}>
                <div className={s.aptDetailAvatar}>{selectedWeekAptData.details.initials}</div>
                <div className={s.aptDetailInfo}>
                  <span className={s.aptDetailName}>{selectedWeekAptData.details.fullName}</span>
                  <span className={s.aptDetailType}>
                    {selectedWeekAptData.apt.type} &middot; {selectedWeekAptData.apt.durationMin} min &middot; {selectedWeekAptData.details.location}
                  </span>
                </div>
              </div>
              <button className={s.dialogClose} onClick={() => setSelectedWeekApt(null)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="4" y1="4" x2="12" y2="12" />
                  <line x1="12" y1="4" x2="4" y2="12" />
                </svg>
              </button>
            </div>
            <div className={s.dialogBody}>
              <div className={s.aptDetailRow}>
                <span className={s.aptDetailLabel}>Tijd</span>
                <span className={s.aptDetailValue}>{selectedWeekAptData.apt.time} — {selectedWeekAptData.apt.endTime}</span>
              </div>
              <div className={s.aptDetailRow}>
                <span className={s.aptDetailLabel}>Vorige sessie</span>
                <span className={s.aptDetailValue}>{selectedWeekAptData.details.lastSession}</span>
              </div>
              <div className={s.aptDetailRow}>
                <span className={s.aptDetailLabel}>Notities</span>
                <span className={s.aptDetailValue}>{selectedWeekAptData.details.notes}</span>
              </div>
            </div>
            <div className={s.dialogActions}>
              <button className={s.aptDetailAction}>Start videogesprek</button>
              <button className={s.aptDetailAction}>Bekijk dossier</button>
              <button className={s.aptDetailAction}>Notitie maken</button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Agenda Dialog */}
      {isAgendaExpanded && (
        <div className={s.dialogOverlay} onClick={() => setIsAgendaExpanded(false)}>
          <div className={s.dialogWide} onClick={(e) => e.stopPropagation()}>
            {renderAgendaContent(true)}
          </div>
        </div>
      )}
    </div>
  );
}
