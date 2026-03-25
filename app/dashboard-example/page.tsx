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

type AppointmentStatus = 'confirmed' | 'pending' | 'available' | 'none';

interface Appointment {
  time: string;
  duration: string;
  client: string;
  type: string;
  status: AppointmentStatus;
  isBreak?: boolean;
}

const schedule: Appointment[] = [
  { time: '08:00', duration: '30m', client: '\u2014',             type: 'Administratietijd',    status: 'none',      isBreak: true },
  { time: '09:00', duration: '60m', client: 'M. de Vries',       type: 'Behandeling (ZPM)',    status: 'confirmed' },
  { time: '09:30', duration: '60m', client: 'M.D. Kemme',        type: 'Behandeling (ZPM)',    status: 'confirmed' },
  { time: '10:30', duration: '90m', client: 'Workshop Stress',   type: '8 deelnemers',         status: 'confirmed' },
  { time: '12:30', duration: '60m', client: 'M.D. Kemme',        type: 'Behandeling (ZPM)',    status: 'confirmed' },
  { time: '13:00', duration: '30m', client: '\u2014',             type: 'Pauze',                status: 'none',      isBreak: true },
  { time: '13:30', duration: '60m', client: 'A. Hoekstra',       type: 'Intake',               status: 'pending' },
  { time: '14:30', duration: '60m', client: 'J. Bakker',         type: 'Vervolgconsult',       status: 'confirmed' },
  { time: '15:30', duration: '\u2014',  client: '\u2014',         type: 'Beschikbaar',          status: 'available', isBreak: true },
];

const recentNotes = [
  { text: 'M. de Vries \u2014 Sessienotitie', time: 'gisteren' },
  { text: 'M.D. Kemme \u2014 Behandelplan', time: '2d geleden' },
  { text: 'Workshop \u2014 Samenvatting', time: '3d geleden' },
];

const messages = [
  { name: 'M. de Vries', preview: 'Bedankt voor de sessie', time: '10m' },
  { name: 'A. Hoekstra', preview: 'Ik heb de vragenlijst...', time: '2u' },
];

const navTiles = [
  { label: 'Agenda', active: true },
  { label: 'Teamchats', active: false },
  { label: 'Directe Tijd', active: false },
  { label: 'Mijn Cli\u00ebnten', active: false },
  { label: 'Cli\u00ebnt Chat', active: false },
  { label: 'MyMoody', active: false },
];

function parseHour(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

export default function DashboardExample() {
  const [now, setNow] = useState<Date | null>(null);
  const [bootPhase, setBootPhase] = useState<'visible' | 'fading' | 'done'>('done');

  useEffect(() => {
    setNow(new Date());

    // Check if we already showed the splash today (24h cookie)
    const lastSplash = document.cookie
      .split('; ')
      .find((c) => c.startsWith('moods_splash='));
    const alreadyShown = !!lastSplash;

    if (alreadyShown || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBootPhase('done');
      return;
    }

    // Show splash and set 24h cookie
    setBootPhase('visible');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `moods_splash=1; expires=${expires}; path=/`;

    const fadeTimer = setTimeout(() => setBootPhase('fading'), 3000);
    const doneTimer = setTimeout(() => setBootPhase('done'), 3800);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

  const greeting = now ? getGreeting(now.getHours()) : 'Goedemorgen';
  const dateStr = now ? formatDate(now) : '';

  const currentHour = now ? now.getHours() + now.getMinutes() / 60 : 9;
  const currentSlotIndex = (() => {
    let idx = -1;
    for (let i = 0; i < schedule.length; i++) {
      if (currentHour >= parseHour(schedule[i].time)) idx = i;
    }
    return idx;
  })();

  const sessionCount = schedule.filter((a) => !a.isBreak).length;
  const availableCount = schedule.filter((a) => a.status === 'available').length;

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
          <span className={s.userName}>GGZ Noord</span>
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
        <span className={s.dateTime}>Therapeut &middot; GGZ Noord &middot; {dateStr}</span>
      </div>

      {/* Main 3-Column Grid */}
      <main className={s.mainGrid}>

        {/* Left Column */}
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

          <div className={s.quickActions}>
            <button className={`${s.quickAction} ${s.quickActionAccent}`}>&#10022; Vraag Moody</button>
            <button className={s.quickAction}>Start videogesprek</button>
            <button className={s.quickAction}>Mijn cli&euml;nten</button>
            <button className={s.quickAction}>Dictaat opnemen</button>
          </div>
        </div>

        {/* Center Column */}
        <div className={s.centerCol}>
          <section className={s.scheduleSection}>
            <div className={s.scheduleHeader}>
              <div className={s.scheduleHeaderLeft}>
                <span className={s.scheduleTitle}>Vandaag</span>
                <span className={s.scheduleCount}>
                  {sessionCount} sessies &middot; {availableCount} beschikbaar
                </span>
              </div>
              <div className={s.togglePills}>
                <button className={`${s.togglePill} ${s.togglePillActive}`}>Dag</button>
                <button className={s.togglePill}>Week</button>
              </div>
            </div>

            <div className={s.scheduleList}>
              {schedule.map((apt, i) => (
                <div
                  key={i}
                  className={[
                    s.scheduleRow,
                    i === currentSlotIndex ? s.scheduleRowActive : '',
                    apt.isBreak ? s.scheduleRowMuted : '',
                  ].filter(Boolean).join(' ')}
                  style={{ animationDelay: `${1.5 + i * 0.03}s` }}
                >
                  <span className={s.scheduleTime}>{apt.time}</span>
                  <span className={s.scheduleDuration}>{apt.duration}</span>
                  <span className={s.scheduleClient}>{apt.client}</span>
                  <span className={s.scheduleType}>{apt.type}</span>
                  <span
                    className={`${s.statusDot} ${
                      apt.status === 'confirmed' ? s.statusConfirmed :
                      apt.status === 'pending' ? s.statusPending :
                      apt.status === 'available' ? s.statusAvailable :
                      s.statusNone
                    }`}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className={s.rightCol}>

          <section className={s.askMoody}>
            <div className={s.askMoodyHeader}>
              <span className={s.askMoodyLabel}>ASKMOODY</span>
              <span className={s.askMoodyDot} />
            </div>
            <div className={s.askMoodyBody}>
              <p className={s.askMoodyMsg}>
                Je hebt 6 sessies vandaag. M.&nbsp;de&nbsp;Vries liet verbeterde GAD-7 scores zien vorige sessie.
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

          <section className={s.messagesSection}>
            <div className={s.messagesHeader}>
              <h3 className={s.sectionHeading}>Berichten</h3>
              <span className={s.messageBadge}>2</span>
            </div>
            {messages.map((msg, i) => (
              <div key={i} className={s.messageRow}>
                <span className={s.messageName}>{msg.name}</span>
                <span className={s.messagePreview}>{msg.preview}</span>
                <span className={s.messageTime}>{msg.time}</span>
              </div>
            ))}
          </section>

        </div>
      </main>

      {/* Bottom Nav */}
      <div className={s.bottomNav}>
        {navTiles.map((tile, i) => (
          <div
            key={i}
            className={`${s.navTile} ${tile.active ? s.navTileActive : ''}`}
          >
            <span className={s.navTileLabel}>{tile.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
