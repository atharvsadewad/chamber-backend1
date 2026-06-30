// =======================================================
// Chamber AI - Knowledge Router
// Future Proof Module Registry
// =======================================================

export const MODULES = [
  {
    id: "laws",
    table: "laws_new",
    priority: 1,

    triggers: [
      "bns",
      "bnss",
      "bsa",
      "ipc",
      "crpc",
      "evidence",
      "act",
      "section",
      "law",
      "laws"
    ],

    searchFields: [
      "section",
      "title",
      "description",
      "keywords",
      "subject",
      "content",
      "act_name"
    ]
  },

  {
    id: "dictionary",
    table: "legal_dictionary",

    priority: 2,

    triggers: [
      "meaning",
      "define",
      "definition",
      "dictionary",
      "term",
      "legal term"
    ],

    searchFields: [
      "term",
      "definition",
      "keywords"
    ]
  },

  {
    id: "constitution",

    table: "constitution",

    priority: 3,

    triggers: [
      "constitution",
      "article",
      "fundamental rights",
      "directive principles"
    ],

    searchFields: [
      "article",
      "title",
      "description",
      "content"
    ]
  }
];


// ===========================================
// Detect which module should answer
// ===========================================

export function detectModule(message) {

    const text = message.toLowerCase();

    for (const module of MODULES) {

        for (const trigger of module.triggers) {

            if (text.includes(trigger)) {

                return module;

            }

        }

    }

    // default

    return MODULES[0];

}
