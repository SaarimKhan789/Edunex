// // utils/llmMatcher.js
const { OpenAI } = require("openai/index.mjs");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL_NAME = "gpt-4.1";

const globalDescriptions = {
  offering_id: {
    description: "Unique identifier of the offering",
    examples: ["course_id", "program_code", "offering_code", "center"],
    data_type: "string or integer",
  },
  course_title: {
    description:
      "Title or name of the course or subject, Examples: title, course_name,subject_name,program_title",
    examples: ["title", "course_name", "program_title", "subject_name"],
    data_type: "string",
  },
  tutor_name: {
    description: "Name of the instructor, trainer or tutor or name",
    examples: [
      "instructor",
      "teacher",
      "professor",
      "first_name + last_name",
      "name",
    ],
    composite: true,
  },
  platform_name: {
    description:
      "The website/coachings offering the course having attributes like platform_name,coaching_name ",
    examples: ["coaching_name,platform_name", "provider", "source"],
    data_type: "string",
  },
  difficulty_level: {
    description: "Level of difficulty",
    examples: ["level", "difficulty", "complexity"],
    data_type: "string",
  },
  price: {
    description: "Cost of the course",
    examples: ["price", "cost", "fee"],
    data_type: "number or string",
  },
  rating: {
    description: "Rating given to the course",
    examples: ["rating", "score", "stars"],
    data_type: "number",
  },
  description: {
    description: "Summary of the course",
    examples: ["description", "summary", "overview"],
    data_type: "string",
  },
  Mode: {
    description: "Online or offline delivery",
    examples: ["mode", "delivery_method", "format"],
    data_type: "string",
  },
  num_enrollments: {
    description: "Number of people enrolled",
    examples: ["enrollments", "students", "participants"],
    data_type: "integer",
  },
  offering_type: {
    description: "Origin DB or content type",
    examples: ["type", "source_db", "classification"],
    data_type: "string",
  },
  location: {
    description: "Location of course or tutor",
    examples: ["location", "city", "country"],
    data_type: "string",
  },
  certifications: {
    description: "Whether certification is provided",
    examples: ["certification", "certificate", "credential"],
    data_type: "string or boolean",
  },
};

async function matchWithLLM(globalCols, allCols, exampleQueries = {}) {
  // Create validated column list
  const validColumns = allCols.map((c) => ({
    ...c,
    key: `${c.db}.${c.table}.${c.col}`.toLowerCase(),
  }));

  // Prepare schema information
  const schemaInfo = validColumns
    .map((c) => `${c.col} (db: ${c.db}, table: ${c.table})`)
    .join("\n");

  const prompt = `
You are a data integration expert. Match global columns to EXISTING database columns ONLY.
VERY IMPORTANT POINT : THINK SEMANTICALY FOR EACH ATTRIBUTE DEEP THINK
STRICT RULES:
1. Use ONLY columns from this list:
${schemaInfo}
2. Never invent or create column names
3. course_title must be somewhat like course_name or subject_name etc so think semantically
4. do not take coaching_name as course_title, coaching_name must be platform_name
5. Suggest alternatives for equivalent terms (e.g., subject_name → course_title)
6. Skip uncertain matches
7. For "tutor_name", suggest components if available
8. Output ONLY valid columns from the list

SEMANTIC EQUIVALENCE GUIDELINES:
- "course_title" ≡ "subject_name"
- "tutor_name" ≡ "first_name" + "last_name" (composite)
- "platform" ≡ "platform_name"

SPECIAL INSTRUCTIONS FOR OFFERING_ID:
- offering_id is typically a COMPOSITE IDENTIFIER (not a direct column)
- Look for PRIMARY KEY columns like: centre_id, course_id, subject_id, id
- In existing systems, it's constructed using:
  * tutordb: coaching_center.centre_id
  * skill_course_database: courses.course_id
  * nptel: course.subject_id
  * db4: hackathon.id or webinar.id
GLOBAL COLUMNS:
${globalCols
  .map((col) => {
    const info = globalDescriptions[col] || {};
    let extra = "";
    if (col === "offering_id") {
      extra = "\n  IMPORTANT: Prefer primary key columns (id, centre_id, etc.)";
    }
    return `- ${col}: ${info.description}${extra}`;
  })
  .join("\n")}

OUTPUT FORMAT: JSON with structure:
{
  "global_column": [
    {
      "db": "exact_db_name",
      "table": "exact_table_name",
      "col": "exact_column_name",
      "similarity": 0.95
    }
  ]
}

EXAMPLE: For "course_title" in "db1":
{
  "course_title": [
    {"db": "db1", "table": "courses", "col": "title", "similarity": 0.95}
  ]
}
  For tutordb:
{
  "course_title": [
    {"db": "tutordb", "table": "table_tutor", "col": "subject_name", "similarity": 0.90}
  ],
  "tutor_name": [
    {"db": "tutordb", "table": "table_tutor", "col": "first_name", "similarity": 0.85},
    {"db": "tutordb", "table": "table_tutor", "col": "last_name", "similarity": 0.85}
  ]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: "user", content: prompt.trim() }],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const rawContent = response.choices[0]?.message?.content;
    let matches = {};

    try {
      matches = JSON.parse(rawContent);
    } catch (e) {
      console.error("JSON parse error:", e);
      return {};
    }

    // Strict validation
    const validatedMatches = {};
    for (const globalCol of globalCols) {
      validatedMatches[globalCol] = (matches[globalCol] || []).filter(
        (match) => {
          if (!match.db || !match.table || !match.col) return false;

          const key = `${match.db}.${match.table}.${match.col}`.toLowerCase();
          const isValid = validColumns.some((c) => c.key === key);

          if (!isValid) {
            console.warn(
              `❌ LLM suggested invalid column: ${key} for ${globalCol}`
            );
          }
          return isValid;
        }
      );
    }
    console.log("validatedMatches", validatedMatches);
    return validatedMatches;
  } catch (err) {
    console.error("LLM Error:", err.message);
    return {};
  }
}

module.exports = { matchWithLLM };
