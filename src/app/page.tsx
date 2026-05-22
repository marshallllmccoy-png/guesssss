import HeroSection from '@/components/home/HeroSection';
import GameRules from '@/components/home/GameRules';
import StartButton from '@/components/home/StartButton';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <GameRules />
      <StartButton />
    </main>
  );
}
