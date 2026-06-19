"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function CreatePDFQuizPage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a PDF file");
    
    setLoading(true);

    try {
      // Convert file to Base64 for simplicity in this POC endpoint
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = {
          fileBase64: base64,
          subject: formData.get("subject"),
          topic: formData.get("topic"),
        };

        const res = await fetch("/api/rag/upload", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Failed to process document");

        toast.success("Document ingested! You can now generate quizzes from it.");
        router.push("/student/create");
      };
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <FileText className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-outfit">Import Documents</h1>
          <p className="text-gray-400">Turn your textbooks and notes into custom AI practice material.</p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-lg font-semibold text-white">Extracting & Indexing...</p>
            <p className="text-sm text-gray-400 mt-2">Connecting to Pinecone RAG engine.</p>
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileUp className="w-5 h-5 text-blue-400" /> PDF Intelligence
          </CardTitle>
          <CardDescription>Upload a PDF (max 10MB) to start semantic indexing.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-blue-500/50 transition-colors bg-white/[0.02]">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden" 
                id="pdf-upload" 
              />
              <label htmlFor="pdf-upload" className="cursor-pointer space-y-4 block">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <FileUp className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file ? file.name : "Click to upload or drag and drop"}</p>
                  <p className="text-xs text-gray-500 mt-1">PDF vectors will be stored in your private namespace.</p>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input name="subject" id="subject" placeholder="e.g. Physics" required className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Main Topic</Label>
                <Input name="topic" id="topic" placeholder="e.g. Quantum Mechanics" required className="bg-white/5 border-white/10" />
              </div>
            </div>

            <Button type="submit" disabled={loading || !file} className="w-full h-12 bg-white/10 hover:bg-white/20 text-white font-semibold">
              {loading ? "Processing..." : <><Sparkles className="mr-2 w-4 h-4 text-blue-400" /> Ingest Document Context</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
