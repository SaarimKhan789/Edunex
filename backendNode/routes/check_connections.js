// routes/check_connections.js
// const express = require("express");
// const router = express.Router();
// const { createConnection, dbConfigs } = require("../utils/db_connections");

// /**
//  * Endpoint to check database connections
//  */
// console.log("✅ check_connections.js router loaded");

// router.get("/test", (req, res) => {
//   res.send("✅ Test route working");
// });
// router.get("/check-connections", async (req, res) => {
//   try {
//     const connectionStatus = {};
//     console.log("Hello");
//     // Check each database connection
//     for (let i = 0; i < dbConfigs.length; i++) {
//       const dbConfig = dbConfigs[i];
//       const dbName = dbConfig.database;
//       const key = `Database ${i + 1} (${dbName})`;

//       try {
//         const { success, error } = await createConnection(dbConfig);
//         console.log("Hi");
//         if (success) {
//           connectionStatus[key] = "Connected";
//         } else {
//           connectionStatus[key] = `Connection Failed: ${error}`;
//         }
//       } catch (err) {
//         connectionStatus[key] = `Connection Error: ${err.message}`;
//       }
//     }

//     res.json(connectionStatus);
//   } catch (error) {
//     console.error("Error in check connections endpoint:", error);
//     res.status(500).json({
//       error: "Internal server error while checking connections",
//     });
//   }
// });

// console.log("Router contents:");
// console.log(
//   router.stack.map((layer) => ({
//     path: layer.route?.path,
//     methods: layer.route?.methods,
//   }))
// );

// module.exports = router;

const express = require("express");
const router = express.Router();

const { checkconnections } = require("../controllers/checkConnection");

router.get("/check-connections", checkconnections);

module.exports = router;
