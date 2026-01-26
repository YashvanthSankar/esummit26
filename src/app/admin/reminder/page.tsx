'use client';

import { useState } from 'react';
import { Send, TestTube, Loader2, Mail, Users, AlertCircle, CheckCircle } from 'lucide-react';

interface SendResult {
    success: boolean;
    totalRecipients?: number;
    sent?: number;
    failed?: number;
    errors?: string[];
    message?: string;
    error?: string;
}

export default function ReminderPage() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [testEmail, setTestEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SendResult | null>(null);

    const sendReminder = async (testMode: boolean) => {
        if (!subject.trim() || !message.trim()) {
            setResult({ success: false, error: 'Subject and message are required' });
            return;
        }

        if (testMode && !testEmail.trim()) {
            setResult({ success: false, error: 'Test email is required for test mode' });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/admin/send-reminder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    message,
                    testMode,
                    testEmail: testMode ? testEmail : undefined,
                }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error: any) {
            setResult({ success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <Mail className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Send Event Reminders</h1>
                        <p className="text-white/50 text-sm">Send email reminders to all paid ticket holders</p>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Email Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g., 🎉 E-Summit '26 Starts Tomorrow!"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none text-white placeholder:text-white/30"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Message Body
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your reminder message here...

You can use multiple lines.

The recipient's name will be added automatically in the greeting."
                            rows={10}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none text-white placeholder:text-white/30 resize-none"
                        />
                    </div>

                    {/* Test Email */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                            <TestTube className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-white/70">Test Mode</span>
                        </div>
                        <input
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="Enter your email to test"
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-yellow-500/50 focus:outline-none text-white placeholder:text-white/30 text-sm"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => sendReminder(true)}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TestTube className="w-5 h-5" />}
                            Send Test Email
                        </button>
                        <button
                            onClick={() => sendReminder(false)}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            Send to All Ticket Holders
                        </button>
                    </div>

                    {/* Result Display */}
                    {result && (
                        <div className={`p-4 rounded-xl border ${result.success ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <div className="flex items-start gap-3">
                                {result.success ? (
                                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    {result.success ? (
                                        <>
                                            <p className="text-green-400 font-medium">
                                                {result.message || `Emails sent successfully!`}
                                            </p>
                                            {result.totalRecipients && (
                                                <div className="mt-2 text-sm text-white/60">
                                                    <p>Total Recipients: {result.totalRecipients}</p>
                                                    <p>Sent: {result.sent}</p>
                                                    {(result.failed ?? 0) > 0 && <p className="text-red-400">Failed: {result.failed}</p>}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-red-400">{result.error}</p>
                                    )}

                                    {result.errors && result.errors.length > 0 && (
                                        <details className="mt-2">
                                            <summary className="text-sm text-white/50 cursor-pointer">View errors</summary>
                                            <ul className="mt-2 text-xs text-red-300 space-y-1">
                                                {result.errors.map((err, i) => (
                                                    <li key={i}>{err}</li>
                                                ))}
                                            </ul>
                                        </details>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-purple-400 mt-0.5" />
                            <div className="text-sm text-white/60">
                                <p className="font-medium text-white/80 mb-1">How it works:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Emails are sent to all users with <strong>paid</strong> tickets</li>
                                    <li>Each user gets a personalized greeting with their name</li>
                                    <li>Use <strong>Test Mode</strong> first to preview the email</li>
                                    <li>Emails are sent in batches to avoid rate limits</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
