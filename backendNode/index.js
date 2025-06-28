// app.js
const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints"); // Add this
const checkConnectionsRouter = require("./routes/check_connections");
const globalSchemaRouter = require("./routes/global_schema");
const filterSchemaRouter = require("./routes/filter/filter_schema");
const globalDataRouter = require("./routes/globaldata");
const app = express();
const port = 4000;
const {
  dbConfigs,
  createConnection,
  closeAllConnections,
} = require("./utils/db_connections");

async function initializeDatabases() {
  for (const config of dbConfigs) {
    await createConnection(config);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
const schemaRoutes = require("./routes/schemaRoutes");
app.use("/api/schema", schemaRoutes);
// Route registration
app.use("/api/connections", checkConnectionsRouter);
app.use("/api/globalschema", globalSchemaRouter);
app.use("/api/filterschema", filterSchemaRouter);
app.use("/api/globaldata", globalDataRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

// Error handling middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Start the server
const server = app.listen(port, async () => {
  try {
    await initializeDatabases();
    console.log(`Server running on port ${port}`);
  } catch (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "🔍 Not Found", path: req.originalUrl });
});
// Graceful shutdown
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function shutdown() {
  console.log("Shutting down gracefully...");
  await closeAllConnections();
  server.close(() => {
    console.log("Server terminated");
    process.exit(0);
  });
}
