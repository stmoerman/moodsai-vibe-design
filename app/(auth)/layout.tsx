import Image from 'next/image';
import s from './layout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.root}>
      <Image
        src="/images/logo.png"
        alt="Moods.ai"
        width={140}
        height={36}
        className={s.logoImg}
        priority
      />
      <div className={s.card}>
        {children}
      </div>
    </div>
  );
}
