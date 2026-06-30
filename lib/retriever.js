// ======================================================
// Chamber AI - Smart Retriever
// ======================================================

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// =========================================
// Search by Section Number
// =========================================

async function searchSection(parsed) {

    let query = supabase
        .from("laws_new")
        .select("*")
        .eq("section", parsed.section);

    if (parsed.act) {
        query = query.ilike("act_name", `%${parsed.act}%`);
    }

    const { data, error } = await query.limit(5);

    if (error) throw error;

    return data || [];
}

// =========================================
// Search Constitution
// =========================================

async function searchArticle(parsed) {

    const { data, error } = await supabase
        .from("constitution")
        .select("*")
        .eq("article", parsed.article)
        .limit(5);

    if (error) throw error;

    return data || [];
}

// =========================================
// Keyword Search
// =========================================

async function keywordSearch(parsed) {

    const keyword = parsed.keywords.join(" ");

    const { data, error } = await supabase
        .from("laws_new")
        .select("*")
        .or(
            [
                `title.ilike.%${keyword}%`,
                `description.ilike.%${keyword}%`,
                `keywords.ilike.%${keyword}%`,
                `subject.ilike.%${keyword}%`,
                `content.ilike.%${keyword}%`,
                `act_name.ilike.%${keyword}%`
            ].join(",")
        )
        .limit(5);

    if (error) throw error;

    return data || [];
}

// =========================================
// Dictionary Search
// =========================================

async function dictionarySearch(parsed) {

    const keyword = parsed.keywords.join(" ");

    const { data, error } = await supabase
        .from("legal_dictionary")
        .select("*")
        .or(
            [
                `term.ilike.%${keyword}%`,
                `definition.ilike.%${keyword}%`,
                `keywords.ilike.%${keyword}%`
            ].join(",")
        )
        .limit(5);

    if (error) throw error;

    return data || [];
}

// =========================================
// Main Retriever
// =========================================

export async function retrieve(parsed) {

    switch (parsed.intent) {

        case "section":
            return await searchSection(parsed);

        case "article":
            return await searchArticle(parsed);

        case "draft":
            return [];

        default:

            if (parsed.module === "dictionary") {
                return await dictionarySearch(parsed);
            }

            return await keywordSearch(parsed);

    }

}