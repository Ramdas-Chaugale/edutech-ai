"use client";

import { SignInButton, SignOutButton, useUser, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, GraduationCap, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { isSignedIn, user } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 mx-auto w-full max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg shadow-purple-500/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-outfit">
            EduTech AI
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <div className="hidden md:flex items-center gap-8 mr-8 text-sm font-medium text-gray-400">
                <a href="#architecture" className="hover:text-white transition-colors cursor-pointer">Architecture</a>
                <a href="#hero" className="hover:text-white transition-colors cursor-pointer">Live Demo</a>
                <Link href="https://github.com/Ramdas-Chaugale/edutech-ai" className="hover:text-white transition-colors">Source Code</Link>
              </div>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25 transition-all active:scale-95">
                  View Demo
                </Button>
              </SignUpButton>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/student">
                <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                  Enter Platform
                </Button>
              </Link>
              <SignOutButton>
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Logout
                </Button>
              </SignOutButton>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main id="hero" className="relative z-10 flex flex-col items-center justify-center flex-grow px-6 pt-20 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-8"
          >
            <Sparkles className="w-3 h-3" />
            <span>New: Query-Based Quiz Generation is Live!</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 font-outfit"
          >
            Production-Grade{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient">
              Adaptive Learning
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Autonomous educational agents that generate quizzes from **PDFs**, **Plain Queries**, or **Exam Patterns** with semantic evaluation.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <>
                <Link href="/student/create">
                  <Button size="lg" className="h-14 px-8 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-0 shadow-2xl shadow-purple-500/30">
                    Launch AI Generator <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/student/create/pdf">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white/5 border-white/10 hover:bg-white/10 text-white">
                    <FileUp className="mr-2 w-4 h-4 text-blue-400" /> Upload PDF
                  </Button>
                </Link>
              </>
            ) : (
              <SignUpButton mode="modal">
                <Button size="lg" className="h-14 px-8 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-0 shadow-2xl shadow-purple-500/30">
                  Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </SignUpButton>
            )}
            <Link href="https://github.com/Ramdas-Chaugale/edutech-ai">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white/5 border-white/10 hover:bg-white/10 text-white">
                View on GitHub
              </Button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            id="architecture"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left"
          >
            {[
              {
                icon: BrainCircuit,
                title: "Query-to-Quiz",
                desc: "Simply type your requirement (e.g. 'Quiz on Algebra for Grade 8') and our agents do the rest.",
              },
              {
                icon: FileText,
                title: "PDF Intelligence",
                desc: "Upload textbooks or notes. Our RAG engine extracts and generates quizzes from your content.",
              },
              {
                icon: LineChart,
                title: "Semantic Insights",
                desc: "Get deep, qualitative feedback on your answers beyond just 'correct' or 'incorrect'.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/[0.07] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/5 mx-auto w-full max-w-7xl flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-8">
        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default">
          <BrainCircuit className="w-5 h-5" />
          <span className="font-bold">EduTech AI</span>
        </div>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-white">Privacy Policy</Link>
          <Link href="#" className="hover:text-white">Terms of Service</Link>
          <a href="mailto:ramdaschaugale@gmail.com" className="hover:text-white">Contact</a>
        </div>
        <div className="text-gray-600">© 2026 EduTech AI. Built with Gemini & Next.js 15.</div>
      </footer>

    </div>
  );
}
