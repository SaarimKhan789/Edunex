const mysql = require("mysql2/promise");
const { getConnection } = require("./db_connections");

async function fetchDataFromDb(config, query) {
  const connection = await getConnection(config.database);
  if (!connection) {
    console.error(`No connection to ${config.database}`);
    return [];
  }

  try {
    const [rows] = await connection.execute(query);
    return rows;
  } catch (err) {
    console.error(`Query error (${config.database}):`, err.message);
    return [];
  }
}

module.exports = {
  fetchDataFromDb,
};
