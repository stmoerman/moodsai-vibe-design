'use client'

import { useState } from 'react'
import Link from 'next/link'
import s from './DesignSystem.module.css'

/* ── Color data ──────────────────────────────────────────── */

const primaryColors = [
  { name: 'Paper',    hex: '#f2eee9', usage: 'Primary background, surfaces', dark: false },
  { name: 'Charcoal', hex: '#454647', usage: 'Primary text, headings',       dark: true  },
]

const secondaryColors = [
  { name: 'Ink',   hex: '#1f1c16', usage: 'Dark backgrounds, CTA, sidebar',       dark: true },
  { name: 'Slate', hex: '#4e565e', usage: 'Body text, secondary text',             dark: true },
  { name: 'Mist',  hex: '#959ead', usage: 'Muted labels, placeholders, metadata',  dark: false },
]

const accentColors = [
  { name: 'Sage',  hex: '#5a7268', usage: 'Success states, positive metrics, links', dark: true  },
  { name: 'Ember', hex: '#cc4444', usage: 'Emphasis, warnings, featured elements',   dark: true  },
  { name: 'Amber', hex: '#c48c28', usage: 'Pending states, caution',                 dark: false },
  { name: 'Rose',  hex: '#9c4040', usage: 'Error states, alerts, badges',            dark: true  },
]

const neutralColors = [
  { name: 'Cloud',  hex: '#faf8f5', usage: 'Card backgrounds, elevated surfaces', dark: false },
  { name: 'Fog',    hex: '#f5f1ec', usage: 'Hover backgrounds, subtle fills',     dark: false },
  { name: 'Ash',    hex: '#e2ded8', usage: 'Borders, dividers',                   dark: false },
  { name: 'Stone',  hex: '#d0cdc6', usage: 'Dot-grid dots, disabled states',      dark: false },
  { name: 'Silver', hex: '#b0b7c1', usage: 'Placeholder text, chart labels',      dark: false },
  { name: 'Pewter', hex: '#8a8580', usage: 'Tertiary text',                       dark: true  },
]

/* ── reMarkable brand reference ─────────────────────────── */

const remarkableColors = [
  { name: 'Blue Ribbon', hex: '#2559F4', usage: 'Primary blue accent (links, CTAs)',    dark: true  },
  { name: 'Masala',      hex: '#423C38', usage: 'Dark warm brown (text, headings)',      dark: true  },
  { name: 'Silver Rust', hex: '#CBBDB9', usage: 'Warm grey/taupe (borders, muted)',      dark: false },
  { name: 'Pearl Bush',  hex: '#E7E1D5', usage: 'Light warm cream (backgrounds)',        dark: false },
  { name: 'Dune',        hex: '#211E1C', usage: 'Near-black (dark surfaces, nav)',       dark: true  },
]

/* ── Spacing scale ───────────────────────────────────────── */

const spacingScale = [
  { px: 4,  rem: '0.25rem', name: 'Micro'          },
  { px: 8,  rem: '0.5rem',  name: 'Tight'           },
  { px: 12, rem: '0.75rem', name: 'Compact'         },
  { px: 16, rem: '1rem',    name: 'Base'             },
  { px: 24, rem: '1.5rem',  name: 'Comfortable'     },
  { px: 32, rem: '2rem',    name: 'Spacious'         },
  { px: 48, rem: '3rem',    name: 'Section gap'      },
  { px: 64, rem: '4rem',    name: 'Section padding'  },
  { px: 96, rem: '6rem',    name: 'Hero padding'     },
]

/* ── Animation tokens ────────────────────────────────────── */

const animationTokens = [
  {
    name: 'Reveal',
    props: [
      { label: 'property', value: 'opacity 0 \u2192 1, translateY 20px \u2192 0' },
      { label: 'duration', value: '0.6s' },
      { label: 'easing',   value: 'power2.out' },
    ],
  },
  {
    name: 'Stagger',
    props: [
      { label: 'delay', value: '0.08s between siblings' },
    ],
  },
  {
    name: 'Draw',
    props: [
      { label: 'property', value: 'stroke-dashoffset length \u2192 0' },
      { label: 'duration', value: '1s' },
      { label: 'easing',   value: 'ease-out' },
    ],
  },
  {
    name: 'Counter',
    props: [
      { label: 'method',   value: 'requestAnimationFrame count-up' },
      { label: 'duration', value: '~1.2s' },
      { label: 'easing',   value: 'cubic ease-out' },
    ],
  },
  {
    name: 'Fade',
    props: [
      { label: 'property', value: 'opacity' },
      { label: 'duration', value: '0.2s' },
      { label: 'easing',   value: 'linear' },
    ],
  },
  {
    name: 'Hover lift',
    props: [
      { label: 'property', value: 'translateY(-2px), box-shadow increase' },
      { label: 'duration', value: '0.15s' },
    ],
  },
]

/* ── Sidebar sections ────────────────────────────────────── */

const sections = [
  { id: 'brand',       label: 'Brand Overview'   },
  { id: 'colors',      label: 'Color Palette'    },
  { id: 'typography',  label: 'Typography'        },
  { id: 'spacing',     label: 'Spacing & Grid'    },
  { id: 'components',  label: 'Components'        },
  { id: 'textures',    label: 'Textures & Effects'},
  { id: 'icons',       label: 'Iconography'       },
  { id: 'animations',  label: 'Animation Tokens'  },
  { id: 'layouts',     label: 'Layout Patterns'   },
]

/* ── Color swatch ────────────────────────────────────────── */

function Swatch({ name, hex, usage, dark }: { name: string; hex: string; usage: string; dark: boolean }) {
  return (
    <div className={s.colorSwatch}>
      <div
        className={`${s.colorSwatchBlock} ${dark ? s.colorSwatchBlockDark : s.colorSwatchBlockLight}`}
        style={{ backgroundColor: hex }}
      >
        {hex}
      </div>
      <div className={s.colorSwatchInfo}>
        <div className={s.colorSwatchName}>{name}</div>
        <div className={s.colorSwatchHex}>{hex}</div>
        <div className={s.colorSwatchUsage}>{usage}</div>
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────── */

export default function DesignSystem() {
  const [toggleOn, setToggleOn] = useState(true)
  const [animKey, setAnimKey] = useState(0)

  return (
    <div className={s.root}>
      {/* Sidebar */}
      <nav className={s.sidebar} aria-label="Design system navigation">
        <Link href="/" className={s.backLink}>&larr; Home</Link>
        <div className={s.sidebarLogo}>Design System</div>
        {sections.map(sec => (
          <a key={sec.id} href={`#${sec.id}`} className={s.sidebarLink}>
            {sec.label}
          </a>
        ))}
      </nav>

      {/* Main content */}
      <main className={s.main}>

        {/* ─── 1. Brand Overview ─── */}
        <section id="brand" className={s.section}>
          <h2 className={s.sectionTitle}>Brand Overview</h2>
          <div className={s.specimen}>
            <div className={s.wordmark}>Moods.ai</div>
            <div className={s.tagline}>The intelligent practice for modern mental healthcare</div>
            <p className={s.brief}>
              Inspired by reMarkable&apos;s paper-first philosophy. Minimal, precise, intentional.
            </p>
          </div>
        </section>

        {/* ─── 2. Color Palette ─── */}
        <section id="colors" className={s.section}>
          <h2 className={s.sectionTitle}>Color Palette</h2>

          <div className={s.colorGroup}>
            <div className={s.colorGroupLabel}>Primary</div>
            <div className={s.colorGrid}>
              {primaryColors.map(c => <Swatch key={c.name} {...c} />)}
            </div>
          </div>

          <div className={s.colorGroup}>
            <div className={s.colorGroupLabel}>Secondary</div>
            <div className={s.colorGrid}>
              {secondaryColors.map(c => <Swatch key={c.name} {...c} />)}
            </div>
          </div>

          <div className={s.colorGroup}>
            <div className={s.colorGroupLabel}>Accent</div>
            <div className={s.colorGrid}>
              {accentColors.map(c => <Swatch key={c.name} {...c} />)}
            </div>
          </div>

          <div className={s.colorGroup}>
            <div className={s.colorGroupLabel}>Neutral Scale</div>
            <div className={s.colorGrid}>
              {neutralColors.map(c => <Swatch key={c.name} {...c} />)}
            </div>
          </div>

          <div className={s.colorGroup}>
            <div className={s.colorGroupLabel}>reMarkable Brand Reference</div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', color: '#959ead', marginBottom: '1rem' }}>
              Source palette from remarkable.com — our design DNA. Adapt for Moods AI, don&apos;t copy directly.
            </p>
            <div className={s.colorGrid}>
              {remarkableColors.map(c => <Swatch key={c.name} {...c} />)}
            </div>
          </div>
        </section>

        {/* ─── 3. Typography ─── */}
        <section id="typography" className={s.section}>
          <h2 className={s.sectionTitle}>Typography</h2>

          {/* Font stack */}
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Font Stack</div>
            <div className={s.fontStack}>
              <span className={s.fontStackLabel}>Headlines</span>
              <span className={`${s.fontStackValue} ${s.fontGaramond}`}>&lsquo;EB Garamond&rsquo;, serif &mdash; Elegant, editorial weight</span>
              <span className={s.fontStackLabel}>Body</span>
              <span className={`${s.fontStackValue} ${s.fontCrimson}`}>&lsquo;Crimson Pro&rsquo;, serif &mdash; Clean, readable body text</span>
              <span className={s.fontStackLabel}>Mono</span>
              <span className={`${s.fontStackValue} ${s.fontMono}`}>&lsquo;Space Mono&rsquo;, monospace &mdash; Data, labels, metadata</span>
              <span className={s.fontStackLabel}>UI</span>
              <span className={`${s.fontStackValue} ${s.fontInter}`}>&lsquo;Inter&rsquo;, sans-serif &mdash; UI elements, buttons</span>
            </div>
          </div>

          {/* Heading scale */}
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Heading Scale</div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Display</span>
                <span>4rem / 600</span>
              </div>
              <div className={s.headingDisplay}>Paper-first design</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>H1</span>
                <span>2.5rem / 500</span>
              </div>
              <div className={s.headingH1}>The intelligent practice</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>H2</span>
                <span>1.75rem / 500</span>
              </div>
              <div className={s.headingH2}>AI-Powered Documentation</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>H3</span>
                <span>1.25rem / 500</span>
              </div>
              <div className={s.headingH3}>Voice-to-Report</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>H4</span>
                <span>1rem / 600</span>
              </div>
              <div className={s.headingH4}>How it works</div>
            </div>
          </div>

          {/* Body scale */}
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Body Scale</div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Large</span>
                <span>1.125rem / 400</span>
              </div>
              <p className={s.bodyLarge}>
                Every session captured with clinical precision. Moods transforms spoken words into structured,
                compliant documentation — so you can focus on the person in front of you.
              </p>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Base</span>
                <span>1rem / 400</span>
              </div>
              <p className={s.bodyBase}>
                Our AI listens, understands context, and generates reports that meet the highest standards.
                No more late-night paperwork. No more missed details.
              </p>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Small</span>
                <span>0.875rem / 400</span>
              </div>
              <p className={s.bodySmall}>
                Session metadata: 45 min duration, cognitive behavioral therapy, progress note generated.
              </p>
            </div>
          </div>

          {/* Mono scale */}
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Mono Scale</div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Data</span>
                <span>1.5rem / 700</span>
              </div>
              <div className={s.monoData}>&euro;18,430</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Label</span>
                <span>0.75rem / 500 / uppercase / ls 0.06em</span>
              </div>
              <div className={s.monoLabel}>REVENUE THIS WEEK</div>
            </div>

            <div className={s.typeSpecimen}>
              <div className={s.typeMeta}>
                <span className={s.typeMetaTag}>Code</span>
                <span>0.8125rem / 400</span>
              </div>
              <div className={s.monoCode}>moods ai:dictate --output=report</div>
            </div>
          </div>
        </section>

        {/* ─── 4. Spacing & Grid ─── */}
        <section id="spacing" className={s.section}>
          <h2 className={s.sectionTitle}>Spacing &amp; Grid</h2>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>Spacing Scale</div>
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

          <div className={s.specimen}>
            <div className={s.specimenLabel}>24px Dot Grid</div>
            <div className={s.dotGridSpecimen} />
          </div>
        </section>

        {/* ─── 5. Components ─── */}
        <section id="components" className={s.section}>
          <h2 className={s.sectionTitle}>Components</h2>

          {/* Buttons */}
          <h3 className={s.sectionSubtitle}>Buttons</h3>
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Button Variants (Default &amp; Hover)</div>
            <div className={s.buttonRow}>
              <div className={s.buttonPair}>
                <span className={s.buttonPairLabel}>Primary</span>
                <button className={s.btnPrimary}>Get Started</button>
                <button className={s.btnPrimaryHover}>Get Started</button>
              </div>
              <div className={s.buttonPair}>
                <span className={s.buttonPairLabel}>Secondary</span>
                <button className={s.btnSecondary}>Learn More</button>
                <button className={s.btnSecondaryHover}>Learn More</button>
              </div>
              <div className={s.buttonPair}>
                <span className={s.buttonPairLabel}>Accent</span>
                <button className={s.btnAccent}>Schedule Demo</button>
                <button className={s.btnAccentHover}>Schedule Demo</button>
              </div>
              <div className={s.buttonPair}>
                <span className={s.buttonPairLabel}>Ghost</span>
                <button className={s.btnGhost}>View details</button>
                <button className={s.btnGhostHover}>View details</button>
              </div>
            </div>
          </div>

          {/* Cards */}
          <h3 className={s.sectionSubtitle}>Cards</h3>
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Card Variants</div>
            <div className={s.cardGrid}>
              <div className={s.cardDefault}>
                <div className={s.cardTag}>Default</div>
                <div className={s.cardTitle}>Session Notes</div>
                <div className={s.cardBody}>Background #fff, border 1px solid #e2ded8, no border-radius, padding 24px.</div>
              </div>
              <div className={s.cardElevated}>
                <div className={s.cardTag}>Elevated</div>
                <div className={s.cardTitle}>Weekly Report</div>
                <div className={s.cardBody}>Same as default + box-shadow 0 2px 8px rgba(0,0,0,0.04).</div>
              </div>
              <div className={s.cardInteractive}>
                <div className={s.cardTag}>Interactive</div>
                <div className={s.cardTitle}>Patient Profile</div>
                <div className={s.cardBody}>Hover to see translateY(-2px) + enhanced shadow. Try it.</div>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <h3 className={s.sectionSubtitle}>Form Inputs</h3>
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Input Types</div>
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
            </div>
          </div>

          {/* Badges */}
          <h3 className={s.sectionSubtitle}>Badges / Tags</h3>
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Badge Variants</div>
            <div className={s.badgeRow}>
              <span className={s.badgeDefault}>Default</span>
              <span className={s.badgeSuccess}>Success</span>
              <span className={s.badgeWarning}>Warning</span>
              <span className={s.badgeError}>Error</span>
            </div>
          </div>
        </section>

        {/* ─── 6. Textures & Effects ─── */}
        <section id="textures" className={s.section}>
          <h2 className={s.sectionTitle}>Textures &amp; Effects</h2>
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Background Textures</div>
            <div className={s.textureGrid}>
              <div className={`${s.textureBox} ${s.textureDotGrid}`}>
                <span className={s.textureLabel}>Dot Grid</span>
              </div>
              <div className={`${s.textureBox} ${s.texturePaperGrain}`}>
                <span className={s.textureLabel}>Paper Grain</span>
              </div>
              <div className={`${s.textureBox} ${s.textureCombined}`}>
                <span className={s.textureLabel}>Combined</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 7. Iconography ─── */}
        <section id="icons" className={s.section}>
          <h2 className={s.sectionTitle}>Iconography</h2>
          <div className={s.specimen}>
            <div className={s.specimenLabel}>Hand-drawn SVG Icons &mdash; Static</div>
            <div className={s.iconGrid}>
              <div className={s.iconCell}>
                <svg className={s.iconSvg} viewBox="0 0 48 48" fill="none" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 36 c8 -4 16 4 24 -2 c4 -3 4 -3 8 -1" />
                </svg>
                <span className={s.iconLabel}>Underline</span>
              </div>
              <div className={s.iconCell}>
                <svg className={s.iconSvg} viewBox="0 0 48 48" fill="none" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round">
                  <polyline points="12,26 20,34 36,14" />
                </svg>
                <span className={s.iconLabel}>Checkmark</span>
              </div>
              <div className={s.iconCell}>
                <svg className={s.iconSvg} viewBox="0 0 48 48" fill="none" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round">
                  <path d="M10 34 C14 14, 30 10, 38 18" />
                  <polyline points="32,12 38,18 32,24" />
                </svg>
                <span className={s.iconLabel}>Arrow</span>
              </div>
              <div className={s.iconCell}>
                <svg className={s.iconSvg} viewBox="0 0 48 48" fill="none" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round">
                  <line x1="14" y1="14" x2="34" y2="34" />
                  <line x1="34" y1="14" x2="14" y2="34" />
                </svg>
                <span className={s.iconLabel}>Cross</span>
              </div>
            </div>
          </div>

          <div className={s.specimen}>
            <div className={s.specimenLabel}>
              Animated (Draw-on) &mdash;
              <button
                onClick={() => setAnimKey(k => k + 1)}
                className={s.btnGhost}
                style={{ display: 'inline', padding: '2px 8px', fontSize: '0.75rem' }}
              >
                Replay
              </button>
            </div>
            <div className={s.iconGrid} key={animKey}>
              <div className={s.iconCell}>
                <svg className={`${s.iconSvg} ${s.iconAnimated}`} viewBox="0 0 48 48" fill="none" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 36 c8 -4 16 4 24 -2 c4 -3 4 -3 8 -1" style={{ '--path-length': '50' } as React.CSSProperties} />
                </svg>
                <span className={s.iconLabel}>Underline</span>
              </div>
              <div className={s.iconCell}>
                <svg className={`${s.iconSvg} ${s.iconAnimated}`} viewBox="0 0 48 48" fill="none" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round">
                  <polyline points="12,26 20,34 36,14" style={{ '--path-length': '40' } as React.CSSProperties} />
                </svg>
                <span className={s.iconLabel}>Checkmark</span>
              </div>
              <div className={s.iconCell}>
                <svg className={`${s.iconSvg} ${s.iconAnimated}`} viewBox="0 0 48 48" fill="none" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round">
                  <path d="M10 34 C14 14, 30 10, 38 18" style={{ '--path-length': '50' } as React.CSSProperties} />
                  <polyline points="32,12 38,18 32,24" style={{ '--path-length': '20' } as React.CSSProperties} />
                </svg>
                <span className={s.iconLabel}>Arrow</span>
              </div>
              <div className={s.iconCell}>
                <svg className={`${s.iconSvg} ${s.iconAnimated}`} viewBox="0 0 48 48" fill="none" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round">
                  <line x1="14" y1="14" x2="34" y2="34" style={{ '--path-length': '30' } as React.CSSProperties} />
                  <line x1="34" y1="14" x2="14" y2="34" style={{ '--path-length': '30' } as React.CSSProperties} />
                </svg>
                <span className={s.iconLabel}>Cross</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 8. Animation Tokens ─── */}
        <section id="animations" className={s.section}>
          <h2 className={s.sectionTitle}>Animation Tokens</h2>
          <div className={s.animTokenGrid}>
            {animationTokens.map(tok => (
              <div key={tok.name} className={s.animToken}>
                <div className={s.animTokenName}>{tok.name}</div>
                <ul className={s.animTokenProps}>
                  {tok.props.map(p => (
                    <li key={p.label}>
                      <span>{p.label}: </span>{p.value}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 9. Layout Patterns ─── */}
        <section id="layouts" className={s.section}>
          <h2 className={s.sectionTitle}>Layout Patterns</h2>
          <div className={s.layoutGrid}>

            {/* Header */}
            <div className={s.layoutMini}>
              <div className={s.layoutMiniLabel}>Header</div>
              <div className={s.miniHeader}>
                <div className={s.miniHeaderLogo} />
                <div className={s.miniHeaderNav}>
                  <div className={s.miniHeaderNavItem} />
                  <div className={s.miniHeaderNavItem} />
                  <div className={s.miniHeaderNavItem} />
                </div>
              </div>
              <div className={s.miniProgressBar} />
            </div>

            {/* Hero */}
            <div className={s.layoutMini}>
              <div className={s.layoutMiniLabel}>Hero</div>
              <div className={s.miniHero}>
                <div className={s.miniHeroTitle} />
                <div className={s.miniHeroSub} />
                <div className={s.miniHeroCta} />
              </div>
            </div>

            {/* Split */}
            <div className={s.layoutMini}>
              <div className={s.layoutMiniLabel}>Split</div>
              <div className={s.miniSplit}>
                <div className={s.miniSplitContent}>
                  <div className={s.miniSplitLine} style={{ width: '80%' }} />
                  <div className={s.miniSplitLine} style={{ width: '100%' }} />
                  <div className={s.miniSplitLine} style={{ width: '60%' }} />
                </div>
                <div className={s.miniSplitVisual} />
              </div>
            </div>

            {/* Timeline */}
            <div className={s.layoutMini}>
              <div className={s.layoutMiniLabel}>Timeline</div>
              <div className={s.miniTimeline}>
                <div className={s.miniTimelineLine} />
                <div className={`${s.miniTimelineItem} ${s.miniTimelineItemLeft}`}>
                  <div className={s.miniTimelineCard} />
                  <div className={s.miniTimelineDot} />
                  <div style={{ width: '42%' }} />
                </div>
                <div className={`${s.miniTimelineItem} ${s.miniTimelineItemRight}`}>
                  <div className={s.miniTimelineCard} />
                  <div className={s.miniTimelineDot} />
                  <div style={{ width: '42%' }} />
                </div>
                <div className={`${s.miniTimelineItem} ${s.miniTimelineItemLeft}`}>
                  <div className={s.miniTimelineCard} />
                  <div className={s.miniTimelineDot} />
                  <div style={{ width: '42%' }} />
                </div>
              </div>
            </div>

            {/* Bento */}
            <div className={s.layoutMini}>
              <div className={s.layoutMiniLabel}>Bento Grid</div>
              <div className={s.miniBento}>
                <div className={`${s.miniBentoItem} ${s.miniBentoLarge}`} />
                <div className={s.miniBentoItem} />
                <div className={s.miniBentoItem} />
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  )
}
