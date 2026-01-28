'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Book, Scale, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-sm">Back to Home</span>
                    </Link>
                    <span className="font-semibold text-lg tracking-tight">Terms of Service</span>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-16">
                <div className="prose prose-invert prose-zinc max-w-none">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
                        <p className="text-zinc-500">Last updated: January 28, 2026</p>
                    </div>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5">
                                <Book className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">Acceptance of Terms</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed">
                            By accessing and using Comculations, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5">
                                <Scale className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">Usage License</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            Comculations grants you a personal, non-exclusive, non-transferable, revocable license to access and use the platform for educational and development purposes.
                        </p>
                        <p className="text-zinc-400 leading-relaxed font-medium">
                            You agree not to use the platform to:
                        </p>
                        <ul className="text-zinc-400 mt-2 space-y-2 list-disc pl-5">
                            <li>Run malicious code or malware</li>
                            <li>Attempt to breach the sandbox environment</li>
                            <li>Mine cryptocurrencies or perform heavy computation attacks</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">Disclaimer</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed">
                            The materials on Comculations are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="border-t border-white/10 pt-12">
                        <p className="text-zinc-400 text-sm">
                            We reserve the right to modify these terms at any time. Your continued use of the platform constitutes your agreement to all such terms.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
