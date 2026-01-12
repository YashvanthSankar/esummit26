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
import InstallApp from '@/components/InstallApp';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#050505] relative">
        {/* Background Grid */}
        <AnimatedGrid />

        {/* Dock Navigation */}
        <DockNavigation />

        {/* E-Summit Logo - Top Left (scrolls with page) */}
        <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 z-20 opacity-80 hover:opacity-100 transition-opacity">
          <Image
            src="/esummit26-logo.png"
            alt="E-Summit '26"
            width={180}
            height={48}
            className="h-8 md:h-12 w-auto"
            unoptimized
            priority
          />
        </Link>

        {/* IIITDM Logo - Top Right */}
        <Link href="https://www.iiitdm.ac.in" target="_blank" rel="noopener noreferrer" className="absolute top-6 right-6 md:top-8 md:right-8 z-20 opacity-80 hover:opacity-100 transition-opacity">
          <Image
            src="/iiitdm.png"
            alt="IIITDM Kancheepuram"
            width={56}
            height={56}
            className="h-10 md:h-14 w-auto brightness-0 invert"
            unoptimized
            priority
          />
        </Link>

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
          

          {/* Sponsors Section */}
          <Sponsors />

          {/* Install App Section */}
          <InstallApp />

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </SmoothScroll>
  );
}
