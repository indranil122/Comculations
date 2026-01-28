'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '@/store/useStore';
import { Loader2, Copy, Download, RotateCcw, Save } from 'lucide-react';

export default function CodeEditor() {
    const {
        code,
        setCode,
        language,
        theme,
        fontSize,
        tabSize,
        wordWrap,
        minimap
    } = useStore();

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
    };

    const handleDownload = () => {
        const extension = language === 'c' ? 'c' : 'py';
        const filename = `code.${extension}`;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReset = () => {
        const defaultCode = language === 'c'
            ? `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`
            : `# Hello World in Python\nprint("Hello, World!")`;
        setCode(defaultCode);
    };

    return (
        <div className="flex-1 flex flex-col bg-[var(--bg-secondary)] border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)]">
            {/* Editor Header */}
            <div className="panel-header">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${language === 'c' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                            main.{language === 'c' ? 'c' : 'py'}
                        </span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
                        {language === 'c' ? 'C Program' : 'Python Script'}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleCopy}
                        className="btn-icon tooltip"
                        data-tooltip="Copy Code"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="btn-icon tooltip"
                        data-tooltip="Download"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleReset}
                        className="btn-icon tooltip"
                        data-tooltip="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-[300px]">
                <Editor
                    height="100%"
                    language={language === 'c' ? 'c' : 'python'}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    loading={
                        <div className="flex items-center justify-center h-full bg-[var(--bg-secondary)]">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
                                <span className="text-sm text-[var(--text-secondary)]">Loading Editor...</span>
                            </div>
                        </div>
                    }
                    options={{
                        fontSize: fontSize,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontLigatures: true,
                        tabSize: tabSize,
                        wordWrap: wordWrap ? 'on' : 'off',
                        minimap: { enabled: minimap, scale: 1 },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        lineNumbers: 'on',
                        glyphMargin: true,
                        folding: true,
                        renderLineHighlight: 'all',
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        smoothScrolling: true,
                        padding: { top: 16, bottom: 16 },
                        bracketPairColorization: { enabled: true },
                        guides: {
                            bracketPairs: true,
                            indentation: true,
                        },
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: true,
                        contextmenu: true,
                        formatOnPaste: true,
                        formatOnType: true,
                    }}
                />
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-tertiary)] border-t border-[var(--border-subtle)] text-xs">
                <div className="flex items-center gap-4">
                    <span className="text-[var(--text-muted)]">
                        {language === 'c' ? 'C (GCC)' : 'Python 3'}
                    </span>
                    <span className="text-[var(--text-muted)]">
                        {code.split('\n').length} lines
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[var(--text-muted)]">UTF-8</span>
                    <span className="text-[var(--text-muted)]">Tab: {tabSize}</span>
                </div>
            </div>
        </div>
    );
}
