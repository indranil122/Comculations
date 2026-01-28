'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import OutputPanel from '@/components/OutputPanel';
import TemplatesModal from '@/components/TemplatesModal';
import SettingsModal from '@/components/SettingsModal';
import { preloadPyodide } from '@/lib/compiler';

export default function CompilerPage() {
  const { theme, showTemplates, showSettings } = useStore();
  const [leftPanelWidth, setLeftPanelWidth] = React.useState(55);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Apply theme class to document
    document.documentElement.classList.toggle('light-theme', theme === 'light');
  }, [theme]);

  useEffect(() => {
    // Preload Pyodide for faster Python execution
    preloadPyodide();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed, e.g., 768px for md, 1024px for lg
    };
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <Header />

      <main
        className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden"
        onMouseMove={(e) => {
          if (isDragging) {
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 20 && newWidth < 80) {
              setLeftPanelWidth(newWidth);
            }
          }
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* Left Panel - Code Editor */}
        <motion.div
          className="flex flex-col min-h-[50vh] lg:min-h-0"
          style={{ width: isMobile ? '100%' : `${leftPanelWidth}%` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CodeEditor />
        </motion.div>

        {/* Resize Handle */}
        <div
          className="hidden lg:block w-1 bg-[var(--border-subtle)] hover:bg-[var(--accent-primary)] cursor-col-resize transition-colors z-10 hover:w-2 active:w-2 active:bg-[var(--accent-primary)]"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
        />

        {/* Right Panel - Output */}
        <motion.div
          className="flex flex-col min-h-[50vh] lg:min-h-0 border-t lg:border-t-0 border-[var(--border-subtle)]"
          style={{ width: isMobile ? '100%' : `${100 - leftPanelWidth}%` }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <OutputPanel />
        </motion.div>
      </main>

      <AnimatePresence>
        {showTemplates && <TemplatesModal />}
        {showSettings && <SettingsModal />}
      </AnimatePresence>
    </div>
  );
}
