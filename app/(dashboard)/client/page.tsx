'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import s from './page.module.css';

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

const appointments = [
  { date: 'Ma 7 apr · 10:00', name: 'Behandeling', therapist: 'Dhr. Van den Berg', type: 'behandeling', status: 'Bevestigd' },
  { date: 'Wo 9 apr · 14:00', name: 'Stressmanagement Workshop', therapist: '8 deelnemers', type: 'workshop', status: 'Bevestigd' },
  { date: 'Do 10 apr · 11:00', name: 'Vervolgconsult', therapist: 'Dhr. Van den Berg', type: 'consult', status: 'Bevestigd' },
  { date: 'Vr 11 apr · 10:00', name: 'Mindfulness Basis Workshop', therapist: '12 deelnemers', type: 'workshop', status: 'In afwachting' },
  { date: 'Ma 14 apr · 09:30', name: 'Behandeling', therapist: 'Dhr. Van den Berg', type: 'behandeling', status: 'Bevestigd' },
];

const tasks = [
  { name: 'Dagboek bijhouden', deadline: 'Deadline: 6 apr', done: false },
  { name: 'GAD-7 vragenlijst', deadline: 'Voltooid 1 apr', done: true },
  { name: 'Ontspanningsoefening', deadline: 'Deadline: 9 apr', done: false },
  { name: 'Workshop voorbereiding', deadline: 'Deadline: 10 apr', done: false },
];

const CANNED_RESPONSES = [
  'Ik begrijp het. Het is heel normaal om je zo te voelen. Wil je er wat meer over vertellen?',
  'Dat klinkt als een goede stap. Heb je al nagedacht over wat je deze week anders wilt doen?',
  'Goed bezig! Vergeet niet om je ontspanningsoefeningen te doen voor je volgende afspraak.',
];

interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

export default function ClientDashboard() {
  const { displayName } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Hoi! Ik ben Moody, je digitale assistent. Hoe kan ik je vandaag helpen?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [responseIndex, setResponseIndex] = useState(0);

  useEffect(() => {
    const now = new Date();
    setGreeting(getGreeting(now.getHours()));
    setDateStr(formatDate(now));
  }, []);

  function handleSend() {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    const idx = responseIndex;
    setResponseIndex((v) => (v + 1) % CANNED_RESPONSES.length);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: CANNED_RESPONSES[idx] }]);
    }, 1000);
  }

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className={s.root}>
      <h1 className={s.greeting}>{greeting}, {displayName ?? 'Demo Cliënt'}</h1>
      <div className={s.dateStr}>Cliënt · {dateStr}</div>

      <div className={s.columns}>
        <div className={s.card}>
          <h2 className={s.cardTitle}>Afspraken</h2>
          {appointments.map((apt, i) => (
            <div key={i} className={s.aptItem}>
              <div className={s.aptDate}>{apt.date}</div>
              <div className={s.aptName}>{apt.name}</div>
              <div className={s.aptMeta}>{apt.therapist} · {apt.status}</div>
              <span className={`${s.aptType} ${apt.type === 'workshop' ? s.aptTypeWorkshop : ''}`}>
                {apt.type}
              </span>
            </div>
          ))}
        </div>

        <div className={s.card}>
          <h2 className={s.cardTitle}>E-health Opdrachten</h2>
          <div className={s.progressText}>{completedCount} van {tasks.length} voltooid</div>
          {tasks.map((task, i) => (
            <div key={i} className={s.taskItem}>
              <div className={`${s.taskCheck} ${task.done ? s.taskCheckDone : ''}`}>
                {task.done ? '✓' : ''}
              </div>
              <div>
                <div className={`${s.taskName} ${task.done ? s.taskNameDone : ''}`}>{task.name}</div>
                <div className={s.taskDeadline}>{task.deadline}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={s.card}>
          <h2 className={s.cardTitle}>AskMoody</h2>
          <div className={s.chatContainer}>
            <div className={s.chatMessages}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${s.chatBubble} ${msg.role === 'ai' ? s.chatBubbleAi : s.chatBubbleUser}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className={s.chatInputRow}>
              <input
                type="text"
                className={s.chatInput}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Typ hier..."
              />
              <button className={s.chatSend} onClick={handleSend}>→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
