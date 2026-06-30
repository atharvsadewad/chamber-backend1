// ============================================================
// Chamber AI
// Intelligent Query Parser
// ============================================================

import { MODULES } from "../config/modules.js";

export function parseQuery(message) {

    const query = message.trim();

    const lower = query.toLowerCase();

    const parsed = {

        original: query,

        intent: "general",

        module: "laws",

        act: null,

        section: null,

        article: null,

        simplified: false,

        draftType: null,

        keywords: []

    };

    // ===============================================
    // Simplified Explanation
    // ===============================================

    const simpleWords = [

        "simple",

        "simply",

        "easy",

        "understand",

        "plain english",

        "explain simply"

    ];

    parsed.simplified = simpleWords.some(word =>
        lower.includes(word)
    );

    // ===============================================
    // Draft Detection
    // ===============================================

    const drafts = [

        "fir",

        "complaint",

        "petition",

        "legal notice",

        "affidavit",

        "agreement",

        "application"

    ];

    for (const draft of drafts) {

        if (lower.includes(draft)) {

            parsed.intent = "draft";

            parsed.draftType = draft;

            return parsed;

        }

    }

    // ===============================================
    // Constitution
    // ===============================================

    if (

        lower.includes("constitution") ||

        lower.includes("article")

    ) {

        parsed.module = "constitution";

    }

    // ===============================================
    // Dictionary
    // ===============================================

    if (

        lower.includes("meaning") ||

        lower.includes("define") ||

        lower.includes("definition") ||

        lower.startsWith("what is") ||

        lower.includes("legal term")

    ) {

        parsed.module = "dictionary";

    }

    // ===============================================
    // Act Detection
    // ===============================================

    const acts = {

        bns: "Bharatiya Nyaya Sanhita",

        bnss: "Bharatiya Nagarik Suraksha Sanhita",

        bsa: "Bharatiya Sakshya Adhiniyam",

        ipc: "Indian Penal Code",

        crpc: "Code of Criminal Procedure"

    };

    for (const key in acts) {

        if (lower.includes(key)) {

            parsed.act = acts[key];

        }

    }

    // ===============================================
    // Section Detection
    // ===============================================

    const sectionPatterns = [

        /section\s*(\d+)/i,

        /sec\.?\s*(\d+)/i,

        /bns\s*(\d+)/i,

        /bnss\s*(\d+)/i,

        /bsa\s*(\d+)/i,

        /ipc\s*(\d+)/i,

        /crpc\s*(\d+)/i

    ];

    for (const pattern of sectionPatterns) {

        const match = query.match(pattern);

        if (match) {

            parsed.intent = "section_lookup";

            parsed.section = Number(match[1]);

            return parsed;

        }

    }

    // ===============================================
    // Article Detection
    // ===============================================

    const article = query.match(/article\s*(\d+)/i);

    if (article) {

        parsed.intent = "article_lookup";

        parsed.article = Number(article[1]);

        parsed.module = "constitution";

        return parsed;

    }

    // ===============================================
    // Keywords
    // ===============================================

    const stopWords = [

        "what",

        "is",

        "the",

        "of",

        "about",

        "tell",

        "me",

        "please",

        "show",

        "give",

        "explain",

        "describe",

        "law",

        "section",

        "article"

    ];

    parsed.keywords =

        lower

        .replace(/[^\w\s]/g, "")

        .split(/\s+/)

        .filter(word =>

            word.length > 2 &&

            !stopWords.includes(word)

        );

    return parsed;

}
