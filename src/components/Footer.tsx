'use client';

import { motion } from 'framer-motion';
import { Heart, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
    return (
        <footer id="footer" className="py-16 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="font-heading text-3xl text-white mb-2">
                            E-SUMMIT <span className="text-[#ccff00]">&apos;26</span>
                        </h3>
                        <p className="font-body text-white/40 text-sm max-w-xs">
                            The premier entrepreneurship summit of South India, hosted at IIITDM Kancheepuram.
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="font-heading text-lg text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {['Events', 'Speakers', 'Schedule', 'Sponsors'].map((link) => (
                                <li key={link}>
                                    <a
                                        href={`#${link.toLowerCase()}`}
                                        className="font-body text-white/40 hover:text-[#ccff00] transition-colors text-sm"
                                        data-hover="true"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="font-heading text-lg text-white mb-4">Follow Us</h4>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="glass-card w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-[#ccff00] transition-colors"
                                        data-hover="true"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <p className="font-body text-white/30 text-sm">
                        © 2026 E-Summit. All rights reserved.
                    </p>
                    <p className="font-body text-white/30 text-sm flex items-center gap-2">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{' '}
                        <span className="text-[#ccff00] font-semibold">E-Cell IIITDM</span>
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
