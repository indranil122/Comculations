'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, AIExplanation } from '@/store/useStore';
import { executeCode } from '@/lib/compiler';
import {
    Terminal,
    AlertCircle,
    Lightbulb,
    Clock,
    MemoryStick,
    CheckCircle2,
    XCircle,
    Sparkles,
    Copy,
    Send,
    Keyboard
} from 'lucide-react';

export default function OutputPanel() {
    const {
        executionResult,
        isExecuting,
        activeTab,
        setActiveTab,
        learningMode,
        code,
        language,
        input,
        setInput,
        setExecutionResult,
        setIsExecuting
    } = useStore();

    const [interactiveInput, setInteractiveInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Check if program is awaiting input (exitCode -1)
    const isAwaitingInput = executionResult?.exitCode === -1;

    // Focus input when awaiting
    useEffect(() => {
        if (isAwaitingInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAwaitingInput]);

    const handleSubmitInput = async () => {
        if (!interactiveInput.trim()) return;

        // Set the input and execute
        setInput(interactiveInput);
        setIsExecuting(true);

        try {
            const result = await executeCode(code, language, interactiveInput, learningMode);
            setExecutionResult(result);
        } catch (error) {
            setExecutionResult({
                output: '',
                error: error instanceof Error ? error.message : 'Execution failed',
                executionTime: 0,
                memoryUsage: 0,
                exitCode: 1
            });
        } finally {
            setIsExecuting(false);
            setInteractiveInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmitInput();
        }
    };

    const tabs = [
        { id: 'output', label: 'Output', icon: Terminal },
        { id: 'error', label: 'Errors', icon: AlertCircle },
        ...(learningMode ? [{ id: 'ai', label: 'AI Help', icon: Sparkles }] : []),
    ] as const;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="flex-1 flex flex-col bg-[var(--bg-secondary)] min-h-[200px]">
            {/* Tab Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
                <div className="flex">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const hasContent = tab.id === 'output'
                            ? !!executionResult?.output
                            : tab.id === 'error'
                                ? !!executionResult?.error
                                : !!executionResult?.aiExplanation;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as 'output' | 'error' | 'ai')}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${activeTab === tab.id
                                    ? 'text-[var(--accent-primary)] border-[var(--accent-primary)] bg-[var(--bg-secondary)]'
                                    : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                {hasContent && tab.id !== 'output' && (
                                    <span className={`w-2 h-2 rounded-full ${tab.id === 'error' ? 'bg-[var(--accent-error)]' : 'bg-[var(--accent-success)]'
                                        }`} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Execution Stats */}
                {executionResult && executionResult.exitCode !== -1 && (
                    <div className="flex items-center gap-4 pr-4">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{executionResult.executionTime}ms</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                            <MemoryStick className="w-3.5 h-3.5" />
                            <span>{executionResult.memoryUsage}KB</span>
                        </div>
                        {executionResult.exitCode === 0 ? (
                            <span className="success-badge flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Success
                            </span>
                        ) : (
                            <span className="error-badge flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Error
                            </span>
                        )}
                    </div>
                )}

                {/* Awaiting Input Indicator */}
                {isAwaitingInput && (
                    <div className="flex items-center gap-2 pr-4">
                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--accent-warning)]/20 text-[var(--accent-warning)] text-xs font-medium">
                            <Keyboard className="w-3.5 h-3.5 animate-pulse" />
                            Waiting for input...
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                <AnimatePresence mode="wait">
                    {isExecuting ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full gap-4"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-[var(--border-default)] border-t-[var(--accent-primary)] animate-spin" />
                                <Terminal className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--accent-primary)]" />
                            </div>
                            <span className="text-sm text-[var(--text-secondary)]">Compiling & Executing...</span>
                        </motion.div>
                    ) : activeTab === 'output' ? (
                        <motion.div
                            key="output"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col"
                        >
                            {executionResult?.output ? (
                                <div className="p-4 relative group flex-1">
                                    <button
                                        onClick={() => copyToClipboard(executionResult.output)}
                                        className="absolute top-2 right-2 btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <pre className="text-sm font-mono text-[var(--text-primary)] whitespace-pre-wrap">
                                        {executionResult.output}
                                    </pre>

                                    {/* Interactive Input Field */}
                                    {isAwaitingInput && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-4 bg-[var(--bg-tertiary)] border-2 border-[var(--accent-primary)] rounded-xl"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <Keyboard className="w-5 h-5 text-[var(--accent-primary)]" />
                                                <span className="text-sm font-medium text-[var(--text-primary)]">Enter Input:</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={interactiveInput}
                                                    onChange={(e) => setInteractiveInput(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder="Type your input here and press Enter..."
                                                    className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
                                                />
                                                <motion.button
                                                    onClick={handleSubmitInput}
                                                    disabled={!interactiveInput.trim()}
                                                    className="btn-primary px-4"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Send className="w-4 h-4" />
                                                    <span>Run</span>
                                                </motion.button>
                                            </div>
                                            <p className="mt-2 text-xs text-[var(--text-muted)]">
                                                Tip: For multiple values, separate with spaces (e.g., "5 10") or press Enter for each line.
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--text-muted)]">
                                    <Terminal className="w-10 h-10 opacity-50" />
                                    <p className="text-sm">Run your code to see output here</p>
                                </div>
                            )}
                        </motion.div>
                    ) : activeTab === 'error' ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="h-full"
                        >
                            {executionResult?.error ? (
                                <div className="p-4">
                                    <div className="bg-[var(--accent-error)]/10 border border-[var(--accent-error)]/20 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-[var(--accent-error)] flex-shrink-0 mt-0.5" />
                                            <pre className="text-sm font-mono text-[var(--accent-error)] whitespace-pre-wrap flex-1">
                                                {executionResult.error}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--text-muted)]">
                                    <CheckCircle2 className="w-10 h-10 opacity-50 text-[var(--accent-success)]" />
                                    <p className="text-sm">No errors found</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="h-full"
                        >
                            {executionResult?.aiExplanation ? (
                                <AIExplanationPanel explanation={executionResult.aiExplanation} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--text-muted)]">
                                    <Lightbulb className="w-10 h-10 opacity-50" />
                                    <p className="text-sm">AI assistance will appear here when errors occur</p>
                                    <p className="text-xs">Make sure Learning Mode is enabled</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function AIExplanationPanel({ explanation }: { explanation: AIExplanation }) {
    if (!explanation) return null;

    return (
        <div className="p-4 space-y-4">
            {/* Error Type */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-medium text-[var(--text-primary)]">AI Analysis</h3>
                    <p className="text-xs text-[var(--text-muted)]">Powered by Comculations</p>
                </div>
            </div>

            {/* Error Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
                <Lightbulb className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-sm font-medium text-[var(--accent-primary)]">{explanation.errorType}</span>
                {explanation.lineNumber && (
                    <span className="text-xs text-[var(--text-muted)]">Line {explanation.lineNumber}</span>
                )}
            </div>

            {/* Simple Explanation */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-default)]">
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[var(--accent-warning)]" />
                    What's happening?
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {explanation.simpleExplanation}
                </p>
            </div>

            {/* Suggested Fix */}
            <div className="bg-[var(--accent-success)]/10 rounded-xl p-4 border border-[var(--accent-success)]/20">
                <h4 className="text-sm font-medium text-[var(--accent-success)] mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    How to proceed
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {explanation.suggestedFix}
                </p>
            </div>

            {/* Example Code */}
            {explanation.exampleCode && (
                <div className="bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border-default)]">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                        <span className="text-xs font-medium text-[var(--text-muted)]">Example</span>
                    </div>
                    <pre className="p-4 text-sm font-mono text-[var(--text-primary)] overflow-x-auto">
                        {explanation.exampleCode}
                    </pre>
                </div>
            )}
        </div>
    );
}
