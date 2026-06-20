# 🚀 EduTech AI: Autonomous Agentic Learning Platform
### Part of the Ramdas Chaugale AI Projects Series

[![Vercel](https://img.shields.io/badge/Vercel-Live-green?style=for-the-badge&logo=vercel)](https://edutech-ai-dusky.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agentic-orange?style=for-the-badge)](https://langchain-ai.github.io/langgraphjs/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-white?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

**EduTech AI** is a professional-grade engineering showcase of autonomous educational agents. It leverages multi-agent orchestration to generate high-accuracy assessments, manage learning roadmaps, and provide deep semantic qualitative feedback.

---

## 🌟 Key Features

- **Agentic Orchestration**: Uses LangGraph to cycle through specialized AI agents (Planner, Generator, Critic) for 99% factual accuracy.
- **Magic Query Generator**: Convert any natural language prompt into a comprehensive, curriculum-aligned quiz instantly.
- **Semantic Evaluation Engine**: Beyond "right or wrong"—get LLM-driven feedback on why an answer is correct or how to improve.
- **Global Exam Patterns**: Built-in logic for JEE, NEET, UPSC, GCSE, and CBSE standards.
- **Adaptive Learning Console**: Track performance with high-fidelity analytics and mastery progression bars.

---

## 🛠️ Technical Architecture

### The Agentic Stack
- **Orchestration**: [LangGraph.js](https://langchain-ai.github.io/langgraphjs/)
- **LLM Layer**: Hybrid Strategy (Groq/Llama-3 for speed, Google Gemini 1.5 Flash for reliability)
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: Clerk (Enterprise-grade auth)
- **Styling**: Tailwind CSS & Framer Motion for ultra-premium animations

---

## 📦 Deployment

### Live Demo
Check out the live application: [https://edutech-ai-dusky.vercel.app/](https://edutech-ai-dusky.vercel.app/)

### Local Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Ramdas-Chaugale/edutech-ai.git
   cd edutech-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file with:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `GOOGLE_API_KEY`
   - `GROQ_API_KEY`

4. **Initialize Database**
   ```bash
   npx prisma db push
   ```

5. **Start Dev Server**
   ```bash
   npm run dev
   ```

---

## 📜 License
MIT License - Developed as part of **Ramdas Chaugale's AI Research Portfolio**.
