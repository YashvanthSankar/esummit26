'use client';

import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Youtube, Mail, MapPin, Heart } from 'lucide-react';

const footerLinks = [
    {
        title: 'Quick Links',
        links: [
            { label: 'Events', href: '#events' },
            { label: 'Speakers', href: '#speakers' },
            { label: 'Schedule', href: '#schedule' },
            { label: 'Sponsors', href: '#sponsors' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'FAQs', href: '#' },
            { label: 'Guidelines', href: '#' },
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
        ],
    },
];

const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
    return (
        <footer className="bg-[var(--bg-primary)] border-t border-[var(--accent-secondary)]/10">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h3 className="text-4xl font-heading font-bold text-[var(--text-primary)] mb-4">
                                E-SUMMIT <span className="text-[var(--accent-primary)]">&apos;26</span>
                            </h3>
                            <p className="text-[var(--text-muted)] font-body leading-relaxed mb-6 max-w-md">
                                The premier entrepreneurship summit bringing together visionaries, innovators, and changemakers at IIITDM Kancheepuram.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-[var(--text-muted)]">
                                    <MapPin className="w-5 h-5 text-[var(--accent-secondary)]" />
                                    <span className="font-body">IIITDM Kancheepuram, Chennai - 600127</span>
                                </div>
                                <div className="flex items-center gap-3 text-[var(--text-muted)]">
                                    <Mail className="w-5 h-5 text-[var(--accent-secondary)]" />
                                    <a
                                        href="mailto:esummit@iiitdm.ac.in"
                                        className="font-body hover:text-[var(--accent-primary)] transition-colors"
                                    >
                                        esummit@iiitdm.ac.in
                                    </a>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-4 mt-6">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            aria-label={social.label}
                                            className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--accent-secondary)]/20 flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-dark)] hover:border-[var(--accent-primary)] transition-all duration-300"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                        >
                            <h4 className="text-lg font-heading font-bold text-[var(--text-primary)] mb-4">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-[var(--text-muted)] font-body hover:text-[var(--accent-primary)] transition-colors duration-300"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 pt-8 border-t border-[var(--accent-secondary)]/10"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[var(--text-muted)] font-body text-sm">
                            © 2026 E-Summit. All rights reserved.
                        </p>
                        <p className="text-[var(--text-muted)] font-body text-sm flex items-center gap-2">
                            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{' '}
                            <span className="text-[var(--accent-primary)] font-semibold">
                                E-Cell IIITDM
                            </span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
