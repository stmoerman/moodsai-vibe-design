import type { Metadata } from "next";
import Link from "next/link";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Dashboard — Moods AI",
  description:
    "Organization owner dashboard example for GGZ Noord, built with the Moods AI design system.",
};

export default function DashboardExample() {
  return (
    <div className={s.root}>
      <div className={s.container}>

        {/* ─── Header ─── */}
        <header className={s.header}>
          <div className={s.headerBreadcrumb}>
            <Link href="/">moods.ai</Link> / dashboard
          </div>
          <h1 className={s.headerTitle}>Practice Overview</h1>
          <p className={s.headerSubtitle}>
            GGZ Noord &middot; Dr. van Berg &middot; Wednesday, 25 March 2026
          </p>
          <p className={s.headerMeta}>Last synced 2 minutes ago</p>
        </header>

        {/* ═══════════════════════════════════════════════════════
            1. KEY METRICS
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <div className={s.statsGrid}>
            <div className={s.statCard}>
              <div className={s.statLabel}>Revenue</div>
              <div className={s.statValue}>&euro;18,430</div>
              <div className={s.statTrendUp}>&#9650; +12%</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>Sessions</div>
              <div className={s.statValue}>142</div>
              <div className={s.statTrendUp}>&#9650; +8%</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>Declarability</div>
              <div className={s.statValue}>78%</div>
              <div className={s.statTrendWarning}>Target 80%</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>Team</div>
              <div className={s.statValue}>8/12</div>
              <div className={s.statTrendUp}>Online now</div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            2. TODAY'S SCHEDULE
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Today</h2>
          <p className={s.sectionDesc}>6 appointments &middot; 2 pending</p>

          <div className={s.tableWrap}>
            <table className={s.dataTable}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Client</th>
                  <th>Therapist</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>09:00</td>
                  <td>M. de Vries</td>
                  <td>Dr. Smit</td>
                  <td><span className={s.badgeSuccess}>Confirmed</span></td>
                </tr>
                <tr>
                  <td>09:30</td>
                  <td>J. Bakker</td>
                  <td>Dr. van Dijk</td>
                  <td><span className={s.badgeSuccess}>Confirmed</span></td>
                </tr>
                <tr>
                  <td>10:00</td>
                  <td>A. Hoekstra</td>
                  <td>Dr. Smit</td>
                  <td><span className={s.badgeWarning}>Pending</span></td>
                </tr>
                <tr>
                  <td>11:00</td>
                  <td>S. Jansen</td>
                  <td>Dr. de Vries</td>
                  <td><span className={s.badgeSuccess}>Confirmed</span></td>
                </tr>
                <tr>
                  <td>13:00</td>
                  <td>T. van Berg</td>
                  <td>Dr. Smit</td>
                  <td><span className={s.badgeSuccess}>Confirmed</span></td>
                </tr>
                <tr>
                  <td>14:00</td>
                  <td className={s.tdMuted}>&mdash;</td>
                  <td>Dr. van Dijk</td>
                  <td><span className={s.badgeDefault}>Available</span></td>
                </tr>
                <tr>
                  <td>15:00</td>
                  <td>E. Mulder</td>
                  <td>Dr. de Vries</td>
                  <td><span className={s.badgeWarning}>Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            3. RECENT ACTIVITY
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Activity</h2>

          <div className={s.activityList}>
            <div className={s.activityRow}>
              <span className={s.activityText}>Session report generated &mdash; M. de Vries</span>
              <span className={s.activityTime}>2 min ago</span>
            </div>
            <div className={s.activityRow}>
              <span className={s.activityText}>New client registered &mdash; A. Hoekstra</span>
              <span className={s.activityTime}>18 min ago</span>
            </div>
            <div className={s.activityRow}>
              <span className={s.activityText}>Leave request submitted &mdash; Dr. van Dijk</span>
              <span className={s.activityTime}>1 hour ago</span>
            </div>
            <div className={s.activityRow}>
              <span className={s.activityText}>3 AI reports completed</span>
              <span className={s.activityTime}>2 hours ago</span>
            </div>
            <div className={s.activityRow}>
              <span className={s.activityText}>Newsletter published</span>
              <span className={s.activityTime}>3 hours ago</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            4. ASKMOODY
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>AskMoody</h2>
          <p className={s.sectionDesc}>Ask anything about your practice</p>

          <input
            type="text"
            className={s.askInput}
            placeholder="How did revenue compare this week vs last week?"
            readOnly
          />
          <div className={s.askMeta}>Powered by AI</div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            5. ACTIVE MODULES
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Modules</h2>

          <div className={s.moduleGrid}>
            <div className={s.moduleCardActive}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>Core</span>
                <span className={s.moduleStatusActive}>Active</span>
              </div>
              <p className={s.moduleDesc}>
                Dashboard, AI chat, settings, and member management. Always on.
              </p>
            </div>
            <div className={s.moduleCardActive}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>Video</span>
                <span className={s.moduleStatusActive}>Active</span>
              </div>
              <p className={s.moduleDesc}>
                Whereby video rooms, virtual office, and session transcripts.
              </p>
            </div>
            <div className={s.moduleCardActive}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>HCI</span>
                <span className={s.moduleStatusActive}>Active</span>
              </div>
              <p className={s.moduleDesc}>
                HCI integration, employee data, declarability, and HR features.
              </p>
            </div>
            <div className={s.moduleCardActive}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>BI</span>
                <span className={s.moduleStatusActive}>Active</span>
              </div>
              <p className={s.moduleDesc}>
                Business intelligence dashboards, reports, and analytics.
              </p>
            </div>
            <div className={s.moduleCardActive}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>Care</span>
                <span className={s.moduleStatusActive}>Active</span>
              </div>
              <p className={s.moduleDesc}>
                Care chat, eHealth tools, client onboarding, and referrals.
              </p>
            </div>
            <div className={s.moduleCard}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>Newsletter</span>
                <span className={s.moduleStatusInactive}>Inactive</span>
              </div>
              <p className={s.moduleDesc}>
                Newsletter creation and distribution for clients and staff.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <div className={s.footer}>Moods AI &middot; Amsterdam</div>

      </div>
    </div>
  );
}
