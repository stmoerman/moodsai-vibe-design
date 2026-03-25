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
      <div className={s.container}>

        {/* ─── Header ─── */}
        <header className={s.header}>
          <div className={s.headerBreadcrumb}>
            <Link href="/">moods.ai</Link> / dashboard
          </div>
          <h1 className={s.headerTitle}>Practice Overview</h1>
          <p className={s.headerSubtitle}>
            GGZ Horizon &middot; Dr. de Groot &middot; Wednesday, 25 March 2026
          </p>
          <p className={s.headerMeta}>2 of 6 modules active</p>
        </header>

        {/* ═══════════════════════════════════════════════════════
            1. GETTING STARTED CHECKLIST
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <div className={s.checklistCard}>
            <div className={s.checklistLabel}>Getting Started</div>

            <div className={s.checklistItem}>
              <span className={s.checklistIconDone}>&#10003;</span>
              <div className={s.checklistContent}>
                <div className={s.checklistTitleDone}>Create your organization</div>
              </div>
            </div>

            <div className={s.checklistItem}>
              <span className={s.checklistIconDone}>&#10003;</span>
              <div className={s.checklistContent}>
                <div className={s.checklistTitleDone}>Invite your first team member</div>
              </div>
            </div>

            <div className={s.checklistItemCurrent}>
              <span className={s.checklistIconCurrent}>&rarr;</span>
              <div className={s.checklistContent}>
                <div className={s.checklistTitleCurrent}>Set up a video room</div>
              </div>
            </div>

            <div className={s.checklistItem}>
              <span className={s.checklistIconUpcoming}>&#9675;</span>
              <div className={s.checklistContent}>
                <div className={s.checklistTitleUpcoming}>Try AI chat with AskMoody</div>
              </div>
            </div>

            <div className={s.checklistItem}>
              <span className={s.checklistIconUpcoming}>&#9675;</span>
              <div className={s.checklistContent}>
                <div className={s.checklistTitleUpcoming}>Explore available modules</div>
              </div>
            </div>

            <button className={s.checklistDismiss}>Dismiss</button>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            2. ACTIVE MODULE CARDS
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <div className={s.activeModuleGrid}>
            <div className={s.activeModuleCard}>
              <div className={s.activeModuleLabel}>Core</div>
              <div className={s.activeModuleStat}>3 team members</div>
              <div className={s.activeModuleTrend}>1 online now</div>
              <div className={s.activeModuleLinks}>
                <Link href="#" className={s.activeModuleLink}>AI Chat</Link>
                <Link href="#" className={s.activeModuleLink}>Members</Link>
                <Link href="#" className={s.activeModuleLink}>Settings</Link>
              </div>
            </div>

            <div className={s.activeModuleCard}>
              <div className={s.activeModuleLabel}>Video</div>
              <div className={s.activeModuleStat}>2 rooms</div>
              <div className={s.activeModuleTrend}>0 active sessions</div>
              <div className={s.activeModuleLinks}>
                <Link href="#" className={s.activeModuleLink}>Rooms</Link>
                <Link href="#" className={s.activeModuleLink}>Start call</Link>
                <Link href="#" className={s.activeModuleLink}>Transcripts</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            3. RECENT ACTIVITY
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Activity</h2>

          <div className={s.activityList}>
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
            placeholder="How do I set up my first video room?"
            readOnly
          />
          <div className={s.askMeta}>Powered by AI</div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            5. AVAILABLE MODULES
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Available Modules</h2>
          <p className={s.sectionDesc}>
            Activate additional modules to unlock more features for your practice.
          </p>

          <div className={s.availableModuleGrid}>
            <div className={s.availableModuleCard}>
              <div className={s.availableModuleLabel}>HCI</div>
              <div className={s.availableModuleTitle}>Practice management &amp; HR</div>
              <p className={s.availableModuleDesc}>
                Connect your HCI system for employee data, declarability tracking, leave management, and HR features.
              </p>
              <Link href="#" className={s.availableModuleActivate}>Activate module &rarr;</Link>
            </div>

            <div className={s.availableModuleCard}>
              <div className={s.availableModuleLabel}>BI</div>
              <div className={s.availableModuleTitle}>Dashboards &amp; analytics</div>
              <p className={s.availableModuleDesc}>
                Revenue insights, custom KPI dashboards, reports, and financial control for your practice.
              </p>
              <Link href="#" className={s.availableModuleActivate}>Activate module &rarr;</Link>
            </div>

            <div className={s.availableModuleCard}>
              <div className={s.availableModuleLabel}>Care</div>
              <div className={s.availableModuleTitle}>Client communication</div>
              <p className={s.availableModuleDesc}>
                Encrypted care chat, eHealth content, client onboarding pipeline, and referral processing.
              </p>
              <Link href="#" className={s.availableModuleActivate}>Activate module &rarr;</Link>
            </div>

            <div className={s.availableModuleCard}>
              <div className={s.availableModuleLabel}>Newsletter</div>
              <div className={s.availableModuleTitle}>Team communication</div>
              <p className={s.availableModuleDesc}>
                Create and distribute internal newsletters with approval workflows and read tracking.
              </p>
              <Link href="#" className={s.availableModuleActivate}>Activate module &rarr;</Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            6. ENABLED MODULES SUMMARY
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
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

        {/* ─── Footer ─── */}
        <div className={s.footer}>Moods AI &middot; Amsterdam</div>

      </div>
    </div>
  );
}
