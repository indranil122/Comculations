'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  ChevronRight,
  Github,
  Zap,
  Terminal,
  Shield,
  Layout,
  Cpu,
  Globe,
  Twitter,
  Linkedin
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden aurora-bg">
      {/* Aurora Blobs */}
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />

      {/* Noise Overlay */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] brightness-100 contrast-150 pointer-events-none z-[1]" />

      {/* Floating Pill Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-5xl rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center shadow-lg">
              <Code2 className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors">Comculations</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors duration-300">Features</a>
            <a href="#playground" className="hover:text-white transition-colors duration-300">Playground</a>
            <a href="https://github.com/indranil122/Comculations" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">Open Source</a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/compiler"
              className="px-5 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>

      <main className="relative z-10 pt-44 pb-32 px-6">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] text-gradient">
              Simplicity in <br />
              Every Line.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 mb-12 leading-relaxed font-light">
              A minimalistic, high-performance cloud compiler.
              Focus on your code in a distraction-free environment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/compiler"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
              >
                Start Coding
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://github.com/indranil122/Comculations"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-black border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>

            {/* Trusted By / Mock Logos - Minimalistic Style (Image 0) */}

          </motion.div>

          {/* Hero Visual - Minimalistic Code Window (Image 2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-32 relative max-w-4xl mx-auto"
          >
            {/* Glow behind the window */}
            <div className="absolute inset-0 bg-white/5 blur-[120px] -z-10 rounded-full opacity-50" />

            <div className="rounded-2xl border border-white/10 bg-[#050505] shadow-2xl overflow-hidden">
              {/* Window Controls */}
              <div className="h-10 border-b border-white/5 flex items-center px-4 justify-between bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest opacity-50">main.py</div>
                <div className="w-12" /> {/* Spacer */}
              </div>

              {/* Minimal Code Content */}
              <div className="p-8 md:p-12 text-left font-mono text-sm leading-8 bg-black/80 backdrop-blur-sm">
                <div className="flex gap-6 text-zinc-600">
                  <span className="select-none w-4 text-right">1</span>
                  <span className="text-zinc-400">def <span className="text-white font-semibold">calculate_gravity</span>(mass, planet=<span className="text-zinc-300">"Earth"</span>):</span>
                </div>
                <div className="flex gap-6 text-zinc-600">
                  <span className="select-none w-4 text-right">2</span>
                  <span className="text-zinc-700 ml-4">// Modern cloud execution environment</span>
                </div>
                <div className="flex gap-6 text-zinc-600">
                  <span className="select-none w-4 text-right">3</span>
                  <span className="text-zinc-400 ml-4">if planet == <span className="text-zinc-300">"Earth"</span>:</span>
                </div>
                <div className="flex gap-6 text-zinc-600">
                  <span className="select-none w-4 text-right">4</span>
                  <span className="text-zinc-400 ml-8">return mass * <span className="text-white">9.807</span></span>
                </div>
                <div className="flex gap-6 text-zinc-600">
                  <span className="select-none w-4 text-right">5</span>
                  <span className="text-zinc-400 ml-4">return <span className="text-white">0</span></span>
                </div>
                <div className="flex gap-6 text-zinc-600 mt-6">
                  <span className="select-none w-4 text-right">6</span>
                  <span className="text-zinc-300">print(calculate_gravity(<span className="text-white">70</span>))</span>
                </div>
                <div className="flex gap-6 text-zinc-600 mt-2">
                  <span className="select-none w-4 text-right">7</span>
                  <motion.div
                    className="w-2 h-5 bg-white opacity-80"
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Minimal Features Grid */}
        <section id="features" className="py-32 px-6 mt-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-24 text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Designed for <br />Focus.</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Stripped of distractions. Optimized for performance.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Zap className="w-5 h-5 text-white" />}
                title="Instant Execution"
                description="Zero setup. Compile C and Python instantly."
              />
              <FeatureCard
                icon={<Cpu className="w-5 h-5 text-white" />}
                title="AI Assistance"
                description="Smart error explanation without the clutter."
              />
              <FeatureCard
                icon={<Layout className="w-5 h-5 text-white" />}
                title="Clean Workspace"
                description="Side-by-side editing and output."
              />
              <FeatureCard
                icon={<Globe className="w-5 h-5 text-white" />}
                title="Cloud Sync"
                description="Access projects from anywhere."
              />
              <FeatureCard
                icon={<Shield className="w-5 h-5 text-white" />}
                title="Secure Sandbox"
                description="Isolated execution environment."
              />
              <FeatureCard
                icon={<Terminal className="w-5 h-5 text-white" />}
                title="Pro Console"
                description="Full ANSI support and formatting."
              />
            </div>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="py-20 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
                  <Code2 className="text-black w-4 h-4" />
                </div>
                <span className="font-bold tracking-tight">Comculations</span>
              </div>
              <p className="text-zinc-500 text-sm max-w-xs">
                Simplicity in Every Line. A minimalistic, high-performance cloud compiler.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-white">Legal</span>
              <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors text-sm">Terms of Service</Link>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-white">Connect</span>
              <a href="https://twitter.com/comculations" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="https://github.com/indranil122/Comculations" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors text-sm">GitHub</a>
              <a href="https://linkedin.com/company/comculations" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors text-sm">LinkedIn</a>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
            <p>© 2026 Comculations. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Twitter className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
              <a href="https://github.com/indranil122/Comculations" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
              </a>
              <Linkedin className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl border border-white/5 bg-zinc-900/10 backdrop-blur-sm hover:bg-zinc-900/30 hover:border-white/10 transition-all group"
    >
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
