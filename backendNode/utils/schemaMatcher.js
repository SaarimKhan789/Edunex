const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const { matchWithLLM } = require("./llmMatcher");
const { extractAllSchemasWithForeignKeys } = require("./introspectSchema");
const GLOBAL_ATTRIBUTES = [
  "offering_id",
  "course_title",
  "tutor_name",
  "platform_name",
  "difficulty_level",
  "price",
  "rating",
  "description",
  "Mode",
  "num_enrollments",
  "offering_type",
  "location",
  "certifications",
];

function tokenizeNormalized(str) {
  return tokenizer.tokenize(str.replace(/[_-]/g, " ").toLowerCase());
}

function jaccardDistance(a, b) {
  const tokensA = tokenizeNormalized(a);
  const tokensB = tokenizeNormalized(b);

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  return 1 - intersection.size / (setA.size + setB.size - intersection.size);
}

function computeCombinedScore(globalCol, schemaCol) {
  const jaro = natural.JaroWinklerDistance(globalCol, schemaCol, {
    ignoreCase: true,
  });
  const jaccard = 1 - jaccardDistance(globalCol, schemaCol);
  return 0.6 * jaro + 0.4 * jaccard;
}

const similarityCache = new Map();
function getCachedScore(globalCol, schemaCol) {
  const cacheKey = `${globalCol}::${schemaCol}`.toLowerCase();
  if (!similarityCache.has(cacheKey)) {
    similarityCache.set(cacheKey, computeCombinedScore(globalCol, schemaCol));
  }
  return similarityCache.get(cacheKey);
}

function getAllColumns(schemaJson) {
  const allColumns = [];

  for (const [db, dbSchema] of Object.entries(schemaJson)) {
    const tables = dbSchema.tables || {};

    for (const [table, columns] of Object.entries(tables)) {
      if (Array.isArray(columns)) {
        for (const col of columns) {
          allColumns.push({
            db,
            table,
            col,
            key: `${db}.${table}.${col}`.toLowerCase(),
          });
        }
      }
    }
  }

  return allColumns;
}

// utils/schemaMatcher.js
async function buildColumnMapHybrid(globalCols, schemaJson) {
  const allCols = getAllColumns(schemaJson);
  const columnMap = {};

  // Get LLM matches
  let llmMatches = {};
  try {
    llmMatches = await matchWithLLM(globalCols, allCols);
  } catch (err) {
    console.error("LLM matching failed:", err);
  }

  for (const globalCol of globalCols) {
    const validatedMatches = [];
    const seenMatches = new Set();

    // Process LLM matches
    if (llmMatches[globalCol]) {
      for (const match of llmMatches[globalCol]) {
        const matchKey =
          `${match.db}.${match.table}.${match.col}`.toLowerCase();
        if (seenMatches.has(matchKey)) continue;

        const exists = allCols.some(
          (c) =>
            c.db === match.db && c.table === match.table && c.col === match.col
        );
        if (exists) {
          const isComposite =
            globalCol === "tutor_name" && Array.isArray(match.components);

          validatedMatches.push({
            ...match,
            baseCol: match.col, // Store base column name
            expression: isComposite
              ? null // Will build later in query builder
              : match.col,
            similarity: match.similarity ?? 0.9,
            source: "llm",
            composite: isComposite,
            components: match.components,
          });
          seenMatches.add(matchKey);
        }
      }
    }

    // Add string similarity matches
    const MIN_SIMILARITY = 0.75;
    for (const schemaCol of allCols) {
      if (seenMatches.has(schemaCol.key)) continue;

      const similarity = getCachedScore(globalCol, schemaCol.col);
      if (similarity >= MIN_SIMILARITY) {
        validatedMatches.push({
          ...schemaCol,
          baseCol: schemaCol.col,
          expression: schemaCol.col,
          similarity,
          source: "string-similarity",
          composite: false,
        });
        seenMatches.add(schemaCol.key);
      }
    }

    // Special handling for composite fields
    if (globalCol === "tutor_name" && validatedMatches.length === 0) {
      const fnameCandidates = allCols.filter(
        (c) => /first[_]?name/i.test(c.col) && !seenMatches.has(c.key)
      );

      const lnameCandidates = allCols.filter(
        (c) => /last[_]?name/i.test(c.col) && !seenMatches.has(c.key)
      );

      // Find matching first/last name pairs in same table
      for (const fname of fnameCandidates) {
        const matchingLname = lnameCandidates.find(
          (l) => l.db === fname.db && l.table === fname.table
        );

        if (matchingLname) {
          validatedMatches.push({
            db: fname.db,
            table: fname.table,
            baseCol: null,
            expression: null,
            similarity: 0.95,
            source: "composite",
            composite: true,
            components: [fname.col, matchingLname.col],
          });
          seenMatches.add(fname.key);
          seenMatches.add(matchingLname.key);
          break;
        }
      }
    }

    validatedMatches.sort((a, b) => b.similarity - a.similarity);
    columnMap[globalCol] = validatedMatches;
  }

  return columnMap;
}

function getAliasAwareColumn(match) {
  // Define table aliases used in your base queries
  const tableAliases = {
    tutordb: {
      coaching_center: "t1",
      table_tutor: "t2",
    },
    nptel: {
      COURSE: "t1",
      TUTORS: "t2",
    },
    skill_course_database: {
      courses: "t1",
    },
    db4: {
      hackathon: null,
      webinar: null,
    },
  };

  const alias = tableAliases[match.db]?.[match.table];
  return alias ? `${alias}.${match.col}` : match.col;
}

async function getDatabaseMappings() {
  try {
    // Get database schemas
    const schemaJson = await extractAllSchemasWithForeignKeys();

    // Get column mappings
    const columnMap = await buildColumnMapHybrid(GLOBAL_ATTRIBUTES, schemaJson);

    // Organize results by database
    const results = {};

    // Process each database
    for (const dbName of Object.keys(schemaJson)) {
      results[dbName] = {};

      // Process each global attribute
      for (const globalAttr of GLOBAL_ATTRIBUTES) {
        const mappings = columnMap[globalAttr] || [];

        // Find best match for this database
        const dbMatch = mappings
          .filter((m) => m.db === dbName)
          .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))[0];

        if (dbMatch) {
          results[dbName][globalAttr] = {
            table: dbMatch.table,
            column: dbMatch.col,
            similarity: dbMatch.similarity,
            source: dbMatch.source,
          };
        } else {
          results[dbName][globalAttr] = {
            status: "no_mapping",
            message: "No matching column found",
          };
        }
      }
    }

    return results;
  } catch (error) {
    console.error("Error generating database mappings:", error);
    throw error;
  }
}

module.exports = {
  getAllColumns,
  getDatabaseMappings,
  buildColumnMapHybrid,
  getCachedScore,
};
