'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-sm">Back to Home</span>
                    </Link>
                    <span className="font-semibold text-lg tracking-tight">Privacy Policy</span>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-16">
                <div className="prose prose-invert prose-zinc max-w-none">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
                        <p className="text-zinc-500">Last updated: January 28, 2026</p>
                    </div>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">Data Collection</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed">
                            At Comculations, we prioritize your privacy. We collect minimal data necessary to provide our compilation services. This includes:
                        </p>
                        <ul className="text-zinc-400 mt-4 space-y-2 list-disc pl-5">
                            <li>Code snippets you execute (temporarily processed for compilation)</li>
                            <li>Usage analytics to improve system performance</li>
                            <li>Technical logs for debugging purposes</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">Code Security</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed">
                            Your code execution happens in isolated sandboxes. We do not claim ownership of any code you write or compile on our platform. Code sent to our servers for compilation (like C programs) is processed ephemerally and is not permanently stored unless you explicitly save it.
                        </p>
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5">
                                <Eye className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">Cookies & Tracking</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed">
                            We use local storage to save your preferences (like theme and editor settings) directly on your device. We do not use invasive tracking cookies.
                        </p>
                    </section>

                    <section className="border-t border-white/10 pt-12">
                        <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                        <p className="text-zinc-400">
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@comculations.com" className="text-white hover:underline">privacy@comculations.com</a>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
