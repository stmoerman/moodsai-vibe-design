'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from './page.module.css';

/* ── Helpers ── */
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
const weeklyRevenue = [
  { week: 'W01', diagnostics: 18, treatment: 82, workshop: 6, ehealth: 12 },
  { week: 'W02', diagnostics: 22, treatment: 96, workshop: 4, ehealth: 10 },
  { week: 'W03', diagnostics: 16, treatment: 74, workshop: 8, ehealth: 14 },
  { week: 'W04', diagnostics: 20, treatment: 105, workshop: 3, ehealth: 9 },
  { week: 'W05', diagnostics: 24, treatment: 88, workshop: 5, ehealth: 11 },
  { week: 'W06', diagnostics: 19, treatment: 110, workshop: 7, ehealth: 8 },
  { week: 'W07', diagnostics: 21, treatment: 98, workshop: 2, ehealth: 13 },
  { week: 'W08', diagnostics: 23, treatment: 102, workshop: 4, ehealth: 10 },
];

const tableData = [
  { week: 'W03', total: '€112,400', diagnostics: '€16,000', treatment: '€74,000', workshop: '€8,000', ehealth: '€14,400' },
  { week: 'W04', total: '€137,000', diagnostics: '€20,000', treatment: '€105,000', workshop: '€3,000', ehealth: '€9,000' },
  { week: 'W05', total: '€128,200', diagnostics: '€24,000', treatment: '€88,000', workshop: '€5,200', ehealth: '€11,000' },
  { week: 'W06', total: '€144,300', diagnostics: '€19,000', treatment: '€110,000', workshop: '€7,300', ehealth: '€8,000' },
  { week: 'W07', total: '€134,100', diagnostics: '€21,000', treatment: '€98,000', workshop: '€2,100', ehealth: '€13,000' },
  { week: 'W08', total: '€139,400', diagnostics: '€23,000', treatment: '€102,000', workshop: '€4,400', ehealth: '€10,000' },
];

const clientFlow = [
  { month: 'Oct', inflow: 78, outflow: 52 },
  { month: 'Nov', inflow: 65, outflow: 48 },
  { month: 'Dec', inflow: 42, outflow: 58 },
  { month: 'Jan', inflow: 88, outflow: 44 },
  { month: 'Feb', inflow: 72, outflow: 50 },
  { month: 'Mar', inflow: 91, outflow: 46 },
];

const modules = [
  { name: 'Core', metric: 'Dashboard & AI', trend: null, active: true },
  { name: 'Video', metric: '8 rooms', trend: '+2 this week', active: true },
  { name: 'HCI', metric: '78% decl.', trend: '-2% vs target', trendNeg: true, active: true },
  { name: 'BI', metric: '12 reports', trend: '+3 new', active: true },
  { name: 'Care', metric: '3 referrals', trend: '+1 today', active: true },
  { name: 'Newsletter', metric: 'Not active', trend: null, active: false },
];

/* ── Sparkline SVG data ── */
function Sparkline({ points, className }: { points: number[]; className?: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const d = `M${coords.join(' L')}`;
  return (
    <svg className={className || s.sparkline} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={d} className={s.sparklinePath} />
    </svg>
  );
}

/* ── Widget header helper ── */
function WidgetHeader({
  title,
  customizing,
}: {
  title: string;
  customizing: boolean;
}) {
  return (
    <div className={s.widgetHeader}>
      <h3 className={s.widgetTitle}>{title}</h3>
      <div className={s.widgetActions}>
        {customizing && <span className={s.dragHandle}>&#x2807;</span>}
        {customizing && <span className={s.toggleIcon}>&#x1F441;</span>}
        <button className={s.aiButton} aria-label="Ask Moody about this">
          &#x2726;
          <span className={s.aiTooltip}>Ask Moody about this</span>
        </button>
      </div>
    </div>
  );
}

const navTabs = [
  { label: 'Overzicht', id: 'overzicht' },
  { label: 'Omzet', id: 'omzet' },
  { label: 'Declaraties', id: 'declaraties' },
  { label: 'Cliëntenstroom', id: 'clientenstroom' },
  { label: 'Modules', id: 'modules' },
];

/* ── Main Component ── */
export default function DashboardExample3() {
  const [now, setNow] = useState<Date | null>(null);
  const [customizing, setCustomizing] = useState(false);
  const [activeTab, setActiveTab] = useState('overzicht');
  const [activeFilters, setActiveFilters] = useState({
    year: '2026',
    month: 'March',
    week: 'All weeks',
  });
  const [flowPeriod, setFlowPeriod] = useState<'Week' | 'Month' | 'Quarter'>('Month');
  const widgetRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Live clock — update every 60s
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // IntersectionObserver for stagger reveal
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setWidgetRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    widgetRefs.current[idx] = el;
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      widgetRefs.current.forEach((el) => {
        if (el) el.classList.add(s.revealVisible);
      });
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add(s.revealVisible);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    widgetRefs.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const greeting = now ? getGreeting(now.getHours()) : 'Goedemiddag';
  const dateStr = now ? formatDate(now) : '';

  const maxBarTotal = Math.max(...weeklyRevenue.map((w) => w.diagnostics + w.treatment + w.workshop + w.ehealth));
  const maxFlow = Math.max(...clientFlow.flatMap((c) => [c.inflow, c.outflow]));

  function toggleFilter(key: 'year' | 'month' | 'week') {
    const opts: Record<string, string[]> = {
      year: ['2024', '2025', '2026'],
      month: ['January', 'February', 'March', 'April', 'May'],
      week: ['All weeks', 'W08', 'W09', 'W10'],
    };
    setActiveFilters((prev) => {
      const arr = opts[key];
      const idx = arr.indexOf(prev[key]);
      return { ...prev, [key]: arr[(idx + 1) % arr.length] };
    });
  }

  const wc = customizing ? s.widgetCustomizing : '';
  let widgetIdx = 0;

  return (
    <div className={s.root}>
      <div className={s.dotGrid} aria-hidden="true" />

      {/* ── Top Bar ── */}
      <header className={s.topBar}>
        <Link href="/" className={s.logo}>
          <Image src="/images/logo.png" alt="Oh My Mood" width={120} height={32} className={s.logoImg} />
        </Link>
        <div className={s.topBarRight}>
          <span className={s.userName}>Amsterdam</span>
          <div className={s.avatar}>JS</div>
        </div>
      </header>

      {/* ── Welcome ── */}
      <div className={s.welcomeHero}>
        <h1 className={s.greeting}>{greeting}, Jaime</h1>
        <svg className={s.greetingUnderline} width="280" height="12" viewBox="0 0 280 12" aria-hidden="true">
          <path
            d="M0,6 C23,1 46,11 70,5 C93,0 116,10 140,4 C163,-1 186,9 210,5 C233,1 256,9 280,6"
            className={s.greetingUnderlinePath}
          />
        </svg>
        <span className={s.dateTime}>BI Dashboard &middot; Amsterdam &middot; {dateStr}</span>
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

      {/* ── Filters ── */}
      <div className={s.filtersRow}>
        <div className={s.filters}>
          <button
            className={`${s.filterPill} ${s.filterPillActive}`}
            onClick={() => toggleFilter('year')}
          >
            {activeFilters.year}
          </button>
          <button
            className={`${s.filterPill} ${s.filterPillActive}`}
            onClick={() => toggleFilter('month')}
          >
            {activeFilters.month}
          </button>
          <button
            className={s.filterPill}
            onClick={() => toggleFilter('week')}
          >
            {activeFilters.week}
          </button>
        </div>
      </div>

      {/* ── Widget Grid ── */}
      <div className={s.widgetGridArea}>
        <div className={s.customizeRow}>
          <button
            className={`${s.customizeBtn} ${customizing ? s.customizeBtnActive : ''}`}
            onClick={() => setCustomizing(!customizing)}
          >
            {customizing ? 'Klaar' : 'Aanpassen'}
          </button>
        </div>

        <div className={s.widgetGrid}>

          {/* ── Row 1: Key Stats ── */}
          <div
            ref={(el) => setWidgetRef(el, widgetIdx++)}
            className={`${s.widget} ${s.reveal} ${wc}`}
            style={{ animationDelay: '0.1s' }}
          >
            <WidgetHeader title="Revenue this week" customizing={customizing} />
            <div className={s.statValue}>&euro;155,068</div>
            <div className={s.statLabel}>This week total</div>
            <div className={`${s.statTrend} ${s.trendPositive}`}>&uarr; 1.6%</div>
            <Sparkline points={[120, 128, 118, 135, 142, 148, 155]} />
          </div>

          <div
            ref={(el) => setWidgetRef(el, widgetIdx++)}
            className={`${s.widget} ${s.reveal} ${wc}`}
            style={{ animationDelay: '0.15s' }}
          >
            <WidgetHeader title="Clients" customizing={customizing} />
            <div className={s.statValue}>1,587</div>
            <div className={s.statLabel}>Total active</div>
            <div className={`${s.statTrend} ${s.trendPositive}`}>+12 this month</div>
            <Sparkline points={[1540, 1548, 1555, 1562, 1570, 1578, 1587]} />
          </div>

          <div
            ref={(el) => setWidgetRef(el, widgetIdx++)}
            className={`${s.widget} ${s.reveal} ${wc}`}
            style={{ animationDelay: '0.2s' }}
          >
            <WidgetHeader title="Direct hours" customizing={customizing} />
            <div className={s.statValue}>23,528</div>
            <div className={s.statLabel}>Indirect: 2,396</div>
            <div className={`${s.statTrend} ${s.trendPositive}`}>&uarr; 3.2%</div>
            <Sparkline points={[22100, 22400, 22800, 23000, 23100, 23350, 23528]} />
          </div>

          <div
            ref={(el) => setWidgetRef(el, widgetIdx++)}
            className={`${s.widget} ${s.reveal} ${wc}`}
            style={{ animationDelay: '0.25s' }}
          >
            <WidgetHeader title="Declarability" customizing={customizing} />
            <div className={s.statValue}>78%</div>
            <div className={s.statLabel}>Target: 80%</div>
            <div className={`${s.statTrend} ${s.trendWarning}`}>&minus;2% below target</div>
            <Sparkline points={[76, 77, 79, 78, 77, 78, 78]} />
          </div>

          {/* ── Row 2: Revenue Chart + Summary ── */}
          <div
            ref={(el) => setWidgetRef(el, widgetIdx++)}
            className={`${s.widget} ${s.widgetSpan3} ${s.reveal} ${wc}`}
            style={{ animationDelay: '0.3s' }}
          >
            <WidgetHeader title="Revenue per week" customizing={customizing} />
            <div className={s.chartArea}>
              <div className={s.chartContainer}>
                <div className={s.yAxis}>
                  <span className={s.yLabel}>150k</span>
                  <span className={s.yLabel}>100k</span>
                  <span className={s.yLabel}>50k</span>
                  <span className={s.yLabel}>0</span>
                </div>
                {weeklyRevenue.map((w) => {
                  const total = w.diagnostics + w.treatment + w.workshop + w.ehealth;
                  return (
                    <div className={s.barGroup} key={w.week}>
                      <div className={s.stackedBar} style={{ height: `${(total / maxBarTotal) * 100}%` }}>
                        <div className={s.barSegment} style={{ background: '#d0cdc6', flex: w.ehealth }} />
                        <div className={s.barSegment} style={{ background: '#b8a898', flex: w.workshop }} />
                        <div className={s.barSegment} style={{ background: '#8b6d4f', flex: w.treatment }} />
                        <div className={s.barSegment} style={{ background: '#3a3a3a', flex: w.diagnostics }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={s.xLabels}>
                {weeklyRevenue.map((w) => (
                  <span className={s.xLabel} key={w.week}>{w.week}</span>
                ))}
              </div>
              <div className={s.chartLegend}>
                {[
                  { color: '#3a3a3a', label: 'Diagnostics' },
                  { color: '#8b6d4f', label: 'Treatment' },
                  { color: '#b8a898', label: 'Workshop' },
                  { color: '#d0cdc6', label: 'eHealth' },
                ].map((l) => (
                  <div className={s.legendItem} key={l.label}>
                    <div className={s.legendSwatch} style={{ background: l.color }} />
                    <span className={s.legendLabel}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={(el) => setWidgetRef(el, widgetIdx++)}
            className={`${s.widget} ${s.reveal} ${wc}`}
            style={{ animationDelay: '0.35s' }}
          >
            <WidgetHeader title="Current month" customizing={customizing} />
            <div className={s.revSummary}>
              <div className={s.revLargeValue}>&euro;152,631</div>
              {[
                { label: 'Diagnostiek', amount: '€19,253', pct: '13%' },
                { label: 'Behandeling', amount: '€108,114', pct: '68%' },
                { label: 'Workshop', amount: '€736', pct: '1%' },
                { label: 'E-health', amount: '€3,026', pct: '2%' },
              ].map((row) => (
                <div className={s.revBreakdownRow} key={row.label}>
                  <span className={s.revBreakdownLabel}>{row.label}</span>
                  <div className={s.revBreakdownValues}>
                    <span className={s.revBreakdownAmount}>{row.amount}</span>
                    <span className={s.revBreakdownPct}>{row.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Row 3: Declaration Control + Client Flow ── */}
          <div
            ref={(el) => setWidgetRef(el, widgetIdx++)}
            className={`${s.widget} ${s.widgetSpan2} ${s.reveal} ${wc}`}
            style={{ animationDelay: '0.4s' }}
          >
            <WidgetHeader title="Declaration control" customizing={customizing} />
            <div className={s.declLargeValue}>&euro;95,575 <span className={`${s.statTrend} ${s.trendPositive}`}>&uarr;</span></div>
            <div className={s.declDeviation}>Deviation: +5.45%</div>
            <div className={s.declRow}>
              <span className={s.declLabel}>Submitted</span>
              <span className={s.declValue}>&euro;1,754,571</span>
            </div>
            <div className={s.declRow}>
              <span className={s.declLabel}>Approved</span>
              <span className={s.declValue}>&euro;1,659,000</span>
            </div>
            <div className={s.declFootnote}>10,812 declarations &middot; 2,349 deviations found</div>
          </div>

          <div
            ref={(el) => setWidgetRef(el, widgetIdx++)}
            className={`${s.widget} ${s.widgetSpan2} ${s.reveal} ${wc}`}
            style={{ animationDelay: '0.45s' }}
          >
            <WidgetHeader title="Client flow" customizing={customizing} />
            <div className={s.flowToggles}>
              {(['Week', 'Month', 'Quarter'] as const).map((p) => (
                <button
                  key={p}
                  className={`${s.flowToggle} ${flowPeriod === p ? s.flowToggleActive : ''}`}
                  onClick={() => setFlowPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className={s.flowChartContainer}>
              {clientFlow.map((c) => (
                <div className={s.flowBarGroup} key={c.month}>
                  <div
                    className={`${s.flowBar} ${s.flowBarInflow}`}
                    style={{ height: `${(c.inflow / maxFlow) * 100}%` }}
                  />
                  <div
                    className={`${s.flowBar} ${s.flowBarOutflow}`}
                    style={{ height: `${(c.outflow / maxFlow) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className={s.flowXLabels}>
              {clientFlow.map((c) => (
                <span className={s.flowXLabel} key={c.month}>{c.month}</span>
              ))}
            </div>
            <div className={s.flowLegend}>
              <div className={s.legendItem}>
                <div className={s.legendSwatch} style={{ background: '#3a3a3a' }} />
                <span className={s.legendLabel}>New clients</span>
              </div>
              <div className={s.legendItem}>
                <div className={s.legendSwatch} style={{ background: '#d0cdc6' }} />
                <span className={s.legendLabel}>Closed trajectories</span>
              </div>
            </div>
          </div>

          {/* ── Row 4: Revenue Table ── */}
          <div
            ref={(el) => setWidgetRef(el, widgetIdx++)}
            className={`${s.widget} ${s.widgetSpan4} ${s.reveal} ${wc}`}
            style={{ animationDelay: '0.5s' }}
          >
            <WidgetHeader title="Revenue per week" customizing={customizing} />
            <table className={s.dataTable}>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Total</th>
                  <th>Diagnostics</th>
                  <th>Treatment</th>
                  <th>Workshop</th>
                  <th>eHealth</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.week}>
                    <td>{row.week}</td>
                    <td>{row.total}</td>
                    <td>{row.diagnostics}</td>
                    <td>{row.treatment}</td>
                    <td>{row.workshop}</td>
                    <td>{row.ehealth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ── Module Cards ── */}
      <div className={s.modulesRow}>
        {modules.map((mod, i) => (
          <div
            key={i}
            className={`${s.moduleTile} ${!mod.active ? s.moduleTileInactive : ''}`}
          >
            <div className={s.moduleName}>{mod.name}</div>
            <div className={s.moduleMetric}>{mod.metric}</div>
            {mod.trend && (
              <div className={`${s.moduleTrend} ${'trendNeg' in mod && mod.trendNeg ? s.moduleTrendNeg : ''}`}>
                {mod.trend}
              </div>
            )}
            <span className={`${s.moduleIndicator} ${mod.active ? s.moduleActive : s.moduleInactive}`} />
          </div>
        ))}
      </div>

      {/* ── AskMoody Bottom Bar ── */}
      <div className={s.askMoodyBar}>
        <div className={s.askMoodyLeft}>
          <span className={s.askMoodyDot}>&#x2726;</span>
          <span className={s.askMoodyLabel}>AskMoody</span>
        </div>
        <input
          type="text"
          className={s.askMoodyInput}
          placeholder="Ask about your practice data..."
          readOnly
        />
        <span className={s.askMoodyShortcut}>&#x2318;K</span>
      </div>
    </div>
  );
}
