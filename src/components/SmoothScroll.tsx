'use client';

// Lightweight replacement for Lenis - uses native CSS smooth scroll
// This eliminates the continuous RAF loop for better performance
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    return <div className="smooth-scroll-wrapper">{children}</div>;
}
