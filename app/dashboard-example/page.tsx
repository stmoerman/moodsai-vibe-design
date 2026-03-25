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
        <span className={styles.navLogo}>Moods</span>
        <div className={styles.navRight}>
          <span className={styles.navName}>Dr. van Berg</span>
          <span className={styles.navAvatar}>JV</span>
        </div>
      </nav>

      {/* ===== Main Content ===== */}
      <main className={styles.main}>
        <div className={styles.content}>
          {/* ===== Section 1: Greeting ===== */}
          <div className={styles.greetingLabel}>Good morning</div>
          <div className={styles.greetingDate}>Wednesday, 25 March</div>
          <div className={styles.spacer48} />

          {/* ===== Section 2: Four Numbers ===== */}
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Revenue</div>
              <div className={styles.statValue}>&euro;18,430</div>
              <div className={styles.statTrendPositive}>+12% vs last week</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Sessions</div>
              <div className={styles.statValue}>142</div>
              <div className={styles.statTrendPositive}>+8% vs last month</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Declarability</div>
              <div className={styles.statValue}>78%</div>
              <div className={styles.statTrend}>Target 80%</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Team</div>
              <div className={styles.statValue}>8 of 12</div>
              <div className={styles.statTrend}>Online now</div>
            </div>
          </div>

          <div className={styles.spacer48} />
          <div className={styles.divider} />
          <div className={styles.spacer64} />

          {/* ===== Section 3: Today's Schedule ===== */}
          <div className={styles.sectionHeading}>Today</div>
          <div className={styles.sectionSub}>6 appointments &middot; 2 pending</div>
          <div className={styles.spacer24} />

          <div className={styles.scheduleRow}>
            <span className={styles.scheduleTime}>09:00</span>
            <span className={styles.scheduleClient}>M. de Vries</span>
            <span className={styles.scheduleTherapist}>Dr. Smit</span>
            <span className={styles.scheduleStatus}>Confirmed</span>
          </div>
          <div className={styles.scheduleRow}>
            <span className={styles.scheduleTime}>09:30</span>
            <span className={styles.scheduleClient}>J. Bakker</span>
            <span className={styles.scheduleTherapist}>Dr. van Dijk</span>
            <span className={styles.scheduleStatus}>Confirmed</span>
          </div>
          <div className={styles.scheduleRow}>
            <span className={styles.scheduleTime}>10:00</span>
            <span className={styles.scheduleClient}>A. Hoekstra</span>
            <span className={styles.scheduleTherapist}>Dr. Smit</span>
            <span className={styles.scheduleStatusPending}>Pending</span>
          </div>
          <div className={styles.scheduleRow}>
            <span className={styles.scheduleTime}>11:00</span>
            <span className={styles.scheduleClient}>S. Jansen</span>
            <span className={styles.scheduleTherapist}>Dr. de Vries</span>
            <span className={styles.scheduleStatus}>Confirmed</span>
          </div>
          <div className={styles.scheduleRow}>
            <span className={styles.scheduleTime}>13:00</span>
            <span className={styles.scheduleClient}>T. van Berg</span>
            <span className={styles.scheduleTherapist}>Dr. Smit</span>
            <span className={styles.scheduleStatus}>Confirmed</span>
          </div>
          <div className={styles.scheduleRow}>
            <span className={styles.scheduleTime}>14:00</span>
            <span className={styles.scheduleClientMuted}>&mdash;</span>
            <span className={styles.scheduleTherapist}>Dr. van Dijk</span>
            <span className={styles.scheduleStatusAvailable}>Available</span>
          </div>
          <div className={styles.scheduleRow}>
            <span className={styles.scheduleTime}>15:00</span>
            <span className={styles.scheduleClient}>E. Mulder</span>
            <span className={styles.scheduleTherapist}>Dr. de Vries</span>
            <span className={styles.scheduleStatusPending}>Pending</span>
          </div>

          <div className={styles.spacer64} />
          <div className={styles.divider} />
          <div className={styles.spacer64} />

          {/* ===== Section 4: Activity ===== */}
          <div className={styles.sectionHeading}>Activity</div>
          <div className={styles.spacer24} />

          <div className={styles.activityRow}>
            <span className={styles.activityText}>Session report generated &mdash; M. de Vries</span>
            <span className={styles.activityTime}>2m</span>
          </div>
          <div className={styles.activityRow}>
            <span className={styles.activityText}>New client registered &mdash; A. Hoekstra</span>
            <span className={styles.activityTime}>18m</span>
          </div>
          <div className={styles.activityRow}>
            <span className={styles.activityText}>Leave request &mdash; Dr. van Dijk</span>
            <span className={styles.activityTime}>1h</span>
          </div>
          <div className={styles.activityRow}>
            <span className={styles.activityText}>3 AI reports completed</span>
            <span className={styles.activityTime}>2h</span>
          </div>
          <div className={styles.activityRow}>
            <span className={styles.activityText}>Newsletter published</span>
            <span className={styles.activityTime}>3h</span>
          </div>

          <div className={styles.spacer64} />
          <div className={styles.divider} />
          <div className={styles.spacer64} />

          {/* ===== Section 5: AskMoody ===== */}
          <input
            type="text"
            className={styles.askInput}
            placeholder="Ask anything about your practice..."
            readOnly
          />
          <div className={styles.askMeta}>Powered by AI</div>

          <div className={styles.spacer64} />
          <div className={styles.divider} />
          <div className={styles.spacer64} />

          {/* ===== Section 6: Modules ===== */}
          <div className={styles.sectionHeading}>Modules</div>
          <div className={styles.sectionSub}>Active features for GGZ Noord</div>
          <div className={styles.spacer24} />

          <div className={styles.moduleGrid}>
            <div className={styles.moduleCardActive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>Core</span>
                <span className={styles.moduleStatusActive}>Active</span>
              </div>
              <p className={styles.moduleDesc}>
                Dashboard home, AI chat, settings, and member management. Always on.
              </p>
            </div>
            <div className={styles.moduleCardActive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>Video</span>
                <span className={styles.moduleStatusActive}>Active</span>
              </div>
              <p className={styles.moduleDesc}>
                Whereby video calls, virtual rooms, and session transcripts. Always on.
              </p>
            </div>
            <div className={styles.moduleCardActive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>HCI</span>
                <span className={styles.moduleStatusActive}>Active</span>
              </div>
              <p className={styles.moduleDesc}>
                HCI integration, employee data, declarability, and HR features.
              </p>
            </div>
            <div className={styles.moduleCardActive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>BI</span>
                <span className={styles.moduleStatusActive}>Active</span>
              </div>
              <p className={styles.moduleDesc}>
                Business intelligence dashboards, reports, and analytics.
              </p>
            </div>
            <div className={styles.moduleCardActive}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>Care</span>
                <span className={styles.moduleStatusActive}>Active</span>
              </div>
              <p className={styles.moduleDesc}>
                Care chat, eHealth tools, client onboarding, and referrals.
              </p>
            </div>
            <div className={styles.moduleCard}>
              <div className={styles.moduleHeader}>
                <span className={styles.moduleName}>Newsletter</span>
                <span className={styles.moduleStatusInactive}>Inactive</span>
              </div>
              <p className={styles.moduleDesc}>
                Newsletter creation and distribution for clients and staff.
              </p>
            </div>
          </div>

          {/* ===== Footer ===== */}
          <div className={styles.footer}>Moods AI &middot; Amsterdam</div>
        </div>
      </main>
    </>
  );
}
