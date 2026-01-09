'use client';

import { motion } from 'framer-motion';
import { Heart, Instagram, Linkedin } from 'lucide-react';

const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/ecell_iiitdm/', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/ecell-iiitdm/', label: 'LinkedIn' },
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
                            E-SUMMIT <span className="text-[#a855f7]">&apos;26</span>
                        </h3>
                        <p className="font-body text-white/40 text-sm max-w-xs mb-6">
                            The premier entrepreneurship summit of South India, hosted at IIITDM Kancheepuram.
                        </p>

                        {/* Logos with background */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 w-fit">
                            <a
                                href="https://iiitdmk-ecell.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform hover:scale-105"
                                data-hover="true"
                            >
                                <img
                                    src="/ecell.png"
                                    alt="E-Cell IIITDM"
                                    className="h-10 w-auto object-contain"
                                />
                            </a>
                            <div className="h-8 w-px bg-white/20"></div>
                            <a
                                href="https://www.iiitdm.ac.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform hover:scale-105 p-2 bg-white rounded-lg"
                                data-hover="true"
                            >
                                <img
                                    src="/iiitdm.png"
                                    alt="IIITDM Kancheepuram"
                                    className="h-10 w-auto object-contain"
                                />
                            </a>
                        </div>
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
                            <li>
                                <a
                                    href="#events"
                                    className="font-body text-white/40 hover:text-[#a855f7] transition-colors text-sm"
                                    data-hover="true"
                                >
                                    Events
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#speakers"
                                    className="font-body text-white/40 hover:text-[#a855f7] transition-colors text-sm"
                                    data-hover="true"
                                >
                                    Speakers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#schedule"
                                    className="font-body text-white/40 hover:text-[#a855f7] transition-colors text-sm"
                                    data-hover="true"
                                >
                                    Schedule
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#sponsors"
                                    className="font-body text-white/40 hover:text-[#a855f7] transition-colors text-sm"
                                    data-hover="true"
                                >
                                    Sponsors
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/dashboard"
                                    className="font-body text-white/40 hover:text-[#a855f7] transition-colors text-sm"
                                    data-hover="true"
                                >
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/login"
                                    className="font-body text-white/40 hover:text-[#a855f7] transition-colors text-sm"
                                    data-hover="true"
                                >
                                    Login
                                </a>
                            </li>
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
                                        className="glass-card w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-[#a855f7] transition-colors"
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

                    <div className="flex items-center gap-4">
                        <a
                            href="/terms"
                            className="font-body text-white/30 hover:text-[#a855f7] transition-colors text-sm"
                            data-hover="true"
                        >
                            Terms
                        </a>
                        <span className="text-white/20">•</span>
                        <a
                            href="/privacy"
                            className="font-body text-white/30 hover:text-[#a855f7] transition-colors text-sm"
                            data-hover="true"
                        >
                            Privacy
                        </a>
                    </div>

                    <p className="font-body text-white/30 text-sm flex items-center gap-2">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{' '}
                        <span className="text-[#a855f7] font-semibold">E-Cell IIITDM</span>
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
