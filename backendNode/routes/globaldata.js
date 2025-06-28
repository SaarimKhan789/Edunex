const express = require("express");
const router = express.Router();
const { fetchUnifiedGlobalData } = require("../utils/globalFetcher");

router.get("/global-data", async (req, res) => {
  try {
    const data = await fetchUnifiedGlobalData();
    res.json(data);
  } catch (err) {
    console.error("Global fetch error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
