'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  { time: '09:30', endTime: '10:30', durationMin: 60, client: 'M.D. Kemme',          type: 'Behandeling (ZPM)',    status: 'confirmed' },
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
  { label: 'Agenda', active: true },
  { label: 'Teamchats', active: false },
  { label: 'Directe Tijd', active: false },
  { label: 'Mijn Cliënten', active: false },
  { label: 'Cliënt Chat', active: false },
  { label: 'MyMoody', active: false },
];

const mockDates = ['Di 24 maart', 'Wo 25 maart', 'Do 26 maart'];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function parseHour(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

export default function DashboardExample() {
  const [now, setNow] = useState<Date | null>(null);
  const [bootPhase, setBootPhase] = useState<'visible' | 'fading' | 'done'>('done');
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);
  const [dateIndex, setDateIndex] = useState(1); // 1 = today (Wo 25 maart)
  const [viewMode, setViewMode] = useState<'dag' | 'week'>('dag');

  useEffect(() => {
    setNow(new Date());

    const lastSplash = document.cookie
      .split('; ')
      .find((c) => c.startsWith('moods_splash='));
    const alreadyShown = !!lastSplash;

    if (alreadyShown || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBootPhase('done');
      return;
    }

    setBootPhase('visible');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `moods_splash=1; expires=${expires}; path=/`;

    const fadeTimer = setTimeout(() => setBootPhase('fading'), 3000);
    const doneTimer = setTimeout(() => setBootPhase('done'), 3800);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

  const greeting = now ? getGreeting(now.getHours()) : 'Goedemorgen';
  const dateStr = now ? formatDate(now) : '';
  const currentHour = now ? now.getHours() + now.getMinutes() / 60 : 10.5;

  // Calculate "now" line position as percentage of the timeline (08:00 - 18:00)
  const nowPct = Math.max(0, Math.min(100, ((currentHour - 8) / 10) * 100));
  const showNowLine = currentHour >= 8 && currentHour <= 18;

  const handlePrevDate = () => setDateIndex((i) => Math.max(0, i - 1));
  const handleNextDate = () => setDateIndex((i) => Math.min(mockDates.length - 1, i + 1));
  const handleToday = () => setDateIndex(1);

  const toggleExpand = (idx: number) => {
    setExpandedAppointment((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className={s.root}>
      <div className={s.dotGrid} aria-hidden="true" />

      {/* Boot Screen */}
      {bootPhase !== 'done' && (
        <div className={`${s.bootScreen} ${bootPhase === 'fading' ? s.bootFading : ''}`}>
          <div className={s.bootContent}>
            <h1 className={s.bootGreeting}>
              {now ? `${getGreeting(now.getHours())}, Jaime` : 'Goedemorgen, Jaime'}
            </h1>
            <svg className={s.bootUnderline} width="480" height="14" viewBox="0 0 480 14" aria-hidden="true">
              <path
                d="M0,7 C40,1 80,13 120,6 C160,0 200,12 240,5 C280,-1 320,11 360,6 C400,1 440,11 480,7"
                className={`${s.bootUnderlinePath} ${s.bootUnderlineDrawn}`}
              />
            </svg>
            <div className={s.bootStats}>
              <span className={s.bootStat}>6 sessies vandaag</span>
              <span className={s.bootStatDot}>&middot;</span>
              <span className={s.bootStat}>1% boven je declarabiliteit target</span>
              <span className={s.bootStatDot}>&middot;</span>
              <span className={s.bootStat}>3 ongelezen berichten</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className={s.topBar}>
        <Link href="/" className={s.logo}>Oh My Mood</Link>
        <div className={s.topBarRight}>
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
          {navTabs.map((tab, i) => (
            <button
              key={i}
              className={`${s.navTab} ${tab.active ? s.navTabActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main 3-Column Grid */}
      <main className={s.mainGrid}>

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
            {/* Agenda Header */}
            <div className={s.agendaHeader}>
              <div className={s.agendaNav}>
                <button className={s.agendaNavBtn} onClick={handlePrevDate} disabled={dateIndex === 0}>&lt;</button>
                <button className={s.agendaTodayBtn} onClick={handleToday}>Vandaag</button>
                <button className={s.agendaNavBtn} onClick={handleNextDate} disabled={dateIndex === mockDates.length - 1}>&gt;</button>
                <span className={s.agendaDateLabel}>{mockDates[dateIndex]}</span>
              </div>
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
            </div>

            {/* Agenda Timeline */}
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

                {/* Now marker */}
                {showNowLine && dateIndex === 1 && (
                  <div className={s.nowMarker} style={{ top: `${nowPct}%` }}>
                    <div className={s.nowDot} />
                    <div className={s.nowLine} />
                  </div>
                )}

                {/* Appointment blocks */}
                {schedule.map((apt, i) => {
                  const topPct = ((parseHour(apt.time) - 8) / 10) * 100;
                  const heightPct = (apt.durationMin / 600) * 100;
                  const isExpanded = expandedAppointment === i;
                  const details = apt.client ? appointmentDetails[apt.client] : null;
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
                        isExpanded ? s.aptExpanded : '',
                      ].filter(Boolean).join(' ')}
                      style={{
                        top: `${topPct}%`,
                        height: isExpanded ? 'auto' : `${heightPct}%`,
                        minHeight: isExpanded ? '200px' : undefined,
                        animationDelay: `${1.5 + i * 0.04}s`,
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

                      {/* Expanded Details */}
                      {isAppointment && (
                        <div className={`${s.aptDetails} ${isExpanded ? s.aptDetailsOpen : ''}`}>
                          <div className={s.aptDetailsInner}>
                            <div className={s.aptDetailsTop}>
                              <div className={s.aptDetailAvatar}>{details?.initials || '??'}</div>
                              <div className={s.aptDetailInfo}>
                                <span className={s.aptDetailName}>{details?.fullName || apt.client}</span>
                                <span className={s.aptDetailType}>{apt.type} &middot; {apt.durationMin} min &middot; {details?.location}</span>
                              </div>
                            </div>
                            <div className={s.aptDetailRow}>
                              <span className={s.aptDetailLabel}>Vorige sessie</span>
                              <span className={s.aptDetailValue}>{details?.lastSession}</span>
                            </div>
                            <div className={s.aptDetailRow}>
                              <span className={s.aptDetailLabel}>Notities</span>
                              <span className={s.aptDetailValue}>{details?.notes}</span>
                            </div>
                            <div className={s.aptDetailActions}>
                              <button className={s.aptDetailAction}>Start videogesprek</button>
                              <button className={s.aptDetailAction}>Bekijk dossier</button>
                              <button className={s.aptDetailAction}>Notitie maken</button>
                            </div>
                            <button
                              className={s.aptDetailClose}
                              onClick={(e) => { e.stopPropagation(); setExpandedAppointment(null); }}
                            >
                              Sluiten
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
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
            <h3 className={s.sectionHeading}>Recente notities</h3>
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
      </main>
    </div>
  );
}
