// Netlify serverless function: AI tutor for the RRB Office Assistant app.
// The Gemini API key is read from the GEMINI_API_KEY environment variable,
// so it is never exposed to the browser or committed to Git.
const MODEL = "gemini-3.6-flash";

const SYSTEM_PROMPT = `You are a friendly, patient tutor for the RRB Office Assistant exam (Numerical Ability + Reasoning).
A student will send you a question they don't understand.
- Explain the solution step by step in very simple language.
- Show the reasoning behind each step, not just the final answer.
- Share a quick exam shortcut or trick when it helps.
- Reply in the same language the student uses (Hindi, English, or Hinglish).
- At the end, clearly mark the final answer.
Keep it concise and easy to follow.`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server is missing GEMINI_API_KEY" }),
    };
  }

  let message = "";
  try {
    const parsed = JSON.parse(event.body || "{}");
    message = String(parsed.message || "").slice(0, 4000);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }
  if (!message.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Please type a question" }),
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "AI service error", detail }),
      };
    }

    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("")
        .trim() || "Sorry, I couldn't generate an answer. Please try again.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Request failed, please try again" }),
    };
  }
};
