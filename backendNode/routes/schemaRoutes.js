// routes/schemaRoutes.js
const express = require("express");
const router = express.Router();
const { getDatabaseMappings } = require("../utils/schemaMatcher");

router.get("/database-mappings", async (req, res) => {
  try {
    const mappings = await getDatabaseMappings();
    res.json(mappings);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve database mappings",
      details: error.message,
    });
  }
});

module.exports = router;
