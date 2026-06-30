// ============================================================
// Chamber AI
// Groq Service
// ============================================================

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";

const MODEL = "llama-3.3-70b-versatile";

// ============================================================
// Generate AI Response
// ============================================================

export async function askGroq(systemPrompt, userMessage) {

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Missing GROQ_API_KEY");
    }

    const response = await fetch(GROQ_API, {

        method: "POST",

        headers: {

            "Authorization": `Bearer ${apiKey}`,

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            model: MODEL,

            temperature: 0.2,

            max_tokens: 2048,

            messages: [

                {
                    role: "system",
                    content: systemPrompt
                },

                {
                    role: "user",
                    content: userMessage
                }

            ]

        })

    });

    const data = await response.json();

    // ==========================
    // API Error
    // ==========================

    if (data.error) {

        throw new Error(data.error.message);

    }

    // ==========================
    // Empty Response
    // ==========================

    if (!data.choices?.length) {

        throw new Error("Groq returned an empty response.");

    }

    return data.choices[0].message.content.trim();

}
