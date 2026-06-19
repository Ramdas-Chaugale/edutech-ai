"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, BarChart3, PieChart, TrendingUp, Brain, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const stats = [
    { label: "Overall Accuracy", value: "78%", icon: Target, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Quizzes Mastered", value: "12", icon: Award, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Concept Clarity", value: "High", icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-outfit">Learning Analytics</h1>
        <p className="text-gray-400 text-sm">A deep dive into your academic performance and knowledge gaps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-white/5 border-white/5 hover:bg-white/[0.08] transition-all">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Graph Placeholder */}
        <Card className="bg-white/5 border-white/5 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" /> Score Progression
            </CardTitle>
            <CardDescription>Your quiz performance over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end gap-2 px-6 pb-6">
             {[40, 70, 45, 90, 65, 85, 95].map((h, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${h}%` }}
                 transition={{ delay: i * 0.1, duration: 1 }}
                 className="flex-1 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-md relative group"
               >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                   {h}% Score
                 </div>
               </motion.div>
             ))}
          </CardContent>
        </Card>

        {/* Subject Strength Card */}
        <Card className="bg-white/5 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" /> Subject Mastery
            </CardTitle>
            <CardDescription>Skill level distribution across major categories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { subject: "Mathematics", progress: 85, color: "bg-blue-500" },
              { subject: "Physics", progress: 62, color: "bg-purple-500" },
              { subject: "History", progress: 94, color: "bg-amber-500" },
              { subject: "Chemistry", progress: 45, color: "bg-green-500" },
            ].map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-300">{s.subject}</span>
                  <span className="text-gray-500">{s.progress}%</span>
                </div>
                <Progress value={s.progress} className="h-1.5 bg-white/5" indicatorClassName={s.color} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-purple-600/10 border-purple-500/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h3 className="text-xl font-bold text-white flex items-center gap-2">
             <Brain className="w-6 h-6 text-purple-400" /> Smart Improvement Tip
           </h3>
           <p className="text-gray-400 text-sm mt-1">Based on your recent scores, you should focus more on **Thermodynamics** concepts in Physics.</p>
        </div>
        <Badge className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 text-sm cursor-default">
          AI Analysis Active
        </Badge>
      </Card>
    </div>
  );
}
