// ============================================================
// Chamber AI
// Knowledge Module Registry
// ============================================================

export const MODULES = {

    laws: {

        enabled: true,

        table: "laws_new",

        priority: 1,

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

    dictionary: {

        enabled: false,

        table: "legal_dictionary",

        priority: 2,

        searchFields: [

            "term",

            "definition",

            "keywords"

        ]

    },

    constitution: {

        enabled: false,

        table: "constitution",

        priority: 3,

        searchFields: [

            "article",

            "title",

            "description",

            "content"

        ]

    }

};
