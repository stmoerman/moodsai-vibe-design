'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from './page.module.css';

const content = {
  nl: {
    login: 'Inloggen',
    heroTitle: 'Mentale gezondheid, slim geregeld.',
    heroSub: 'Moods.ai is het alles-in-één platform voor GGZ-praktijken. Van agenda en declaraties tot AI-ondersteunde cliëntenzorg — alles op één plek.',
    heroCta: 'Aan de slag',
    features: [
      { icon: '◈', title: 'BI & Inzicht', desc: 'Realtime overzicht op omzet, cliënten, declaraties en trends. Altijd weten hoe je praktijk ervoor staat.' },
      { icon: '◉', title: 'Slim Plannen', desc: 'Agenda, e-health opdrachten en workshops in één overzicht. Voor therapeuten én cliënten.' },
      { icon: '◎', title: 'AskMoody', desc: 'AI-assistent voor cliënten en therapeuten. Vraag, ontvang en leer — op elk moment.' },
    ],
    previewLabel: 'Dashboard preview',
    stats: [
      { value: '€139k', label: 'Omzet' },
      { value: '342', label: 'Cliënten' },
      { value: '87%', label: 'Declarabiliteit' },
      { value: '24u', label: 'Directe uren' },
    ],
    copyright: '© 2026 Moods AI',
    privacy: 'Privacy',
    terms: 'Voorwaarden',
    contact: 'Contact',
  },
  en: {
    login: 'Log in',
    heroTitle: 'Mental healthcare, smartly managed.',
    heroSub: 'Moods.ai is the all-in-one platform for mental health practices. From scheduling and billing to AI-powered client care — all in one place.',
    heroCta: 'Get started',
    features: [
      { icon: '◈', title: 'BI & Insights', desc: 'Real-time overview of revenue, clients, billing, and trends. Always know where your practice stands.' },
      { icon: '◉', title: 'Smart Planning', desc: 'Agenda, e-health assignments, and workshops in one view. For therapists and clients alike.' },
      { icon: '◎', title: 'AskMoody', desc: 'AI assistant for clients and therapists. Ask, receive, and learn — at any moment.' },
    ],
    previewLabel: 'Dashboard preview',
    stats: [
      { value: '€139k', label: 'Revenue' },
      { value: '342', label: 'Clients' },
      { value: '87%', label: 'Billing rate' },
      { value: '24h', label: 'Direct hours' },
    ],
    copyright: '© 2026 Moods AI',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
  },
};

type Lang = 'nl' | 'en';

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('nl');
  const t = content[lang];

  useEffect(() => {
    const saved = localStorage.getItem('moods-lang') as Lang | null;
    if (saved === 'en' || saved === 'nl') setLang(saved);
  }, []);

  function switchLang(l: Lang) {
    setLang(l);
    localStorage.setItem('moods-lang', l);
  }

  return (
    <div className={s.root}>
      <nav className={s.nav}>
        <div className={s.navLogo}>
          <Image src="/images/logo.png" alt="Moods.ai" width={110} height={28} priority />
        </div>
        <div className={s.navSpacer} />
        <div className={s.langToggle}>
          <button
            className={`${s.langBtn} ${lang === 'nl' ? s.langBtnActive : ''}`}
            onClick={() => switchLang('nl')}
          >
            NL
          </button>
          <button
            className={`${s.langBtn} ${lang === 'en' ? s.langBtnActive : ''}`}
            onClick={() => switchLang('en')}
          >
            EN
          </button>
        </div>
        <Link href="/login" className={s.navLogin}>{t.login}</Link>
      </nav>

      <section className={s.hero}>
        <h1 className={s.heroTitle}>{t.heroTitle}</h1>
        <p className={s.heroSub}>{t.heroSub}</p>
        <Link href="/login" className={s.heroCta}>{t.heroCta}</Link>
      </section>

      <section className={s.features}>
        {t.features.map((f, i) => (
          <div key={i} className={s.featureCard}>
            <div className={s.featureIcon}>{f.icon}</div>
            <h3 className={s.featureTitle}>{f.title}</h3>
            <p className={s.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      <section className={s.preview}>
        <div className={s.previewBox}>
          <div className={s.previewLabel}>{t.previewLabel}</div>
          <div className={s.previewGrid}>
            {t.stats.map((stat, i) => (
              <div key={i} className={s.previewStat}>
                <div className={s.previewStatValue}>{stat.value}</div>
                <div className={s.previewStatLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={s.footer}>
        <span>{t.copyright}</span>
        <div className={s.footerLinks}>
          <a href="#" className={s.footerLink}>{t.privacy}</a>
          <a href="#" className={s.footerLink}>{t.terms}</a>
          <a href="#" className={s.footerLink}>{t.contact}</a>
        </div>
      </footer>
    </div>
  );
}
