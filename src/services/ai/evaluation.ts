/**
 * Universal AI Proxy Evaluation Engine (Groq 3.3)
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
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
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
      console.error(`🔴 Eval AI ERROR:`, data.error?.message);
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

export async function evaluateAnswer(question: string, answer: string, correctAnswer: string) {
  const prompt = `
    As an expert tutor, evaluate the student's answer.
    Question: ${question}
    Student's Answer: ${answer}
    Correct Answer: ${correctAnswer}

    Provide a score (0-100) and a brief, encouraging feedback.
    Format your response EXACTLY like this:
    Score: [score]
    Feedback: [feedback]
  `;

  const response = await callAI(prompt);
  if (!response) return { score: 0, feedback: "Evaluation temporarily unavailable." };

  // Extract score and feedback
  const scoreMatch = response.match(/Score:\s*(\d+)/i);
  const feedbackMatch = response.match(/Feedback:\s*(.*)/i);

  return {
    score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
    feedback: feedbackMatch ? feedbackMatch[1] : "Good effort!",
  };
}
