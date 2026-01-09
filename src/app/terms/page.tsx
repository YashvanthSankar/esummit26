import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service | E-Summit \'26',
    description: 'Terms of Service for E-Summit \'26 IIITDM Kancheepuram',
};

export default function TermsPage() {
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
                    Terms of Service
                </h1>

                <div className="prose prose-invert prose-purple max-w-none space-y-6">
                    <p className="font-body text-white/70 leading-relaxed">
                        Last updated: January 2026
                    </p>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">1. Acceptance of Terms</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            By accessing and using the E-Summit &apos;26 website and purchasing tickets, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">2. Event Tickets</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            Tickets purchased for E-Summit &apos;26 are non-refundable and non-transferable. Each ticket grants access to the specified event(s) as per the ticket type (Solo, Duo, or Quad Pass).
                        </p>
                        <ul className="list-disc pl-6 space-y-2 font-body text-white/70">
                            <li>Solo Pass: Access for 1 person</li>
                            <li>Duo Pass: Access for 2 people</li>
                            <li>Quad Pass: Access for 4 people</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">3. QR Code Usage</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            Each ticket includes a unique QR code that must be presented for entry at the event. The QR code is valid for one-time entry per event. Sharing or duplicating QR codes is prohibited.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">4. Event Changes</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            E-Cell IIITDM reserves the right to modify event schedules, speakers, or content without prior notice. In case of event cancellation, ticket holders will be notified and refunds will be processed.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">5. Code of Conduct</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            All attendees are expected to maintain professional conduct during the event. Any behavior deemed inappropriate may result in removal from the event without refund.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading text-2xl text-white">6. Contact</h2>
                        <p className="font-body text-white/70 leading-relaxed">
                            For any questions regarding these terms, please contact us at{' '}
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
