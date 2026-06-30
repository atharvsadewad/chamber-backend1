// ============================================================
// Chamber AI
// Smart Retriever
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { MODULES } from "../config/modules.js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// ============================================================
// Search by Section
// ============================================================

async function searchSection(parsed, module) {

    let query = supabase
        .from(module.table)
        .select("*")
        .eq("section", parsed.section);

    if (parsed.act) {
        query = query.ilike("act_name", `%${parsed.act}%`);
    }

    const { data, error } = await query.limit(5);

    if (error) throw error;

    return data || [];

}

// ============================================================
// Search by Article
// ============================================================

async function searchArticle(parsed, module) {

    const { data, error } = await supabase
        .from(module.table)
        .select("*")
        .eq("article", parsed.article)
        .limit(5);

    if (error) throw error;

    return data || [];

}

// ============================================================
// Generic Search
// ============================================================

async function searchKeywords(parsed, module) {

    if (!parsed.keywords.length) return [];

    const keyword = parsed.keywords.join(" ");

    const filters = module.searchFields
        .map(field => `${field}.ilike.%${keyword}%`)
        .join(",");

    const { data, error } = await supabase
        .from(module.table)
        .select("*")
        .or(filters)
        .limit(5);

    if (error) throw error;

    return data || [];

}

// ============================================================
// Main Retriever
// ============================================================

export async function retrieve(parsed) {

    let module = MODULES[parsed.module];

    if (!module || !module.enabled) {
        module = MODULES.laws;
    }

    switch (parsed.intent) {

        case "section_lookup":
            return await searchSection(parsed, module);

        case "article_lookup":
            return await searchArticle(parsed, module);

        case "draft":
            return [];

        default:
            return await searchKeywords(parsed, module);

    }

}
