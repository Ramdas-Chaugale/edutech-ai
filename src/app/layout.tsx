import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "EduTech AI | Adaptive Learning Platform",
  description: "AI-powered educational platform for quizzes, mock tests, and personalized roadmaps.",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased`}>
        <body className="min-h-screen bg-background font-sans">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
