'use client';

import { useState, useEffect, useCallback } from 'react';
import { ResponsiveGridLayout, useContainerWidth } from 'react-grid-layout';
import type { Layout, LayoutItem } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Checkbox from '@radix-ui/react-checkbox';
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
  { week: 'W03', total: '€112.400', diagnostics: '€16.000', treatment: '€74.000', workshop: '€8.000', ehealth: '€14.400' },
  { week: 'W04', total: '€137.000', diagnostics: '€20.000', treatment: '€105.000', workshop: '€3.000', ehealth: '€9.000' },
  { week: 'W05', total: '€128.200', diagnostics: '€24.000', treatment: '€88.000', workshop: '€5.200', ehealth: '€11.000' },
  { week: 'W06', total: '€144.300', diagnostics: '€19.000', treatment: '€110.000', workshop: '€7.300', ehealth: '€8.000' },
  { week: 'W07', total: '€134.100', diagnostics: '€21.000', treatment: '€98.000', workshop: '€2.100', ehealth: '€13.000' },
  { week: 'W08', total: '€139.400', diagnostics: '€23.000', treatment: '€102.000', workshop: '€4.400', ehealth: '€10.000' },
];

const clientFlow = [
  { month: 'Okt', inflow: 78, outflow: 52 },
  { month: 'Nov', inflow: 65, outflow: 48 },
  { month: 'Dec', inflow: 42, outflow: 58 },
  { month: 'Jan', inflow: 88, outflow: 44 },
  { month: 'Feb', inflow: 72, outflow: 50 },
  { month: 'Mrt', inflow: 91, outflow: 46 },
];

const modules = [
  { name: 'Core', metric: 'Dashboard & AI', trend: null, active: true },
  { name: 'Video', metric: '8 kamers', trend: '+2 deze week', active: true },
  { name: 'HCI', metric: '78% decl.', trend: '-2% vs target', trendNeg: true, active: true },
  { name: 'BI', metric: '12 rapporten', trend: '+3 nieuw', active: true },
  { name: 'Care', metric: '3 verwijzingen', trend: '+1 vandaag', active: true },
  { name: 'Nieuwsbrief', metric: 'Niet actief', trend: null, active: false },
];

/* ── Widget titles map ── */
const WIDGET_TITLES: Record<string, string> = {
  'stat-revenue': 'Omzet deze week',
  'stat-clients': 'Cli\u00ebnten',
  'stat-hours': 'Directe uren',
  'stat-declarability': 'Declarabiliteit',
  'chart-revenue': 'Omzet per week',
  'breakdown-revenue': 'Huidige maand',
  'declaration-control': 'Declaratiecontrole',
  'client-flow': 'Cli\u00ebntenstroom',
  'table-revenue': 'Omzettabel',
};

/* ── Default grid layout ── */
const DEFAULT_LAYOUT: Layout = [
  { i: 'stat-revenue', x: 0, y: 0, w: 3, h: 5, minW: 2, minH: 4 },
  { i: 'stat-clients', x: 3, y: 0, w: 3, h: 5, minW: 2, minH: 4 },
  { i: 'stat-hours', x: 6, y: 0, w: 3, h: 5, minW: 2, minH: 4 },
  { i: 'stat-declarability', x: 9, y: 0, w: 3, h: 5, minW: 2, minH: 4 },
  { i: 'chart-revenue', x: 0, y: 5, w: 9, h: 8, minW: 4, minH: 6 },
  { i: 'breakdown-revenue', x: 9, y: 5, w: 3, h: 8, minW: 2, minH: 5 },
  { i: 'declaration-control', x: 0, y: 13, w: 6, h: 6, minW: 3, minH: 4 },
  { i: 'client-flow', x: 6, y: 13, w: 6, h: 6, minW: 3, minH: 4 },
  { i: 'table-revenue', x: 0, y: 19, w: 12, h: 7, minW: 6, minH: 5 },
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
        {!customizing && (
          <button className={s.aiButton} aria-label="Vraag Moody hierover">
            &#x2726;
            <span className={s.aiTooltip}>Vraag Moody hierover</span>
          </button>
        )}
      </div>
    </div>
  );
}

const navTabs = [
  { label: 'Overzicht', id: 'overzicht' },
  { label: 'Omzet', id: 'omzet' },
  { label: 'Declaraties', id: 'declaraties' },
  { label: 'Cli\u00ebntenstroom', id: 'clientenstroom' },
  { label: 'Modules', id: 'modules' },
];

/* ── Main Component ── */
export default function DashboardExample3() {
  const [now, setNow] = useState<Date | null>(null);
  const [customizing, setCustomizing] = useState(false);
  const [activeTab, setActiveTab] = useState('overzicht');
  const [moodyOpen, setMoodyOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    year: '2026',
    month: 'Maart',
  });
  const [selectedWeeks, setSelectedWeeks] = useState<Set<string>>(new Set());
  const [flowPeriod, setFlowPeriod] = useState<'Week' | 'Month' | 'Quarter'>('Month');

  // react-grid-layout state
  const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT);
  const [hiddenWidgets, setHiddenWidgets] = useState<Set<string>>(new Set());
  const { width, containerRef, mounted } = useContainerWidth();

  // Live clock
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // ⌘K to toggle AskMoody
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setMoodyOpen((v) => !v);
      }
      if (e.key === 'Escape' && moodyOpen) {
        setMoodyOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [moodyOpen]);

  const greeting = now ? getGreeting(now.getHours()) : 'Goedemiddag';
  const dateStr = now ? formatDate(now) : '';

  const maxBarTotal = Math.max(...weeklyRevenue.map((w) => w.diagnostics + w.treatment + w.workshop + w.ehealth));
  const maxFlow = Math.max(...clientFlow.flatMap((c) => [c.inflow, c.outflow]));

  const filterOptions: Record<string, string[]> = {
    year: ['2024', '2025', '2026'],
    month: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
  };

  const weekOptions = ['W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08', 'W09', 'W10'];

  function selectFilter(key: string, value: string) {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }

  function toggleWeek(week: string) {
    setSelectedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  }

  function selectAllWeeks() {
    setSelectedWeeks(new Set());
  }

  const weekLabel = selectedWeeks.size === 0
    ? 'Alle weken'
    : selectedWeeks.size === 1
      ? Array.from(selectedWeeks)[0]
      : `${selectedWeeks.size} weken`;

  function resetFilters() {
    setActiveFilters({ year: '2026', month: 'Maart' });
    setSelectedWeeks(new Set());
  }

  const toggleHide = useCallback((id: string) => {
    setHiddenWidgets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const restoreWidget = useCallback((id: string) => {
    setHiddenWidgets((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  function handleReset() {
    setLayout(DEFAULT_LAYOUT);
    setHiddenWidgets(new Set());
  }

  const visibleLayout = layout.filter((l) => !hiddenWidgets.has(l.i));

  /* ── renderWidget: returns the content for each widget ID ── */
  function renderWidget(id: string) {
    switch (id) {
      case 'stat-revenue':
        return (
          <>
            <WidgetHeader title="Omzet deze week" customizing={customizing} />
            <div className={s.statValue}>&euro;155.068</div>
            <div className={s.statLabel}>Totaal deze week</div>
            <div className={`${s.statTrend} ${s.trendPositive}`}>&uarr; 1,6%</div>
            <Sparkline points={[120, 128, 118, 135, 142, 148, 155]} />
          </>
        );

      case 'stat-clients':
        return (
          <>
            <WidgetHeader title="Cli&euml;nten" customizing={customizing} />
            <div className={s.statValue}>1.587</div>
            <div className={s.statLabel}>Totaal actief</div>
            <div className={`${s.statTrend} ${s.trendPositive}`}>+12 deze maand</div>
            <Sparkline points={[1540, 1548, 1555, 1562, 1570, 1578, 1587]} />
          </>
        );

      case 'stat-hours':
        return (
          <>
            <WidgetHeader title="Directe uren" customizing={customizing} />
            <div className={s.statValue}>23.528</div>
            <div className={s.statLabel}>Indirect: 2.396</div>
            <div className={`${s.statTrend} ${s.trendPositive}`}>&uarr; 3,2%</div>
            <Sparkline points={[22100, 22400, 22800, 23000, 23100, 23350, 23528]} />
          </>
        );

      case 'stat-declarability':
        return (
          <>
            <WidgetHeader title="Declarabiliteit" customizing={customizing} />
            <div className={s.statValue}>78%</div>
            <div className={s.statLabel}>Target: 80%</div>
            <div className={`${s.statTrend} ${s.trendWarning}`}>&minus;2% onder target</div>
            <Sparkline points={[76, 77, 79, 78, 77, 78, 78]} />
          </>
        );

      case 'chart-revenue':
        return (
          <>
            <WidgetHeader title="Omzet per week" customizing={customizing} />
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
                  { color: '#3a3a3a', label: 'Diagnostiek' },
                  { color: '#8b6d4f', label: 'Behandeling' },
                  { color: '#b8a898', label: 'Workshop' },
                  { color: '#d0cdc6', label: 'E-health' },
                ].map((l) => (
                  <div className={s.legendItem} key={l.label}>
                    <div className={s.legendSwatch} style={{ background: l.color }} />
                    <span className={s.legendLabel}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'breakdown-revenue':
        return (
          <>
            <WidgetHeader title="Huidige maand" customizing={customizing} />
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
          </>
        );

      case 'declaration-control':
        return (
          <>
            <WidgetHeader title="Declaratiecontrole" customizing={customizing} />
            <div className={s.declLargeValue}>&euro;95.575 <span className={`${s.statTrend} ${s.trendPositive}`}>&uarr;</span></div>
            <div className={s.declDeviation}>Afwijking: +5,45%</div>
            <div className={s.declRow}>
              <span className={s.declLabel}>Ingediend</span>
              <span className={s.declValue}>&euro;1.754.571</span>
            </div>
            <div className={s.declRow}>
              <span className={s.declLabel}>Goedgekeurd</span>
              <span className={s.declValue}>&euro;1.659.000</span>
            </div>
            <div className={s.declFootnote}>10.812 declaraties &middot; 2.349 afwijkingen gevonden</div>
          </>
        );

      case 'client-flow':
        return (
          <>
            <WidgetHeader title="Cli&euml;ntenstroom" customizing={customizing} />
            <div className={s.flowToggles}>
              {(['Week', 'Month', 'Quarter'] as const).map((p) => (
                <button
                  key={p}
                  className={`${s.flowToggle} ${flowPeriod === p ? s.flowToggleActive : ''}`}
                  onClick={() => setFlowPeriod(p)}
                >
                  {p === 'Month' ? 'Maand' : p === 'Quarter' ? 'Kwartaal' : p}
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
                <span className={s.legendLabel}>Nieuwe cli&euml;nten</span>
              </div>
              <div className={s.legendItem}>
                <div className={s.legendSwatch} style={{ background: '#d0cdc6' }} />
                <span className={s.legendLabel}>Afgesloten trajecten</span>
              </div>
            </div>
          </>
        );

      case 'table-revenue':
        return (
          <>
            <WidgetHeader title="Omzet per week" customizing={customizing} />
            <table className={s.dataTable}>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Totaal</th>
                  <th>Diagnostiek</th>
                  <th>Behandeling</th>
                  <th>Workshop</th>
                  <th>E-health</th>
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
          </>
        );

      default:
        return null;
    }
  }

  return (
    <div className={s.root}>
      <div className={s.dotGrid} aria-hidden="true" />

      {/* ── Welcome ── */}
      <div className={s.welcomeHero}>
        <h1 className={s.greeting}>{greeting}, Jaime</h1>
        <svg className={s.greetingUnderline} width="280" height="12" viewBox="0 0 280 12" aria-hidden="true">
          <path
            d="M0,6 C23,1 46,11 70,5 C93,0 116,10 140,4 C163,-1 186,9 210,5 C233,1 256,9 280,6"
            className={s.greetingUnderlinePath}
          />
        </svg>
        <span className={s.dateTime} suppressHydrationWarning>BI Dashboard &middot; Amsterdam &middot; {dateStr}</span>
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
          {/* Year + Month dropdowns */}
          {/* Year + Month dropdowns (Radix) */}
          {(['year', 'month'] as const).map((key) => (
            <DropdownMenu.Root key={key}>
              <DropdownMenu.Trigger asChild>
                <button className={s.filterBtn}>
                  <span className={s.filterBtnLabel}>{key === 'year' ? 'Jaar' : 'Maand'}</span>
                  <span className={s.filterBtnValue}>{activeFilters[key]}</span>
                  <svg className={s.filterBtnChevron} width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 4l2 2 2-2" />
                  </svg>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className={s.filterMenu} sideOffset={4} align="start">
                  {filterOptions[key].map((opt) => (
                    <DropdownMenu.Item
                      key={opt}
                      className={`${s.filterOption} ${activeFilters[key] === opt ? s.filterOptionActive : ''}`}
                      onSelect={() => selectFilter(key, opt)}
                    >
                      {opt}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ))}

          {/* Week multi-select (Radix) */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className={s.filterBtn}>
                <span className={s.filterBtnLabel}>Week</span>
                <span className={s.filterBtnValue}>{weekLabel}</span>
                <svg className={s.filterBtnChevron} width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 4l2 2 2-2" />
                </svg>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className={s.filterMenu} sideOffset={4} align="start">
                <DropdownMenu.Item
                  className={`${s.filterOption} ${selectedWeeks.size === 0 ? s.filterOptionActive : ''}`}
                  onSelect={selectAllWeeks}
                >
                  Alle weken
                </DropdownMenu.Item>
                <DropdownMenu.Separator className={s.filterSeparator} />
                {weekOptions.map((w) => (
                  <DropdownMenu.CheckboxItem
                    key={w}
                    className={s.filterCheckOption}
                    checked={selectedWeeks.has(w)}
                    onCheckedChange={() => toggleWeek(w)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    <DropdownMenu.ItemIndicator className={s.filterCheckIndicator}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </DropdownMenu.ItemIndicator>
                    <span>{w}</span>
                  </DropdownMenu.CheckboxItem>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <button className={s.filterReset} onClick={resetFilters} title="Filters herstellen">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── AskMoody Trigger ── */}
      <div className={s.askMoodyTriggerRow}>
        <button className={s.askMoodyTrigger} onClick={() => setMoodyOpen(true)}>
          <span className={s.askMoodyDot}>&#x2726;</span>
          <span>Vraag iets aan Moody...</span>
          <span className={s.askMoodyShortcut}>&#x2318;K</span>
        </button>
      </div>

      {/* ── AskMoody Side Panel ── */}
      {moodyOpen && (
        <div className={s.moodyOverlay} onClick={() => setMoodyOpen(false)}>
          <div className={s.moodyPanel} onClick={(e) => e.stopPropagation()}>
            <div className={s.moodyHeader}>
              <div className={s.moodyHeaderLeft}>
                <span className={s.askMoodyDot}>&#x2726;</span>
                <span className={s.moodyHeaderTitle}>AskMoody</span>
              </div>
              <button className={s.moodyClose} onClick={() => setMoodyOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" />
                </svg>
              </button>
            </div>
            <div className={s.moodyMessages}>
              <div className={s.moodyMsgSystem}>
                Hoi Jaime! Ik kan je helpen met vragen over je praktijkdata. Probeer bijvoorbeeld:
              </div>
              <div className={s.moodySuggestions}>
                <button className={s.moodySuggestion} onClick={() => {}}>Wat is onze omzet deze maand?</button>
                <button className={s.moodySuggestion} onClick={() => {}}>Hoeveel cli&euml;nten zijn er deze week?</button>
                <button className={s.moodySuggestion} onClick={() => {}}>Toon declarabiliteit per therapeut</button>
              </div>
              <div className={s.moodyMsgUser}>
                Wat is onze omzet deze maand?
              </div>
              <div className={s.moodyMsgAi}>
                <p>De omzet voor maart 2026 is <strong>&euro;152.631</strong>, verdeeld over:</p>
                <ul>
                  <li>Behandeling: &euro;108.114 (68%)</li>
                  <li>Diagnostiek: &euro;19.253 (13%)</li>
                  <li>E-health: &euro;3.026 (2%)</li>
                  <li>Workshop: &euro;736 (1%)</li>
                </ul>
                <p>Dit is 1,6% hoger dan vorige maand.</p>
              </div>
            </div>
            <div className={s.moodyInputArea}>
              <input
                type="text"
                className={s.moodyInput}
                placeholder="Stel een vraag..."
                autoFocus
              />
              <button className={s.moodySendBtn}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2L7 9M14 2L9.5 14L7 9L2 6.5L14 2Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Widget Grid ── */}
      <div className={s.widgetGridArea}>
        <div className={s.customizeRow}>
          {customizing && (
            <button onClick={handleReset} className={s.resetBtn}>
              Herstellen
            </button>
          )}
          <button
            className={`${s.customizeBtn} ${customizing ? s.customizeBtnActive : ''}`}
            onClick={() => setCustomizing(!customizing)}
          >
            {customizing ? 'Klaar' : 'Aanpassen'}
          </button>
        </div>

        <div ref={containerRef as React.RefObject<HTMLDivElement>}>
          {mounted && (
            <ResponsiveGridLayout
              layouts={{ lg: visibleLayout as LayoutItem[] }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={40}
              width={width}
              dragConfig={{ enabled: customizing, handle: '.rgl-drag-handle' }}
              resizeConfig={{ enabled: customizing }}
              onLayoutChange={(currentLayout: Layout) => {
                setLayout((prev) => {
                  const hiddenItems = prev.filter((l) => hiddenWidgets.has(l.i));
                  return [...currentLayout, ...hiddenItems];
                });
              }}
              margin={[16, 16] as [number, number]}
              containerPadding={[0, 0] as [number, number]}
            >
              {visibleLayout.map((item) => (
                <div key={item.i} className={`${s.widgetCard} ${customizing ? s.widgetCustomizing : ''}`}>
                  {customizing && (
                    <div className={s.widgetToolbar}>
                      <span className="rgl-drag-handle" style={{ cursor: 'grab' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#d0cdc6">
                          <circle cx="5" cy="4" r="1.5" /><circle cx="11" cy="4" r="1.5" />
                          <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
                          <circle cx="5" cy="12" r="1.5" /><circle cx="11" cy="12" r="1.5" />
                        </svg>
                      </span>
                      <button onClick={() => toggleHide(item.i)} className={s.hideWidgetBtn}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <line x1="2" y1="2" x2="12" y2="12" /><line x1="12" y1="2" x2="2" y2="12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {renderWidget(item.i)}
                </div>
              ))}
            </ResponsiveGridLayout>
          )}
        </div>

        {/* ── Hidden Widgets Panel ── */}
        {customizing && hiddenWidgets.size > 0 && (
          <div className={s.hiddenPanel}>
            <div className={s.hiddenPanelLabel}>Verborgen widgets</div>
            <div className={s.hiddenPanelItems}>
              {Array.from(hiddenWidgets).map((id) => (
                <button key={id} className={s.hiddenItem} onClick={() => restoreWidget(id)}>
                  {WIDGET_TITLES[id]} <span>+ Tonen</span>
                </button>
              ))}
            </div>
          </div>
        )}
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

      {/* AskMoody moved to inline position above widget grid */}
    </div>
  );
}
