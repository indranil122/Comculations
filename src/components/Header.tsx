'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Play,
    Settings,
    Layout,
    Sun,
    Moon,
    GraduationCap,
    Code2,
    FileCode,
    Menu,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { executeCode } from '@/lib/compiler';

export default function Header() {
    const {
        theme,
        toggleTheme,
        language,
        setLanguage,
        learningMode,
        toggleLearningMode,
        setShowTemplates,
        setShowSettings,
        isExecuting,
        code,
        input,
        setIsExecuting,
        setExecutionResult,
        setActiveTab
    } = useStore();

    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleRun = async () => {
        if (isExecuting) return;

        setIsExecuting(true);
        setActiveTab('output');

        try {
            const result = await executeCode(code, language, input, learningMode);
            setExecutionResult(result);

            // If there's an error and learning mode is on, switch to AI tab
            if (result.error && learningMode && result.aiExplanation) {
                setActiveTab('ai');
            } else if (result.error) {
                setActiveTab('error');
            }
        } catch (error) {
            setExecutionResult({
                output: '',
                error: error instanceof Error ? error.message : 'Execution failed',
                executionTime: 0,
                memoryUsage: 0,
                exitCode: 1
            });
            setActiveTab('error');
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] sticky top-0 z-50">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/">
                        <motion.div
                            className="flex items-center gap-3 cursor-pointer group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                                    <img src="/logo.png" alt="Comculations" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="font-semibold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                    Comculations
                                </h1>
                                <p className="text-xs text-[var(--text-muted)]">Code. Compile. Conquer.</p>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Desktop Controls */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Language Selector Dropdown */}
                        <div className="relative group">
                            <button className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all flex items-center gap-2 min-w-[140px] justify-between">
                                <span className="flex items-center gap-2">
                                    <FileCode className="w-4 h-4 text-[var(--accent-primary)]" />
                                    {language === 'c' ? 'C' : 'Python'}
                                </span>
                                <Menu className="w-3.5 h-3.5 opacity-50" />
                            </button>

                            <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
                                <div className="p-1">
                                    <button
                                        onClick={() => setLanguage('c')}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${language === 'c' ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'}`}
                                    >
                                        <span>C</span>
                                        {language === 'c' && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />}
                                    </button>
                                    <button
                                        onClick={() => setLanguage('python')}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${language === 'python' ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'}`}
                                    >
                                        <span>Python</span>
                                        {language === 'python' && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />}
                                    </button>
                                </div>
                                <div className="border-t border-[var(--border-default)] p-1 bg-[var(--bg-tertiary)]/50">
                                    <button disabled className="w-full text-left px-3 py-2 rounded-md text-sm text-[var(--text-muted)] flex items-center justify-between cursor-not-allowed opacity-60">
                                        <span>Java</span>
                                        <span className="text-[10px] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] border border-[var(--border-subtle)]">Soon</span>
                                    </button>
                                    <button disabled className="w-full text-left px-3 py-2 rounded-md text-sm text-[var(--text-muted)] flex items-center justify-between cursor-not-allowed opacity-60">
                                        <span>C++</span>
                                        <span className="text-[10px] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] border border-[var(--border-subtle)]">Soon</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Run Button */}
                        <motion.button
                            onClick={handleRun}
                            disabled={isExecuting}
                            className="btn-primary relative overflow-hidden min-w-[120px]"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isExecuting ? (
                                <>
                                    <div className="loading-spinner" />
                                    <span>Running...</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    <span>Run Code</span>
                                </>
                            )}
                        </motion.button>

                        {/* Learning Mode Toggle */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-default)]">
                            <GraduationCap className={`w-4 h-4 ${learningMode ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`} />
                            <span className="text-xs font-medium text-[var(--text-secondary)]">Learning</span>
                            <button
                                onClick={toggleLearningMode}
                                className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${learningMode ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-elevated)]'
                                    }`}
                            >
                                <motion.div
                                    className="w-4 h-4 bg-[var(--bg-primary)] rounded-full absolute top-0.5 shadow-md"
                                    animate={{ left: learningMode ? '22px' : '2px', backgroundColor: learningMode ? 'var(--bg-primary)' : 'var(--text-secondary)' }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>

                        {/* Templates */}
                        <button
                            onClick={() => setShowTemplates(true)}
                            className="btn-icon tooltip"
                            data-tooltip="Templates"
                        >
                            <Layout className="w-5 h-5" />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="btn-icon tooltip"
                            data-tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        >
                            <motion.div
                                key={theme}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </motion.div>
                        </button>

                        {/* Settings */}
                        <button
                            onClick={() => setShowSettings(true)}
                            className="btn-icon tooltip"
                            data-tooltip="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex md:hidden items-center gap-2">
                        <motion.button
                            onClick={handleRun}
                            disabled={isExecuting}
                            className="btn-primary py-2 px-3"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isExecuting ? (
                                <div className="loading-spinner" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                        </motion.button>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="btn-icon"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <motion.div
                    initial={false}
                    animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }}
                    className="md:hidden overflow-hidden"
                >
                    <div className="pt-4 pb-2 flex flex-col gap-3">
                        {/* Language Selector */}
                        <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg p-1 border border-[var(--border-default)]">
                            <button
                                onClick={() => setLanguage('c')}
                                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'c'
                                    ? 'bg-[var(--accent-primary)] text-white'
                                    : 'text-[var(--text-secondary)]'
                                    }`}
                            >
                                C
                            </button>
                            <button
                                onClick={() => setLanguage('python')}
                                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'python'
                                    ? 'bg-[var(--accent-primary)] text-white'
                                    : 'text-[var(--text-secondary)]'
                                    }`}
                            >
                                Python
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={toggleLearningMode}
                                className={`flex flex-col items-center gap-1 p-3 rounded-lg border ${learningMode
                                    ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]'
                                    : 'bg-[var(--bg-tertiary)] border-[var(--border-default)]'
                                    }`}
                            >
                                <GraduationCap className="w-5 h-5" />
                                <span className="text-xs">Learning</span>
                            </button>
                            <button
                                onClick={() => { setShowTemplates(true); setMobileMenuOpen(false); }}
                                className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)]"
                            >
                                <Layout className="w-5 h-5" />
                                <span className="text-xs">Templates</span>
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)]"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                <span className="text-xs">Theme</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
