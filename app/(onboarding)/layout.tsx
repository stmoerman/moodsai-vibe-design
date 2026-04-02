import Image from 'next/image';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center px-5 py-10">
      <Image
        src="/images/logo.png"
        alt="Moods.ai"
        width={140}
        height={36}
        className="mb-8"
        priority
      />
      {children}
    </div>
  );
}
