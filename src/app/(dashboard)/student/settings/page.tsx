"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold font-outfit">Platform Settings</h1>
        <p className="text-gray-400 text-sm">Manage your profile, notifications, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="space-y-1">
           {[
             { label: "Profile", icon: User, active: true },
             { label: "Notifications", icon: Bell },
             { label: "Security", icon: Shield },
             { label: "Appearance", icon: Palette },
           ].map((item, i) => (
             <Button 
               key={i} 
               variant="ghost" 
               className={`w-full justify-start gap-3 rounded-xl h-12 ${item.active ? "bg-white/5 text-white" : "text-gray-500"}`}
             >
               <item.icon className="w-4 h-4" /> {item.label}
             </Button>
           ))}
        </aside>

        <div className="lg:col-span-2 space-y-6">
           <Card className="bg-white/5 border-white/5">
             <CardHeader>
               <CardTitle className="text-lg">Profile Information</CardTitle>
               <CardDescription>Update your personal details visible on the platform.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue={user?.firstName || ""} className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue={user?.lastName || ""} className="bg-white/5 border-white/10" />
                  </div>
                </div>
                <div className="space-y-2">
                   <Label>Email Address</Label>
                   <Input value={user?.primaryEmailAddress?.emailAddress || ""} disabled className="bg-white/5 border-white/10 opacity-50" />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-500 text-white mt-4">
                  Save Changes
                </Button>
             </CardContent>
           </Card>

           <Card className="bg-white/5 border-white/5">
             <CardHeader>
               <CardTitle className="text-lg">AI Preferences</CardTitle>
               <CardDescription>Control how the agentic engine interacts with your content.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Automatic Criticism</p>
                    <p className="text-xs text-gray-500">Run the Critic Agent on every generated question.</p>
                  </div>
                  <div className="w-12 h-6 bg-purple-600 rounded-full flex items-center px-1">
                     <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Model Preference</p>
                    <p className="text-xs text-gray-500">Prioritize Google Gemini over Groq for higher accuracy.</p>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full flex items-center px-1">
                     <div className="w-4 h-4 bg-gray-500 rounded-full" />
                  </div>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
