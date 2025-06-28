const { dbConfigs } = require("../utils/db_connections");
exports.getOfferingTypes = async (req, res) => {
  try {
    // This could come from a configuration service in production
    const offeringTypes = dbConfigs.map((config) => config.database);

    console.log("Offering types:", offeringTypes);

    res.json(offeringTypes);
  } catch (err) {
    console.error("❌ Error in /offering-types:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
