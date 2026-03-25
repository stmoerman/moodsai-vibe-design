'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import s from './page.module.css';

function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
}

const appointments = [
  { time: '09:00', client: 'M. de Vries', therapist: 'Dr. Smit', status: 'confirmed' as const },
  { time: '09:30', client: 'J. Bakker', therapist: 'Dr. van Dijk', status: 'confirmed' as const },
  { time: '10:00', client: 'A. Hoekstra', therapist: 'Dr. Smit', status: 'pending' as const },
  { time: '11:00', client: 'S. Jansen', therapist: 'Dr. de Vries', status: 'confirmed' as const },
  { time: '13:00', client: 'T. van Berg', therapist: 'Dr. Smit', status: 'confirmed' as const },
  { time: '14:00', client: '\u2014', therapist: 'Dr. van Dijk', status: 'available' as const },
];

const activityItems = [
  { text: 'Session report generated \u2014 M. de Vries', time: '2 min ago' },
  { text: 'New client registered \u2014 A. Hoekstra', time: '18 min ago' },
  { text: 'Leave request submitted \u2014 Dr. van Dijk', time: '1h ago' },
  { text: '3 AI reports completed', time: '2h ago' },
  { text: 'Newsletter published', time: '3h ago' },
];

const notifications = [
  { color: '#4a6a9a', text: 'New client: A. Hoekstra' },
  { color: '#8b6d4f', text: 'Leave request: Dr. van Dijk' },
  { color: '#d0cdc6', text: 'Report ready for review' },
];

const modules = [
  { name: 'Core', stat: 'Dashboard & AI', active: true },
  { name: 'Video', stat: '8 rooms active', active: true },
  { name: 'HCI', stat: '78% declarability', active: true },
  { name: 'BI', stat: '12 reports ready', active: true },
  { name: 'Care', stat: '3 new referrals', active: true },
  { name: 'Newsletter', stat: 'Not configured', active: false },
];

export default function DashboardExample() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const greeting = now ? getGreeting(now.getHours()) : 'Good morning';
  const timeStr = now ? formatTime(now) : '';
  const dateStr = now ? formatDate(now) : '';

  // Determine which appointment is "current" based on hour
  const currentHour = now ? now.getHours() : 9;
  const currentSlotIndex = (() => {
    const hours = [9, 9.5, 10, 11, 13, 14];
    let idx = 0;
    for (let i = 0; i < hours.length; i++) {
      if (currentHour >= hours[i]) idx = i;
    }
    return idx;
  })();

  return (
    <div className={s.root}>
      <div className={s.dotGrid} aria-hidden="true" />

      {/* Top Bar */}
      <header className={s.topBar}>
        <Link href="/" className={s.logo}>Moods.ai</Link>
        <div className={s.topBarRight}>
          <span className={s.orgName}>GGZ Noord</span>
          <div className={s.avatar}>JV</div>
        </div>
      </header>

      {/* Welcome Hero */}
      <div className={s.welcomeHero}>
        <h1 className={s.greeting}>{greeting}, Jaime</h1>
        <svg className={s.greetingUnderline} width="280" height="12" viewBox="0 0 280 12" aria-hidden="true">
          <path
            d="M0,6 C23,1 46,11 70,5 C93,0 116,10 140,4 C163,-1 186,9 210,5 C233,1 256,9 280,6"
            className={s.greetingUnderlinePath}
          />
        </svg>
        <span className={s.dateTime}>{dateStr} &middot; {timeStr}</span>
      </div>

      {/* Main Grid */}
      <main className={s.mainGrid}>

        {/* Left Column */}
        <div className={s.leftCol}>

          {/* Today's Schedule */}
          <section className={s.scheduleSection}>
            <div className={s.scheduleHeader}>
              <span className={s.scheduleTitle}>Today</span>
              <span className={s.scheduleCount}>6 appointments</span>
            </div>
            <div className={s.scheduleList}>
              {appointments.map((apt, i) => (
                <div
                  key={i}
                  className={`${s.scheduleRow} ${i === currentSlotIndex ? s.scheduleRowActive : ''}`}
                  style={{ animationDelay: `${0.15 + i * 0.03}s` }}
                >
                  <span className={s.scheduleTime}>{apt.time}</span>
                  <span className={s.scheduleClient}>{apt.client}</span>
                  <span className={s.scheduleTherapist}>{apt.therapist}</span>
                  <span
                    className={`${s.statusDot} ${
                      apt.status === 'confirmed' ? s.statusConfirmed :
                      apt.status === 'pending' ? s.statusPending :
                      s.statusAvailable
                    }`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Quick Stats */}
          <div className={s.quickStats}>
            <div className={s.quickStat}>
              <div className={s.quickStatValue}>&euro;18,430</div>
              <div className={s.quickStatLabel}>Revenue</div>
            </div>
            <div className={s.quickStatDivider} />
            <div className={s.quickStat}>
              <div className={s.quickStatValue}>142</div>
              <div className={s.quickStatLabel}>Sessions</div>
            </div>
            <div className={s.quickStatDivider} />
            <div className={s.quickStat}>
              <div className={s.quickStatValue}>78%</div>
              <div className={s.quickStatLabel}>Declarability</div>
            </div>
            <div className={s.quickStatDivider} />
            <div className={s.quickStat}>
              <div className={s.quickStatValue}>8/12</div>
              <div className={s.quickStatLabel}>Online</div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className={s.rightCol}>

          {/* AskMoody */}
          <section className={s.askMoody}>
            <div className={s.askMoodyHeader}>
              <span className={s.askMoodyLabel}>ASKMOODY</span>
              <span className={s.askMoodyDot} />
            </div>
            <div className={s.askMoodyBody}>
              <p className={s.askMoodyMsg}>
                Revenue up 12% this week. 3 therapists below target.
              </p>
            </div>
            <input
              type="text"
              className={s.askMoodyInput}
              placeholder="Ask anything..."
              readOnly
            />
          </section>

          {/* Activity Feed */}
          <section className={s.activitySection}>
            <h3 className={s.sectionHeading}>Recent</h3>
            {activityItems.map((item, i) => (
              <div key={i} className={s.activityRow}>
                <span className={s.activityText}>{item.text}</span>
                <span className={s.activityTime}>{item.time}</span>
              </div>
            ))}
          </section>

          {/* Notifications */}
          <section className={s.notificationsSection}>
            <div className={s.notificationsHeader}>
              <h3 className={s.sectionHeading}>Notifications</h3>
              <span className={s.notifBadge}>3</span>
            </div>
            {notifications.map((notif, i) => (
              <div key={i} className={s.notifRow}>
                <span className={s.notifDot} style={{ backgroundColor: notif.color }} />
                <span className={s.notifText}>{notif.text}</span>
              </div>
            ))}
          </section>

        </div>
      </main>

      {/* Bottom Row — Module Quick Access */}
      <div className={s.modulesRow}>
        {modules.map((mod, i) => (
          <div
            key={i}
            className={`${s.moduleTile} ${!mod.active ? s.moduleTileInactive : ''}`}
            style={{ animationDelay: `${0.3 + i * 0.04}s` }}
          >
            <div className={s.moduleName}>{mod.name}</div>
            <div className={s.moduleStat}>{mod.stat}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
