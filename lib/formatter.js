// ======================================================
// Chamber AI - Context Formatter
// ======================================================

export function buildContext(records = [], parsed = {}) {

    if (!records || records.length === 0) {
        return "";
    }

    return records.map(record => {

        let context = "";

        // ===================================================
        // LAW RECORD
        // ===================================================

        if (record.section !== undefined) {

            context += `
==================================================
LEGAL RECORD
==================================================

Act:
${record.act_name || "Unknown"}

Section:
${record.section || "-"}

Title:
${record.title || "-"}

Subject:
${record.subject || "-"}

Description:
${record.description || "-"}

Keywords:
${record.keywords || "-"}

Legal Text:
${record.content || "-"}

Source:
${record.source || "-"}

`;

        }

        // ===================================================
        // LEGAL DICTIONARY
        // ===================================================

        else if (record.term) {

            context += `
==================================================
LEGAL DICTIONARY
==================================================

Term:
${record.term}

Definition:
${record.definition}

Keywords:
${record.keywords || "-"}

`;

        }

        // ===================================================
        // CONSTITUTION
        // ===================================================

        else if (record.article) {

            context += `
==================================================
CONSTITUTION

Article:
${record.article}

Title:
${record.title}

Description:
${record.description || "-"}

Content:
${record.content}

`;

        }

        return context;

    }).join("\n\n");
}

// ======================================================
// Chamber AI System Prompt
// ======================================================

export function buildPrompt(parsed, context) {

return `

You are Chamber AI.

Chamber AI is an Indian Legal Research Assistant.

You must NEVER invent laws.

If legal context exists,
answer ONLY using that context.

If context is missing,
say clearly:

"I couldn't find this provision in Chamber's legal database."

Never fabricate legal sections.

Never confuse one Act with another.

----------------------------------------------------

When answering legal provisions use this format:

Act

Section / Article

Title

Explanation in simple language

Original Legal Text

Important Points

----------------------------------------------------

When answering dictionary terms use:

Legal Term

Meaning

Simple Explanation

----------------------------------------------------

If the user asks to generate:

• FIR
• Legal Notice
• Complaint
• Affidavit
• Agreement

Generate a professional legal draft.

----------------------------------------------------

Legal Context

${context || "NO LEGAL CONTEXT FOUND"}

`;
}