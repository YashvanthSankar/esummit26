import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy | E-Summit \'26',
    description: 'Privacy Policy for E-Summit \'26 IIITDM Kancheepuram',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen px-6 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            <div className="max-w-3xl mx-auto relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-body text-sm">Back to Home</span>
                </Link>

                <h1 className="font-heading text-4xl sm:text-5xl text-white mb-8">
                    Privacy Policy
                </h1>

                <div className="prose prose-invert prose-purple max-w-none space-y-6">
                    <p className="font-body text-white/70 leading-relaxed">
                        Last updated: January 2026
                    </p>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">1. Information We Collect</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            When you register for E-Summit &apos;26, we collect the following information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 font-body text-white/70">
                            <li>Full name</li>
                            <li>Email address (via Google OAuth)</li>
                            <li>Phone number</li>
                            <li>College/Organization name</li>
                            <li>Roll number (for IIITDM students)</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">2. How We Use Your Information</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            Your information is used solely for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 font-body text-white/70">
                            <li>Processing ticket purchases</li>
                            <li>Generating unique QR codes for event entry</li>
                            <li>Sending event-related communications</li>
                            <li>Verifying attendee identity at the venue</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">3. Data Storage</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            Your data is securely stored using Supabase, a trusted cloud database provider. We implement industry-standard security measures to protect your information.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">4. Third-Party Services</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            We use the following third-party services:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 font-body text-white/70">
                            <li>Google OAuth for authentication</li>
                            <li>Payment gateway for secure transactions</li>
                            <li>Supabase for database services</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">5. Data Retention</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            We retain your data for the duration of the event and up to 6 months after for administrative purposes. You may request deletion of your data by contacting us.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">6. Your Rights</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            You have the right to access, correct, or delete your personal information. Contact us at{' '}
                            <a href="mailto:ecell@iiitdm.ac.in" className="text-[#a855f7] hover:underline">
                                ecell@iiitdm.ac.in
                            </a>{' '}
                            for any privacy-related requests.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">7. Contact</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            For privacy concerns, contact E-Cell IIITDM at{' '}
                            <a href="mailto:ecell@iiitdm.ac.in" className="text-[#a855f7] hover:underline">
                                ecell@iiitdm.ac.in
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
