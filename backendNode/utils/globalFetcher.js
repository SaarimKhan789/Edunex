// // utils/globalFetcher.js
// const { getConnection, dbConfigs } = require("./db_connections");
// const { buildColumnMapHybrid } = require("./schemaMatcher");
// const { extractAllSchemasWithForeignKeys } = require("./introspectSchema");

// const GLOBAL_SCHEMA = [
//   "offering_id",
//   "course_title",
//   "tutor_name",
//   "platform_name",
//   "difficulty_level",
//   "price",
//   "rating",
//   "description",
//   "Mode",
//   "num_enrollments",
//   "offering_type",
//   "location",
//   "certifications",
// ];

// const queries = [];

// // MySQL-compatible functions
// function mysqlConcat(items) {
//   const processedItems = items.map((item) => {
//     // Handle string literals
//     if (typeof item === "string") {
//       // If it's already quoted, leave it alone
//       if (item.startsWith("'") && item.endsWith("'")) {
//         return item;
//       }
//       // Otherwise, add quotes
//       return `'${item}'`;
//     }
//     return item;
//   });
//   return `CONCAT(${processedItems.join(", ")})`;
// }

// // Safe fallbacks with proper concatenation
// function safeFallback(globalCol, dbName, table = "") {
//   switch (globalCol) {
//     case "offering_type":
//       return `'${dbName}'`;
//     case "certifications":
//       return `'yes'`;
//     case "location":
//       return `'Remote'`;
//     case "Mode":
//       return dbName === "nptel" ? `'Online'` : `'Offline'`;
//     case "price":
//       return dbName === "nptel" ? `'Free'` : `'Paid'`;
//     case "offering_id":
//       // CORRECTED: Pass strings without extra quotes
//       return mysqlConcat([`${dbName}_`, `FLOOR(RAND() * 1000)`]);
//     default:
//       return `NULL`;
//   }
// }

// function validateColumn(schema, dbName, table, col) {
//   return schema[dbName]?.tables?.[table]?.includes(col);
// }

// function buildQuery(schema, dbName, columnMap) {
//   const colList = [];
//   const usedTables = new Set();
//   const tableAliases = {};
//   let aliasCounter = 1;
//   colList.push(`'${dbName}' AS offering_type`);
//   // Find primary table (most referenced)
//   const tableCounts = {};
//   GLOBAL_SCHEMA.forEach((col) => {
//     const match = (columnMap[col] || []).filter((c) => c.db === dbName)[0];
//     if (match) {
//       tableCounts[match.table] = (tableCounts[match.table] || 0) + 1;
//     }
//   });

//   const primaryTable =
//     Object.keys(tableCounts).sort(
//       (a, b) => tableCounts[b] - tableCounts[a]
//     )[0] || Object.keys(schema[dbName]?.tables || {})[0];

//   if (!primaryTable) return null;

//   const getTableAlias = (table) => {
//     if (!tableAliases[table]) tableAliases[table] = `t${aliasCounter++}`;
//     return tableAliases[table];
//   };

//   const primaryAlias = getTableAlias(primaryTable);
//   usedTables.add(primaryTable);

//   // Process each global column
//   for (const globalCol of GLOBAL_SCHEMA) {
//     const candidates = (columnMap[globalCol] || [])
//       .filter((c) => c.db === dbName)
//       .sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

//     let expression = safeFallback(globalCol, dbName, primaryAlias);
//     let found = false;

//     // Try to find valid match
//     for (const candidate of candidates) {
//       const { table, col } = candidate;
//       if (validateColumn(schema, dbName, table, col)) {
//         const alias =
//           table === primaryTable ? primaryAlias : getTableAlias(table);
//         if (table !== primaryTable) usedTables.add(table);
//         expression = `${alias}.${col}`;
//         found = true;
//         break;
//       }
//     }

//     // Special handling for composite fields
//     if (!found && globalCol === "tutor_name") {
//       const first = candidates.find((c) => /first[_]?name/i.test(c.col));
//       const last = candidates.find((c) => /last[_]?name/i.test(c.col));

//       if (
//         first &&
//         last &&
//         first.table === primaryTable &&
//         last.table === primaryTable &&
//         validateColumn(schema, dbName, primaryTable, first.col) &&
//         validateColumn(schema, dbName, primaryTable, last.col)
//       ) {
//         expression = mysqlConcat([
//           `${primaryAlias}.${first.col}`,
//           `' '`,
//           `${primaryAlias}.${last.col}`,
//         ]);
//         found = true;
//       }
//     }

//     colList.push(`${expression} AS ${globalCol}`);
//   }

//   // Build FROM clause
//   const tables = Array.from(usedTables);
//   if (tables.length === 0) return null;

//   let fromClause = `${primaryTable} AS ${primaryAlias}`;
//   const foreignKeys = schema[dbName]?.foreignKeys || [];

//   // Add joins
//   for (const table of tables) {
//     if (table === primaryTable) continue;

//     const alias = getTableAlias(table);
//     const fk = foreignKeys.find(
//       (f) =>
//         (f.fromTable === primaryTable && f.toTable === table) ||
//         (f.fromTable === table && f.toTable === primaryTable)
//     );

//     if (fk) {
//       const condition =
//         fk.fromTable === primaryTable
//           ? `${primaryAlias}.${fk.fromColumn} = ${alias}.${fk.toColumn}`
//           : `${alias}.${fk.fromColumn} = ${primaryAlias}.${fk.toColumn}`;
//       fromClause += `\n  JOIN ${table} AS ${alias} ON ${condition}`;
//     } else {
//       fromClause += `, ${table} AS ${alias}`;
//     }
//   }

//   return `SELECT ${colList.join(", ")} \nFROM ${fromClause}`;
// }

// function buildMultiRootQuery(schema, dbName, columnMap) {
//   const tables = Object.keys(schema[dbName]?.tables || {});
//   const unionQueries = [];

//   for (const table of tables) {
//     const tableCols = [];
//     tableCols.push(`'${dbName}' AS offering_type`);
//     for (const globalCol of GLOBAL_SCHEMA) {
//       const candidates = (columnMap[globalCol] || [])
//         .filter((c) => c.db === dbName && c.table === table)
//         .sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

//       let expr = "NULL";
//       let found = false;

//       // Try to find valid match
//       for (const candidate of candidates) {
//         if (validateColumn(schema, dbName, table, candidate.col)) {
//           expr = `${table}.${candidate.col}`;
//           found = true;
//           break;
//         }
//       }

//       // Special handling for offering_type in db4
//       if (!found && globalCol === "offering_type") {
//         expr = `'${table}'`; // Use table name as offering type
//         found = true;
//       }

//       // Special handling for course_title
//       if (!found && globalCol === "course_title") {
//         const titleColumns = ["title", "course_name", "name", "subject"];
//         for (const col of titleColumns) {
//           if (validateColumn(schema, dbName, table, col)) {
//             expr = `${table}.${col}`;
//             found = true;
//             break;
//           }
//         }
//       }

//       // Fallback to default values
//       if (!found) {
//         switch (globalCol) {
//           case "offering_id":
//             expr = mysqlConcat([`'${table}_'`, `${table}.id`]);
//             break;
//           case "platform":
//             expr = `'${table}'`;
//             break;
//           case "certifications":
//             expr = `'yes'`;
//             break;
//           case "Mode":
//             expr = `'Online'`;
//             break;
//           case "price":
//             expr = `'Free'`;
//             break;
//           case "location":
//             expr = `'Remote'`;
//             break;
//         }
//       }

//       tableCols.push(`${expr} AS ${globalCol}`);
//     }

//     unionQueries.push(`SELECT ${tableCols.join(", ")} FROM ${table}`);
//   }

//   return unionQueries.join("\nUNION ALL\n");
// }
// async function fetchUnifiedGlobalData() {
//   try {
//     const schema = await extractAllSchemasWithForeignKeys();
//     const columnMap = await buildColumnMapHybrid(GLOBAL_SCHEMA, schema);
//     const finalResults = [];

//     console.log("Validated Column Map:");
//     console.log(JSON.stringify(columnMap, null, 2));

//     for (const config of dbConfigs) {
//       const db = config.database;
//       const conn = await getConnection(db);

//       // Choose query builder based on database
//       const query =
//         db === "db4"
//           ? buildMultiRootQuery(schema, db, columnMap)
//           : buildQuery(schema, db, columnMap);

//       if (!query) {
//         console.warn(`⚠️ No query for ${db}, skipping`);
//         continue;
//       }

//       queries.push(query);
//       console.log(`\n🔎 Query for ${db}:\n${query}\n`);

//       try {
//         const [rows] = await conn.query(query);
//         finalResults.push(...rows.map((row) => ({ ...row, source: db })));
//       } catch (err) {
//         console.error(`❌ Error querying ${db}:`, err.message);
//         console.error(`❌ Failed query: ${query}`);
//       }
//     }

//     return finalResults;
//   } catch (err) {
//     console.error("❌ Global fetch error:", err);
//     throw err;
//   }
// }

// module.exports = { fetchUnifiedGlobalData, queries };

// utils/globalFetcher.js
// utils/globalFetcher.js
const { getConnection, dbConfigs } = require("./db_connections");
const { buildColumnMapHybrid } = require("./schemaMatcher");
const { extractAllSchemasWithForeignKeys } = require("./introspectSchema");

const GLOBAL_SCHEMA = [
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

const queries = [];

// Database-specific concatenation
function dbConcat(dbName, items) {
  if (["nptel", "skill_course_database"].includes(dbName)) {
    return items.join(" || ");
  }
  return `CONCAT(${items.join(", ")})`;
}

// Fixed table aliases used in column mapping
function getFixedTableAlias(dbName, tableName) {
  const aliasMap = {
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
      hackathon: "h",
      webinar: "w",
    },
  };

  return aliasMap[dbName]?.[tableName] || tableName;
}

// Build queries for all databases based on column mappings
function buildQueriesFromMappings(schemaJson, columnMap) {
  const dbQueries = {};

  for (const dbName of Object.keys(schemaJson)) {
    const dbSchema = schemaJson[dbName];
    const tables = dbSchema.tables || {};
    const foreignKeys = dbSchema.foreignKeys || [];

    if (dbName === "db4") {
      dbQueries[dbName] = buildMultiTableQuery(dbName, tables, columnMap);
    } else {
      dbQueries[dbName] = buildJoinedQuery(
        dbName,
        tables,
        foreignKeys,
        columnMap
      );
    }
  }

  return dbQueries;
}

// Build a joined query for relational databases
// services/globalFetcher.js
function buildJoinedQuery(dbName, tables, foreignKeys, columnMap) {
  const selectClauses = [];
  const usedTables = new Set();
  const tableAliases = {};

  // Add offering_type first
  selectClauses.push(`'${dbName}' AS offering_type`);

  // Process each global attribute
  GLOBAL_SCHEMA.forEach((globalAttr) => {
    const mappings =
      columnMap[globalAttr]?.filter((m) => m.db === dbName) || [];
    let expression = "NULL";
    let sourceTable = null;

    // Try to find best valid match
    for (const mapping of mappings) {
      const table = mapping.table;
      const col = mapping.baseCol || mapping.expression;

      // Skip if table doesn't exist in schema
      if (!tables[table]) continue;

      // Use fixed alias for this table
      const alias = getFixedTableAlias(dbName, table);
      tableAliases[table] = alias;

      // Handle composite fields
      if (mapping.composite) {
        if (mapping.components && mapping.components.length === 2) {
          const [first, last] = mapping.components;
          if (tables[table].includes(first) && tables[table].includes(last)) {
            expression = dbConcat(dbName, [
              `${alias}.${first}`,
              `' '`,
              `${alias}.${last}`,
            ]);
            sourceTable = table;
            usedTables.add(table);
            break;
          }
        }
      }
      // Handle regular fields
      else if (col && tables[table].includes(col)) {
        expression = `${alias}.${col}`;
        sourceTable = table;
        usedTables.add(table);
        break;
      }
    }

    // Fallback values for missing mappings
    if (expression === "NULL") {
      switch (globalAttr) {
        case "offering_id":
          expression = dbConcat(dbName, [`'${dbName}_'`, "RANDOM()"]);
          break;
        case "certifications":
          expression = "'Yes'";
          break;
        case "Mode":
          expression = dbName === "nptel" ? "'Online'" : "'Offline'";
          break;
        case "price":
          expression = dbName === "nptel" ? "'Free'" : "'Paid'";
          break;
        case "location":
          expression = "'Remote'";
          break;
        case "platform_name":
          expression = dbName === "nptel" ? "'nptel'" : "''";
          break;
      }
    }

    selectClauses.push(`${expression} AS ${globalAttr}`);
  });

  // Build FROM clause
  const tableList = Array.from(usedTables);
  if (tableList.length === 0) return null;

  const primaryTable = tableList[0];
  const primaryAlias = tableAliases[primaryTable];
  let fromClause = `${primaryTable} AS ${primaryAlias}`;
  const joins = [];

  // Add joins for other tables
  for (let i = 1; i < tableList.length; i++) {
    const table = tableList[i];
    const alias = tableAliases[table];

    const fk = foreignKeys.find(
      (fk) =>
        (fk.fromTable === primaryTable && fk.toTable === table) ||
        (fk.fromTable === table && fk.toTable === primaryTable)
    );

    if (fk) {
      const fromCol =
        fk.fromTable === primaryTable
          ? `${primaryAlias}.${fk.fromColumn}`
          : `${alias}.${fk.fromColumn}`;
      const toCol =
        fk.toTable === primaryTable
          ? `${primaryAlias}.${fk.toColumn}`
          : `${alias}.${fk.toColumn}`;

      joins.push(`JOIN ${table} AS ${alias} ON ${fromCol} = ${toCol}`);
    } else {
      // Cross join if no foreign key relationship
      joins.push(`, ${table} AS ${alias}`);
    }
  }

  return `
    SELECT ${selectClauses.join(",\n       ")}
    FROM ${fromClause}
    ${joins.join("\n    ")}
  `;
}

// Build multi-table query for db4
function buildMultiTableQuery(dbName, tables, columnMap) {
  const unionQueries = [];

  Object.keys(tables).forEach((tableName) => {
    const tableColumns = tables[tableName];
    const selectClauses = [`'${dbName}' AS offering_type`];
    const alias = getFixedTableAlias(dbName, tableName);

    GLOBAL_SCHEMA.forEach((globalAttr) => {
      const mappings =
        columnMap[globalAttr]?.filter(
          (m) => m.db === dbName && m.table === tableName
        ) || [];

      let expression = "NULL";
      let found = false;

      // Try to find valid mapping
      for (const mapping of mappings) {
        // Handle composite fields
        if (mapping.composite) {
          if (mapping.components && mapping.components.length === 2) {
            const [first, last] = mapping.components;
            if (tableColumns.includes(first) && tableColumns.includes(last)) {
              expression = dbConcat(dbName, [
                `${alias}.${first}`,
                `' '`,
                `${alias}.${last}`,
              ]);
              found = true;
              break;
            }
          }
        }
        // Handle regular fields
        else if (mapping.baseCol && tableColumns.includes(mapping.baseCol)) {
          expression = `${alias}.${mapping.baseCol}`;
          found = true;
          break;
        }
      }
      if (globalAttr === "tutor_name" && !found) {
        // Skip this table entirely if tutor_name is not available
        return "";
      }
      // Table-specific fallbacks
      if (!found) {
        switch (globalAttr) {
          case "offering_id":
            expression = dbConcat(dbName, [`'${tableName}_'`, `${alias}.id`]);
            break;
          case "offering_type":
            expression = `'${tableName}'`;
            break;
          case "platform_name":
            expression = `'${tableName}'`;
            break;
          case "course_title":
            const titleCol = tableColumns.find((c) =>
              /title|name|subject|course/i.test(c)
            );
            expression = titleCol ? `${alias}.${titleCol}` : "'Unnamed Course'";
            break;
          case "certifications":
            expression = `'yes'`;
            break;
          case "Mode":
            expression = `'Online'`;
            break;
          case "price":
            expression = `'Free'`;
            break;
          case "location":
            expression = `'Remote'`;
            break;
        }
      }

      selectClauses.push(`${expression} AS ${globalAttr}`);
    });

    unionQueries.push(
      `SELECT ${selectClauses.join(", ")} FROM ${tableName} AS ${alias}`
    );
  });

  return unionQueries.join("\nUNION ALL\n");
}

async function fetchUnifiedGlobalData() {
  try {
    const schema = await extractAllSchemasWithForeignKeys();
    const columnMap = await buildColumnMapHybrid(GLOBAL_SCHEMA, schema);
    const finalResults = [];

    console.log("Validated Column Map:");
    console.log(JSON.stringify(columnMap, null, 2));

    // Build all queries using the new unified approach
    const dbQueries = buildQueriesFromMappings(schema, columnMap);

    for (const config of dbConfigs) {
      const db = config.database;
      const conn = await getConnection(db);

      const query = dbQueries[db];

      if (!query) {
        console.warn(`⚠️ No query for ${db}, skipping`);
        continue;
      }

      queries.push(query);
      console.log(`\n🔎 Query for ${db}:\n${query}\n`);

      try {
        const [rows] = await conn.query(query);
        finalResults.push(...rows.map((row) => ({ ...row, source: db })));
      } catch (err) {
        console.error(`❌ Error querying ${db}:`, err.message);
        console.error(`❌ Failed query: ${query}`);
      }
    }

    return finalResults;
  } catch (err) {
    console.error("❌ Global fetch error:", err);
    throw err;
  }
}

module.exports = { fetchUnifiedGlobalData, queries };
