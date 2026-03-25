'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from './page.module.css';

/* ─── Helpers ─── */
function getGreeting(hour: number) {
  if (hour < 12) return 'Goedemorgen';
  if (hour < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

function formatDate(date: Date) {
  const days = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
  const months = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function parseHour(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

function isRecentMessage(time: string): boolean {
  return time === '10m' || time === '2u';
}

/* ─── Types ─── */
type AppointmentStatus = 'confirmed' | 'pending' | 'available' | 'break';

interface Appointment {
  time: string;
  endTime: string;
  durationMin: number;
  client: string;
  type: string;
  status: AppointmentStatus;
}

/* ─── Data ─── */
const schedule: Appointment[] = [
  { time: '08:00', endTime: '09:00', durationMin: 60, client: '',                    type: 'Beschikbaar',          status: 'available' },
  { time: '09:00', endTime: '10:00', durationMin: 60, client: 'M. de Vries',         type: 'Behandeling (ZPM)',    status: 'confirmed' },
  { time: '09:30', endTime: '10:30', durationMin: 60, client: 'S. Jansen',           type: 'Behandeling (ZPM)',    status: 'confirmed' },
  { time: '10:30', endTime: '12:00', durationMin: 90, client: 'Workshop Stressregulatie', type: '8 deelnemers',    status: 'confirmed' },
  { time: '12:00', endTime: '12:30', durationMin: 30, client: '',                    type: 'Beschikbaar',          status: 'available' },
  { time: '12:30', endTime: '13:00', durationMin: 30, client: 'M.D. Kemme',          type: 'Behandeling (ZPM)',    status: 'confirmed' },
  { time: '13:00', endTime: '13:30', durationMin: 30, client: '',                    type: 'Pauze',                status: 'break' },
  { time: '13:30', endTime: '14:30', durationMin: 60, client: 'A. Hoekstra',         type: 'Intake',               status: 'pending' },
  { time: '14:30', endTime: '15:30', durationMin: 60, client: 'J. Bakker',           type: 'Vervolgconsult',       status: 'confirmed' },
  { time: '15:30', endTime: '16:00', durationMin: 30, client: '',                    type: 'Beschikbaar',          status: 'available' },
  { time: '16:00', endTime: '17:00', durationMin: 60, client: '',                    type: 'Beschikbaar',          status: 'available' },
  { time: '17:00', endTime: '18:00', durationMin: 60, client: '',                    type: 'Beschikbaar',          status: 'available' },
];

const appointmentDetails: Record<string, {
  fullName: string;
  initials: string;
  location: string;
  lastSession: string;
  notes: string;
}> = {
  'M. de Vries': {
    fullName: 'Maria de Vries',
    initials: 'MV',
    location: 'Kamer 3',
    lastSession: '18 maart 2026',
    notes: 'GAD-7 gedaald van 12 naar 8. Behandelplan loopt goed.',
  },
  'M.D. Kemme': {
    fullName: 'Marcus D. Kemme',
    initials: 'MK',
    location: 'Kamer 1',
    lastSession: '20 maart 2026',
    notes: 'PHQ-9: stabiel op 6. Volgende sessie: cognitieve herstructurering.',
  },
  'A. Hoekstra': {
    fullName: 'Anna Hoekstra',
    initials: 'AH',
    location: 'Online (video)',
    lastSession: 'Eerste intake',
    notes: 'Verwezen door huisarts. Klachten: angst en slapeloosheid.',
  },
  'J. Bakker': {
    fullName: 'Jan Bakker',
    initials: 'JB',
    location: 'Kamer 2',
    lastSession: '21 maart 2026',
    notes: 'EMDR fase 3 gestart. Goede voortgang.',
  },
  'S. Jansen': {
    fullName: 'Sophie Jansen',
    initials: 'SJ',
    location: 'Kamer 3',
    lastSession: '19 maart 2026',
    notes: 'CGT fase 2. Huiswerkopdrachten besproken.',
  },
};

const recentNotes = [
  { text: 'M. de Vries — Sessienotitie', time: 'gisteren', aiGenerated: true },
  { text: 'M.D. Kemme — Behandelplan', time: '2d geleden', aiGenerated: false },
  { text: 'Workshop — Samenvatting', time: '3d geleden', aiGenerated: true },
];

const messages = [
  { name: 'M. de Vries', preview: 'Bedankt voor de sessie', time: '10m' },
  { name: 'A. Hoekstra', preview: 'Ik heb de vragenlijst ingevuld', time: '2u' },
  { name: 'J. Bakker', preview: 'Kan ik de afspraak verzetten?', time: '3u' },
  { name: 'M.D. Kemme', preview: 'Heb je het verslag al gezien?', time: '5u' },
  { name: 'S. Jansen', preview: 'Tot volgende week', time: '1d' },
  { name: 'Dr. van Dijk', preview: 'Overleg over casus Hoekstra', time: '1d' },
  { name: 'T. van Berg', preview: 'Ik voel me veel beter', time: '2d' },
];

const navTabs = [
  { label: 'Agenda', id: 'agenda' },
  { label: 'Teamchats', id: 'teamchats' },
  { label: 'Directe Tijd', id: 'directe-tijd' },
  { label: 'Mijn Cliënten', id: 'clienten' },
  { label: 'Cliënt Chat', id: 'client-chat' },
];

const mockDates = ['Di 24 maart', 'Wo 25 maart', 'Do 26 maart'];
const mockWeeks = ['Week 12 · 17–21 mrt', 'Week 13 · 24–28 mrt', 'Week 14 · 31 mrt–4 apr'];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const weekSchedule: Record<string, Appointment[]> = {
  'Ma': [
    { time: '09:00', endTime: '10:00', durationMin: 60, client: 'S. Jansen', type: 'Behandeling', status: 'confirmed' },
    { time: '11:00', endTime: '12:00', durationMin: 60, client: 'T. van Berg', type: 'Intake', status: 'confirmed' },
    { time: '14:00', endTime: '15:00', durationMin: 60, client: 'M. de Vries', type: 'Vervolgconsult', status: 'confirmed' },
  ],
  'Di': [
    { time: '08:30', endTime: '09:30', durationMin: 60, client: 'J. Bakker', type: 'Behandeling', status: 'confirmed' },
    { time: '10:00', endTime: '11:30', durationMin: 90, client: 'Workshop ACT', type: '6 deelnemers', status: 'confirmed' },
    { time: '13:00', endTime: '14:00', durationMin: 60, client: 'A. Hoekstra', type: 'Behandeling', status: 'confirmed' },
    { time: '15:00', endTime: '16:00', durationMin: 60, client: 'M.D. Kemme', type: 'Behandeling', status: 'pending' },
  ],
  'Wo': [],
  'Do': [
    { time: '09:00', endTime: '10:00', durationMin: 60, client: 'M. de Vries', type: 'Behandeling', status: 'confirmed' },
    { time: '10:30', endTime: '11:30', durationMin: 60, client: 'S. Jansen', type: 'Behandeling', status: 'confirmed' },
    { time: '13:30', endTime: '14:30', durationMin: 60, client: 'M.D. Kemme', type: 'Diagnostiek', status: 'confirmed' },
  ],
  'Vr': [
    { time: '09:00', endTime: '09:30', durationMin: 30, client: '', type: 'Administratietijd', status: 'break' },
    { time: '09:30', endTime: '10:30', durationMin: 60, client: 'J. Bakker', type: 'Behandeling', status: 'confirmed' },
    { time: '11:00', endTime: '12:00', durationMin: 60, client: 'T. van Berg', type: 'Vervolgconsult', status: 'confirmed' },
  ],
};

const weekDays = ['Ma', 'Di', 'Wo', 'Do', 'Vr'] as const;
const weekDates = ['Ma 24', 'Di 25', 'Wo 26', 'Do 27', 'Vr 28'];

const askMoodyInsights = [
  { text: 'M. de Vries: GAD-7 gedaald van 12 naar 8', type: 'positive' as const },
  { text: 'Workshop morgen: 8 deelnemers bevestigd', type: 'info' as const },
  { text: 'Declarabiliteit deze week: +1% boven target', type: 'positive' as const },
];

/* ─── Component ─── */
export default function DashboardV3() {
  const [now, setNow] = useState<Date | null>(null);
  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(null);
  const [selectedWeekApt, setSelectedWeekApt] = useState<{ day: string; idx: number } | null>(null);
  const [dateIndex, setDateIndex] = useState(1);
  const [weekIndex, setWeekIndex] = useState(1);
  const [viewMode, setViewMode] = useState<'dag' | 'week'>('dag');
  const [isAgendaExpanded, setIsAgendaExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda');

  useEffect(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    if (expandedAppointment === null && selectedWeekApt === null && !isAgendaExpanded) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedAppointment(null);
        setSelectedWeekApt(null);
        setIsAgendaExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expandedAppointment, selectedWeekApt, isAgendaExpanded]);

  const greeting = now ? getGreeting(now.getHours()) : 'Goedemorgen';
  const dateStr = now ? formatDate(now) : '';
  const currentHour = now ? now.getHours() + now.getMinutes() / 60 : 10.5;
  const nowPct = Math.max(0, Math.min(100, ((currentHour - 8) / 10) * 100));
  const showNowLine = currentHour >= 8 && currentHour <= 18;

  const nextAppointment = useMemo(() => {
    if (!now) return null;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (const apt of schedule) {
      const [h, m] = apt.time.split(':').map(Number);
      const aptMinutes = h * 60 + m;
      if (aptMinutes > currentMinutes && (apt.status === 'confirmed' || apt.status === 'pending')) {
        const diffMin = aptMinutes - currentMinutes;
        return { apt, diffMin };
      }
    }
    return null;
  }, [now]);

  const isPastAppointment = (apt: Appointment): boolean => {
    if (!now) return false;
    const [h, m] = apt.endTime.split(':').map(Number);
    const endMinutes = h * 60 + m;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return endMinutes <= currentMinutes;
  };

  const isNextAppointment = (apt: Appointment): boolean => {
    if (!nextAppointment) return false;
    return apt.time === nextAppointment.apt.time && apt.client === nextAppointment.apt.client;
  };

  const handlePrev = () => {
    if (viewMode === 'dag') setDateIndex((i) => Math.max(0, i - 1));
    else setWeekIndex((i) => Math.max(0, i - 1));
  };
  const handleNext = () => {
    if (viewMode === 'dag') setDateIndex((i) => Math.min(mockDates.length - 1, i + 1));
    else setWeekIndex((i) => Math.min(mockWeeks.length - 1, i + 1));
  };
  const handleToday = () => { setDateIndex(1); setWeekIndex(1); };
  const navLabel = viewMode === 'dag' ? mockDates[dateIndex] : mockWeeks[weekIndex];
  const isPrevDisabled = viewMode === 'dag' ? dateIndex === 0 : weekIndex === 0;
  const isNextDisabled = viewMode === 'dag' ? dateIndex === mockDates.length - 1 : weekIndex === mockWeeks.length - 1;

  const toggleExpand = (idx: number) => {
    setExpandedAppointment((prev) => (prev === idx ? null : idx));
  };

  const getWeekDaySchedule = (day: string): Appointment[] => {
    if (day === 'Wo') return schedule;
    return weekSchedule[day] || [];
  };

  const handleWeekAptClick = (day: string, idx: number, apt: Appointment) => {
    if (apt.status !== 'confirmed' && apt.status !== 'pending') return;
    setSelectedWeekApt({ day, idx });
  };

  const selectedWeekAptData = selectedWeekApt
    ? (() => {
        const daySchedule = getWeekDaySchedule(selectedWeekApt.day);
        const apt = daySchedule[selectedWeekApt.idx];
        const details = apt?.client ? appointmentDetails[apt.client] : null;
        return apt && details ? { apt, details } : null;
      })()
    : null;

  /* ─── Appointment Detail Dialog ─── */
  const renderAppointmentDialog = (
    apt: Appointment,
    details: { fullName: string; initials: string; location: string; lastSession: string; notes: string },
    onClose: () => void,
  ) => (
    <div className={s.dialogOverlay} onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md mx-4 animate-[fadeIn_0.15s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
              {details.initials}
            </div>
            <div>
              <div className="font-semibold text-slate-900">{details.fullName}</div>
              <div className="text-sm text-slate-500">{apt.type} &middot; {apt.durationMin} min &middot; {details.location}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="p-5 space-y-3">
          <div className="flex justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tijd</span>
            <span className="text-sm text-slate-700">{apt.time} — {apt.endTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Vorige sessie</span>
            <span className="text-sm text-slate-700">{details.lastSession}</span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Notities</span>
            <p className="text-sm text-slate-700 mt-1">{details.notes}</p>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2 p-5 pt-0">
          <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm py-2.5 font-medium transition-colors">
            Start videogesprek
          </button>
          <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm py-2.5 font-medium transition-colors">
            Bekijk dossier
          </button>
          <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm py-2.5 font-medium transition-colors">
            Notitie maken
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── Agenda Content (reused in inline + expanded) ─── */
  const renderAgendaContent = (inExpandedDialog: boolean) => (
    <>
      {/* Agenda header with nav */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={isPrevDisabled}
            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
          >
            &lt;
          </button>
          <button
            onClick={handleToday}
            className="px-3 h-8 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Vandaag
          </button>
          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
          >
            &gt;
          </button>
          <span className="text-lg font-semibold text-slate-900 ml-2">{navLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('dag')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'dag' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dag
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'week' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week
            </button>
          </div>
          {inExpandedDialog ? (
            <button
              onClick={() => setIsAgendaExpanded(false)}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Sluiten"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="12" y2="12" />
                <line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setIsAgendaExpanded(true)}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Volledig scherm"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Countdown */}
      {nextAppointment && dateIndex === 1 && viewMode === 'dag' && (
        <div className="text-sm text-blue-600 mb-3 font-medium">
          Volgende sessie over {nextAppointment.diffMin} min — {nextAppointment.apt.client} ({nextAppointment.apt.type})
        </div>
      )}

      {/* Day View */}
      {viewMode === 'dag' && (
        <div className={`${s.timelineScroll} relative`}>
          <div className={s.timeline}>
            {/* Gutter */}
            <div className={s.timelineGutter}>
              {timeSlots.map((t) => (
                <div key={t} className={s.timelineGutterSlot}>
                  <span className="text-xs text-slate-400 font-medium">{t}</span>
                </div>
              ))}
            </div>
            {/* Body */}
            <div className={s.timelineBody}>
              {/* Hour lines */}
              {timeSlots.map((t, i) => (
                <div
                  key={t}
                  className="absolute left-0 right-0 border-t border-slate-100"
                  style={{ top: `${(i / 10) * 100}%` }}
                />
              ))}

              {/* NOW marker */}
              {showNowLine && dateIndex === 1 && (
                <div className={s.nowMarker} style={{ top: `${nowPct}%` }}>
                  <span className="text-xs font-bold text-blue-600 mr-1 -mt-3 absolute -left-[46px]">NU</span>
                  <div className={s.nowDot} />
                  <div className={s.nowLine} />
                </div>
              )}

              {/* Appointment blocks */}
              {schedule.map((apt, i) => {
                const topPct = ((parseHour(apt.time) - 8) / 10) * 100;
                const heightPct = (apt.durationMin / 600) * 100;
                const isAppointment = apt.status === 'confirmed' || apt.status === 'pending';
                const past = dateIndex === 1 && isPastAppointment(apt);
                const isNext = dateIndex === 1 && isNextAppointment(apt);

                if (apt.status === 'available') {
                  return (
                    <div
                      key={i}
                      className={s.aptBlock}
                      style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                    >
                      <div className={`h-full border border-dashed border-slate-300 bg-slate-50 rounded-lg flex items-center justify-center ${past ? 'opacity-40' : ''}`}>
                        <span className="text-sm text-slate-400">Beschikbaar</span>
                      </div>
                    </div>
                  );
                }

                if (apt.status === 'break') {
                  return (
                    <div
                      key={i}
                      className={s.aptBlock}
                      style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                    >
                      <div className={`h-full bg-slate-50 rounded-lg flex items-center px-3 ${past ? 'opacity-40' : ''}`}>
                        <span className="text-sm text-slate-400 italic">{apt.type} &middot; {apt.durationMin} min</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={i}
                    className={s.aptBlock}
                    style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                  >
                    <div
                      className={`h-full border-l-4 bg-white shadow-sm rounded-r-lg p-3 cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-center ${
                        apt.status === 'confirmed' ? 'border-l-blue-500' : 'border-l-amber-500'
                      } ${past ? 'opacity-40' : ''} ${isNext ? 'ring-2 ring-blue-200' : ''}`}
                      onClick={isAppointment && !past ? () => toggleExpand(i) : undefined}
                    >
                      <div className="font-medium text-slate-900 text-sm">{apt.client}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{apt.type} — {apt.durationMin} min</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className={`${s.timelineScroll} relative`}>
          <div className={s.weekTimeline}>
            <div className={s.weekGutter}>
              <div className={s.weekGutterHeader} />
              <div className={`${s.weekGutterSlots} flex flex-col`}>
                {timeSlots.map((t) => (
                  <div key={t} className={`${s.timelineGutterSlot} flex-1`}>
                    <span className="text-xs text-slate-400 font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {weekDays.map((day, di) => {
              const dayScheduleItems = getWeekDaySchedule(day);
              const isToday = day === 'Wo';
              return (
                <div key={day} className={s.weekDayCol}>
                  <div className={`${s.weekDayHeader} text-xs font-medium ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>
                    {weekDates[di]}
                  </div>
                  <div className={`${s.weekDayBody} ${isToday ? 'bg-blue-50/30' : ''}`}>
                    {/* Hour lines */}
                    {timeSlots.map((t, ti) => (
                      <div
                        key={t}
                        className="absolute left-0 right-0 border-t border-slate-100"
                        style={{ top: `${(ti / 10) * 100}%` }}
                      />
                    ))}
                    {isToday && showNowLine && (
                      <div className={s.nowMarker} style={{ top: `${nowPct}%` }}>
                        <div className={s.nowDot} />
                        <div className={s.nowLine} />
                      </div>
                    )}
                    {dayScheduleItems.map((apt, ai) => {
                      const topPct = ((parseHour(apt.time) - 8) / 10) * 100;
                      const heightPct = (apt.durationMin / 600) * 100;
                      const isAppointment = apt.status === 'confirmed' || apt.status === 'pending';
                      return (
                        <div
                          key={ai}
                          className={`${s.weekAptBlock} ${
                            apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            apt.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            apt.status === 'break' ? 'bg-slate-50 text-slate-400' :
                            'bg-slate-50 text-slate-400 border border-dashed border-slate-300'
                          }`}
                          style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                          onClick={isAppointment ? () => handleWeekAptClick(day, ai, apt) : undefined}
                        >
                          <span className="truncate text-xs font-medium">
                            {isAppointment ? apt.client : apt.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
        <Link href="/">
          <Image src="/images/logo.png" alt="Oh My Mood" width={120} height={28} style={{ height: 28, width: 'auto' }} />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Amsterdam</span>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
            JS
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Greeting */}
        <div className={`${s.fadeIn} mb-1`}>
          <h1 className="text-2xl font-semibold text-slate-900">{greeting}, Jaime</h1>
          <p className="text-sm text-slate-500 mt-1">Therapeut &middot; Amsterdam &middot; {dateStr}</p>
          <p className="text-sm text-blue-600 mt-2 flex items-center gap-1.5">
            <span>&#10022;</span>
            6 sessies vandaag &middot; M. de Vries liet verbetering zien (GAD-7 &#8595;4) &middot; Declarabiliteit op schema
          </p>
        </div>

        {/* Nav Tabs */}
        <nav className={`${s.fadeIn} ${s.stagger1} border-b border-slate-200 mt-5 mb-6`}>
          <div className="flex gap-6">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Tab: Teamchats */}
        {activeTab === 'teamchats' && (
          <div className={`${s.fadeIn} flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden`} style={{ minHeight: 500 }}>
            {/* Sidebar */}
            <div className="w-72 border-r border-slate-200 flex flex-col">
              <div className="p-3 border-b border-slate-100">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2 transition-colors">
                  + Nieuw gesprek
                </button>
              </div>
              <div className="p-3 border-b border-slate-100">
                <input type="text" placeholder="Zoek gesprek..." readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none" />
              </div>
              <div className="flex-1 overflow-y-auto">
                {[
                  { name: '# Algemeen', preview: 'Dr. van Dijk: Wie kan morgen de 14:00 overnemen?', time: '5m', unread: 2 },
                  { name: '# Klinisch overleg', preview: 'S. Jansen: Nieuwe richtlijn bijgevoegd', time: '1u', unread: 0 },
                  { name: '# Rooster', preview: 'Jaime: Ik ben er vrijdag niet', time: '3u', unread: 0 },
                  { name: 'Dr. van Dijk', preview: 'Heb je de verwijsbrief gezien?', time: '20m', unread: 1 },
                  { name: 'S. Jansen', preview: 'Bedankt voor de workshop tips!', time: '2u', unread: 0 },
                  { name: 'M. de Groot', preview: 'Vergadering verzet naar 15:00', time: '4u', unread: 0 },
                  { name: '# Admin', preview: 'Systeem update gepland voor zondag', time: '1d', unread: 0 },
                ].map((chat, i) => (
                  <div
                    key={i}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      i === 0 ? 'bg-blue-50 border-r-2 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">{chat.name}</span>
                      <span className="text-xs text-slate-400">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-slate-500 truncate mr-2">{chat.preview}</span>
                      {chat.unread > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-600 text-white text-xs font-medium rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Chat main */}
            <div className="flex-1 flex flex-col">
              <div className="h-14 flex items-center justify-between px-5 border-b border-slate-100">
                <span className="font-semibold text-slate-900"># Algemeen</span>
                <span className="text-xs text-slate-400">8 leden</span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {[
                  { author: 'Dr. van Dijk', initials: 'VD', time: '14:32', text: 'Wie kan morgen de 14:00 slot overnemen? Ik heb een spoedafspraak.' },
                  { author: 'S. Jansen', initials: 'SJ', time: '14:35', text: 'Ik kan dat doen, heb nog ruimte.' },
                  { author: 'Jaime', initials: 'JS', time: '14:36', text: 'Top, bedankt Sophie! Ik update de agenda.' },
                  { author: 'Dr. van Dijk', initials: 'VD', time: '14:38', text: 'Fijn, het gaat om een cliënt van mij — M. Bakker. Dossier staat klaar.' },
                  { author: 'M. de Groot', initials: 'MG', time: '14:45', text: 'Vergeet niet dat we morgen ook teamoverleg hebben om 16:00.' },
                ].map((msg, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {msg.initials}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-slate-900">{msg.author}</span>
                        <span className="text-xs text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 flex items-center gap-3">
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Bijlage">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M7 1v8M3 5l4-4 4 4" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Audio opname">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="5" y="1" width="4" height="7" rx="2" />
                      <path d="M3 7a4 4 0 0 0 8 0M7 11v2" />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Bericht naar # Algemeen..."
                  readOnly
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Directe Tijd */}
        {activeTab === 'directe-tijd' && (
          <div className={`${s.fadeIn} space-y-6`}>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Directe tijd</h2>
              <p className="text-sm text-slate-500 mt-0.5">Week 13 &middot; 24–28 maart 2026</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Directe uren deze week', value: '19,0', sub: 'van 23,4 uur target' },
                { label: 'Declarabiliteit', value: '81%', sub: 'Target: 80%' },
                { label: 'Indirecte uren', value: '4,4', sub: 'Administratie, overleg' },
              ].map((stat, i) => (
                <div key={i} className="bg-white shadow-sm border border-slate-200 rounded-xl p-5">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</div>
                  <div className="text-sm text-slate-500 mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5 space-y-3">
              {[
                { day: 'Maandag', hours: '4,0 uur', pct: 80 },
                { day: 'Dinsdag', hours: '5,0 uur', pct: 100 },
                { day: 'Woensdag', hours: '4,5 uur', pct: 90 },
                { day: 'Donderdag', hours: '3,5 uur', pct: 70 },
                { day: 'Vrijdag', hours: '2,0 uur', pct: 40 },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm text-slate-700 w-28">{row.day}</span>
                  <span className="text-sm text-slate-500 w-16">{row.hours}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={s.dtBarFill} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Mijn Cliënten */}
        {activeTab === 'clienten' && (
          <div className={`${s.fadeIn} space-y-6`}>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Mijn cli&euml;nten</h2>
              <p className="text-sm text-slate-500 mt-0.5">12 actieve cli&euml;nten</p>
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl divide-y divide-slate-100">
              {[
                { name: 'Maria de Vries', code: 'MV', status: 'In behandeling', since: 'jan 2026', next: 'Wo 26 mrt · 09:00' },
                { name: 'Marcus D. Kemme', code: 'MK', status: 'In behandeling', since: 'feb 2026', next: 'Wo 26 mrt · 09:30' },
                { name: 'Anna Hoekstra', code: 'AH', status: 'Intake gepland', since: 'mrt 2026', next: 'Wo 26 mrt · 13:30' },
                { name: 'Jan Bakker', code: 'JB', status: 'In behandeling', since: 'dec 2025', next: 'Wo 26 mrt · 14:30' },
                { name: 'Sophie Jansen', code: 'SJ', status: 'In behandeling', since: 'nov 2025', next: 'Do 27 mrt · 10:30' },
                { name: 'Thijs van Berg', code: 'TB', status: 'Afronding', since: 'sep 2025', next: 'Vr 28 mrt · 11:00' },
              ].map((client, i) => (
                <div key={i} className="flex items-center px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mr-4">
                    {client.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm">{client.name}</div>
                    <div className="text-xs text-slate-500">{client.status} &middot; sinds {client.since}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Volgende afspraak</div>
                    <div className="text-sm text-slate-700">{client.next}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Cliënt Chat */}
        {activeTab === 'client-chat' && (
          <div className={`${s.fadeIn} flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden`} style={{ minHeight: 500 }}>
            {/* Sidebar */}
            <div className="w-72 border-r border-slate-200 flex flex-col">
              <div className="p-3 border-b border-slate-100">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2 transition-colors">
                  + Nieuw gesprek
                </button>
              </div>
              <div className="p-3 border-b border-slate-100">
                <input type="text" placeholder="Zoek cli&euml;nt..." readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none" />
              </div>
              <div className="flex-1 overflow-y-auto">
                {[
                  { name: 'M. de Vries', preview: 'Bedankt voor de sessie', time: '10m', unread: 1 },
                  { name: 'A. Hoekstra', preview: 'Ik heb de vragenlijst ingevuld', time: '2u', unread: 1 },
                  { name: 'J. Bakker', preview: 'Kan ik de afspraak verzetten?', time: '3u', unread: 0 },
                  { name: 'M.D. Kemme', preview: 'Heb je het verslag al gezien?', time: '5u', unread: 0 },
                  { name: 'T. van Berg', preview: 'Ik voel me veel beter', time: '2d', unread: 0 },
                ].map((chat, i) => (
                  <div
                    key={i}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      i === 0 ? 'bg-blue-50 border-r-2 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">{chat.name}</span>
                      <span className="text-xs text-slate-400">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-slate-500 truncate mr-2">{chat.preview}</span>
                      {chat.unread > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-600 text-white text-xs font-medium rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Chat main */}
            <div className="flex-1 flex flex-col">
              <div className="h-14 flex items-center justify-between px-5 border-b border-slate-100">
                <span className="font-semibold text-slate-900">M. de Vries</span>
                <span className="text-xs text-slate-400">Beveiligde zorgchat</span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {[
                  { author: 'M. de Vries', initials: 'MV', time: '14:20', text: 'Bedankt voor de sessie van vandaag. Ik ga de oefeningen proberen.' },
                  { author: 'Jaime', initials: 'JS', time: '14:25', text: 'Graag gedaan! Probeer de ademhalingsoefening twee keer per dag. Laat weten hoe het gaat.' },
                  { author: 'M. de Vries', initials: 'MV', time: '14:28', text: 'Zal ik doen. Moet ik de vragenlijst ook nog invullen voor volgende week?' },
                  { author: 'Jaime', initials: 'JS', time: '14:30', text: 'Ja, die krijg je automatisch per email. Vul hem in voor onze volgende sessie.' },
                ].map((msg, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {msg.initials}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-slate-900">{msg.author}</span>
                        <span className="text-xs text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 flex items-center gap-3">
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Bijlage">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M7 1v8M3 5l4-4 4 4" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Audio opname">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="5" y="1" width="4" height="7" rx="2" />
                      <path d="M3 7a4 4 0 0 0 8 0M7 11v2" />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Bericht naar M. de Vries..."
                  readOnly
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab: Agenda — 3 Column Grid */}
        {activeTab === 'agenda' && (
          <main className="grid grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <aside className="col-span-12 lg:col-span-3 space-y-4">
              {/* Stat: Cliënten vandaag */}
              <div className={`${s.fadeIn} ${s.stagger1} bg-white shadow-sm border border-slate-200 rounded-xl p-5`}>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cli&euml;nten vandaag</div>
                <div className="text-3xl font-bold text-slate-900 mt-1">6</div>
                <div className="flex gap-1.5 mt-3">
                  {[true, true, true, true, false, false].map((filled, i) => (
                    <span
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        filled ? 'bg-blue-600' : 'border-2 border-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-slate-500 mt-2">4 bevestigd &middot; 2 in afwachting</div>
              </div>

              {/* Stat: Declarabiliteit */}
              <div className={`${s.fadeIn} ${s.stagger2} bg-white shadow-sm border border-slate-200 rounded-xl p-5`}>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Declarabiliteit</div>
                <div className="text-3xl font-bold text-slate-900 mt-1">81%</div>
                <div className="relative mt-3">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '81%' }} />
                  </div>
                  <div className={`${s.targetMarker} bg-amber-500`} style={{ left: '80%' }} />
                </div>
                <div className="text-sm text-slate-500 mt-2">Target: 80%</div>
              </div>

              {/* Stat: Ongelezen */}
              <div className={`${s.fadeIn} ${s.stagger3} bg-white shadow-sm border border-slate-200 rounded-xl p-5`}>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ongelezen</div>
                <div className="text-3xl font-bold text-amber-600 mt-1">3</div>
                <div className="text-sm text-slate-500 mt-1">2 chats, 1 rapport</div>
              </div>

              {/* Berichten */}
              <div className={`${s.fadeIn} ${s.stagger4} bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden`}>
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900">Berichten</h3>
                  <span className="w-5 h-5 flex items-center justify-center bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                    {messages.length}
                  </span>
                </div>
                <div className={s.messagesScroll}>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                        isRecentMessage(msg.time) ? 'border-l-2 border-blue-600 pl-[18px]' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 text-sm">{msg.name}</div>
                        <div className="text-sm text-slate-500 truncate">{msg.preview}</div>
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0">{msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Center Column: Agenda */}
            <section className={`${s.fadeIn} ${s.stagger2} col-span-12 lg:col-span-6`}>
              <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Vandaag</h2>
                    <p className="text-sm text-slate-500">6 sessies &middot; 1 beschikbaar</p>
                  </div>
                </div>
                {renderAgendaContent(false)}
              </div>
            </section>

            {/* Right Sidebar */}
            <aside className="col-span-12 lg:col-span-3 space-y-4">
              {/* AskMoody */}
              <div className={`${s.fadeIn} ${s.stagger3} bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden`}>
                <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">AskMoody</span>
                </div>
                <div className="p-5 space-y-3">
                  {askMoodyInsights.map((insight, i) => (
                    <div key={i} className="border-l-2 border-blue-400 pl-3 text-sm text-slate-700">
                      {insight.text}
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-5">
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Vraag iets aan Moody..."
                    readOnly
                  />
                </div>
              </div>

              {/* Recente Verslagen */}
              <div className={`${s.fadeIn} ${s.stagger4} bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden`}>
                <div className="px-5 py-3 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900">Recente verslagen</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {recentNotes.map((note, i) => (
                    <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm text-slate-700 truncate">{note.text}</span>
                        {note.aiGenerated && (
                          <span className="flex-shrink-0 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            AI gegenereerd
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{note.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mijn kamer */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className={`${s.fadeIn} ${s.stagger5} flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-md py-4 px-6 text-sm font-medium transition-colors`}
              >
                Mijn kamer
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 1.5H2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V7.5" />
                  <path d="M7 1.5h3.5V5" />
                  <path d="M5 7L10.5 1.5" />
                </svg>
              </a>
              <div className="flex items-center justify-center gap-1.5 -mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500">Beschikbaar</span>
              </div>
            </aside>
          </main>
        )}

        {/* Mobile: Berichten below agenda */}
        {activeTab === 'agenda' && (
          <div className="lg:hidden mt-6">
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Berichten</h3>
                <span className="w-5 h-5 flex items-center justify-center bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                  {messages.length}
                </span>
              </div>
              <div>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                      isRecentMessage(msg.time) ? 'border-l-2 border-blue-600 pl-[18px]' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 text-sm">{msg.name}</div>
                      <div className="text-sm text-slate-500 truncate">{msg.preview}</div>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">{msg.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Dialog (day view) */}
      {expandedAppointment !== null && (() => {
        const apt = schedule[expandedAppointment];
        const details = apt.client ? appointmentDetails[apt.client] : null;
        if (!details) return null;
        return renderAppointmentDialog(apt, details, () => setExpandedAppointment(null));
      })()}

      {/* Appointment Dialog (week view) */}
      {selectedWeekAptData && renderAppointmentDialog(
        selectedWeekAptData.apt,
        selectedWeekAptData.details,
        () => setSelectedWeekApt(null),
      )}

      {/* Expanded Agenda Dialog */}
      {isAgendaExpanded && (
        <div className={s.dialogOverlay} onClick={() => setIsAgendaExpanded(false)}>
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-5xl mx-4 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {renderAgendaContent(true)}
          </div>
        </div>
      )}
    </div>
  );
}
