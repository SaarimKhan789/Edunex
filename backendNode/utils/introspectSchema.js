const {
  getConnection,
  createConnection,
  dbConfigs,
} = require("./db_connections");

async function initConnections() {
  for (const config of dbConfigs) {
    await createConnection(config);
  }
}

// utils/introspectSchema.js

async function extractAllSchemasWithForeignKeys() {
  const result = {};

  for (const config of dbConfigs) {
    const dbName = config.database;
    const conn = await getConnection(dbName);

    result[dbName] = { tables: {}, foreignKeys: [] };

    try {
      // Extract tables
      const [tables] = await conn.query("SHOW TABLES");

      for (const row of tables) {
        const tableName = Object.values(row)[0];

        // Extract columns - ensure we get an array of column names
        const [columns] = await conn.query(`SHOW COLUMNS FROM ${tableName}`);
        const columnNames = columns.map((col) => col.Field);

        result[dbName].tables[tableName] = columnNames;
      }

      // Extract foreign keys
      const [fkData] = await conn.query(
        `
        SELECT 
          TABLE_NAME AS fromTable,
          COLUMN_NAME AS fromColumn,
          REFERENCED_TABLE_NAME AS toTable,
          REFERENCED_COLUMN_NAME AS toColumn
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE 
          TABLE_SCHEMA = ? AND 
          REFERENCED_TABLE_NAME IS NOT NULL
      `,
        [dbName]
      );

      result[dbName].foreignKeys = fkData.map((fk) => ({
        fromTable: fk.fromTable,
        fromColumn: fk.fromColumn,
        toTable: fk.toTable,
        toColumn: fk.toColumn,
      }));

      console.log(
        `✅ Schema extracted for ${dbName}: ${
          Object.keys(result[dbName].tables).length
        } tables, ${result[dbName].foreignKeys.length} foreign keys`
      );
    } catch (err) {
      console.error(`❌ Error extracting schema for ${dbName}:`, err.message);
      // Ensure we have at least an empty tables object
      result[dbName].tables = result[dbName].tables || {};
    }
  }

  return result;
}

module.exports = {
  initConnections,
  extractAllSchemasWithForeignKeys,
};
