// ✅ Chamber AI Backend — GEMINI + SUPABASE (FINAL FIXED)

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
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!GEMINI_KEY) {
      return res.status(500).json({
        response: "Gemini API key missing."
      });
    }

    // 🔍 STEP 1: Fetch relevant laws
    let context = "";

    try {
      const lawRes = await fetch(
        `${SUPABASE_URL}/rest/v1/laws?select=*&or=(title.ilike.%${message}%,content.ilike.%${message}%)&limit=3`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
          }
        }
      );

      const lawData = await lawRes.json();

      if (lawData.length > 0) {
        context = lawData.map(law => `
Title: ${law.title}
Content: ${law.content}
`).join("\n\n");
      }

    } catch (err) {
      console.error("⚠️ Supabase fetch error:", err);
    }

    // 🤖 STEP 2: Gemini prompt (FIXED)
    const prompt = `You are Chamber AI, an Indian legal assistant.

If user asks to generate a draft:
- Format it properly
- Use formal legal language
- Structure it clearly

Use the following legal context if available:

${context || "No specific legal data found."}

User request: ${message}

Respond clearly in simple language.`;

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
                { text: prompt }
              ]
            }
          ]
        })
      }
    );

    const data = await geminiResponse.json();

console.log("🧠 Gemini RAW:", JSON.stringify(data, null, 2));

if (data.error) {
  console.error("❌ Gemini API Error:", data.error);
  return res.status(500).json({
    response: "Gemini error: " + data.error.message
  });
}

const reply =
  data?.candidates?.[0]?.content?.parts?.[0]?.text;

if (!reply) {
  return res.status(500).json({
    response: "No response from AI (check logs)"
  });
}
