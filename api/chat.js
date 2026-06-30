// ============================================================
// Chamber AI
// Main API Endpoint
// ============================================================

import { parseQuery } from "../services/parser.js";
import { retrieve } from "../services/retriever.js";
import { generateResponse } from "../services/responder.js";

// ============================================================
// CORS
// ============================================================

const allowedOrigins = [
    "https://chamber-frontend-i2lc.vercel.app",
    "http://localhost:3000"
];

// ============================================================
// API Handler
// ============================================================

export default async function handler(req, res) {

    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({
            response: "Only POST requests allowed."
        });
    }

    try {

        // ==========================================
        // Parse Request Body
        // ==========================================

        let body = req.body;

        if (typeof body === "string") {
            body = JSON.parse(body);
        }

        const message = body?.message?.trim();

        if (!message) {

            return res.status(400).json({
                response: "Message is required."
            });

        }

        // ==========================================
        // Parse User Query
        // ==========================================

        const parsed = parseQuery(message);

        console.log("📥 Parsed Query:", parsed);

        // ==========================================
        // Retrieve Database Context
        // ==========================================

        const records = await retrieve(parsed);

        console.log(`📚 Records Found: ${records.length}`);

        // ==========================================
        // Generate Final Response
        // ==========================================

        const reply = await generateResponse(
            parsed,
            records
        );

        // ==========================================
        // Success
        // ==========================================

        return res.status(200).json({
            response: reply
        });

    }

    catch (err) {

        console.error("❌ Chamber Error");

        console.error(err);

        return res.status(500).json({

            response:
                "Something went wrong while processing your request."

        });

    }

}
