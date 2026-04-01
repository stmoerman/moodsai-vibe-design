'use client';

import { useState, useEffect } from 'react';
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
  { value: '€139k', label: 'Omzet deze week', trend: '+8% vs vorige week', neg: false },
  { value: '87%', label: 'Gem. declarabiliteit', trend: '-2% vs target', neg: true },
  { value: '342', label: 'Actieve cliënten', trend: '+12 deze maand', neg: false },
  { value: '€4.2k', label: 'Gem. omzet/FTE', trend: '+3% vs vorige maand', neg: false },
];

const quickLinks = [
  { icon: '→', label: 'Teamlid uitnodigen', desc: 'Uitnodiging versturen' },
  { icon: '◉', label: 'Rooster bekijken', desc: 'Weekoverzicht team' },
  { icon: '◈', label: 'Declarabiliteit', desc: 'Controle & alerts' },
  { icon: '◎', label: 'Verlofoverzicht', desc: 'Aanvragen & saldi' },
];

const navTabs = [
  { id: 'overzicht', label: 'Overzicht' },
  { id: 'team', label: 'Team' },
  { id: 'hr', label: 'HR & Verlof' },
  { id: 'rapportage', label: 'Rapportage' },
];

export default function AdminDashboard() {
  const { displayName } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [activeTab, setActiveTab] = useState('overzicht');

  useEffect(() => {
    const now = new Date();
    setGreeting(getGreeting(now.getHours()));
    setDateStr(formatDate(now));
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
        <div className={s.grid}>
          {/* Team overview */}
          <div className={s.widgetCard}>
            <div className={s.widgetTitle}>Teamoverzicht</div>
            <div className={s.statRow}>
              <div className={s.stat}>
                <div className={s.statValue}>18</div>
                <div className={s.statLabel}>Teamleden</div>
              </div>
              <div className={s.stat}>
                <div className={s.statValue}>3</div>
                <div className={s.statLabel}>Recent</div>
              </div>
              <div className={s.stat}>
                <div className={s.statValue}>2</div>
                <div className={s.statLabel}>Uitnodigingen</div>
              </div>
            </div>

            <div className={`${s.sectionSub} ${s.sectionSubFirst}`}>Recent toegetreden</div>
            {recentMembers.map((m, i) => (
              <div key={i} className={s.listItem}>
                <div className={s.listAvatar}>{m.initials}</div>
                <div>
                  <div className={s.listName}>{m.name}</div>
                  <div className={s.listMeta}>{m.role} · {m.date}</div>
                </div>
              </div>
            ))}

            <div className={s.sectionSub} style={{ marginTop: 12 }}>Openstaande uitnodigingen</div>
            {pendingInvites.map((inv, i) => (
              <div key={i} className={s.listItem}>
                <div className={s.listAvatar}>{inv.initials}</div>
                <div>
                  <div className={s.listName}>{inv.name}</div>
                  <div className={s.listMeta}>{inv.role} · Verstuurd {inv.sent}</div>
                </div>
                <div className={s.listSpacer} />
                <span className={`${s.listBadge} ${s.badgePending}`}>Verstuurd</span>
              </div>
            ))}
          </div>

          {/* HR snapshot */}
          <div className={s.widgetCard}>
            <div className={s.widgetTitle}>HR Snapshot</div>
            <div className={s.statRow}>
              <div className={s.stat}>
                <div className={s.statValue}>1</div>
                <div className={s.statLabel}>Afwezig</div>
              </div>
              <div className={s.stat}>
                <div className={s.statValue}>2</div>
                <div className={s.statLabel}>Verlofaanvragen</div>
              </div>
              <div className={s.stat}>
                <div className={s.statValue}>1</div>
                <div className={s.statLabel}>Alert</div>
              </div>
            </div>

            {hrItems.map((item, i) => (
              <div key={i} className={s.listItem}>
                <div className={s.listAvatar}>{item.initials}</div>
                <div>
                  <div className={s.listName}>{item.name}</div>
                  <div className={s.listMeta}>{item.reason}</div>
                </div>
                <div className={s.listSpacer} />
                <span className={`${s.listBadge} ${item.badgeType === 'warning' ? s.badgeWarning : s.badgePending}`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>

          {/* Op-Ex KPIs */}
          <div className={`${s.widgetCard} ${s.gridFull}`}>
            <div className={s.widgetTitle}>Op-Ex KPIs</div>
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

          {/* Quick links */}
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
      </div>
    </div>
  );
}
