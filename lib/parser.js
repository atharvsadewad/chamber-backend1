// ======================================================
// Chamber AI - Intelligent Query Parser
// ======================================================

export function parseQuery(message) {

    const original = message.trim();

    const text = original.toLowerCase();

    const result = {

        intent: "general",

        module: "laws",

        act: null,

        section: null,

        article: null,

        keywords: [],

        original

    };

    // ===========================================
    // Detect Draft Requests
    // ===========================================

    const draftWords = [
        "draft",
        "legal notice",
        "fir",
        "agreement",
        "petition",
        "affidavit",
        "application",
        "complaint"
    ];

    if (draftWords.some(word => text.includes(word))) {

        result.intent = "draft";

        return result;

    }

    // ===========================================
    // Detect Constitution
    // ===========================================

    if (
        text.includes("constitution") ||
        text.includes("article")
    ) {

        result.module = "constitution";

    }

    // ===========================================
    // Detect Legal Dictionary
    // ===========================================

    if (

        text.includes("meaning") ||

        text.includes("define") ||

        text.includes("definition") ||

        text.includes("what is") ||

        text.includes("legal term")

    ) {

        result.module = "dictionary";

    }

    // ===========================================
    // Detect Act
    // ===========================================

    if (

        text.includes("bns") ||

        text.includes("bharatiya nyaya sanhita")

    ) {

        result.act = "Bharatiya Nyaya Sanhita";

    }

    if (

        text.includes("bnss") ||

        text.includes("bharatiya nagarik suraksha sanhita")

    ) {

        result.act = "Bharatiya Nagarik Suraksha Sanhita";

    }

    if (

        text.includes("bsa") ||

        text.includes("bharatiya sakshya adhiniyam")

    ) {

        result.act = "Bharatiya Sakshya Adhiniyam";

    }

    // ===========================================
    // Detect Section Number
    // ===========================================

    const sectionPatterns = [

        /section\s*(\d+)/i,

        /sec\s*(\d+)/i,

        /bns\s*(\d+)/i,

        /bnss\s*(\d+)/i,

        /bsa\s*(\d+)/i

    ];

    for (const pattern of sectionPatterns) {

        const match = original.match(pattern);

        if (match) {

            result.intent = "section";

            result.section = Number(match[1]);

            return result;

        }

    }

    // ===========================================
    // Detect Constitution Article
    // ===========================================

    const articleMatch = original.match(/article\s*(\d+)/i);

    if (articleMatch) {

        result.intent = "article";

        result.article = Number(articleMatch[1]);

        result.module = "constitution";

        return result;

    }

    // ===========================================
    // Build Keywords
    // ===========================================

    const stopWords = [

        "what",

        "is",

        "the",

        "of",

        "about",

        "tell",

        "me",

        "explain",

        "describe",

        "please",

        "show",

        "give",

        "law",

        "section",

        "article"

    ];

    result.keywords =

        text

        .split(/\s+/)

        .filter(word =>

            word.length > 2 &&

            !stopWords.includes(word)

        );

    return result;

}
