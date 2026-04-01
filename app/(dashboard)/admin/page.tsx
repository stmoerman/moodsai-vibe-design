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
  { icon: '→', label: 'Teamlid uitnodigen', desc: 'Stuur een uitnodiging' },
  { icon: '◉', label: 'Rooster bekijken', desc: 'Weekoverzicht team' },
  { icon: '◈', label: 'Declarabiliteit', desc: 'Controle & alerts' },
  { icon: '◎', label: 'Verlofoverzicht', desc: 'Aanvragen & saldi' },
];

export default function AdminDashboard() {
  const { displayName } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    setGreeting(getGreeting(now.getHours()));
    setDateStr(formatDate(now));
  }, []);

  return (
    <div className={s.root}>
      <h1 className={s.greeting}>{greeting}, {displayName ?? 'Demo Admin'}</h1>
      <div className={s.dateStr}>Admin · {dateStr}</div>

      <div className={s.grid}>
        {/* Team overview */}
        <div className={s.card}>
          <h2 className={s.cardTitle}>Teamoverzicht</h2>
          <div className={s.statRow}>
            <div className={s.stat}>
              <div className={s.statValue}>18</div>
              <div className={s.statLabel}>Teamleden</div>
            </div>
            <div className={s.stat}>
              <div className={s.statValue}>3</div>
              <div className={s.statLabel}>Recent toegevoegd</div>
            </div>
            <div className={s.stat}>
              <div className={s.statValue}>2</div>
              <div className={s.statLabel}>Openstaande uitnodigingen</div>
            </div>
          </div>

          <h3 className={s.cardTitle} style={{ fontSize: '0.85rem', marginBottom: 12 }}>Recent toegetreden</h3>
          {recentMembers.map((m, i) => (
            <div key={i} className={s.listItem}>
              <div className={s.listAvatar}>{m.initials}</div>
              <div>
                <div className={s.listName}>{m.name}</div>
                <div className={s.listMeta}>{m.role} · {m.date}</div>
              </div>
            </div>
          ))}

          <h3 className={s.cardTitle} style={{ fontSize: '0.85rem', marginTop: 16, marginBottom: 12 }}>Openstaande uitnodigingen</h3>
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
        <div className={s.card}>
          <h2 className={s.cardTitle}>HR Snapshot</h2>
          <div className={s.statRow}>
            <div className={s.stat}>
              <div className={s.statValue}>1</div>
              <div className={s.statLabel}>Afwezig vandaag</div>
            </div>
            <div className={s.stat}>
              <div className={s.statValue}>2</div>
              <div className={s.statLabel}>Verlofaanvragen</div>
            </div>
            <div className={s.stat}>
              <div className={s.statValue}>1</div>
              <div className={s.statLabel}>Declarabiliteit alert</div>
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
        <div className={`${s.card} ${s.gridFull}`}>
          <h2 className={s.cardTitle}>Op-Ex KPIs</h2>
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
        <div className={`${s.card} ${s.gridFull}`}>
          <h2 className={s.cardTitle}>Snelkoppelingen</h2>
          <div className={s.quickLinks}>
            {quickLinks.map((link, i) => (
              <button key={i} className={s.quickLink}>
                <span className={s.quickLinkIcon}>{link.icon}</span>
                <div>
                  <div>{link.desc}</div>
                  <div className={s.quickLinkLabel}>{link.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
