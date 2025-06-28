const { fetchUnifiedGlobalData, queries } = require("../utils/globalFetcher");
const { dbConfigs, getConnection } = require("../utils/db_connections");
const {
  filterQueryWithFunctions,
} = require("../routes/filter/sql_filter_utils");
const {
  extractAllSchemasWithForeignKeys,
} = require("../utils/introspectSchema");
const { buildColumnMapHybrid } = require("../utils/schemaMatcher");

let unifiedCache = null;
const columnsOfInterest = [
  "price",
  "Mode",
  "rating",
  "difficulty_level",
  "location",
  "offering_type",
  "platform",
  "certifications",
];

// Updated constants without offering_type
const dbConstants = {
  tutordb: {
    Mode: "offline",
    price: "paid",
    certifications: "yes",
  },
  skill_course_database: {
    location: "remote",
    certifications: "yes",
  },
  nptel: {
    price: "free",
    Mode: "online",
    location: "remote",
    certifications: "yes",
    platform_name: "nptel",
  },
  db4: {
    certifications: "yes",
  },
};

// Get unique values with offering_type fix
async function getUniqueValues() {
  if (!unifiedCache) {
    unifiedCache = await fetchUnifiedGlobalData();
  }

  const df = unifiedCache;
  const uniqueValues = {};

  for (const col of columnsOfInterest) {
    let allValues = [];

    // Special handling for offering_type
    if (col === "offering_type") {
      allValues = [...new Set(df.map((row) => row.source.toLowerCase()))];
      uniqueValues[col] = allValues;
      continue;
    }

    // Regular column processing
    df.forEach((row) => {
      if (!row) return;

      // Constant values take priority
      const dbName = row.source;
      if (dbConstants[dbName]?.[col]) {
        allValues.push(dbConstants[dbName][col].toString().toLowerCase());
        return;
      }

      // Regular row values
      if (row[col] !== null && row[col] !== undefined) {
        const val =
          typeof row[col] === "string"
            ? row[col].toLowerCase()
            : String(row[col]).toLowerCase();
        allValues.push(val);
      }
    });

    // Special value validation
    if (col === "Mode") {
      uniqueValues[col] = [...new Set(allValues)].filter((val) =>
        ["online", "offline"].includes(val)
      );
    } else if (col === "price") {
      uniqueValues[col] = [...new Set(allValues)].filter((val) =>
        ["free", "paid"].includes(val)
      );
    } else {
      uniqueValues[col] = [...new Set(allValues)];
    }
  }

  return uniqueValues;
}

// Controller for unique values
exports.getUniqueValues = async (req, res) => {
  try {
    const uniqueValues = await getUniqueValues();
    res.json(uniqueValues);
  } catch (err) {
    console.error("❌ Error in /unique-values:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch filtered data with offering_type fix
async function fetchFilteredSchemaData(filters, uniqueValues, columnMap) {
  let filteredData = [];

  for (let i = 0; i < dbConfigs.length; i++) {
    const dbConfig = dbConfigs[i];
    const dbName = dbConfig.database;
    const query = queries[i];

    if (!query) {
      console.log(`⏩ Skipping ${dbName}: No query defined`);
      continue;
    }

    const filteredQuery = filterQueryWithFunctions(
      query,
      filters,
      uniqueValues,
      dbName,
      columnMap
    );

    if (!filteredQuery) {
      console.log(`Skipping ${dbName}: No valid query generated`);
      continue;
    }

    console.log(` Executing on ${dbName}: ${filteredQuery}...`);
    console.log("**************");

    try {
      const conn = await getConnection(dbName);
      const [rows] = await conn.query(filteredQuery);

      filteredData.push(
        ...rows.map((row) => ({
          ...row,
          source: dbName,
          // Critical fix: Set offering_type to dbName
          offering_type: dbName,
          Mode: dbConstants[dbName]?.Mode || row.Mode,
          price: dbConstants[dbName]?.price || row.price,
        }))
      );
    } catch (err) {
      console.error(`❌ ${dbName} query failed:`, err.message);
    }
  }

  return filteredData;
}

// Main filtered courses endpoint
exports.filteredCourses = async (req, res) => {
  try {
    const filters = req.body;
    const uniqueValues = await getUniqueValues();
    const globalColumns = Object.keys(filters);
    const schemaJson = await extractAllSchemasWithForeignKeys();
    const columnMap = await buildColumnMapHybrid(globalColumns, schemaJson);

    const filteredData = await fetchFilteredSchemaData(
      filters,
      uniqueValues,
      columnMap
    );

    // Add unique IDs to results
    const coursesWithIds = filteredData.map((course, index) => ({
      ...course,
      unique_id: `${course.offering_id}-${course.source}-${index}`,
    }));

    coursesWithIds.length > 0
      ? res.json(coursesWithIds)
      : res.status(404).json({ message: "No matching courses found" });
  } catch (err) {
    console.error("❌ /filtered-courses error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
