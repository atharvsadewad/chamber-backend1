// ============================================================
// Chamber AI
// Response Service
// ============================================================

import { buildContext, buildPrompt } from "./formatter.js";
import { askGroq } from "./groq.js";

// ============================================================
// Generate Chamber Response
// ============================================================

export async function generateResponse(parsed, records) {

    // ============================================
    // Draft Requests
    // ============================================

    if (parsed.intent === "draft") {

        const systemPrompt = `
You are Chamber AI.

Generate professional Indian legal drafts.

Use proper formatting.

Use formal legal language.

Return only the draft.
`;

        return await askGroq(systemPrompt, parsed.original);

    }

    // ============================================
    // No Database Result
    // ============================================

    if (!records || records.length === 0) {

        return `❌ I couldn't find this provision in Chamber's legal database.

This may be because:

• The database is still under development.

• The requested law has not been added yet.

• Try searching using another keyword, section number, or Act name.

Example:

• Explain BNS Section 31

• Article 21

• Meaning of Mens Rea`;

    }

    // ============================================
    // Build Context
    // ============================================

    const context = buildContext(records, parsed);

    const prompt = buildPrompt(parsed, context);

    return await askGroq(

        prompt,

        parsed.original

    );

}
