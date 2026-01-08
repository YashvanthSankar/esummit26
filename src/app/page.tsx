import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import EventsGrid from '@/components/EventsGrid';
import SpeakersCarousel from '@/components/SpeakersCarousel';
import Schedule from '@/components/Schedule';
import Sponsors from '@/components/Sponsors';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <Hero />

      {/* Marquee Separator */}
      <Marquee />

      {/* Events Bento Grid */}
      <EventsGrid />

      {/* Speakers Carousel */}
      <SpeakersCarousel />

      {/* Marquee Separator */}
      <Marquee text="CONNECT • CREATE • CONQUER" speed="slow" />

      {/* Schedule Timeline */}
      <Schedule />

      {/* Sponsors Section */}
      <Sponsors />

      {/* Footer */}
      <Footer />
    </main>
  );
}
