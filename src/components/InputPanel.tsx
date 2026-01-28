'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { FileInput, Trash2 } from 'lucide-react';

export default function InputPanel() {
    const { input, setInput } = useStore();

    return (
        <div className="bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]">
            {/* Header */}
            <div className="panel-header">
                <div className="flex items-center gap-2">
                    <FileInput className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">Input (stdin)</span>
                </div>
                {input && (
                    <button
                        onClick={() => setInput('')}
                        className="btn-icon text-[var(--text-muted)] hover:text-[var(--accent-error)]"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Input Area */}
            <div className="p-2">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input for your program here (stdin)..."
                    className="w-full h-24 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-lg p-3 text-sm font-mono text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all placeholder:text-[var(--text-muted)]"
                />
            </div>
        </div>
    );
}
