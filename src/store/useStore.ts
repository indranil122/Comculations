import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'c' | 'python';
export type Theme = 'dark' | 'light';

export interface ExecutionResult {
  output: string;
  error: string;
  executionTime: number;
  memoryUsage: number;
  exitCode: number;
  aiExplanation?: AIExplanation;
}

export interface AIExplanation {
  errorType: string;
  simpleExplanation: string;
  suggestedFix: string;
  exampleCode?: string;
  lineNumber?: number;
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: Language;
  code: string;
  category: string;
  icon: string;
}

export interface SavedFile {
  id: string;
  name: string;
  language: Language;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CompilerState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Language
  language: Language;
  setLanguage: (language: Language) => void;

  // Code
  code: string;
  setCode: (code: string) => void;

  // Input/Output
  input: string;
  setInput: (input: string) => void;

  // Execution
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  setIsExecuting: (isExecuting: boolean) => void;
  setExecutionResult: (result: ExecutionResult | null) => void;

  // Interactive Input Mode
  awaitingInput: boolean;
  inputPrompt: string;
  setAwaitingInput: (awaiting: boolean, prompt?: string) => void;

  // Learning Mode
  learningMode: boolean;
  setLearningMode: (enabled: boolean) => void;
  toggleLearningMode: () => void;

  // Saved Files
  savedFiles: SavedFile[];
  addSavedFile: (file: Omit<SavedFile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSavedFile: (id: string, updates: Partial<SavedFile>) => void;
  deleteSavedFile: (id: string) => void;

  // UI State
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  activeTab: 'output' | 'error' | 'ai';
  setActiveTab: (tab: 'output' | 'error' | 'ai') => void;

  // Editor Settings
  fontSize: number;
  setFontSize: (size: number) => void;
  tabSize: number;
  setTabSize: (size: number) => void;
  wordWrap: boolean;
  setWordWrap: (wrap: boolean) => void;
  minimap: boolean;
  setMinimap: (show: boolean) => void;
}

const DEFAULT_C_CODE = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Welcome to Comculations!\\n");
    
    // Try modifying this code
    int a = 10;
    int b = 20;
    printf("Sum of %d and %d is: %d\\n", a, b, a + b);
    
    return 0;
}`;

const DEFAULT_PYTHON_CODE = `# Welcome to Comculations!
# Python Compiler

def greet(name):
    """A simple greeting function"""
    return f"Hello, {name}!"

def main():
    print("Welcome to Comculations!")
    print(greet("Student"))
    
    # Try some calculations
    numbers = [1, 2, 3, 4, 5]
    print(f"Sum: {sum(numbers)}")
    print(f"Average: {sum(numbers) / len(numbers)}")

if __name__ == "__main__":
    main()
`;

export const useStore = create<CompilerState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),

      // Language
      language: 'c',
      setLanguage: (language) => {
        const newCode = language === 'c' ? DEFAULT_C_CODE : DEFAULT_PYTHON_CODE;
        set({ language, code: newCode, executionResult: null });
      },

      // Code
      code: DEFAULT_C_CODE,
      setCode: (code) => set({ code }),

      // Input/Output
      input: '',
      setInput: (input) => set({ input }),

      // Execution
      isExecuting: false,
      executionResult: null,
      setIsExecuting: (isExecuting) => set({ isExecuting }),
      setExecutionResult: (executionResult) => set({ executionResult }),

      // Interactive Input Mode
      awaitingInput: false,
      inputPrompt: '',
      setAwaitingInput: (awaiting, prompt = '') => set({ awaitingInput: awaiting, inputPrompt: prompt }),

      // Learning Mode
      learningMode: true,
      setLearningMode: (learningMode) => set({ learningMode }),
      toggleLearningMode: () => set({ learningMode: !get().learningMode }),

      // Saved Files
      savedFiles: [],
      addSavedFile: (file) => {
        const newFile: SavedFile = {
          ...file,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set({ savedFiles: [...get().savedFiles, newFile] });
      },
      updateSavedFile: (id, updates) => {
        set({
          savedFiles: get().savedFiles.map((file) =>
            file.id === id ? { ...file, ...updates, updatedAt: new Date() } : file
          ),
        });
      },
      deleteSavedFile: (id) => {
        set({ savedFiles: get().savedFiles.filter((file) => file.id !== id) });
      },

      // UI State
      showTemplates: false,
      setShowTemplates: (showTemplates) => set({ showTemplates }),
      showSettings: false,
      setShowSettings: (showSettings) => set({ showSettings }),
      activeTab: 'output',
      setActiveTab: (activeTab) => set({ activeTab }),

      // Editor Settings
      fontSize: 14,
      setFontSize: (fontSize) => set({ fontSize }),
      tabSize: 4,
      setTabSize: (tabSize) => set({ tabSize }),
      wordWrap: false,
      setWordWrap: (wordWrap) => set({ wordWrap }),
      minimap: true,
      setMinimap: (minimap) => set({ minimap }),
    }),
    {
      name: 'comculations-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        learningMode: state.learningMode,
        savedFiles: state.savedFiles,
        fontSize: state.fontSize,
        tabSize: state.tabSize,
        wordWrap: state.wordWrap,
        minimap: state.minimap,
      }),
    }
  )
);
