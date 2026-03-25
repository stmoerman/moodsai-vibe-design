import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Dashboard — Moods AI",
  description:
    "Organization owner dashboard example for GGZ Noord, built with the Moods AI design system.",
};

export default function DashboardExample() {
  return (
    <>
      {/* ===== Top Navigation ===== */}
      <nav className={styles.topNav}>
        <span className={styles.navLogo}>Moods.ai</span>

        <div className={styles.navTabs}>
          <span className={styles.navTabActive}>Overview</span>
          <span className={styles.navTab}>Schedule</span>
          <span className={styles.navTab}>Team</span>
          <span className={styles.navTab}>Analytics</span>
          <span className={styles.navTab}>Settings</span>
        </div>

        <div className={styles.navRight}>
          <span className={styles.navBell}>
            &#128276;
            <span className={styles.navBellDot} />
          </span>
          <span className={styles.navAvatar}>JV</span>
          <span className={styles.navOrg}>GGZ Noord</span>
        </div>
      </nav>

      {/* ===== Main Content ===== */}
      <main className={styles.main}>
        <div className={styles.content}>
          {/* ===== Header ===== */}
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.greeting}>Good morning, Dr. van Berg</h1>
              <p className={styles.headerMeta}>
                GGZ Noord &middot; Wednesday, 25 March 2026
              </p>
            </div>
            <div className={styles.headerRight}>
              <span className={styles.togglePillActive}>Today</span>
              <span className={styles.togglePill}>This week</span>
              <span className={styles.togglePill}>This month</span>
            </div>
          </header>

          {/* ===== Row 1: Key Metrics ===== */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Revenue</div>
              <div className={styles.statValue}>&euro;18,430</div>
              <div className={styles.statSub}>This week</div>
              <div className={styles.statTrendUp}>&uarr; 12% vs last week</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Sessions</div>
              <div className={styles.statValue}>142</div>
              <div className={styles.statSub}>This month</div>
              <div className={styles.statTrendUp}>&uarr; 8% vs last month</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Declarability</div>
              <div className={styles.statValue}>78%</div>
              <div className={styles.statSub}>Practice average</div>
              <div className={styles.statTrendWarn}>Target: 80%</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Team Online</div>
              <div className={styles.statValue}>8 / 12</div>
              <div className={styles.statSub}>Currently active</div>
              <div className={styles.statTrendNeutral}>&nbsp;</div>
            </div>
          </div>

          {/* ===== Row 2: Schedule + Activity ===== */}
          <div className={styles.twoCol}>
            {/* Today's Schedule */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Today&apos;s Schedule</h2>
              <table className={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Client</th>
                    <th>Therapist</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.tdMono}>09:00</td>
                    <td>M. de Vries</td>
                    <td>Dr. Smit</td>
                    <td>Session</td>
                    <td>
                      <span className={styles.badgeConfirmed}>Confirmed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.tdMono}>09:30</td>
                    <td>J. Bakker</td>
                    <td>Dr. van Dijk</td>
                    <td>Intake</td>
                    <td>
                      <span className={styles.badgeConfirmed}>Confirmed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.tdMono}>10:00</td>
                    <td>A. Hoekstra</td>
                    <td>Dr. Smit</td>
                    <td>Session</td>
                    <td>
                      <span className={styles.badgePending}>Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.tdMono}>11:00</td>
                    <td>S. Jansen</td>
                    <td>Dr. de Vries</td>
                    <td>Follow-up</td>
                    <td>
                      <span className={styles.badgeConfirmed}>Confirmed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.tdMono}>13:00</td>
                    <td>T. van Berg</td>
                    <td>Dr. Smit</td>
                    <td>Session</td>
                    <td>
                      <span className={styles.badgeConfirmed}>Confirmed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.tdMono}>14:00</td>
                    <td className={styles.tdMuted}>&mdash;</td>
                    <td>Dr. van Dijk</td>
                    <td>Available</td>
                    <td>
                      <span className={styles.badgeAvailable}>&mdash;</span>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.tdMono}>15:00</td>
                    <td>E. Mulder</td>
                    <td>Dr. de Vries</td>
                    <td>Session</td>
                    <td>
                      <span className={styles.badgePending}>Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recent Activity */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Recent Activity</h2>
              <ul className={styles.activityList}>
                <li className={styles.activityItem}>
                  <span className={`${styles.activityDot} ${styles.dotBlue}`} />
                  <span className={styles.activityText}>
                    Session report generated &mdash; M. de Vries
                  </span>
                  <span className={styles.activityTime}>2m ago</span>
                </li>
                <li className={styles.activityItem}>
                  <span
                    className={`${styles.activityDot} ${styles.dotGreen}`}
                  />
                  <span className={styles.activityText}>
                    New client registered &mdash; A. Hoekstra
                  </span>
                  <span className={styles.activityTime}>18m ago</span>
                </li>
                <li className={styles.activityItem}>
                  <span
                    className={`${styles.activityDot} ${styles.dotAmber}`}
                  />
                  <span className={styles.activityText}>
                    Leave request submitted &mdash; Dr. van Dijk
                  </span>
                  <span className={styles.activityTime}>1h ago</span>
                </li>
                <li className={styles.activityItem}>
                  <span
                    className={`${styles.activityDot} ${styles.dotPurple}`}
                  />
                  <span className={styles.activityText}>
                    AI documentation completed &mdash; 3 sessions
                  </span>
                  <span className={styles.activityTime}>2h ago</span>
                </li>
                <li className={styles.activityItem}>
                  <span className={`${styles.activityDot} ${styles.dotBlue}`} />
                  <span className={styles.activityText}>
                    Newsletter published &mdash; March Update
                  </span>
                  <span className={styles.activityTime}>3h ago</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ===== Row 3: AskMoody ===== */}
          <div className={styles.askMoody}>
            <div className={styles.askMoodyLeft}>
              <div className={styles.askMoodyTitle}>AskMoody</div>
              <div className={styles.askMoodySubtitle}>
                Ask anything about your practice
              </div>
            </div>
            <input
              type="text"
              className={styles.askMoodyInput}
              placeholder="What was our revenue breakdown last month?"
              readOnly
            />
            <span className={styles.askMoodyMeta}>Powered by AI</span>
          </div>

          {/* ===== Row 4: Active Modules ===== */}
          <h2 className={styles.sectionTitle}>Active Modules</h2>
          <div className={styles.moduleGrid}>
            <div className={styles.moduleCardActive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>Core</span>
                <span className={styles.moduleBadgeActive}>Active</span>
              </div>
              <p className={styles.moduleDesc}>
                Dashboard home, AI chat, settings, and member management.
                Always on.
              </p>
            </div>
            <div className={styles.moduleCardActive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>Video</span>
                <span className={styles.moduleBadgeActive}>Active</span>
              </div>
              <p className={styles.moduleDesc}>
                Whereby video calls, virtual rooms, and session transcripts.
                Always on.
              </p>
            </div>
            <div className={styles.moduleCardActive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>HCI</span>
                <span className={styles.moduleBadgeActive}>Active</span>
              </div>
              <p className={styles.moduleDesc}>
                HCI integration, employee data, declarability, and HR features.
              </p>
            </div>
            <div className={styles.moduleCardActive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>BI</span>
                <span className={styles.moduleBadgeActive}>Active</span>
              </div>
              <p className={styles.moduleDesc}>
                Business intelligence dashboards, reports, and analytics.
              </p>
            </div>
            <div className={styles.moduleCardActive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>Care</span>
                <span className={styles.moduleBadgeActive}>Active</span>
              </div>
              <p className={styles.moduleDesc}>
                Care chat, eHealth tools, client onboarding, and referrals.
              </p>
            </div>
            <div className={styles.moduleCardInactive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>Newsletter</span>
                <span className={styles.moduleBadgeInactive}>Inactive</span>
              </div>
              <p className={styles.moduleDesc}>
                Newsletter creation and distribution for clients and staff.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
