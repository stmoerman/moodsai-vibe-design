import type { Metadata } from "next";
import Link from "next/link";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Dashboard — Moods AI",
  description:
    "Modular dashboard example for GGZ Horizon — new organization with core and video modules only.",
};

export default function DashboardExample2() {
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
            Good morning, Dr. de Groot
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
            GGZ Horizon &middot; Wednesday, 25 March 2026
          </p>
          <p className={s.heroMeta}>2 of 6 modules active</p>
        </section>

        <div className={s.sectionDivider} />

        {/* ════════════════════════════════════════════
            01 — Begin
        ════════════════════════════════════════════ */}
        <section className={s.section}>
          <p className={s.sectionLabel}>01 &mdash; Begin</p>

          <div className={s.checklistDone}>
            <svg className={s.checkmarkSvg} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3,12 L9,18 L21,6" className={s.checkPath} />
            </svg>
            <span className={s.checklistTextDone}>Create your organization</span>
          </div>

          <div className={s.checklistDone}>
            <svg className={s.checkmarkSvg} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3,12 L9,18 L21,6" className={s.checkPath} />
            </svg>
            <span className={s.checklistTextDone}>Invite your first team member</span>
          </div>

          <div className={s.checklistCurrent}>
            <span className={s.checklistIcon}>&rarr;</span>
            <span className={s.checklistText}>Set up a video room</span>
          </div>

          <div className={s.checklistUpcoming}>
            <span className={s.checklistIcon}>&#9675;</span>
            <span className={s.checklistText}>Try AI chat with AskMoody</span>
          </div>

          <div className={s.checklistUpcoming}>
            <span className={s.checklistIcon}>&#9675;</span>
            <span className={s.checklistText}>Explore available modules</span>
          </div>
        </section>

        <div className={s.sectionDivider} />

        {/* ════════════════════════════════════════════
            02 — Active
        ════════════════════════════════════════════ */}
        <section className={s.section}>
          <p className={s.sectionLabel}>02 &mdash; Active</p>

          <div className={s.activeModuleGrid}>
            <div className={s.activeModuleCard}>
              <div className={s.activeModuleName}>Core</div>
              <div className={s.activeModuleStat}>3 team members</div>
              <div className={s.activeModuleTrend}>1 online now</div>
            </div>

            <div className={s.activeModuleCard}>
              <div className={s.activeModuleName}>Video</div>
              <div className={s.activeModuleStat}>2 rooms</div>
              <div className={s.activeModuleTrend}>0 active sessions</div>
            </div>
          </div>
        </section>

        <div className={s.sectionDivider} />

        {/* ════════════════════════════════════════════
            03 — Recent
        ════════════════════════════════════════════ */}
        <section className={s.section}>
          <p className={s.sectionLabel}>03 &mdash; Recent</p>

          <div className={s.activityRow}>
            <span className={s.activityText}>Organization created</span>
            <span className={s.activityTime}>1d ago</span>
          </div>
          <div className={s.activityRow}>
            <span className={s.activityText}>Dr. de Groot joined as owner</span>
            <span className={s.activityTime}>1d ago</span>
          </div>
          <div className={s.activityRow}>
            <span className={s.activityText}>Video room &lsquo;Therapy A&rsquo; created</span>
            <span className={s.activityTime}>5h ago</span>
          </div>
          <div className={s.activityRow}>
            <span className={s.activityText}>M. Bakker invited to team</span>
            <span className={s.activityTime}>3h ago</span>
          </div>
          <div className={s.activityRow}>
            <span className={s.activityText}>AskMoody: first conversation</span>
            <span className={s.activityTime}>1h ago</span>
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
            placeholder="How do I set up my first video room?"
            readOnly
          />
          <div className={s.askMeta}>Powered by AI</div>
        </section>

        <div className={s.sectionDivider} />

        {/* ════════════════════════════════════════════
            05 — Discover
        ════════════════════════════════════════════ */}
        <section className={s.section}>
          <p className={s.sectionLabel}>05 &mdash; Discover</p>

          <div className={s.availableModuleGrid}>
            <div className={s.availableModuleCard}>
              <div className={s.availableModuleName}>HCI</div>
              <div className={s.availableModuleTitle}>Practice management &amp; HR</div>
              <p className={s.availableModuleDesc}>
                Connect your HCI system for employee data, declarability tracking, leave management, and HR features.
              </p>
              <Link href="#" className={s.availableModuleActivate}>Activate &rarr;</Link>
            </div>

            <div className={s.availableModuleCard}>
              <div className={s.availableModuleName}>BI</div>
              <div className={s.availableModuleTitle}>Dashboards &amp; analytics</div>
              <p className={s.availableModuleDesc}>
                Revenue insights, custom KPI dashboards, reports, and financial control for your practice.
              </p>
              <Link href="#" className={s.availableModuleActivate}>Activate &rarr;</Link>
            </div>

            <div className={s.availableModuleCard}>
              <div className={s.availableModuleName}>Care</div>
              <div className={s.availableModuleTitle}>Client communication</div>
              <p className={s.availableModuleDesc}>
                Encrypted care chat, eHealth content, client onboarding pipeline, and referral processing.
              </p>
              <Link href="#" className={s.availableModuleActivate}>Activate &rarr;</Link>
            </div>

            <div className={s.availableModuleCard}>
              <div className={s.availableModuleName}>Newsletter</div>
              <div className={s.availableModuleTitle}>Team communication</div>
              <p className={s.availableModuleDesc}>
                Create and distribute internal newsletters with approval workflows and read tracking.
              </p>
              <Link href="#" className={s.availableModuleActivate}>Activate &rarr;</Link>
            </div>
          </div>
        </section>

        <div className={s.sectionDivider} />

        {/* ════════════════════════════════════════════
            06 — Status
        ════════════════════════════════════════════ */}
        <section className={s.section}>
          <p className={s.sectionLabel}>06 &mdash; Status</p>

          <div className={s.moduleSummary}>
            <div className={s.moduleSummaryItem}>
              <span className={s.moduleDotActive} />
              <span className={s.moduleSummaryName}>Core</span>
            </div>
            <div className={s.moduleSummaryItem}>
              <span className={s.moduleDotActive} />
              <span className={s.moduleSummaryName}>Video</span>
            </div>
            <div className={s.moduleSummaryItem}>
              <span className={s.moduleDotInactive} />
              <span className={s.moduleSummaryNameMuted}>HCI</span>
            </div>
            <div className={s.moduleSummaryItem}>
              <span className={s.moduleDotInactive} />
              <span className={s.moduleSummaryNameMuted}>BI</span>
            </div>
            <div className={s.moduleSummaryItem}>
              <span className={s.moduleDotInactive} />
              <span className={s.moduleSummaryNameMuted}>Care</span>
            </div>
            <div className={s.moduleSummaryItem}>
              <span className={s.moduleDotInactive} />
              <span className={s.moduleSummaryNameMuted}>Newsletter</span>
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
