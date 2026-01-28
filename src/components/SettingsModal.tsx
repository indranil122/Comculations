'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { X, Type, AlignLeft, Map, ToggleLeft, Minus, Plus } from 'lucide-react';

export default function SettingsModal() {
    const {
        setShowSettings,
        fontSize,
        setFontSize,
        tabSize,
        setTabSize,
        wordWrap,
        setWordWrap,
        minimap,
        setMinimap,
        theme,
        setTheme
    } = useStore();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-default)] w-full max-w-md overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Editor Settings</h2>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Customize your coding experience</p>
                    </div>
                    <button
                        onClick={() => setShowSettings(false)}
                        className="btn-icon"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Settings */}
                <div className="p-6 space-y-6">
                    {/* Theme */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                            <ToggleLeft className="w-4 h-4 text-[var(--text-muted)]" />
                            Theme
                        </label>
                        <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg p-1 border border-[var(--border-default)]">
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${theme === 'dark'
                                        ? 'bg-[var(--accent-primary)] text-white'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                Dark
                            </button>
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${theme === 'light'
                                        ? 'bg-[var(--accent-primary)] text-white'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                Light
                            </button>
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                            <Type className="w-4 h-4 text-[var(--text-muted)]" />
                            Font Size: {fontSize}px
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                                className="btn-icon"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <input
                                type="range"
                                min="10"
                                max="24"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                            />
                            <button
                                onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                                className="btn-icon"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Tab Size */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                            <AlignLeft className="w-4 h-4 text-[var(--text-muted)]" />
                            Tab Size
                        </label>
                        <div className="flex gap-2">
                            {[2, 4, 8].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setTabSize(size)}
                                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tabSize === size
                                            ? 'bg-[var(--accent-primary)] text-white'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
                                        }`}
                                >
                                    {size} spaces
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggle Options */}
                    <div className="space-y-4">
                        {/* Word Wrap */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-[var(--text-muted)]" />
                                <span className="text-sm font-medium text-[var(--text-primary)]">Word Wrap</span>
                            </div>
                            <button
                                onClick={() => setWordWrap(!wordWrap)}
                                className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${wordWrap ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-elevated)] border border-[var(--border-default)]'
                                    }`}
                            >
                                <motion.div
                                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md"
                                    animate={{ left: wordWrap ? '26px' : '2px' }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>

                        {/* Minimap */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Map className="w-4 h-4 text-[var(--text-muted)]" />
                                <span className="text-sm font-medium text-[var(--text-primary)]">Minimap</span>
                            </div>
                            <button
                                onClick={() => setMinimap(!minimap)}
                                className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${minimap ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-elevated)] border border-[var(--border-default)]'
                                    }`}
                            >
                                <motion.div
                                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md"
                                    animate={{ left: minimap ? '26px' : '2px' }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
                    <p className="text-xs text-[var(--text-muted)] text-center">
                        Settings are automatically saved
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
