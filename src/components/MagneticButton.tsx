'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, MouseEvent } from 'react';
import { ExternalLink } from 'lucide-react';

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  href?: string;
  external?: boolean;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  variant = 'primary',
  href,
  external = false,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles = `
    relative inline-flex items-center gap-2 px-8 py-4 
    text-lg font-semibold font-body rounded-full
    transition-colors duration-300 cursor-pointer
    overflow-hidden
  `;

  const variants = {
    primary: `
      bg-[var(--accent-primary)] text-[var(--text-dark)]
      hover:bg-white
    `,
    outline: `
      border-2 border-[var(--accent-primary)] text-[var(--accent-primary)]
      hover:bg-[var(--accent-primary)] hover:text-[var(--text-dark)]
    `,
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref as any}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
      {external && <ExternalLink className="w-5 h-5" />}
    </Component>
  );
}
