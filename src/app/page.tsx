"use client";

import { SignInButton, useUser, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, LineChart, Sparkles, Wand2, Globe, Cpu } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useUser();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020203] text-white selection:bg-blue-500/30 font-sans">
      {/* Cinematic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
      </div>

      {/* Premium Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-8 mx-auto w-full max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-white/10 bg-white/5 rounded-xl backdrop-blur-md shadow-2xl">
            <BrainCircuit className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex flex-col">
             <span className="text-xl font-bold tracking-tight font-outfit uppercase">EduTech AI</span>
             <span className="text-[10px] text-gray-500 tracking-[0.2em] font-medium leading-none">Ramdas Chaugale AI Projects</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium">
          {!isSignedIn ? (
            <>
              <div className="hidden md:flex items-center gap-10 mr-10 text-gray-400">
                <a href="#lab" className="hover:text-blue-400 transition-all border-b border-transparent hover:border-blue-400/30 pb-1">AI Research</a>
                <a href="#architecture" className="hover:text-blue-400 transition-all border-b border-transparent hover:border-blue-400/30 pb-1">Logic Stack</a>
                <Link href="https://github.com/Ramdas-Chaugale/edutech-ai" className="hover:text-white transition-all">Source</Link>
              </div>
              <SignInButton mode="modal">
                <button className="text-gray-400 hover:text-white transition-colors">Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="h-11 px-6 bg-white text-black hover:bg-gray-200 font-bold rounded-full transition-transform active:scale-95 shadow-xl shadow-white/10">
                  Join The Lab
                </Button>
              </SignUpButton>
            </>
          ) : (
            <div className="flex items-center gap-5">
              <Link href="/student">
                <Button variant="outline" className="h-11 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white px-8">
                  Student Console
                </Button>
              </Link>
              <SignOutButton>
                <button className="text-gray-500 hover:text-red-400 text-xs uppercase tracking-widest font-bold">Sign Out</button>
              </SignOutButton>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main id="hero" className="relative z-10 flex flex-col items-center justify-center flex-grow px-6 text-center pt-20 pb-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold tracking-widest text-blue-400 uppercase mb-12 mx-auto"
          >
            <Sparkles className="w-3 h-3" />
            <span>Autonomous Intelligence Series • Build 15.5</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-[110px] font-bold tracking-tighter mb-10 leading-[0.9] font-outfit"
          >
            Agentic{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-600">
              Future of
            </span>
            <br />
            Learning.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 mb-16 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            An engineering showcase of autonomous educational agents that orchestrate quizzes with multi-step reasoning and semantic evaluation.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {isSignedIn ? (
              <Link href="/student/create">
                <Button size="lg" className="h-16 px-12 text-lg bg-blue-600 hover:bg-blue-500 text-white border-0 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 group">
                  Initiate Generator <Wand2 className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            ) : (
              <SignUpButton mode="modal">
                <Button size="lg" className="h-16 px-12 text-lg bg-blue-600 hover:bg-blue-500 text-white border-0 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95 group">
                   Get Started <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignUpButton>
            )}
            <Link href="https://github.com/Ramdas-Chaugale/edutech-ai">
              <button className="h-16 px-10 text-gray-400 hover:text-white font-medium transition-all text-lg">
                Technical Blueprint
              </button>
            </Link>
          </motion.div>

          {/* Logic Modules Grid */}
          <motion.div
            id="architecture"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-48 text-left"
          >
            {[
              {
                icon: Cpu,
                title: "Agent Orchestration",
                desc: "Multiple AI agents (Planner, Generator, Critic) collaborate in a LangGraph cycle to ensure 99% accuracy.",
                color: "text-blue-400",
                bg: "bg-blue-400/10"
              },
              {
                icon: Globe,
                title: "Global Standards",
                desc: "Pre-trained on global exam patterns including JEE, UPSC, and GCSE with zero-shot prompting.",
                color: "text-purple-400",
                bg: "bg-purple-400/10"
              },
              {
                icon: LineChart,
                title: "Semantic Analysis",
                desc: "LLM-driven qualitative scoring that understands 'why' an answer is right or wrong, not just 'what'.",
                color: "text-green-400",
                bg: "bg-green-400/10"
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.04] group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/10 transition-all" />
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 shadow-inner`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-outfit">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-40 mb-20 text-center"
          >
            <p className="text-[10px] text-gray-700 tracking-[0.5em] font-black uppercase mb-4">Core Research Signature</p>
            <h2 className="text-xl font-bold text-gray-400 opacity-30 cursor-default hover:opacity-100 transition-opacity">
              Ramdas Chaugale AI Projects © 2026
            </h2>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
