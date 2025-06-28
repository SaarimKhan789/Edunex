const dbConstants = {
  // Default constants for all databases
  "*": {
    certifications: "yes",
  },

  // Database-specific constants
  tutordb: {
    Mode: "offline",
    price: "paid",
    offering_type: "tutordb",
  },
  skill_course_database: {
    location: "remote",
  },
  nptel: {
    price: "free",
    Mode: "online",
    location: "remote",
  },
};
function filterLike(column, value) {
  if (!column || !value) return "";
  return `${column} IS NOT NULL AND ${column} LIKE '%${value}%'`;
}

function filterCategorical(column, values, allowedValues) {
  if (!Array.isArray(values)) values = [values];

  // Normalize values
  const normalizedAllowed = allowedValues.map((v) => v?.toLowerCase?.() || v);
  const normalizedValues = values.map((v) => v?.toLowerCase?.() || v);

  // Separate null and non-null values
  const nonNullValues = normalizedValues.filter(
    (v) => v !== "null" && v !== null
  );
  const hasNull =
    normalizedValues.includes("null") || normalizedValues.includes(null);

  // Process non-null values
  const validValues = nonNullValues.filter((v) =>
    normalizedAllowed.includes(v)
  );

  // Build conditions
  const conditions = [];

  if (validValues.length > 0) {
    if (validValues.length === 1) {
      conditions.push(`LOWER(${column}) = '${validValues[0]}'`);
    } else {
      conditions.push(
        `LOWER(${column}) IN (${validValues.map((v) => `'${v}'`).join(", ")})`
      );
    }
  }

  // Add null condition if requested
  if (hasNull) {
    conditions.push(`${column} IS NULL`);
  }

  return conditions.length > 0 ? `(${conditions.join(" OR ")})` : "";
}

function filterNumeric(column, value) {
  // Handle direct numeric values
  if (
    typeof value === "number" ||
    (typeof value === "string" && !isNaN(value))
  ) {
    return `${column} = ${parseFloat(value)}`;
  }

  // Handle comparison strings
  if (typeof value === "string" && />|<|=/.test(value)) {
    return `${column} ${value}`;
  }

  return "";
}

// Column mapping with fallbacks
function mapColumn(globalCol, dbName, columnMap) {
  const mappingList = columnMap[globalCol] || [];
  const match = mappingList.find(
    (m) => m.db === dbName && m.col && m.col.toLowerCase() !== "null"
  );

  return match?.col || null;
}

// Constant value handler
function getConstantValue(dbName, globalCol) {
  return dbConstants[dbName]?.[globalCol] || null;
}

// Table name extractor
function extractTableName(query, dbName) {
  // Special handling for db4-style databases
  if (dbName === "db4") {
    const match = query.match(/FROM\s+(\w+)/i);
    return match ? match[1].toLowerCase() : "";
  }

  // Generic table extraction
  const fromMatch = query.match(/FROM\s+(\w+)(?:\s+AS\s+\w+)?/i);
  return fromMatch ? fromMatch[1].toLowerCase() : "";
}

// Critical fix: offering_type handling
function handleConstantFilter(globalCol, value, dbName) {
  // Special handling for offering_type
  if (globalCol === "offering_type") {
    const filterValues = Array.isArray(value)
      ? value.map((v) => v.toLowerCase())
      : [value.toLowerCase()];

    return filterValues.includes(dbName.toLowerCase())
      ? null // Don't filter out this DB
      : "1=0"; // Exclude this DB entirely
  }

  // Regular constant handling
  const constantValue = getConstantValue(dbName, globalCol);
  if (!constantValue) return null;

  const constant = constantValue.toString().toLowerCase();
  const filterValues = Array.isArray(value)
    ? value.map((v) => v.toString().toLowerCase())
    : [value.toString().toLowerCase()];

  return filterValues.includes(constant) ? null : "1=0";
}

// Main query filter function
// Main query filter function
function filterQueryWithFunctions(
  baseQuery,
  filters,
  uniqueValues,
  dbName,
  columnMap
) {
  if (!baseQuery) return null;

  const conditions = [];
  const tableName = extractTableName(baseQuery, dbName);

  // First pass: Handle constant-based filters
  for (const [globalCol, value] of Object.entries(filters)) {
    const constantResult = handleConstantFilter(
      globalCol,
      value,
      dbName,
      tableName
    );

    if (constantResult === "1=0") {
      console.log(
        `⏩ Skipping ${dbName} due to constant filter: ${globalCol}=${value}`
      );
      return null;
    }
  }

  // Second pass: Handle column-based filters
  for (const [globalCol, value] of Object.entries(filters)) {
    // Skip offering_type after constant handling
    if (globalCol === "offering_type") continue;

    // Skip if constant exists for this column
    if (getConstantValue(dbName, globalCol)) continue;

    const localCol = mapColumn(globalCol, dbName, columnMap);

    // Special handling for difficulty_level
    if (globalCol === "difficulty_level") {
      // Only apply filter if database has non-null difficulty values
      const dbHasDifficultyValues =
        uniqueValues[globalCol] && uniqueValues[globalCol].length > 0;

      if (dbHasDifficultyValues) {
        const allowed = uniqueValues[globalCol] || [];
        const condition = filterCategorical(localCol, value, allowed);
        if (condition) conditions.push(condition);
      }
      // For databases with only null values, don't apply any filter
      continue;
    }

    if (["course_title", "tutor_name"].includes(globalCol)) {
      conditions.push(filterLike(localCol, value));
    } else if (["platform", "location", "Mode"].includes(globalCol)) {
      const allowed = uniqueValues[globalCol] || [];
      const condition = filterCategorical(localCol, value, allowed);
      if (condition) conditions.push(condition);
    } else if (globalCol === "price") {
      if (value === "free") conditions.push(`${localCol} = 'free'`);
      else if (value === "paid") conditions.push(`${localCol} != 'free'`);
    } else if (["rating", "num_enrollments"].includes(globalCol)) {
      const condition = filterNumeric(localCol, value);
      if (condition) conditions.push(condition);
    } else if (globalCol === "certifications") {
      conditions.push(filterCategorical(localCol, value, ["yes", "no"]));
    }
  }

  // Build final query
  let whereClause = "";
  if (conditions.length > 0) {
    whereClause = " WHERE " + conditions.join(" AND ");
  }

  return baseQuery.replace(/;+$/, "") + whereClause + " ORDER BY rating DESC;";
}

// Export filter functions
module.exports = {
  filterQueryWithFunctions,
  filterLike,
  filterCategorical,
  filterNumeric,
  mapColumn,
  getConstantValue,
  extractTableName,
};
