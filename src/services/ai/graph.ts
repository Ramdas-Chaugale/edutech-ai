import { StateGraph, Annotation, START, END } from "@langchain/langgraph";

// Define the state of our agentic workflow
export const GraphAnnotation = Annotation.Root({
  subject: Annotation<string>,
  topic: Annotation<string>,
  difficulty: Annotation<string>,
  count: Annotation<number>,
  context: Annotation<string>,
  questions: Annotation<any[]>,
  criticFeedback: Annotation<string>,
  status: Annotation<"planning" | "retrieving" | "generating" | "reviewing" | "completed">,
});

/**
 * Universal AI Proxy (Supports Google & Groq 3.3)
 */
async function callAI(prompt: string, retries = 3): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || process.env.GOOGLE_API_KEY;
  const isGroq = !!process.env.GROQ_API_KEY;
  
  if (!apiKey) throw new Error("No API Key found (GROQ or GOOGLE)");

  try {
    const url = isGroq 
      ? "https://api.groq.com/openai/v1/chat/completions"
      : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = isGroq ? {
      model: "llama-3.3-70b-versatile", // Latest Groq Model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    } : {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(isGroq ? { "Authorization": `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`🔴 AI Error:`, data.error?.message || "Check your API key status.");
      if (response.status === 429 && retries > 0) {
         await new Promise(r => setTimeout(r, 5000));
         return callAI(prompt, retries - 1);
      }
      return "";
    }

    return isGroq 
      ? data.choices[0].message.content 
      : data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  } catch (e) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 2000));
      return callAI(prompt, retries - 1);
    }
    return "";
  }
}

// --- Agent Nodes ---

const planningNode = async (state: typeof GraphAnnotation.State) => {
  console.log("---PLANNER AGENT---");
  return { status: "planning" as const };
};

const retrievalNode = async (state: typeof GraphAnnotation.State) => {
  console.log("---RETRIEVAL AGENT---");
  return { status: "retrieving" as const, context: "Standard educational context." };
};

const generationNode = async (state: typeof GraphAnnotation.State) => {
  console.log("---GENERATOR AGENT---");
  const prompt = `
    Generate ${state.count} multiple choice questions about ${state.topic} (${state.subject}). 
    Difficulty: ${state.difficulty}.
    
    Return ONLY a valid JSON array of objects with this structure:
    [{
      "text": "The question?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "The exact full text of the correct option",
      "explanation": "Why it is correct"
    }]
  `;
  
  let rawResponse = await callAI(prompt);
  
  if (!rawResponse) {
    return {
      status: "generating" as const,
      questions: Array(state.count).fill(null).map((_, i) => ({
        text: `Concept Check: ${state.topic} Principle ${i+1}?`,
        options: ["Theory A", "Practice B", "History C", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "AI Gateway Timeout. Loading stable standard."
      }))
    };
  }

  try {
    const jsonString = rawResponse.match(/\[[\s\S]*\]/)?.[0] || rawResponse;
    const questions = JSON.parse(jsonString);
    return { status: "generating" as const, questions };
  } catch (e) {
    return { status: "generating" as const, questions: [] };
  }
};

const reviewNode = async (state: typeof GraphAnnotation.State) => {
  console.log("---CRITIC AGENT---");
  return { status: "completed" as const };
};

// --- Build Graph ---

const workflow = new StateGraph(GraphAnnotation)
  .addNode("plan", planningNode)
  .addNode("retrieve", retrievalNode)
  .addNode("generate", generationNode)
  .addNode("review", reviewNode)
  .addEdge(START, "plan")
  .addEdge("plan", "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "review")
  .addEdge("review", END);

export const app = workflow.compile();
