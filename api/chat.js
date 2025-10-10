// ✅ Chamber AI Backend — Fixed CORS + OpenAI handler
export default async function handler(req, res) {
  // ✅ Allowed frontend origins (add more if needed)
  const allowedOrigins = [
    "https://chamber-frontend-i2lc.vercel.app", // your production frontend
    "https://chamber-frontend.vercel.app",      // optional main domain
    "http://localhost:3000"                     // for local testing
  ];

  const origin = req.headers.origin;

  // ✅ Set CORS headers dynamically
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Reject non-POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { message } = req.body;

  try {
    // ✅ Forward request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Chamber AI, a legal information assistant for Indian law." },
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("🔴 OpenAI API Error:", errorData);
      return res.status(response.status).json({ response: "OpenAI API error occurred." });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response from AI.";
    console.log("✅ AI Response:", reply);

    res.status(200).json({ response: reply });
  } catch (error) {
    console.error("💥 Backend Error:", error);
    res.status(500).json({ response: "Internal server error" });
  }
}

// ✅ For debugging environment
console.log("🔑 OpenAI Key Loaded:", process.env.OPENAI_API_KEY ? "✅ YES" : "❌ NO");
