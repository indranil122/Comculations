# Cumpiler AI 🎓⚡

**Cumpiler AI** is a state-of-the-art educational code compiler designed to help students and developers learn programming with intelligent feedback. Unlike traditional online compilers, Cumpiler AI analyzes your code errors and provides simplified, AI-powered explanations to help you understand *why* your code failed and *how* to fix it.

![Cumpiler AI](https://placehold.co/1200x600/1e1e2e/cba6f7?text=Cumpiler+AI+Preview)

## ✨ Key Features

- **🚀 Real Code Execution**
  - **Python**: Runs directly in your browser using **Pyodide** (WebAssembly) for blazing fast, secure execution.
  - **C**: Compiles and runs via the **Piston API** (GCC backend) to support standard C libraries.
  
- **🤖 AI Error Analysis**
  - Automatically detects error patterns in your code.
  - Provides beginner-friendly explanations for complex compiler errors.
  - Suggests specific fixes and provides corrected example code.

- **🎨 Modern & Responsive UI**
  - Beautiful Dark & Light modes.
  - Smooth animations powered by **Framer Motion**.
  - Built with **Next.js 14** and **TailwindCSS** for a premium feel.

- **📚 Learning Tools**
  - Built-in code templates for common algorithms and concepts.
  - "Learning Mode" toggle to switch between simple output and detailed educational feedback.

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (React)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (VS Code's editor engine)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Runtime**:
  - **Pyodide**: Python Wasm
  - **Piston API**: Server-side C execution

## 🚀 Getting Started

Follow these steps to run the project locally:

### Prerequisites

- Node.js 18+ installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/educompile-ai.git
   cd educompile-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to start coding!

## 🤝 Contribution

Contributions are welcome! If you have suggestions or bug reports, please open an issue or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
