'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const LOCATIONS = [
  { value: 'Amsterdam', label: 'Amsterdam' },
  { value: 'Utrecht', label: 'Utrecht' },
  { value: 'Rotterdam', label: 'Rotterdam' },
  { value: 'Nijmegen', label: 'Nijmegen' },
  { value: 'Heerlen', label: 'Heerlen' },
  { value: 'Venray', label: 'Venray' },
  { value: 'Online', label: 'Online (landelijk)' },
];

interface OnboardingData {
  token: string;
  email: string;
  firstName: string;
  language: string;
  location: string;
  reason: string;
  completedAt: string | null;
}

export default function OnboardingPage() {
  return <Suspense><OnboardingWizard /></Suspense>;
}

function OnboardingWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const presetLocation = searchParams.get('location') ?? '';
  const hasPresetLocation = !!presetLocation;
  const totalSteps = hasPresetLocation ? 3 : 4;

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    token: searchParams.get('token') ?? '',
    email: searchParams.get('email') ?? '',
    firstName: searchParams.get('name') ?? '',
    language: '',
    location: presetLocation,
    reason: '',
    completedAt: null,
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    localStorage.setItem('moods-onboarding', JSON.stringify(data));
  }, [data]);

  function handlePasswordSubmit() {
    if (password.length < 8) { setPasswordError('Minimaal 8 tekens'); return; }
    if (password !== confirmPassword) { setPasswordError('Wachtwoorden komen niet overeen'); return; }
    setPasswordError('');
    setStep(2);
  }

  function handleLanguage(lang: string) {
    setData((d) => ({ ...d, language: lang }));
    setStep(hasPresetLocation ? 3 : 3);
  }

  function handleLocation(loc: string) {
    setData((d) => ({ ...d, location: loc }));
    setStep(4);
  }

  function handleReasonSubmit() {
    const completed = { ...data, completedAt: new Date().toISOString() };
    setData(completed);
    localStorage.setItem('moods-onboarding', JSON.stringify(completed));
    router.push('/onboarding/intake');
  }

  const isReasonStep = (hasPresetLocation && step === 3) || (!hasPresetLocation && step === 4);
  const isLocationStep = !hasPresetLocation && step === 3;

  return (
    <div className="bg-surface border border-border p-10 w-full max-w-[460px]">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`w-2 h-2 transition-colors ${i < step ? 'bg-warm' : 'border border-border'}`} />
        ))}
      </div>

      {/* Step 1: Password */}
      {step === 1 && (
        <div>
          <h1 className="font-display text-2xl text-text mb-2">
            Welkom bij Moods.ai{data.firstName ? `, ${data.firstName}` : ''}
          </h1>
          <p className="font-serif text-sm text-text-muted mb-8">Maak je account aan om verder te gaan</p>

          <div className="mb-5">
            <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">Wachtwoord</label>
            <input type="password" className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors" placeholder="Minimaal 8 tekens" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="mb-6">
            <label className="block font-mono text-[0.7rem] text-text-muted uppercase tracking-wider mb-2">Wachtwoord bevestigen</label>
            <input type="password" className="w-full font-serif text-base text-text bg-transparent border-b border-border py-2 outline-none focus:border-text transition-colors" placeholder="Herhaal je wachtwoord" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          {passwordError && <div className="mb-4 font-mono text-[0.7rem] text-[#c47050]">{passwordError}</div>}

          <button onClick={handlePasswordSubmit} disabled={!password || !confirmPassword} className="w-full font-mono text-[0.8rem] font-bold uppercase tracking-wider text-paper bg-text py-3.5 cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">Verder</button>
        </div>
      )}

      {/* Step 2: Language */}
      {step === 2 && (
        <div>
          <h1 className="font-display text-2xl text-text mb-2">In welke taal wil je behandeld worden?</h1>
          <p className="font-serif text-sm text-text-muted mb-8">Je kunt dit later altijd wijzigen</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleLanguage('NL')} className="p-6 border border-border bg-paper hover:border-text hover:bg-surface-hover transition-colors cursor-pointer text-center">
              <div className="font-display text-lg text-text mb-1">Nederlands</div>
              <div className="font-mono text-[0.65rem] text-text-faint uppercase">NL</div>
            </button>
            <button onClick={() => handleLanguage('EN')} className="p-6 border border-border bg-paper hover:border-text hover:bg-surface-hover transition-colors cursor-pointer text-center">
              <div className="font-display text-lg text-text mb-1">English</div>
              <div className="font-mono text-[0.65rem] text-text-faint uppercase">EN</div>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {isLocationStep && (
        <div>
          <h1 className="font-display text-2xl text-text mb-2">Waar wil je behandeld worden?</h1>
          <p className="font-serif text-sm text-text-muted mb-8">We zoeken therapeuten op deze locatie</p>
          <div className="grid grid-cols-2 gap-3">
            {LOCATIONS.map((loc) => (
              <button key={loc.value} onClick={() => handleLocation(loc.value)} className="p-5 border border-border bg-paper hover:border-text hover:bg-surface-hover transition-colors cursor-pointer text-center">
                <div className="font-serif text-base text-text">{loc.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3/4: Reason */}
      {isReasonStep && (
        <div>
          <h1 className="font-display text-2xl text-text mb-2">Kun je kort omschrijven waarom je hulp zoekt?</h1>
          <p className="font-serif text-sm text-text-muted mb-8">Je antwoord wordt alleen gedeeld met je therapeut</p>
          <textarea className="w-full font-serif text-base text-text bg-transparent border border-border p-4 outline-none focus:border-text transition-colors resize-none h-32 placeholder:text-text-faint mb-6" placeholder="Bijv. ik ervaar veel stress op werk..." value={data.reason} onChange={(e) => setData((d) => ({ ...d, reason: e.target.value }))} />
          <button onClick={handleReasonSubmit} className="w-full font-mono text-[0.8rem] font-bold uppercase tracking-wider text-paper bg-text py-3.5 cursor-pointer hover:opacity-85 transition-opacity">Verder naar intake planning</button>
          <button onClick={handleReasonSubmit} className="w-full mt-3 font-serif text-sm text-text-faint hover:text-text transition-colors cursor-pointer bg-transparent border-none">Overslaan</button>
        </div>
      )}
    </div>
  );
}
