'use client'
import { useRef, useLayoutEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './styles.module.css'

gsap.registerPlugin(ScrollTrigger)

// ── Types ──────────────────────────────────────────────────────────────────

type TabId = 'dashboard' | 'ai-docs' | 'scheduling' | 'hr-leave' | 'analytics' | 'communication'

interface NavItem {
  icon: string
  label: string
  id: string
  badge?: number
}

interface AppointmentSlot {
  time: string
  client?: string
  status?: 'confirmed' | 'pending'
}

interface NotifItem {
  dot: 'blue' | 'amber' | 'green'
  text: string
  time: string
}

interface TeamMember {
  initials: string
  color: string
  online: boolean
}

interface PlanId {
  id: 'free' | 'pro' | 'lifetime'
}

// ── Static data ────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { icon: '◉', label: 'Dashboard', id: 'dashboard' },
  { icon: '✦', label: 'AI Assistant', id: 'ai-docs' },
  { icon: '▦', label: 'Schedule', id: 'scheduling' },
  { icon: '▤', label: 'Clients', id: 'clients' },
  { icon: '☰', label: 'Team Chat', id: 'communication' },
  { icon: '▶', label: 'Video Rooms', id: 'video' },
  { icon: '◈', label: 'HR & Leave', id: 'hr-leave' },
  { icon: '∿', label: 'Analytics', id: 'analytics' },
  { icon: '◻', label: 'Knowledge Base', id: 'knowledge' },
  { icon: '⚙', label: 'Settings', id: 'settings' },
]

const APPOINTMENTS: AppointmentSlot[] = [
  { time: '09:00', client: 'M. de Vries', status: 'confirmed' },
  { time: '10:00', client: 'J. Bakker', status: 'confirmed' },
  { time: '11:00', client: 'S. Jansen', status: 'pending' },
  { time: '13:00' },
  { time: '14:00', client: 'T. van Berg', status: 'confirmed' },
  { time: '15:00', client: 'E. Smit', status: 'pending' },
]

const NOTIFICATIONS: NotifItem[] = [
  { dot: 'blue', text: 'New client registered: A. Hoekstra', time: '2m ago' },
  { dot: 'amber', text: 'Leave request pending — Dr. van Dijk', time: '18m ago' },
  { dot: 'green', text: 'Session report ready for review', time: '1h ago' },
]

const TEAM: TeamMember[] = [
  { initials: 'MV', color: '#5a7268', online: true },
  { initials: 'JB', color: '#4e565e', online: true },
  { initials: 'SJ', color: '#7a6e62', online: true },
  { initials: 'TH', color: '#6e7a82', online: true },
  { initials: 'EK', color: '#82736a', online: false },
  { initials: 'RV', color: '#5e6a72', online: false },
]

const REVENUE_POINTS = [11200, 13400, 12800, 15600, 14200, 17100, 18430]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const SECURITY_ITEMS = [
  { icon: '◆', name: 'NEN 7510', desc: 'Information security in healthcare' },
  { icon: '◇', name: 'NEN 7513', desc: 'Audit trail for patient record access' },
  { icon: '▪', name: 'AES-256 encryption', desc: 'All data encrypted at rest' },
  { icon: '▫', name: 'Field-level encryption', desc: 'Per-field PHI protection' },
]

const AUDIT_ROWS = [
  { ts: '2026-03-25 09:14', action: 'Session report generated', user: 'dr.smit@ggz' },
  { ts: '2026-03-25 08:52', action: 'Client record accessed', user: 'm.vries@ggz' },
  { ts: '2026-03-25 08:31', action: 'Login successful (MFA)', user: 'j.bakker@ggz' },
]

// ── Revenue SVG helpers ─────────────────────────────────────────────────────

function buildPolylinePoints(values: number[]): string {
  const W = 100
  const H = 80
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const pad = 8

  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W
      const y = H - pad - ((v - min) / range) * (H - pad * 2)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

function buildAreaPath(values: number[]): string {
  const W = 100
  const H = 80
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const pad = 8

  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W
    const y = H - pad - ((v - min) / range) * (H - pad * 2)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })

  const first = pts[0]
  const last = pts[pts.length - 1]
  return `M ${first} L ${pts.join(' L ')} L ${last.split(',')[0]},${H} L 0,${H} Z`
}

// ── Tab content panels ──────────────────────────────────────────────────────

function AiDocsPanel() {
  return (
    <div className={styles.dashGrid}>
      <div className={styles.widgetCardWide}>
        <div className={styles.widgetTitle}>AI Documentation</div>
        <div className={styles.chatPanel}>
          <div className={styles.chatBubble}>
            Generating SOAP note for session with M. de Vries (09:00)... Subjective: Patient reports reduced anxiety. Objective: Stable affect, cooperative. Assessment: GAD-7 score improved by 4 points. Plan: Continue CBT, next session in 2 weeks.
          </div>
          <div className={styles.docTagRow}>
            {['SOAP Note', 'DSM-5 Report', 'Progress Note', 'Intake Form'].map(t => (
              <span key={t} className={styles.docTag}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.widgetCard}>
        <div className={styles.widgetTitle}>Recent Documents</div>
        {['de Vries — SOAP 25/03', 'Bakker — Progress 24/03', 'Jansen — Intake 22/03'].map((d, i) => (
          <div key={i} className={i < 2 ? styles.docListItemBorder : styles.docListItem}>
            <span>{d}</span>
            <span className={styles.docViewLink}>View</span>
          </div>
        ))}
      </div>
      <div className={styles.widgetCard}>
        <div className={styles.widgetTitle}>Moody Insights</div>
        <div className={styles.insightsText}>
          3 sessions documented today. Average documentation time: <strong className={styles.insightsHighlight}>2m 14s</strong> vs 18 min manual. Time saved this week: <strong className={styles.insightsHighlight}>4.2 hrs</strong>.
        </div>
      </div>
      <div className={styles.widgetCardFull}>
        <div className={styles.widgetTitle}>AskMoody — AI Assistant</div>
        <div className={styles.chatPanel}>
          <div className={styles.chatBubble}>
            Based on the last 30 sessions, 78% of your clients show measurable improvement in GAD-7 scores within 6 weeks. This exceeds the national benchmark of 64%.
          </div>
          <div className={styles.chatInput}>
            <input className={styles.chatInputField} placeholder="Ask Moody anything about your practice..." />
            <button className={styles.chatSendBtn}>Ask</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SchedulingPanel() {
  const days = ['Mon 25', 'Tue 26', 'Wed 27', 'Thu 28', 'Fri 29']
  const slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
  const filled: Record<string, { client: string; status: 'confirmed' | 'pending' }> = {
    'Mon 25-09:00': { client: 'de Vries', status: 'confirmed' },
    'Mon 25-11:00': { client: 'Bakker', status: 'confirmed' },
    'Mon 25-14:00': { client: 'Jansen', status: 'pending' },
    'Tue 26-10:00': { client: 'van Berg', status: 'confirmed' },
    'Tue 26-13:00': { client: 'Smit', status: 'confirmed' },
    'Wed 27-09:00': { client: 'Hoekstra', status: 'pending' },
    'Wed 27-15:00': { client: 'de Jong', status: 'confirmed' },
    'Thu 28-11:00': { client: 'Visser', status: 'confirmed' },
    'Fri 29-10:00': { client: 'Mulder', status: 'pending' },
    'Fri 29-14:00': { client: 'Peters', status: 'confirmed' },
  }

  return (
    <div className={styles.scheduleWrap}>
      <div className={styles.scheduleTable}>
        <div className={styles.scheduleHeaderRow}>
          <div className={styles.scheduleHeaderEmpty} />
          {days.map(d => (
            <div key={d} className={styles.scheduleHeaderDay}>{d}</div>
          ))}
        </div>
        {slots.map(slot => (
          <div key={slot} className={styles.scheduleSlotRow}>
            <div className={styles.scheduleTimeLabel}>{slot}</div>
            {days.map(d => {
              const key = `${d}-${slot}`
              const appt = filled[key]
              return (
                <div key={d} className={styles.scheduleCell}>
                  {appt && (
                    <div className={appt.status === 'confirmed' ? styles.scheduleApptConfirmed : styles.scheduleApptPending}>{appt.client}</div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function HrLeavePanel() {
  const requests = [
    { name: 'Dr. van Dijk', type: 'Annual Leave', dates: '1–5 Apr', status: 'pending' },
    { name: 'M. de Vries', type: 'Sick Leave', dates: '24–25 Mar', status: 'approved' },
    { name: 'J. Bakker', type: 'Study Leave', dates: '28–29 Mar', status: 'approved' },
  ]

  return (
    <div className={styles.dashGrid}>
      <div className={styles.widgetCardWide}>
        <div className={styles.widgetTitle}>Leave Requests</div>
        <div className={styles.leaveList}>
          {requests.map((r, i) => (
            <div key={i} className={styles.leaveRow}>
              <div>
                <div className={styles.leaveName}>{r.name}</div>
                <div className={styles.leaveDetail}>{r.type} · {r.dates}</div>
              </div>
              <div className={styles.leaveActions}>
                <span className={r.status === 'pending' ? styles.statusBadgePending : styles.statusBadgeApproved}>{r.status.toUpperCase()}</span>
                {r.status === 'pending' && (
                  <>
                    <button className={styles.btnApprove}>Approve</button>
                    <button className={styles.btnDeny}>Deny</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.widgetCard}>
        <div className={styles.widgetTitle}>Team Availability</div>
        <div className={styles.availabilityList}>
          {[
            { name: 'Dr. Smit', days: 5, color: '#5a7268' },
            { name: 'Dr. van Dijk', days: 0, color: '#9c4040' },
            { name: 'M. de Vries', days: 4, color: '#5a7268' },
            { name: 'J. Bakker', days: 3, color: '#c48c28' },
          ].map((m, i) => (
            <div key={i} className={styles.availabilityRow}>
              <span className={styles.availabilityName}>{m.name}</span>
              <div className={styles.availabilityBarTrack}>
                <div className={styles.availabilityBarFill} style={{ width: `${(m.days / 5) * 100}%`, background: m.color }} />
              </div>
              <span className={styles.availabilityDays} style={{ color: m.color }}>{m.days}d</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.widgetCard}>
        <div className={styles.widgetTitle}>Headcount</div>
        <div className={styles.widgetValue}>12</div>
        <div className={styles.widgetMeta}>Staff members</div>
        <div className={styles.headcountBreakdown}>
          {[['Psychologists', '4'], ['Psychiatrists', '2'], ['Counselors', '4'], ['Admin', '2']].map(([role, n]) => (
            <div key={role} className={styles.headcountRow}>
              <span>{role}</span>
              <span className={styles.headcountValue}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsPanel() {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  const revenue = [14200, 15100, 13800, 16400, 17200, 18430]
  const declarability = [72, 74, 71, 75, 77, 78]

  return (
    <div className={styles.dashGrid}>
      <div className={styles.widgetCardWide}>
        <div className={styles.widgetTitle}>Revenue — 6 Month Trend</div>
        <div className={styles.analyticsBigValue}>€18,430</div>
        <div className={styles.analyticsTrend}>↑ 29.8% vs 6 months ago</div>
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" className={styles.analyticsSvg}>
          <defs>
            <linearGradient id="revGrad6" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5a7268" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#5a7268" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const min = Math.min(...revenue), max = Math.max(...revenue), range = max - min
            const pts = revenue.map((v, i) => `${(i / (revenue.length - 1) * 200).toFixed(1)},${(60 - 4 - ((v - min) / range) * 52).toFixed(1)}`)
            const first = pts[0], last = pts[pts.length - 1]
            return (
              <>
                <path d={`M ${first} L ${pts.join(' L ')} L ${last.split(',')[0]},60 L 0,60 Z`} fill="url(#revGrad6)" />
                <polyline points={pts.join(' ')} fill="none" stroke="#5a7268" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )
          })()}
        </svg>
        <div className={styles.analyticsChartLabels}>
          {months.map(m => <span key={m}>{m}</span>)}
        </div>
      </div>
      <div className={styles.widgetCard}>
        <div className={styles.widgetTitle}>Declarability</div>
        <div className={styles.declarabilityValue}>78%</div>
        <div className={styles.declarabilityTarget}>Target: 80%</div>
        <div className={styles.declarabilityList}>
          {months.map((m, i) => (
            <div key={m} className={styles.declarabilityRow}>
              <span className={styles.declarabilityLabel}>{m}</span>
              <div className={styles.declarabilityBarTrack}>
                <div className={styles.declarabilityBarFill} style={{ width: `${declarability[i]}%`, background: declarability[i] >= 80 ? '#5a7268' : '#c48c28' }} />
              </div>
              <span className={styles.declarabilityPercent}>{declarability[i]}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.widgetCard}>
        <div className={styles.widgetTitle}>Sessions This Month</div>
        <div className={styles.widgetValue}>142</div>
        <div className={styles.widgetMetaGood}>↑ 12% vs last month</div>
        <div className={styles.sessionsDetail}>
          <div>Completed: <strong className={styles.sessionsHighlightGreen}>138</strong></div>
          <div>Cancelled: <strong className={styles.sessionsHighlightRed}>4</strong></div>
          <div>Avg. duration: <strong className={styles.sessionsHighlightDefault}>47 min</strong></div>
        </div>
      </div>
      <div className={styles.widgetCard}>
        <div className={styles.widgetTitle}>Client Outcomes</div>
        <div className={styles.widgetValue}>78%</div>
        <div className={styles.widgetMeta}>Show measurable improvement</div>
        <div className={styles.outcomesDetail}>
          National benchmark: 64%<br />
          GAD-7 avg. improvement: <span className={styles.outcomesHighlight}>−4.2 pts</span>
        </div>
      </div>
      <div className={styles.widgetCard}>
        <div className={styles.widgetTitle}>Time Savings</div>
        <div className={styles.widgetValue}>4.2h</div>
        <div className={styles.widgetMeta}>saved per therapist / week</div>
        <div className={styles.timeSavingsDetail}>
          Documentation: 2m 14s avg<br />
          Manual baseline: 18 min<br />
          Efficiency gain: <span className={styles.timeSavingsHighlight}>88%</span>
        </div>
      </div>
    </div>
  )
}

function CommunicationPanel() {
  const messages = [
    { from: 'Dr. Smit', time: '09:32', text: 'Can someone cover the 14:00 slot tomorrow?', avatar: 'DS', color: '#4e565e', isBot: false },
    { from: 'M. de Vries', time: '09:35', text: 'I can do it. Already have capacity.', avatar: 'MV', color: '#5a7268', isBot: false },
    { from: 'AskMoody', time: '09:36', text: 'Scheduling confirmed. Calendar updated for both parties.', avatar: '✦', color: '#7a6e62', isBot: true },
  ]

  return (
    <div className={styles.dashGrid}>
      <div className={styles.widgetCardWide}>
        <div className={styles.widgetTitle}>Team Chat — #General</div>
        <div className={styles.chatMessages}>
          {messages.map((m, i) => (
            <div key={i} className={styles.chatMessageRow}>
              <div className={styles.chatMsgAvatar} style={{ background: m.color }}>
                <span className={m.isBot ? styles.chatMsgAvatarBot : styles.chatMsgAvatarText}>{m.avatar}</span>
              </div>
              <div>
                <div className={styles.chatMsgHeader}>
                  <span className={styles.chatMsgFrom}>{m.from}</span>
                  <span className={styles.chatMsgTime}>{m.time}</span>
                </div>
                <div className={m.isBot ? styles.chatMsgBubbleBot : styles.chatMsgBubbleUser}>{m.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.chatInput}>
          <input className={styles.chatInputField} placeholder="Message #general..." />
          <button className={styles.chatSendBtn}>Send</button>
        </div>
      </div>
      <div className={styles.widgetCard}>
        <div className={styles.widgetTitle}>Video Rooms</div>
        <div className={styles.videoRoomList}>
          {[
            { room: 'Room A', status: 'active' as const, who: 'Dr. Smit + M. de Vries' },
            { room: 'Room B', status: 'waiting' as const, who: 'J. Bakker (waiting)' },
            { room: 'Room C', status: 'idle' as const, who: 'Available' },
          ].map((r, i) => (
            <div key={i} className={styles.videoRoomItem}>
              <div>
                <div className={styles.videoRoomName}>{r.room}</div>
                <div className={styles.videoRoomWho}>{r.who}</div>
              </div>
              <span className={r.status === 'active' ? styles.statusActive : r.status === 'waiting' ? styles.statusWaiting : styles.statusIdle}>{r.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.widgetCard}>
        <div className={styles.widgetTitle}>Channels</div>
        {['# general', '# clinical', '# admin', '# urgent'].map((c, i) => (
          <div key={i} className={`${i < 3 ? styles.channelItemBorder : styles.channelItem} ${i === 0 ? styles.channelItemActive : ''}`}>
            <span>{c}</span>
            {i === 3 && <span className={styles.channelBadge}>2</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Plan selector ───────────────────────────────────────────────────────────

type PlanIdType = PlanId['id']

const PLANS: Array<{
  id: PlanIdType
  name: string
  price: string
  per: string
  badge?: string
  badgeType?: 'pro' | 'life'
  features: Array<{ label: string; included: boolean }>
}> = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    per: 'per user / month',
    features: [
      { label: '2 therapists', included: true },
      { label: 'Basic scheduling', included: true },
      { label: 'AI documentation', included: false },
      { label: 'Analytics', included: false },
      { label: 'HR & Leave', included: false },
      { label: 'NEN 7510 compliance', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€49',
    per: 'per user / month',
    badge: 'Most popular',
    badgeType: 'pro',
    features: [
      { label: 'Unlimited therapists', included: true },
      { label: 'Full scheduling', included: true },
      { label: 'AI documentation', included: true },
      { label: 'Analytics dashboard', included: true },
      { label: 'HR & Leave', included: true },
      { label: 'NEN 7510/7513 + AES-256', included: true },
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '€1,490',
    per: 'per seat, once',
    badge: 'Best value',
    badgeType: 'life',
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Lifetime updates', included: true },
      { label: 'Priority support', included: true },
      { label: 'Custom integrations', included: true },
      { label: 'On-premise option', included: true },
      { label: 'SLA guarantee', included: true },
    ],
  },
]

function PricingSection() {
  const [selected, setSelected] = useState<PlanIdType>('pro')

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Choose your plan</div>
      <div className={styles.sectionSubtitle}>Upgrade or change plan at any time. All plans include 14-day free trial.</div>

      <div className={styles.pricingGrid}>
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className={selected === plan.id ? styles.planCardActive : styles.planCard}
            onClick={() => setSelected(plan.id)}
          >
            <div className={styles.planHeader}>
              <div className={selected === plan.id ? styles.planRadioActive : styles.planRadio} />
              {plan.badge && (
                <span className={plan.badgeType === 'pro' ? styles.planBadgePro : styles.planBadgeLife}>
                  {plan.badge}
                </span>
              )}
            </div>
            <div className={styles.planName}>{plan.name}</div>
            <div className={styles.planPrice}>{plan.price}</div>
            <div className={styles.planPricePer}>{plan.per}</div>
            <ul className={styles.planFeatures}>
              {plan.features.map((f, i) => (
                <li key={i} className={styles.planFeature}>
                  <span className={f.included ? styles.featureCheck : styles.featureCross}>
                    {f.included ? '✓' : '–'}
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.upgradeRow}>
        <button className={styles.upgradeBtn}>
          Upgrade to {PLANS.find(p => p.id === selected)?.name ?? 'Pro'}
        </button>
        <span className={styles.upgradeMeta}>No credit card required for trial</span>
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

const FEATURE_TABS: Array<{ id: TabId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'ai-docs', label: 'AI Documentation' },
  { id: 'scheduling', label: 'Scheduling' },
  { id: 'hr-leave', label: 'HR & Leave' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'communication', label: 'Communication' },
]

export default function Design08() {
  const rootRef = useRef<HTMLDivElement>(null)
  const widgetsRef = useRef<HTMLDivElement>(null)
  const revenueLineRef = useRef<SVGPolylineElement | null>(null)
  const notifBadgeRef = useRef<HTMLDivElement>(null)
  const underHoodRef = useRef<HTMLDivElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const tabContentRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [revenueCount, setRevenueCount] = useState(0)
  const [gaugeReady, setGaugeReady] = useState(false)

  // Tab switch with GSAP cross-fade
  const handleTabChange = useCallback((newTab: TabId) => {
    if (newTab === activeTab) return
    const el = tabContentRef.current
    if (!el) { setActiveTab(newTab); return }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setActiveTab(newTab); return }

    const tl = gsap.timeline()
    tl.to(el, { opacity: 0, duration: 0.2, ease: 'power1.in' })
      .call(() => { setActiveTab(newTab) })
      .set(el, { opacity: 0 })
      .to(el, { opacity: 1, duration: 0.2, ease: 'power1.out' })
  }, [activeTab])

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      // Widget stagger-in
      if (widgetsRef.current && !prefersReduced) {
        const cards = widgetsRef.current.querySelectorAll<HTMLElement>('[class*="widgetCard"]')
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.1 }
        )
      }

      // Revenue polyline draw animation
      if (revenueLineRef.current && !prefersReduced) {
        const line = revenueLineRef.current
        const length = line.getTotalLength?.() ?? 200
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(line, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out', delay: 0.4 })
      }

      // Notification badge pulse
      if (notifBadgeRef.current && !prefersReduced) {
        gsap.to(notifBadgeRef.current, {
          scale: 1.15,
          duration: 1,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
        })
      }

      // Scroll-triggered sections
      const scrollEls = [underHoodRef.current, pricingRef.current, ctaRef.current].filter(Boolean)
      scrollEls.forEach(el => {
        if (!el || prefersReduced) return
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, rootRef)

    // Revenue count-up
    if (!prefersReduced) {
      const target = 18430
      const duration = 1200
      const start = performance.now()
      let rafId: number
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setRevenueCount(Math.round(eased * target))
        if (progress < 1) rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
      setTimeout(() => setGaugeReady(true), 600)
      return () => {
        cancelAnimationFrame(rafId)
        ctx.revert()
        ScrollTrigger.getAll().forEach(t => t.kill())
      }
    } else {
      setRevenueCount(18430)
      setGaugeReady(true)
    }

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  // Gauge arc animation when ready
  const r = 44
  const cx = 60
  const cy = 62
  const startAngle = 200
  const endAngle = 340
  const totalArc = endAngle - startAngle
  const circumference = (totalArc / 360) * 2 * Math.PI * r
  const pct = 0.78
  const dashOffset = circumference * (1 - pct)

  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180
  const arcPath = (start: number, end: number) => {
    const s = toRad(start), e = toRad(end)
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s)
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e)
    const large = end - start > 180 ? 1 : 0
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
  }

  const formattedRevenue = revenueCount.toLocaleString('nl-NL')

  return (
    <div ref={rootRef} className={styles.root}>

      {/* Welcome bar */}
      <div className={styles.welcomeBar}>
        <span className={styles.welcomeBarText}>
          This is a preview of <strong>Moods AI</strong> — the intelligent practice management platform for modern mental healthcare
        </span>
        <div className={styles.welcomeBarActions}>
          <button className={styles.btnLogIn}>Log In</button>
          <button className={styles.btnSignUp}>Sign Up Free</button>
        </div>
      </div>

      {/* App shell */}
      <div className={styles.appShell}>

        {/* Desktop sidebar */}
        <nav className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <div className={styles.sidebarLogoText}>Moods<span>.ai</span></div>
          </div>
          <div className={styles.sidebarNav}>
            {NAV_ITEMS.map((item, i) => {
              const isActive = item.id === activeTab || (item.id === 'dashboard' && activeTab === 'dashboard')
              const isTabNav = FEATURE_TABS.some(t => t.id === item.id)
              return (
                <button
                  key={i}
                  className={isActive ? styles.navItemActive : styles.navItem}
                  onClick={() => isTabNav ? handleTabChange(item.id as TabId) : undefined}
                  type="button"
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.id === 'clients' && <span className={styles.navBadge}>3</span>}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Mobile sidebar (top scroll) */}
        <nav className={styles.mobileSidebar}>
          {NAV_ITEMS.map((item, i) => {
            const isActive = item.id === activeTab
            const isTabNav = FEATURE_TABS.some(t => t.id === item.id)
            return (
              <button
                key={i}
                className={isActive ? styles.mobileNavItemActive : styles.mobileNavItem}
                onClick={() => isTabNav ? handleTabChange(item.id as TabId) : undefined}
                type="button"
              >
                <span className={styles.mobileNavIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Main content */}
        <main className={styles.mainContent}>

          {/* Dashboard header */}
          <div className={styles.dashHeader}>
            <div>
              <div className={styles.dashTitle}>Good morning, Dr. Smit</div>
              <div className={styles.dashSubtitle}>Wednesday, 25 March 2026 · Practice overview</div>
            </div>
            <div className={styles.dashHeaderRight}>
              <div className={styles.notifBell}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4e565e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <div ref={notifBadgeRef} className={styles.notifBadge}>3</div>
              </div>
              <div className={styles.userAvatar}>DS</div>
            </div>
          </div>

          {/* Feature tabs */}
          <div className={styles.featureTabs}>
            <div className={styles.tabList} role="tablist">
              {FEATURE_TABS.map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={activeTab === tab.id ? styles.tabActive : styles.tab}
                  onClick={() => handleTabChange(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div ref={tabContentRef} className={styles.tabContent}>
            {activeTab === 'dashboard' && (
              <div ref={widgetsRef} className={styles.dashGrid}>
                {/* Revenue Chart */}
                <div className={styles.widgetCardWide}>
                  <div className={styles.widgetTitle}>Revenue This Week</div>
                  <div className={styles.widgetValueGreen}>€{formattedRevenue}</div>
                  <div className={styles.widgetMetaGood}>↑ 12% vs last week</div>
                  <div className={styles.revenueChart}>
                    <svg viewBox="0 0 100 80" preserveAspectRatio="none" className={styles.chartSvg}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5a7268" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#5a7268" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={buildAreaPath(REVENUE_POINTS)} fill="url(#revenueGradient)" />
                      <polyline
                        ref={revenueLineRef}
                        points={buildPolylinePoints(REVENUE_POINTS)}
                        className={styles.chartLine}
                      />
                      {REVENUE_POINTS.map((_, i) => {
                        const pts = buildPolylinePoints(REVENUE_POINTS).split(' ')
                        const parts = pts[i]?.split(',')
                        const px = parts ? parseFloat(parts[0]) : 0
                        const py = parts ? parseFloat(parts[1]) : 0
                        return <circle key={i} cx={px} cy={py} r="2.5" className={styles.chartDot} />
                      })}
                    </svg>
                    <div className={styles.chartLabels}>
                      {DAYS.map(d => <span key={d}>{d}</span>)}
                    </div>
                  </div>
                </div>

                {/* Appointments */}
                <div className={styles.widgetCard}>
                  <div className={styles.widgetTitle}>Appointments Today</div>
                  <div className={styles.apptCount}>6</div>
                  <div className={styles.apptGrid}>
                    {APPOINTMENTS.map((a, i) => (
                      <div key={i} className={
                        !a.status ? styles.apptSlotEmpty :
                        a.status === 'confirmed' ? styles.apptSlotConfirmed :
                        styles.apptSlotPending
                      }>
                        <div className={styles.apptTime}>{a.time}</div>
                        {a.client && <div className={styles.apptClient}>{a.client}</div>}
                        {a.status && (
                          <div className={`${styles.apptStatus} ${a.status === 'confirmed' ? styles.apptStatusConfirmed : styles.apptStatusPending}`}>
                            {a.status === 'confirmed' ? '✓' : '⏳'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AskMoody */}
                <div className={styles.widgetCard}>
                  <div className={styles.widgetTitle}>AskMoody</div>
                  <div className={styles.chatPanel}>
                    <div className={styles.chatBubble}>
                      Revenue is up 12% from last week across all categories.<span className={styles.chatCursor} />
                    </div>
                    <div className={styles.chatInput}>
                      <input className={styles.chatInputField} placeholder="Ask Moody..." readOnly />
                      <button className={styles.chatSendBtn}>→</button>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className={styles.widgetCard}>
                  <div className={styles.widgetTitle}>Recent Notifications</div>
                  <div className={styles.notifList}>
                    {NOTIFICATIONS.map((n, i) => (
                      <div key={i} className={styles.notifItem}>
                        <div className={`${styles.notifDot} ${
                          n.dot === 'blue' ? styles.notifDotBlue :
                          n.dot === 'amber' ? styles.notifDotAmber :
                          styles.notifDotGreen
                        }`} />
                        <div>
                          <div className={styles.notifText}>{n.text}</div>
                          <div className={styles.notifTime}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Online */}
                <div className={styles.widgetCard}>
                  <div className={styles.widgetTitle}>Team Online</div>
                  <div className={styles.teamRow}>
                    {TEAM.filter(m => m.online).map((m, i) => (
                      <div key={i} className={styles.teamAvatar} style={{ background: m.color }}>
                        {m.initials}
                        <div className={styles.teamOnlineDot} />
                      </div>
                    ))}
                    {TEAM.filter(m => !m.online).map((m, i) => (
                      <div key={i} className={styles.teamAvatar} style={{ background: '#ddd', color: '#959ead' }}>
                        {m.initials}
                      </div>
                    ))}
                  </div>
                  <div className={styles.teamMeta}>
                    <span className={styles.teamMetaCount}>4</span> of 12 online
                  </div>
                </div>

                {/* Declarability gauge */}
                <div className={styles.widgetCard}>
                  <div className={styles.widgetTitle}>Declarability</div>
                  <div className={styles.gaugeWrap}>
                    <svg viewBox="0 0 120 72" className={styles.gaugeSvg}>
                      <path d={arcPath(startAngle, endAngle)} fill="none" stroke="#ebe7e1" strokeWidth="12" strokeLinecap="round" />
                      <path
                        d={arcPath(startAngle, endAngle)}
                        fill="none"
                        stroke="#5a7268"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${circumference}`}
                        strokeDashoffset={gaugeReady ? `${dashOffset}` : `${circumference}`}
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                      />
                      <text x={cx} y={cy + 4} className={styles.gaugeText}>78%</text>
                    </svg>
                    <div className={styles.gaugeTarget}>
                      Target: <span className={styles.gaugeTargetNum}>80%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'ai-docs' && <AiDocsPanel />}
            {activeTab === 'scheduling' && <SchedulingPanel />}
            {activeTab === 'hr-leave' && <HrLeavePanel />}
            {activeTab === 'analytics' && <AnalyticsPanel />}
            {activeTab === 'communication' && <CommunicationPanel />}
          </div>

          {/* Under the Hood */}
          <div ref={underHoodRef} className={styles.section}>
            <div className={styles.sectionTitle}>Under the Hood</div>
            <div className={styles.sectionSubtitle}>Compliance, security and auditability — built in from day one.</div>

            <div className={styles.hoodGrid}>
              <div className={styles.settingsPanel}>
                {SECURITY_ITEMS.map((item, i) => (
                  <div key={i} className={styles.settingsRow}>
                    <div className={styles.settingsLabel}>
                      <span className={styles.settingsIcon}>{item.icon}</span>
                      <div>
                        <div className={styles.settingsName}>{item.name}</div>
                        <div className={styles.settingsDesc}>{item.desc}</div>
                      </div>
                    </div>
                    <div className={styles.toggleOn}>
                      <div className={styles.togglePill} />
                      <span className={styles.toggleCheck}>✓</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className={styles.auditLogTitle}>Audit Log</div>
                <div className={styles.auditLog}>
                  <div className={styles.auditHeader}>
                    <span>Timestamp</span>
                    <span>Action</span>
                    <span className={styles.auditHeaderRight}>User</span>
                  </div>
                  {AUDIT_ROWS.map((row, i) => (
                    <div key={i} className={styles.auditRow}>
                      <span className={styles.auditTimestamp}>{row.ts}</span>
                      <span className={styles.auditAction}>{row.action}</span>
                      <span className={styles.auditUser}>{row.user}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div ref={pricingRef}>
            <PricingSection />
          </div>

          {/* CTA */}
          <div ref={ctaRef} className={styles.ctaSection}>
            <div className={styles.ctaHeadline}>This could be your dashboard tomorrow.</div>
            <div className={styles.ctaSubline}>Join 200+ Dutch GGZ practices already on Moods AI. No setup fee. Cancel anytime.</div>
            <button className={styles.ctaBtn}>Start 14-day free trial</button>
          </div>

        </main>
      </div>
    </div>
  )
}
