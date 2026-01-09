'use client';

import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import EventsGrid from '@/components/EventsGrid';
import SpeakersCarousel from '@/components/SpeakersCarousel';
import Schedule from '@/components/Schedule';
import Sponsors from '@/components/Sponsors';
import Footer from '@/components/Footer';
import AnimatedGrid from '@/components/AnimatedGrid';
import DockNavigation from '@/components/DockNavigation';
import SmoothScroll from '@/components/SmoothScroll';

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#050505] relative">
        {/* Background Grid */}
        <AnimatedGrid />

        {/* Dock Navigation */}
        <DockNavigation />

        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <div id="hero">
            <Hero />
          </div>

          {/* Marquee Separator */}
          <Marquee />

          {/* Events Bento Grid */}
          <EventsGrid />

          {/* Speakers */}
          <SpeakersCarousel />

          {/* Schedule Timeline */}
          <Schedule />

          {/* Sponsors Section */}
          <Sponsors />

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </SmoothScroll>
  );
}
