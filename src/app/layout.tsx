import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comculations - Professional Code Compiler",
  description: "Experience the next generation of code execution with Comculations. Real-time compilation and a beautiful immersive environment.",
  keywords: ["online compiler", "C compiler", "Python compiler", "code editor", "programming", "learning", "education", "syntax highlighting"],
  authors: [{ name: "Comculations Team" }],
  openGraph: {
    title: "Comculations - Professional Code Compiler",
    description: "Professional web-based compiler with advanced learning assistance",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
