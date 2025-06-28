const express = require("express");
const { dbConfigs, queries } = require("../utils/db_connections");
const { fetchDataFromDb } = require("../utils/db_utils");

async function fetchGlobalSchemaData() {
  let globalData = [];

  for (let i = 0; i < dbConfigs.length; i++) {
    if (i < queries.length) {
      try {
        const data = await fetchDataFromDb(dbConfigs[i], queries[i]);
        globalData = [...globalData, ...data];
      } catch (error) {
        console.error(`Error fetching data from database config ${i}:`, error);
      }
    } else {
      console.log(`Warning: No query for database config ${i}`);
    }
  }

  return globalData;
}

exports.globalschema = async (req, res) => {
  try {
    const globalData = await fetchGlobalSchemaData();
    //console.log("globaldata", globalData);
    // Check if we got any data
    if (globalData.length > 0) {
      res.json(globalData);
    } else {
      res.status(404).json({ message: "No data retrieved from databases." });
    }
  } catch (error) {
    console.error("Error in global schema endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
