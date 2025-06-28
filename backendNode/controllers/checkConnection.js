const { createConnection, dbConfigs } = require("../utils/db_connections");

exports.checkconnections = async (req, res) => {
  try {
    const connectionStatus = {};
    // Check each database connection
    for (let i = 0; i < dbConfigs.length; i++) {
      const dbConfig = dbConfigs[i];
      const dbName = dbConfig.database;
      const key = `Database ${i + 1} (${dbName})`;

      try {
        const { success, error } = await createConnection(dbConfig);
        if (success) {
          connectionStatus[key] = "Connected";
        } else {
          connectionStatus[key] = `Connection Failed: ${error}`;
        }
      } catch (err) {
        connectionStatus[key] = `Connection Error: ${err.message}`;
      }
    }
    console.log(connectionStatus);
    res.json(connectionStatus);
  } catch (error) {
    console.error("Error in check connections endpoint:", error);
    res.status(500).json({
      error: "Internal server error while checking connections",
    });
  }
};
