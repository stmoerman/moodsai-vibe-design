'use client'

import { useState } from 'react'
import Link from 'next/link'
import s from './DesignSystem.module.css'

/* ── Color data ──────────────────────────────────────────── */

const coreColors = [
  { token: '--bg',             name: 'Pearl Bush',   hex: '#E7E1D5', usage: 'Page backgrounds',              dark: false, sampleText: 'Background' },
  { token: '--surface',        name: 'Paper',        hex: '#f2eee9', usage: 'Cards, elevated surfaces',      dark: false, sampleText: 'Surface' },
  { token: '--text',           name: 'Masala',       hex: '#423C38', usage: 'Primary text, headings',        dark: true,  sampleText: 'Primary text' },
  { token: '--text-secondary', name: 'Slate',        hex: '#4e565e', usage: 'Body text',                     dark: true,  sampleText: 'Body text' },
  { token: '--text-muted',     name: 'Pewter',       hex: '#8a7e79', usage: 'Labels, metadata, captions',    dark: true,  sampleText: 'Muted label' },
  { token: '--border',         name: 'Silver Rust',  hex: '#CBBDB9', usage: 'Borders, dividers',             dark: false, sampleText: 'Border line' },
  { token: '--dark',           name: 'Dune',         hex: '#211E1C', usage: 'Dark sections, nav, footers',   dark: true,  sampleText: 'Dark surface' },
]

const accentColors = [
  { token: '--accent',  name: 'Blue Ribbon', hex: '#2559F4', usage: 'Primary CTA, links, active states', dark: true,  sampleText: 'Call to action' },
  { token: '--success', name: 'Sage',        hex: '#5a7268', usage: 'Positive metrics, confirmations',   dark: true,  sampleText: 'Confirmed' },
  { token: '--warning', name: 'Amber',       hex: '#c48c28', usage: 'Pending states, caution',           dark: false, sampleText: 'Pending' },
  { token: '--error',   name: 'Ember',       hex: '#c44',    usage: 'Errors, destructive actions',       dark: true,  sampleText: 'Error state' },
  { token: '--danger',  name: 'Rose',        hex: '#9c4040', usage: 'Critical alerts',                   dark: true,  sampleText: 'Critical' },
]

const neutralColors = [
  { token: '--neutral-50',  hex: '#faf8f5', usage: 'Lightest surface',        dark: false },
  { token: '--neutral-100', hex: '#f5f1ec', usage: 'Hover state backgrounds', dark: false },
  { token: '--neutral-200', hex: '#e2ded8', usage: 'Subtle borders',          dark: false },
  { token: '--neutral-300', hex: '#d0cdc6', usage: 'Disabled, placeholder',   dark: false },
  { token: '--neutral-400', hex: '#b0b7c1', usage: 'Chart labels',            dark: false },
  { token: '--neutral-500', hex: '#8a7e79', usage: 'Muted text',              dark: true  },
  { token: '--neutral-600', hex: '#4e565e', usage: 'Secondary text',          dark: true  },
  { token: '--neutral-700', hex: '#423C38', usage: 'Primary text',            dark: true  },
  { token: '--neutral-800', hex: '#211E1C', usage: 'Dark surfaces',           dark: true  },
]

/* ── Spacing scale ───────────────────────────────────────── */

const spacingScale = [
  { px: 4,   rem: '0.25rem',  name: 'Micro' },
  { px: 8,   rem: '0.5rem',   name: 'Tight' },
  { px: 12,  rem: '0.75rem',  name: 'Compact' },
  { px: 16,  rem: '1rem',     name: 'Base' },
  { px: 24,  rem: '1.5rem',   name: 'Comfortable' },
  { px: 32,  rem: '2rem',     name: 'Spacious' },
  { px: 48,  rem: '3rem',     name: 'Section gap' },
  { px: 64,  rem: '4rem',     name: 'Section padding' },
  { px: 96,  rem: '6rem',     name: 'Hero padding' },
  { px: 128, rem: '8rem',     name: 'Max gap' },
]

/* ── Color swatch ────────────────────────────────────────── */

function Swatch({ token, name, hex, usage, dark, sampleText }: {
  token: string; name?: string; hex: string; usage: string; dark: boolean; sampleText?: string
}) {
  return (
    <div className={s.colorSwatch}>
      <div
        className={`${s.colorSwatchBlock} ${dark ? s.colorSwatchBlockDark : s.colorSwatchBlockLight}`}
        style={{ backgroundColor: hex }}
      >
        {sampleText || hex}
      </div>
      <div className={s.colorSwatchInfo}>
        {name && <div className={s.colorSwatchName}>{name}</div>}
        <div className={s.colorSwatchToken}>{token}</div>
        <div className={s.colorSwatchHex}>{hex}</div>
        <div className={s.colorSwatchUsage}>{usage}</div>
      </div>
    </div>
  )
}

function NeutralSwatch({ token, hex, usage, dark }: {
  token: string; hex: string; usage: string; dark: boolean
}) {
  return (
    <div className={s.colorSwatch}>
      <div
        className={`${s.colorSwatchBlock} ${dark ? s.colorSwatchBlockDark : s.colorSwatchBlockLight}`}
        style={{ backgroundColor: hex }}
      >
        {hex}
      </div>
      <div className={s.colorSwatchInfo}>
        <div className={s.colorSwatchToken}>{token}</div>
        <div className={s.colorSwatchHex}>{hex}</div>
        <div className={s.colorSwatchUsage}>{usage}</div>
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────── */

export default function DesignSystem() {
  const [toggleOn, setToggleOn] = useState(true)
  const [checkboxOn, setCheckboxOn] = useState(true)

  return (
    <div className={s.root}>
      <div className={s.container}>

        {/* ─── Header ─── */}
        <header className={s.header}>
          <Link href="/" className={s.headerBackLink}>&larr; Back to Gallery</Link>
          <h1 className={s.headerTitle}>Moods AI Design System</h1>
          <p className={s.headerSubtitle}>
            Visual guidelines for the Moods AI platform. Derived from reMarkable&apos;s paper-first
            philosophy. Sharp corners, generous whitespace, restrained color.
          </p>
        </header>

        {/* ═══════════════════════════════════════════════════════
            1. COLORS
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Colors</h2>

          <div className={s.colorGroup}>
            <div className={s.colorGroupLabel}>Core</div>
            <div className={s.colorGrid}>
              {coreColors.map(c => <Swatch key={c.token} {...c} />)}
            </div>
          </div>

          <div className={s.colorGroup}>
            <div className={s.colorGroupLabel}>Accents</div>
            <div className={s.colorGrid}>
              {accentColors.map(c => <Swatch key={c.token} {...c} />)}
            </div>
          </div>

          <div className={s.colorGroup}>
            <div className={s.colorGroupLabel}>Neutral Scale</div>
            <div className={s.colorGrid}>
              {neutralColors.map(c => <NeutralSwatch key={c.token} {...c} />)}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            2. TYPOGRAPHY
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Typography</h2>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>Heading Scale</div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Display</span>
                <span>EB Garamond &middot; 3.5rem &middot; 400 &middot; -0.02em</span>
              </div>
              <div className={s.headingDisplay}>Paper-first design</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>H1</span>
                <span>EB Garamond &middot; 2.5rem &middot; 400 &middot; -0.02em</span>
              </div>
              <div className={s.headingH1}>The intelligent practice</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>H2</span>
                <span>EB Garamond &middot; 1.8rem &middot; 400 &middot; -0.01em</span>
              </div>
              <div className={s.headingH2}>AI-Powered Documentation</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>H3</span>
                <span>EB Garamond &middot; 1.3rem &middot; 400</span>
              </div>
              <div className={s.headingH3}>Voice-to-Report</div>
            </div>
          </div>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>Body Text</div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Body</span>
                <span>Crimson Pro &middot; 1rem &middot; 400</span>
              </div>
              <p className={s.bodyBase}>
                Every session captured with clinical precision. Moods transforms spoken words into structured,
                compliant documentation &mdash; so you can focus on the person in front of you.
              </p>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Body Small</span>
                <span>Crimson Pro &middot; 0.875rem &middot; 400</span>
              </div>
              <p className={s.bodySmall}>
                Session metadata: 45 min duration, cognitive behavioral therapy, progress note generated.
              </p>
            </div>
          </div>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>Mono &amp; Data</div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Label</span>
                <span>Space Mono &middot; 0.7rem &middot; 500 &middot; 0.15em uppercase</span>
              </div>
              <div className={s.monoLabel}>REVENUE THIS WEEK</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Data</span>
                <span>Space Mono &middot; varies &middot; 700</span>
              </div>
              <div className={s.monoData}>&euro;18,430</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Code</span>
                <span>Space Mono &middot; 0.8125rem &middot; 400</span>
              </div>
              <div className={s.monoCode}>moods ai:dictate --output=report</div>
            </div>
          </div>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>Specimen Paragraph</div>
            <p className={s.specimenParagraph}>
              Mental healthcare documentation should feel as natural as writing on paper.
              Moods AI builds on reMarkable&apos;s principle that the best tools disappear into
              the workflow. Every typeface, every spacing decision, every color choice serves
              clarity and calm. The serif warmth of EB Garamond and Crimson Pro conveys
              authority without coldness; Space Mono grounds data in precision.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            3. SPACING
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Spacing</h2>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>Scale: 4 &middot; 8 &middot; 12 &middot; 16 &middot; 24 &middot; 32 &middot; 48 &middot; 64 &middot; 96 &middot; 128</div>
            {spacingScale.map(sp => (
              <div key={sp.px} className={s.spacingRow}>
                <div className={s.spacingBlock} style={{ width: sp.px }} />
                <span className={s.spacingMeta}>
                  {sp.px}px ({sp.rem})
                  <span className={s.spacingName}>&mdash; {sp.name}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            4. BUTTONS
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Buttons</h2>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>Button Variants &mdash; Default &amp; Hover</div>
            <div className={s.buttonRow}>
              <div className={s.buttonPair}>
                <span className={s.buttonPairLabel}>Primary</span>
                <button className={s.btnPrimary}>Get Started</button>
                <span className={s.buttonStateLabel}>default</span>
                <button className={s.btnPrimaryHover}>Get Started</button>
                <span className={s.buttonStateLabel}>hover</span>
              </div>
              <div className={s.buttonPair}>
                <span className={s.buttonPairLabel}>Secondary</span>
                <button className={s.btnSecondary}>Learn More</button>
                <span className={s.buttonStateLabel}>default</span>
                <button className={s.btnSecondaryHover}>Learn More</button>
                <span className={s.buttonStateLabel}>hover</span>
              </div>
              <div className={s.buttonPair}>
                <span className={s.buttonPairLabel}>Accent</span>
                <button className={s.btnAccent}>Schedule Demo</button>
                <span className={s.buttonStateLabel}>default</span>
                <button className={s.btnAccentHover}>Schedule Demo</button>
                <span className={s.buttonStateLabel}>hover</span>
              </div>
              <div className={s.buttonPair}>
                <span className={s.buttonPairLabel}>Ghost</span>
                <button className={s.btnGhost}>View details</button>
                <span className={s.buttonStateLabel}>default</span>
                <button className={s.btnGhostHover}>View details</button>
                <span className={s.buttonStateLabel}>hover</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            5. CARDS
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Cards</h2>

          <div className={s.cardGrid}>
            <div className={s.cardDefault}>
              <div className={s.cardTag}>Default</div>
              <div className={s.cardTitle}>Session Notes</div>
              <div className={s.cardBody}>
                Surface background with 1px border. No border-radius. Clean and flat.
              </div>
            </div>
            <div className={s.cardElevated}>
              <div className={s.cardTag}>Elevated</div>
              <div className={s.cardTitle}>Weekly Report</div>
              <div className={s.cardBody}>
                Same as default plus subtle box-shadow for layering hierarchy.
              </div>
            </div>
            <div className={s.cardInteractive}>
              <div className={s.cardTag}>Interactive</div>
              <div className={s.cardTitle}>Patient Profile</div>
              <div className={s.cardBody}>
                Hover to see translateY(-2px) lift with enhanced shadow. Try it.
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            6. FORM CONTROLS
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Form Controls</h2>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>Input &amp; Select</div>
            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="ds-text">Text Input</label>
                <input
                  id="ds-text"
                  type="text"
                  className={s.inputText}
                  placeholder="Enter patient name..."
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="ds-select">Select</label>
                <select id="ds-select" className={s.selectInput}>
                  <option>Cognitive Behavioral</option>
                  <option>Psychodynamic</option>
                  <option>Humanistic</option>
                </select>
              </div>
            </div>
          </div>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>Toggle &amp; Checkbox</div>
            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Toggle</label>
                <div className={s.toggleWrapper}>
                  <button
                    className={toggleOn ? s.toggleOn : s.toggle}
                    onClick={() => setToggleOn(!toggleOn)}
                    role="switch"
                    aria-checked={toggleOn}
                    aria-label="Auto-generate reports"
                  >
                    <div className={s.toggleKnob} />
                  </button>
                  <span className={s.toggleLabel}>{toggleOn ? 'On' : 'Off'}</span>
                </div>
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Checkbox</label>
                <div
                  className={s.checkboxWrapper}
                  onClick={() => setCheckboxOn(!checkboxOn)}
                  role="checkbox"
                  aria-checked={checkboxOn}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setCheckboxOn(!checkboxOn) }}
                >
                  <div className={checkboxOn ? s.checkboxChecked : s.checkbox}>
                    {checkboxOn && <span className={s.checkboxCheck}>&#10003;</span>}
                  </div>
                  <span className={s.checkboxLabel}>Auto-generate progress notes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            7. BADGES & TAGS
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Badges &amp; Tags</h2>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>Badge Variants</div>
            <div className={s.badgeRow}>
              <span className={s.badgeDefault}>Default</span>
              <span className={s.badgeSuccess}>Success</span>
              <span className={s.badgeWarning}>Warning</span>
              <span className={s.badgeError}>Error</span>
              <span className={s.badgeDanger}>Danger</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            8. DASHBOARD COMPONENTS
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Dashboard Components</h2>
          <p className={s.sectionDesc}>
            Practical specimens showing how the Moods AI dashboard should look. These patterns
            define stat cards, charts, data tables, and navigation.
          </p>

          {/* Stat cards */}
          <h3 className={s.sectionSubtitle}>Stat Cards</h3>
          <div className={s.dashGrid}>
            <div className={s.statCard}>
              <div className={s.statLabel}>Sessions Today</div>
              <div className={s.statValue}>12</div>
              <div className={s.statTrendUp}>&#9650; 8% vs last week</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>Revenue MTD</div>
              <div className={s.statValue}>&euro;18,430</div>
              <div className={s.statTrendUp}>&#9650; 12% vs last month</div>
            </div>
            <div className={s.statCard}>
              <div className={s.statLabel}>Cancellations</div>
              <div className={s.statValue}>3</div>
              <div className={s.statTrendDown}>&#9660; 2 more than avg</div>
            </div>
          </div>

          {/* Mini chart */}
          <h3 className={s.sectionSubtitle}>Chart Placeholder</h3>
          <div className={s.chartPlaceholder}>
            <div className={s.specimenLabel}>Weekly Sessions</div>
            <div className={s.chartBox}>
              <div className={s.chartBar} style={{ height: '40%' }} />
              <div className={s.chartBar} style={{ height: '65%' }} />
              <div className={s.chartBar} style={{ height: '55%' }} />
              <div className={s.chartBar} style={{ height: '80%' }} />
              <div className={s.chartBar} style={{ height: '70%' }} />
              <div className={s.chartBar} style={{ height: '90%' }} />
              <div className={s.chartBar} style={{ height: '45%' }} />
            </div>
            <div className={s.chartLabels}>
              <span className={s.chartLabel}>Mon</span>
              <span className={s.chartLabel}>Tue</span>
              <span className={s.chartLabel}>Wed</span>
              <span className={s.chartLabel}>Thu</span>
              <span className={s.chartLabel}>Fri</span>
              <span className={s.chartLabel}>Sat</span>
              <span className={s.chartLabel}>Sun</span>
            </div>
          </div>

          {/* Data table */}
          <h3 className={s.sectionSubtitle}>Data Table Row</h3>
          <div className={s.specimen}>
            <table className={s.dataTable}>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Anna M.</td>
                  <td>CBT</td>
                  <td className={s.dataTableMono}>45 min</td>
                  <td><span className={s.badgeSuccess}>Complete</span></td>
                </tr>
                <tr>
                  <td>Erik J.</td>
                  <td>Psychodynamic</td>
                  <td className={s.dataTableMono}>60 min</td>
                  <td><span className={s.badgeWarning}>In progress</span></td>
                </tr>
                <tr>
                  <td>Lisa K.</td>
                  <td>Group therapy</td>
                  <td className={s.dataTableMono}>90 min</td>
                  <td><span className={s.badgeDefault}>Scheduled</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Navigation items */}
          <h3 className={s.sectionSubtitle}>Navigation Items</h3>
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Sidebar Nav &mdash; Active &amp; Inactive</div>
            <div className={s.navList}>
              <div className={s.navItemActive}>
                <span className={s.navItemIcon}>&#9632;</span> Dashboard
              </div>
              <div className={s.navItem}>
                <span className={s.navItemIcon}>&#9632;</span> Patients
              </div>
              <div className={s.navItem}>
                <span className={s.navItemIcon}>&#9632;</span> Sessions
              </div>
              <div className={s.navItem}>
                <span className={s.navItemIcon}>&#9632;</span> Reports
              </div>
              <div className={s.navItem}>
                <span className={s.navItemIcon}>&#9632;</span> Settings
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            9. DARK MODE SPECIMENS
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Dark Mode Specimens</h2>
          <p className={s.sectionDesc}>
            How components render on the Dune (#211E1C) background, used for sidebars and dark sections.
          </p>

          <div className={s.darkSpecimen}>
            <div className={s.darkSpecimenLabel}>Text Colors on Dark</div>
            <div className={s.darkTextPrimary}>Primary heading on dark</div>
            <div className={s.darkTextSecondary}>
              Body text on dark surfaces uses Silver Rust (#CBBDB9) for comfortable reading contrast
              without the harshness of pure white.
            </div>
            <div className={s.darkTextMuted}>MUTED LABEL ON DARK &mdash; #8a7e79</div>
          </div>

          <div className={s.darkSpecimen}>
            <div className={s.darkSpecimenLabel}>Buttons on Dark</div>
            <div className={s.darkBtnRow}>
              <button className={s.darkBtnPrimary}>Primary</button>
              <button className={s.darkBtnSecondary}>Secondary</button>
              <button className={s.darkBtnAccent}>Accent</button>
            </div>
          </div>

          <div className={s.darkSpecimen}>
            <div className={s.darkSpecimenLabel}>Card on Dark</div>
            <div className={s.darkCard}>
              <div className={s.darkCardTitle}>Session Summary</div>
              <div className={s.darkCardBody}>
                Cards on dark backgrounds use subtle white-alpha fills with muted borders.
                Text shifts to Pearl Bush (#E7E1D5) for headings and Silver Rust (#CBBDB9) for body.
              </div>
            </div>
          </div>

          <div className={s.darkSpecimen}>
            <div className={s.darkSpecimenLabel}>Navigation on Dark</div>
            <div className={s.darkNavList}>
              <div className={s.darkNavItemActive}>
                <span className={s.navItemIcon}>&#9632;</span> Dashboard
              </div>
              <div className={s.darkNavItem}>
                <span className={s.navItemIcon}>&#9632;</span> Patients
              </div>
              <div className={s.darkNavItem}>
                <span className={s.navItemIcon}>&#9632;</span> Sessions
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            10. DO'S AND DON'TS
            ═══════════════════════════════════════════════════════ */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>Do&apos;s and Don&apos;ts</h2>

          <div className={s.rulesGrid}>
            <div className={s.rulesCol}>
              <div className={s.rulesColDo}>DO</div>
              <ul className={s.rulesList}>
                <li>Use sharp corners everywhere &mdash; no border-radius</li>
                <li>Use generous whitespace between sections (64&ndash;96px)</li>
                <li>Use restrained color &mdash; mostly neutrals with accent for CTAs</li>
                <li>Use EB Garamond for headings, Crimson Pro for body</li>
                <li>Use Space Mono for labels, data values, and code</li>
                <li>Keep shadows subtle: max rgba(0,0,0,0.08)</li>
              </ul>
            </div>
            <div className={s.rulesCol}>
              <div className={s.rulesColDont}>DON&apos;T</div>
              <ul className={s.rulesList}>
                <li>Use border-radius on any element</li>
                <li>Use heavy drop shadows or glows</li>
                <li>Use bright or saturated colors outside of accent spots</li>
                <li>Mix more than 2 font families per section</li>
                <li>Use sans-serif for body text &mdash; this is a serif-first system</li>
                <li>Add decorative elements that don&apos;t serve clarity</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
