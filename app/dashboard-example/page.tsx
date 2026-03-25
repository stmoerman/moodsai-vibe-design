'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import s from './page.module.css';

function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(date: Date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
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
  { time: '08:00', duration: '30m', client: '\u2014',             type: 'Admin time',       status: 'none',      isBreak: true },
  { time: '09:00', duration: '60m', client: 'M. de Vries',       type: 'Treatment (ZPM)',   status: 'confirmed' },
  { time: '09:30', duration: '60m', client: 'M.D. Kemme',        type: 'Treatment (ZPM)',   status: 'confirmed' },
  { time: '10:30', duration: '90m', client: 'Workshop Stress',   type: '8 participants',    status: 'confirmed' },
  { time: '12:30', duration: '60m', client: 'M.D. Kemme',        type: 'Treatment (ZPM)',   status: 'confirmed' },
  { time: '13:00', duration: '30m', client: '\u2014',             type: 'Lunch',             status: 'none',      isBreak: true },
  { time: '13:30', duration: '60m', client: 'A. Hoekstra',       type: 'Intake',            status: 'pending' },
  { time: '14:30', duration: '60m', client: 'J. Bakker',         type: 'Follow-up',         status: 'confirmed' },
  { time: '15:30', duration: '\u2014',  client: '\u2014',             type: 'Available',         status: 'available', isBreak: true },
];

const recentNotes = [
  { text: 'M. de Vries \u2014 Session note', time: 'yesterday' },
  { text: 'M.D. Kemme \u2014 Treatment plan', time: '2d ago' },
  { text: 'Workshop \u2014 Summary', time: '3d ago' },
];

const messages = [
  { name: 'M. de Vries', preview: 'Bedankt voor de sessie', time: '10m' },
  { name: 'A. Hoekstra', preview: 'Ik heb de vragenlijst...', time: '2h' },
];

const navTiles = [
  { label: 'Agenda', active: true },
  { label: 'Teamchats', active: false },
  { label: 'Direct Time', active: false },
  { label: 'My Clients', active: false },
  { label: 'Client Chat', active: false },
  { label: 'MyMoody', active: false },
];

function parseHour(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

export default function DashboardExample() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const greeting = now ? getGreeting(now.getHours()) : 'Good morning';
  const dateStr = now ? formatDate(now) : '';

  // Determine current schedule row based on hour
  const currentHour = now ? now.getHours() + now.getMinutes() / 60 : 9;
  const currentSlotIndex = (() => {
    let idx = -1;
    for (let i = 0; i < schedule.length; i++) {
      if (currentHour >= parseHour(schedule[i].time)) idx = i;
    }
    return idx;
  })();

  // Count sessions (non-break items)
  const sessionCount = schedule.filter((a) => !a.isBreak).length;
  const availableCount = schedule.filter((a) => a.status === 'available').length;

  return (
    <div className={s.root}>
      <div className={s.dotGrid} aria-hidden="true" />

      {/* Top Bar */}
      <header className={s.topBar}>
        <Link href="/" className={s.logo}>Moods.ai</Link>
        <div className={s.topBarRight}>
          <span className={s.userName}>Dr. Smit</span>
          <div className={s.avatar}>DS</div>
        </div>
      </header>

      {/* Welcome */}
      <div className={s.welcomeHero}>
        <h1 className={s.greeting}>{greeting}, Nathalie</h1>
        <svg className={s.greetingUnderline} width="280" height="12" viewBox="0 0 280 12" aria-hidden="true">
          <path
            d="M0,6 C23,1 46,11 70,5 C93,0 116,10 140,4 C163,-1 186,9 210,5 C233,1 256,9 280,6"
            className={s.greetingUnderlinePath}
          />
        </svg>
        <span className={s.dateTime}>Therapist &middot; GGZ Noord &middot; {dateStr}</span>
      </div>

      {/* Main 3-Column Grid */}
      <main className={s.mainGrid}>

        {/* ── Left Column: Stats + Quick Actions ── */}
        <div className={s.leftCol}>
          <div className={s.statBlock}>
            <div className={s.statLabel}>Clients today</div>
            <div className={s.statValue}>6</div>
            <div className={s.statSub}>2 pending</div>
          </div>
          <div className={s.statBlock}>
            <div className={s.statLabel}>Declarability</div>
            <div className={s.statValue}>81%</div>
            <div className={s.statSub}>19.0 / 23.4 hrs this week</div>
          </div>
          <div className={s.statBlock}>
            <div className={s.statLabel}>Unread</div>
            <div className={s.statValue}>3</div>
            <div className={s.statSub}>2 chats, 1 report</div>
          </div>

          <div className={s.quickActions}>
            <button className={`${s.quickAction} ${s.quickActionAccent}`}>&#10022; Ask Moody</button>
            <button className={s.quickAction}>Start video call</button>
            <button className={s.quickAction}>View my clients</button>
            <button className={s.quickAction}>Record dictation</button>
          </div>
        </div>

        {/* ── Center Column: Today's Schedule ── */}
        <div className={s.centerCol}>
          <section className={s.scheduleSection}>
            <div className={s.scheduleHeader}>
              <div className={s.scheduleHeaderLeft}>
                <span className={s.scheduleTitle}>Today</span>
                <span className={s.scheduleCount}>
                  {sessionCount} sessions &middot; {availableCount} available slot
                </span>
              </div>
              <div className={s.togglePills}>
                <button className={`${s.togglePill} ${s.togglePillActive}`}>Day</button>
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

        {/* ── Right Column: Context ── */}
        <div className={s.rightCol}>

          {/* AskMoody */}
          <section className={s.askMoody}>
            <div className={s.askMoodyHeader}>
              <span className={s.askMoodyLabel}>ASKMOODY</span>
              <span className={s.askMoodyDot} />
            </div>
            <div className={s.askMoodyBody}>
              <p className={s.askMoodyMsg}>
                You have 6 sessions today. M.&nbsp;de&nbsp;Vries showed improved GAD-7 scores last session.
              </p>
            </div>
            <input
              type="text"
              className={s.askMoodyInput}
              placeholder="Ask anything..."
              readOnly
            />
          </section>

          {/* Recent Notes */}
          <section className={s.notesSection}>
            <h3 className={s.sectionHeading}>Recent notes</h3>
            {recentNotes.map((note, i) => (
              <div key={i} className={s.noteRow}>
                <span className={s.noteText}>{note.text}</span>
                <span className={s.noteTime}>{note.time}</span>
              </div>
            ))}
          </section>

          {/* Messages */}
          <section className={s.messagesSection}>
            <div className={s.messagesHeader}>
              <h3 className={s.sectionHeading}>Messages</h3>
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

      {/* Bottom Nav Tiles */}
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
