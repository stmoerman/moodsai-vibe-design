import type { Metadata } from "next";
import Link from "next/link";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Dashboard — Moods AI",
  description:
    "Organization owner dashboard example for GGZ Noord, built with the Design 10 visual language.",
};

export default function DashboardExample() {
  return (
    <div className={s.root}>
      {/* Dot-grid background */}
      <div className={s.dotGrid} aria-hidden="true" />

      {/* Scroll progress bar */}
      <div className={s.progressBar} aria-hidden="true" />

      {/* ── Navigation ── */}
      <nav className={s.nav}>
        <Link href="/" className={s.navLogo}>Moods.ai</Link>
        <ul className={s.navLinks}>
          <li><Link href="#" className={s.navLink}>Overview</Link></li>
          <li><Link href="#" className={s.navLink}>Schedule</Link></li>
          <li><Link href="#" className={s.navLink}>Team</Link></li>
          <li><Link href="#" className={s.navLink}>Analytics</Link></li>
          <li><Link href="#" className={s.navLink}>Settings</Link></li>
        </ul>
      </nav>

      <div className={s.page}>

        {/* ════════════════════════════════════════════
            Hero
        ════════════════════════════════════════════ */}
        <section className={s.hero}>
          <p className={s.heroEyebrow}>Practice Overview</p>

          <h1 className={s.heroHeadline}>
            Good morning, Dr. van Berg
            <svg
              className={s.heroUnderline}
              width="360"
              height="16"
              viewBox="0 0 360 16"
              aria-hidden="true"
            >
              <path
                d="M0,8 C30,2 60,14 90,6 C120,0 150,12 180,4 C210,-2 240,10 270,6 C300,2 330,10 360,8"
                className={s.underlinePath}
              />
            </svg>
          </h1>

          <p className={s.heroSub}>
            GGZ Noord &middot; Wednesday, 25 March 2026
          </p>
        </section>

        <div className={s.sectionDivider} />

        {/* ════════════════════════════════════════════
            01 — Overview
        ════════════════════════════════════════════ */}
        <section className={s.section}>
          <p className={s.sectionLabel}>01 &mdash; Overview</p>

          <div className={s.statsRow}>
            <div className={s.stat}>
              <div className={s.statLabel}>Revenue</div>
              <div className={s.statValue}>&euro;18,430</div>
              <div className={s.statTrend}>+12% vs last week</div>
            </div>
            <div className={s.statDivider} />
            <div className={s.stat}>
              <div className={s.statLabel}>Sessions</div>
              <div className={s.statValue}>142</div>
              <div className={s.statTrend}>+8% vs last week</div>
            </div>
            <div className={s.statDivider} />
            <div className={s.stat}>
              <div className={s.statLabel}>Declarability</div>
              <div className={s.statValue}>78%</div>
              <div className={s.statTrend}>Target 80%</div>
            </div>
            <div className={s.statDivider} />
            <div className={s.stat}>
              <div className={s.statLabel}>Team</div>
              <div className={s.statValue}>8/12</div>
              <div className={s.statTrend}>Online now</div>
            </div>
          </div>
        </section>

        <div className={s.sectionDivider} />

        {/* ════════════════════════════════════════════
            02 — Today
        ════════════════════════════════════════════ */}
        <section className={s.section}>
          <p className={s.sectionLabel}>02 &mdash; Today</p>

          <table className={s.scheduleTable}>
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
                <td><span className={s.statusConfirmed}>Confirmed</span></td>
              </tr>
              <tr>
                <td>09:30</td>
                <td>J. Bakker</td>
                <td>Dr. van Dijk</td>
                <td><span className={s.statusConfirmed}>Confirmed</span></td>
              </tr>
              <tr>
                <td>10:00</td>
                <td>A. Hoekstra</td>
                <td>Dr. Smit</td>
                <td><span className={s.statusPending}>Pending</span></td>
              </tr>
              <tr>
                <td>11:00</td>
                <td>S. Jansen</td>
                <td>Dr. de Vries</td>
                <td><span className={s.statusConfirmed}>Confirmed</span></td>
              </tr>
              <tr>
                <td>13:00</td>
                <td>T. van Berg</td>
                <td>Dr. Smit</td>
                <td><span className={s.statusConfirmed}>Confirmed</span></td>
              </tr>
              <tr>
                <td>14:00</td>
                <td className={s.tdMuted}>&mdash;</td>
                <td>Dr. van Dijk</td>
                <td><span className={s.statusConfirmed}>Available</span></td>
              </tr>
              <tr>
                <td>15:00</td>
                <td>E. Mulder</td>
                <td>Dr. de Vries</td>
                <td><span className={s.statusPending}>Pending</span></td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className={s.sectionDivider} />

        {/* ════════════════════════════════════════════
            03 — Recent
        ════════════════════════════════════════════ */}
        <section className={s.section}>
          <p className={s.sectionLabel}>03 &mdash; Recent</p>

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
        </section>

        <div className={s.sectionDivider} />

        {/* ════════════════════════════════════════════
            04 — Ask
        ════════════════════════════════════════════ */}
        <section className={s.section}>
          <p className={s.sectionLabel}>04 &mdash; Ask</p>

          <input
            type="text"
            className={s.askInput}
            placeholder="How did revenue compare this week vs last week?"
            readOnly
          />
          <div className={s.askMeta}>Powered by AI</div>
        </section>

        <div className={s.sectionDivider} />

        {/* ════════════════════════════════════════════
            05 — Modules
        ════════════════════════════════════════════ */}
        <section className={s.section}>
          <p className={s.sectionLabel}>05 &mdash; Modules</p>

          <div className={s.moduleGrid}>
            <div className={s.moduleCard}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>Core</span>
                <span className={s.moduleStatus}>Active</span>
              </div>
              <p className={s.moduleDesc}>
                Dashboard, AI chat, settings, and member management. Always on.
              </p>
            </div>
            <div className={s.moduleCard}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>Video</span>
                <span className={s.moduleStatus}>Active</span>
              </div>
              <p className={s.moduleDesc}>
                Whereby video rooms, virtual office, and session transcripts.
              </p>
            </div>
            <div className={s.moduleCard}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>HCI</span>
                <span className={s.moduleStatus}>Active</span>
              </div>
              <p className={s.moduleDesc}>
                HCI integration, employee data, declarability, and HR features.
              </p>
            </div>
            <div className={s.moduleCard}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>BI</span>
                <span className={s.moduleStatus}>Active</span>
              </div>
              <p className={s.moduleDesc}>
                Business intelligence dashboards, reports, and analytics.
              </p>
            </div>
            <div className={s.moduleCard}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>Care</span>
                <span className={s.moduleStatus}>Active</span>
              </div>
              <p className={s.moduleDesc}>
                Care chat, eHealth tools, client onboarding, and referrals.
              </p>
            </div>
            <div className={s.moduleCardInactive}>
              <div className={s.moduleHeader}>
                <span className={s.moduleName}>Newsletter</span>
                <span className={s.moduleStatus}>Inactive</span>
              </div>
              <p className={s.moduleDesc}>
                Newsletter creation and distribution for clients and staff.
              </p>
            </div>
          </div>
        </section>

        <div className={s.sectionDivider} />

        {/* ── Footer ── */}
        <footer className={s.footer}>
          <p className={s.footerText}>Moods AI &middot; Amsterdam</p>
        </footer>

      </div>
    </div>
  );
}
