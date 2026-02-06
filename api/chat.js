// ✅ Chamber AI Backend — GEMINI VERSION (FREE)

export default async function handler(req, res) {

  const allowedOrigins = [
    "https://chamber-frontend-i2lc.vercel.app",
    "https://chamber-frontend.vercel.app",
    "http://localhost:3000"
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { message } = req.body;

  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_KEY) {
      return res.status(500).json({
        response: "Gemini API key missing in Vercel environment variables."
      });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are Chamber AI, an Indian legal assistant. 
Answer clearly in simple language.

User question: ${message}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await geminiResponse.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I could not generate a response.";

    console.log("✅ Gemini Response:", reply);

    res.status(200).json({ response: reply });

  } catch (error) {
    console.error("💥 Backend Error:", error);
    res.status(500).json({ response: "Internal server error" });
  }
}
